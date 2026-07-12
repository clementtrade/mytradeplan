import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

export async function POST(request: Request) {
  const { trades, profile, date, user_id, dayKey, force } = await request.json()

  if (supabase && user_id && dayKey && !force) {
    const { data: cached } = await supabase
      .from('day_insights')
      .select('content')
      .eq('user_id', user_id)
      .eq('date', dayKey)
      .maybeSingle()
    if (cached) {
      return NextResponse.json({ insight: cached.content })
    }
  }

  const tradesDesc = trades.map((t: any) => {
    const rrPlanifie = t.rr_initial != null ? `${t.rr_initial}R` : 'non renseigné'
    const rrRealise = t.rr_realise != null ? `${t.rr_realise > 0 ? '+' : ''}${t.rr_realise}R` : 'non renseigné'
    const contexte = t.contexte?.trim() ? t.contexte.trim() : 'non renseigné'
    const zone = t.zone?.trim() ? t.zone.trim() : 'non renseigné'
    const cible = t.cible?.trim() ? t.cible.trim() : 'non renseigné'
    const confirmation = t.confirmation?.trim() ? t.confirmation.trim() : 'non renseigné'
    return `- ${t.direction.toUpperCase()} ${t.instrument} · Setup: ${t.setup_type || 'Non défini'} · RR planifié: ${rrPlanifie} · RR réalisé: ${rrRealise} · Plan suivi: ${t.followed_plan ? 'Oui' : 'Non'}
  Contexte : ${contexte}
  Zone : ${zone}
  Cible : ${cible}
  Confirmation : ${confirmation}`
  }).join('\n')

  const prompt = `Tu es un coach de trading expert. Analyse ces trades du ${date} pour ce trader :

PROFIL DU TRADER :
- Marché : ${profile?.market}
- Approche : ${profile?.approach}
- Timeframe : ${profile?.tf}
- Problème récurrent : ${profile?.problem}
- Outils : ${profile?.tools}

TRADES DU JOUR :
${tradesDesc}

Pour chaque trade, tu as le raisonnement complet du trader (Contexte → Zone → Confirmation → Résultat). Donne une analyse courte (3-4 phrases max) et directe qui porte sur le process, pas juste le résultat :
1. Le contexte noté justifiait-il la zone jouée ? La confirmation était-elle alignée avec le setup et le contexte, ou le trade semble-t-il pris sur une confirmation faible/absente ?
2. La gestion de sortie (RR réalisé vs planifié) est-elle cohérente avec le contexte décrit, ou le trader a-t-il dévié de son plan sans raison apparente ?
3. Une leçon concrète pour la prochaine session, ancrée dans ce qui a été noté (pas une généralité).

Sois direct, précis, et personnalisé à son profil. Pas de formules génériques.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const insight = response.content[0].type === 'text' ? response.content[0].text : ''

  if (supabase && user_id && dayKey) {
    await supabase.from('day_insights').upsert(
      { user_id, date: dayKey, content: insight },
      { onConflict: 'user_id,date' }
    )
  }

  return NextResponse.json({ insight })
}