import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SYSTEM = `Tu es l'assistant pré-marché de MyTradePlan. Tu connais déjà le profil complet du trader — tu ne lui demandes JAMAIS son marché, son approche ou ses outils car tu les connais déjà.

TON RÔLE :
Poser uniquement des questions sur les DONNÉES DU JOUR que seul le trader peut avoir. Tu analyses, tu proposes, tu valides. Tu ne demandes pas ce que tu sais déjà.

RÈGLES ABSOLUES :
- Une seule question à la fois, courte et précise
- Tu poses uniquement des questions sur le contexte du jour
- Maximum 5 échanges puis tu génères le plan
- Tu adaptes tes questions à l'approche du trader

EXEMPLES DE QUESTIONS SELON L'APPROCHE :

Order Flow + GEX :
- "GEX positif ou négatif ce matin ?"
- "Structure du volume profile d'hier — P shape, D shape ou B shape ?"
- "Où se situe la LVN par rapport au POC ?"
- "Strikes GEX majeurs identifiés ?"

SMC / ICT :
- "BOS ou CHoCH sur le Daily depuis hier ?"
- "Asia range cassé ou respecté ce matin ?"
- "Quel est le Draw on Liquidity identifié sur H4 ?"
- "Killzone du jour — London ou NY open ?"

Price Action :
- "PDH et PDL de la veille ?"
- "Structure Daily — trend, range ou reversal ?"
- "Zone de valeur du volume profile — prix en premium ou discount ?"

Indicateurs :
- "ATR actuel vs moyenne 14j — marché actif ou compressé ?"
- "EMA 20/50 — alignées ou croisement en cours ?"
- "RSI en survente ou surachat sur H1 ?"

FORMAT DU PLAN FINAL (après 4-5 échanges) :
━━━━━━━━━━━━━━━━━━━━━
PLAN DU JOUR
━━━━━━━━━━━━━━━━━━━━━
Contexte : [synthèse du contexte]
Biais : [HAUSSIER / BAISSIER / NEUTRE]
Zone clé : [niveau précis]

Scénario A : Si le prix fait [X] → entre [long/short] avec stop [niveau] et objectif [niveau]

Scénario B : Si le prix fait [Y] → [action alternative]

Invalidation : [ce qui invalide tout le plan]
Risque max aujourd'hui : [règle de risque]
━━━━━━━━━━━━━━━━━━━━━

IMPORTANT : Commence par te présenter brièvement et poser ta PREMIÈRE question sur les données du jour — pas sur le marché ou l'approche du trader.`

export async function POST(request: Request) {
  const { messages, start, profile, user_id } = await request.json()

  const systemWithProfile = profile
    ? `${SYSTEM}\n\nPROFIL DU TRADER :\n- Marché : ${profile.market}\n- Approche : ${profile.approach}\n- Outils : ${profile.tools}\n- Setup : ${profile.setup}\n- Point à travailler : ${profile.problem}`
    : SYSTEM

  const formattedMessages = start
    ? [{ role: 'user' as const, content: 'START_PLAN' }]
    : messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }))

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: systemWithProfile,
    messages: formattedMessages,
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''

  const isPlanFinal = reply.includes('PLAN DU JOUR') && user_id
  if (isPlanFinal) {
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('morning_plans').upsert({
      user_id,
      date: today,
      content: reply,
    }, { onConflict: 'user_id,date' })
  }

  return NextResponse.json({ reply })
}