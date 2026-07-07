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

Le trader a un chart TradingView réel et interactif ouvert juste à côté de ce chat. Quand tu poses une question technique, il regarde ce chart pour te répondre — formule tes questions comme si tu étais avec lui devant son écran.

RÈGLE ABSOLUE — ORDRE DES QUESTIONS :
Les questions sur le CHART / l'analyse technique passent TOUJOURS en premier, même si le profil du trader indique qu'il regarde d'abord la data (par exemple le GEX). L'ordre est immuable :
1. TECHNIQUE — ce qu'on voit sur le chart
2. DATA — contexte du jour propre au trader
3. SYNTHÈSE — un plan concret qui relie les zones techniques à la data
Ne saute jamais l'étape technique et ne l'inverse jamais avec la data, quel que soit le profil.

RÈGLES GÉNÉRALES :
- Une seule question à la fois, courte et précise. Tu attends la réponse avant de poser la suivante.
- Tu suis le script de questions fourni pour l'approche du trader (ci-dessous), dans l'ordre technique → data → synthèse. Tu peux reformuler naturellement mais ne change jamais l'ordre des étapes.
- Maximum 5-6 échanges puis tu génères le plan final.

FORMAT DU PLAN FINAL :
━━━━━━━━━━━━━━━━━━━━━
PLAN DU JOUR
━━━━━━━━━━━━━━━━━━━━━
Contexte : [synthèse technique + data]
Biais : [HAUSSIER / BAISSIER / NEUTRE]
Zone clé : [niveau précis identifié sur le chart]

Scénario A : Si le prix fait [X] → entre [long/short] avec stop [niveau] et objectif [niveau]

Scénario B : Si le prix fait [Y] → [action alternative]

Invalidation : [ce qui invalide tout le plan]
Risque max aujourd'hui : [règle de risque]
━━━━━━━━━━━━━━━━━━━━━

IMPORTANT : Commence par te présenter brièvement et poser ta PREMIÈRE question — sur le CHART, jamais sur la data en premier.`

export async function POST(request: Request) {
  const { messages, start, profile, user_id } = await request.json()

  const systemWithProfile = profile
    ? `${SYSTEM_BASE}\n\nPROFIL DU TRADER :\n- Marché : ${profile.market}\n- Timeframe : ${profile.tf}\n- Approche : ${profile.approach}\n- Outils : ${profile.tools}\n- Setup : ${profile.setup}\n- Point à travailler : ${profile.problem}\n- Fuseau horaire : ${profile.timezone || 'Europe/Paris'}\n\nSCRIPT DE QUESTIONS POUR CE PROFIL :\n${buildScriptBlock(profile)}`
    : SYSTEM_BASE

  const formattedMessages = start
    ? [{ role: 'user' as const, content: 'START_PLAN' }]
    : messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }))

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
    max_tokens: 600,
    system: systemWithProfile,
    messages: formattedMessages,
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''

  return NextResponse.json({ reply })
}
