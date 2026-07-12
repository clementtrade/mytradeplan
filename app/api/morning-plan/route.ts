import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Meme logique de categorisation que le dashboard (app/dashboard/page.tsx: getRRExitCategory),
// dupliquee ici pour que les chiffres de la memoire du plan restent coherents avec ce que le trader voit sur son dashboard.
type ExitCategoryKey = 'sous' | 'tenue' | 'audela'

function getExitCategory(rrInitial: number, rrRealise: number): ExitCategoryKey {
  if (rrRealise < 0) return 'sous'
  const ratio = rrRealise / rrInitial
  if (ratio < 0.9) return 'sous'
  if (ratio <= 1.1) return 'tenue'
  return 'audela'
}

function computeTraderStats(trades: { rr_initial: number | null; rr_realise: number | null }[]) {
  const rrTrades = trades.filter(t => t.rr_initial != null && t.rr_realise != null && (t.rr_initial as number) > 0)
  const rrCount = rrTrades.length
  const avgRRInitial = rrCount > 0 ? rrTrades.reduce((s, t) => s + (t.rr_initial as number), 0) / rrCount : 0
  const avgRRRealise = rrCount > 0 ? rrTrades.reduce((s, t) => s + (t.rr_realise as number), 0) / rrCount : 0
  const catCounts = { sous: 0, tenue: 0, audela: 0 }
  rrTrades.forEach(t => { catCounts[getExitCategory(t.rr_initial as number, t.rr_realise as number)]++ })

  const realiseOnly = trades.filter(t => t.rr_realise != null)
  const expectancy = realiseOnly.length > 0 ? realiseOnly.reduce((s, t) => s + (t.rr_realise as number), 0) / realiseOnly.length : null
  const winRate = realiseOnly.length > 0 ? Math.round((realiseOnly.filter(t => (t.rr_realise as number) > 0).length / realiseOnly.length) * 100) : null

  return { rrCount, avgRRInitial, avgRRRealise, catCounts, expectancy, winRate }
}

function buildMemoryBlock(stats: ReturnType<typeof computeTraderStats>, insights: { date: string; content: string }[]): string | null {
  const hasStats = stats.rrCount > 0 || stats.winRate != null
  const hasInsights = insights.length > 0
  if (!hasStats && !hasInsights) return null

  let block = 'MÉMOIRE DU TRADER (sessions récentes) :\n'

  if (hasStats) {
    block += `\nStats globales (trades journalisés) :\n`
    if (stats.expectancy != null) block += `- Expectancy : ${stats.expectancy >= 0 ? '+' : ''}${stats.expectancy.toFixed(2)}R par trade\n`
    if (stats.winRate != null) block += `- Win rate : ${stats.winRate}%\n`
    if (stats.rrCount > 0) {
      block += `- RR moyen : réalisé ${stats.avgRRRealise.toFixed(2)}R vs planifié ${stats.avgRRInitial.toFixed(2)}R\n`
      block += `- Répartition des sorties : Sous la cible ${stats.catCounts.sous} · Cible tenue ${stats.catCounts.tenue} · Au-delà ${stats.catCounts.audela}\n`
    }
  }

  if (hasInsights) {
    block += `\nInsights des 30 derniers jours :\n`
    insights.forEach(i => {
      const d = new Date(i.date)
      const label = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
      block += `- ${label} : ${i.content}\n`
    })
  }

  block += `\nUtilise cette mémoire pour le "Rappel du jour" du plan final : choisis le pattern comportemental le plus pertinent pour le contexte identifié aujourd'hui, et formule-le comme un conseil actionnable qui relie explicitement ce pattern au contexte du jour — jamais une statistique brute recrachée telle quelle.
Exemple voulu : "Tu coupes tes gains tôt en environnement mean-reverting — aujourd'hui c'est justement mean-reverting, donc viser le POC et sortir est cohérent, ne force pas au-delà."
Exemple interdit : "Ton RR planifié tourne autour de 4R."
Si aucun pattern de la mémoire n'est pertinent pour le contexte du jour, omets complètement le Rappel du jour plutôt que de mettre une banalité. Ne mentionne jamais que des données manquent ou sont incomplètes : si la mémoire est vide ou partielle, continue normalement, comme si elle n'existait pas.`

  return block
}

// Heure de session (référence : réouverture Globex CME, 17h America/Chicago) exprimée dans le fuseau du trader.
function getUtcOffsetMinutes(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset', hour: '2-digit' }).formatToParts(date)
  const offset = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00'
  const match = offset.match(/GMT([+-])(\d{2}):?(\d{2})?/)
  if (!match) return 0
  const sign = match[1] === '-' ? -1 : 1
  return sign * (parseInt(match[2]) * 60 + parseInt(match[3] || '0'))
}

function getSessionHourLabel(timezone: string | undefined): string {
  const tz = timezone || 'Europe/Paris'
  try {
    const now = new Date()
    const chicagoOffsetMin = getUtcOffsetMinutes('America/Chicago', now)
    const refUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 17, 0, 0) - chicagoOffsetMin * 60000)
    return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(refUTC).replace(':00', 'h').replace(':', 'h')
  } catch {
    return '22h'
  }
}

// Scripts de questions modulaires par approche — chart-first : technique d'abord, data ensuite, synthèse à la fin.
// Pour ajouter une approche, ajoute simplement une entrée ici.
type ApproachScript = { technique: string[]; dataDefault: string }

const APPROACH_SCRIPTS: Record<string, ApproachScript> = {
  'Order Flow': {
    technique: [
      "Trace un volume profile depuis {sessionHour} à maintenant sur ton chart. Quelle forme observes-tu — D, P ou b ?",
      "Où sont les LVN et les HVN par rapport à la VAH/VAL ?",
      "On ouvre in ou out of balance par rapport à la value area d'hier ?",
    ],
    dataDefault: "Des niveaux macro ou des catalyseurs à surveiller aujourd'hui ?",
  },
  'SMC / ICT': {
    technique: [
      "Regarde le high et le low de la session asiatique — la liquidité est côté buy-side ou sell-side ?",
      "Quel est le draw on liquidity que tu identifies ?",
      "Vois-tu un FVG ou un order block non mitigé entre le prix actuel et ce pool de liquidité ?",
      "Quelle est l'invalidation structurelle de ce setup ?",
    ],
    dataDefault: "Une news ou une killzone à privilégier aujourd'hui ?",
  },
  'Price Action': {
    technique: [
      "Sur le chart, quelle est la structure daily/H4 — HH-HL, LH-LL ou range ?",
      "Le prix est-il proche d'un niveau majeur ou au milieu d'une zone ?",
      "Quelles confluences observes-tu — moyenne mobile, trendline, fibonacci ?",
    ],
    dataDefault: "Des catalyseurs prévus cette semaine ?",
  },
  'Indicateurs': {
    technique: [
      "Sur le chart, l'ATR actuel est-il au-dessus ou en dessous de sa moyenne — marché actif ou compressé ?",
      "Tes indicateurs principaux donnent-ils un signal aligné, ou en contradiction ?",
      "Le RSI H1 est-il en zone de surachat, de survente ou neutre ?",
    ],
    dataDefault: "Un catalyseur macro qui pourrait invalider le signal technique aujourd'hui ?",
  },
  'Macro': {
    technique: [
      "Sur le chart, comment le prix a réagi aux derniers catalyseurs macro — quelle structure ça a laissé ?",
      "Quel est le niveau clé le plus proche du prix actuel ?",
      "Les actifs corrélés (DXY, taux, autres indices) confirment ou divergent ?",
    ],
    dataDefault: "Quels catalyseurs macro sont prévus aujourd'hui, avec les horaires ?",
  },
  'Débutant': {
    technique: [
      "Quel marché et quel timeframe regardes-tu sur ton chart ?",
      "Sur ce chart, quel est le sens général — ça monte, ça baisse ou c'est plat ?",
      "Vois-tu un niveau où le prix a déjà réagi plusieurs fois ?",
    ],
    dataDefault: "Où placerais-tu ton stop, c'est-à-dire ton niveau d'invalidation ?",
  },
}

// Le marché Crypto a ses propres questions techniques, quelle que soit l'approche du trader.
const CRYPTO_TECHNIQUE = [
  "Quel actif, quel timeframe, et quelle est la tendance sur le higher timeframe ?",
  "Quels sont les niveaux clés sur le chart — range high/low, zones de liquidations ?",
]
const CRYPTO_DATA = "BTC suit ou diverge de cet actif ? Funding et open interest actuels ?"

// Si le trader a mentionné GEX/gamma/vanna dans ses outils, la question data devient options — sinon on l'allège.
const OPTIONS_DATA = "GEX positif ou négatif ce matin ? Quel est le flip le plus proche ?"

function buildScriptBlock(profile: any): string {
  const approachKey = profile?.approach === 'Je ne sais pas encore' ? 'Débutant' : profile?.approach
  const script: ApproachScript = APPROACH_SCRIPTS[approachKey] || APPROACH_SCRIPTS['Débutant']
  const sessionHour = getSessionHourLabel(profile?.timezone)
  const isCrypto = profile?.market === 'Crypto'
  const technique = (isCrypto ? CRYPTO_TECHNIQUE : script.technique).map(q => q.replace('{sessionHour}', sessionHour))
  const toolsMentionsOptions = /gex|gamma|vanna|options?/i.test(profile?.tools || '')
  const dataQuestion = toolsMentionsOptions ? OPTIONS_DATA : (isCrypto ? CRYPTO_DATA : script.dataDefault)

  return `ÉTAPE 1 — TECHNIQUE (chart, dans cet ordre) :
${technique.map((q, i) => `${i + 1}. ${q}`).join('\n')}

ÉTAPE 2 — DATA (seulement après la technique) :
${dataQuestion}

ÉTAPE 3 — SYNTHÈSE :
Relie les zones techniques identifiées à la donnée du jour pour produire le plan final.`
}

const SYSTEM_BASE = `Tu es l'assistant pré-marché de MyTradePlan. Tu connais déjà le profil complet du trader — tu ne lui demandes JAMAIS son marché, son approche ou ses outils car tu les connais déjà.

Le trader a son propre chart TradingView ouvert de son côté. Quand tu poses une question technique, il regarde ce chart pour te répondre — en texte ou en collant une capture d'écran — formule tes questions comme si tu étais avec lui devant son écran.

RÈGLE ABSOLUE — ORDRE DES QUESTIONS :
Les questions sur le CHART / l'analyse technique passent TOUJOURS en premier, même si le profil du trader indique qu'il regarde d'abord la data (par exemple le GEX). L'ordre est immuable :
1. TECHNIQUE — ce qu'on voit sur le chart
2. DATA — contexte du jour propre au trader
3. SYNTHÈSE — un plan concret qui relie les zones techniques à la data
Ne saute jamais l'étape technique et ne l'inverse jamais avec la data, quel que soit le profil.

RÈGLE — LE PLAN EST UNE ARBORESCENCE DE CONTEXTES, JAMAIS DE "HORS PLAN" :
Le plan doit couvrir le contexte actuel du marché ET les basculements plausibles et matériels de la session (cassure d'un niveau d'invalidation, changement de régime, retour dans la value, etc.) — pas tous les cas théoriques imaginables, seulement ceux qui ont une vraie chance de se produire aujourd'hui vu ce que le trader a décrit.
Pour CHAQUE contexte retenu (le principal, et chaque basculement plausible), applique le process complet : quel type de zone surveiller → quel type de cible viser → quel type de confirmation attendre.
Un changement de contexte n'est JAMAIS une sortie du plan. Les formulations "hors plan", "à toi de voir", "débrouille-toi", "cherche...", ou toute variante qui renvoie le trader à lui-même sans process, sont interdites. Si le contexte bascule en cours de session, c'est l'entrée dans un autre contexte que tu as déjà couvert dans le plan — jamais une fin de couverture.
Persistance dans le questionnement : avant de générer le plan final, assure-toi d'avoir de quoi écrire le process complet de chaque contexte principal identifié. Si un contexte de bascule plausible (ex. un gamma flip qui casse) n'est pas encore couvrable avec ce que tu sais, continue à poser des questions ciblées sur ce point précis au lieu de conclure prématurément. Ne génère le plan que quand chaque contexte retenu peut être traité de bout en bout.

RÈGLE — TU GUIDES LE PROCESS, TU N'EXÉCUTES JAMAIS LE TRADE À LA PLACE DU TRADER :
Tu restes au niveau du cadre, jamais de l'exécution. Pour chaque contexte, tu indiques quel TYPE de zone et quel TYPE de confirmation sont cohérents avec ce contexte, et pourquoi — de façon concrète mais catégorielle.
Exemple correct : "Dans ce contexte, cherche une zone de rejet dans le haut de ta value area, et attends ta confirmation de retournement habituelle avant d'entrer."
Exemple interdit : "Achète à 5920, cible 5945, stop 5915."
Tu ne donnes JAMAIS de niveau de prix précis, de setup exact, ni de stop/cible chiffrés que tu aurais toi-même déterminés. Si le trader a lui-même mentionné un niveau précis pendant la conversation (ex. un order block qu'il a identifié sur son chart), tu peux t'y référer tel qu'il te l'a donné — mais tu ne calcules, n'inventes et n'ajustes jamais un chiffre à sa place.
Le trader apporte sa technique et ses niveaux ; tu apportes la rigueur du process et le bon type d'approche selon le contexte. Ton but est de pousser le trader à bien appliquer SON process avec SES outils, dans le bon contexte — pas de décider le trade pour lui. Cette règle te protège aussi : tu raisonnes sur des catégories (contexte → type de zone → type de confirmation), un terrain que tu maîtrises, sans prétendre connaître toutes les techniques ni tous les styles de trading.

RÈGLES GÉNÉRALES :
- Une seule question à la fois, courte et précise. Tu attends la réponse avant de poser la suivante.
- Tu suis le script de questions fourni pour l'approche du trader (ci-dessous), dans l'ordre technique → data → synthèse. Tu peux reformuler naturellement mais ne change jamais l'ordre des étapes.
- Généralement 5-6 échanges suffisent pour couvrir le contexte principal, mais si un basculement plausible n'est pas encore couvrable, continue à poser des questions ciblées jusqu'à l'avoir — ne génère jamais le plan avant d'avoir de quoi traiter chaque contexte principal de bout en bout (voir règle sur l'arborescence de contextes ci-dessus).

CAPTURES D'ÉCRAN DU CHART :
Le trader peut répondre à une question technique en collant une capture de son chart au lieu d'écrire. Dans ce cas, tu interprètes directement ce que tu vois sur l'image et tu fais l'analyse à sa place — tu identifies toi-même la forme (D/P/b), les LVN/HVN, la structure, les niveaux, la position du prix, etc. selon ce qui est demandé par la question en cours. Le trader n'a pas besoin de décrire l'image, tu la lis et tu enchaînes directement sur l'étape suivante du script.

FORMAT DU PLAN FINAL :
━━━━━━━━━━━━━━━━━━━━━
PLAN DU JOUR
━━━━━━━━━━━━━━━━━━━━━
Contexte principal : [synthèse technique + data pour le contexte le plus probable aujourd'hui]
Biais : [HAUSSIER / BAISSIER / NEUTRE]

→ Process pour ce contexte :
Zone à surveiller : [type de zone cohérent avec ce contexte — reprends la zone que le trader a lui-même identifiée sur son chart]
Cible visée : [type de cible cohérent avec ce contexte]
Confirmation à attendre : [type de confirmation cohérent avec ce contexte et l'approche du trader]

Basculement plausible — [nom court du basculement, ex. "cassure du gamma flip"] :
→ Process pour ce contexte : [même structure zone / cible / confirmation, catégorielle]

[Ajoute un 2e basculement plausible seulement s'il y en a un réellement matériel vu la conversation — sinon n'en invente pas.]

Invalidation globale : [ce qui invaliderait l'ensemble du plan, pas juste un scénario]
Rappel du jour : [uniquement si un pattern comportemental de la mémoire est pertinent pour le contexte du jour — sinon omets cette ligne entièrement]
Risque max aujourd'hui : [règle de risque générale, pas un stop chiffré]
━━━━━━━━━━━━━━━━━━━━━

IMPORTANT : Commence par te présenter brièvement et poser ta PREMIÈRE question — sur le CHART, jamais sur la data en premier.`

export async function POST(request: Request) {
  const { messages, start, profile, user_id, memory: memoryFromClient } = await request.json()

  // La memoire n'est calculee qu'au lancement du plan (start === true) : une seule requete DB par
  // session. Le client renvoie ensuite ce bloc tel quel a chaque tour pour qu'il reste present dans
  // le system prompt sans requeter Supabase a nouveau.
  let memory: string | null = memoryFromClient || null
  if (start && user_id) {
    const { data: tradesData } = await supabase.from('trades').select('rr_initial, rr_realise').eq('user_id', user_id)
    const stats = computeTraderStats(tradesData || [])

    const oneMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
    const { data: insightsData } = await supabase
      .from('day_insights')
      .select('date, content')
      .eq('user_id', user_id)
      .gte('date', oneMonthAgo)
      .order('date', { ascending: true })

    memory = buildMemoryBlock(stats, insightsData || [])
  }

  const systemWithProfile = profile
    ? `${SYSTEM_BASE}\n\nPROFIL DU TRADER :\n- Marché : ${profile.market}\n- Timeframe : ${profile.tf}\n- Approche : ${profile.approach}\n- Outils : ${profile.tools}\n- Setup : ${profile.setup}\n- Point à travailler : ${profile.problem}\n- Fuseau horaire : ${profile.timezone || 'Europe/Paris'}\n\n${memory ? memory + '\n\n' : ''}SCRIPT DE QUESTIONS POUR CE PROFIL :\n${buildScriptBlock(profile)}`
    : SYSTEM_BASE

  const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

  const formattedMessages = start
    ? [{ role: 'user' as const, content: 'START_PLAN' }]
    : messages.map((m: any) => {
        const role = m.role === 'user' ? 'user' as const : 'assistant' as const
        if (m.image?.base64 && ALLOWED_IMAGE_TYPES.includes(m.image.mediaType)) {
          return {
            role,
            content: [
              { type: 'image' as const, source: { type: 'base64' as const, media_type: m.image.mediaType, data: m.image.base64 } },
              { type: 'text' as const, text: m.text || 'Voici une capture de mon chart.' },
            ],
          }
        }
        return { role, content: m.text }
      })

  if (start && user_id) {
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('morning_plans').insert({
      user_id,
      date: today,
      content: 'started',
    })
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 900,
    system: systemWithProfile,
    messages: formattedMessages,
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''

  return NextResponse.json({ reply, memory })
}
