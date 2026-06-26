import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { trades, profile, date } = await request.json()

  const tradesDesc = trades.map((t: any) =>
    `- ${t.direction.toUpperCase()} ${t.instrument} · Setup: ${t.setup_type || 'Non défini'} · Résultat: ${t.result_r > 0 ? '+' : ''}${t.result_r}R · Plan suivi: ${t.followed_plan ? 'Oui' : 'Non'}`
  ).join('\n')

  const prompt = `Tu es un coach de trading expert. Analyse ces trades du ${date} pour ce trader :

PROFIL DU TRADER :
- Marché : ${profile?.market}
- Approche : ${profile?.approach}
- Timeframe : ${profile?.tf}
- Problème récurrent : ${profile?.problem}
- Outils : ${profile?.tools}

TRADES DU JOUR :
${tradesDesc}

Donne une analyse courte (3-4 phrases max) et directe :
1. Les trades étaient-ils cohérents avec son approche et son profil ?
2. Y a-t-il un pattern problématique ?
3. Une leçon concrète pour la prochaine session.

Sois direct, précis, et personnalisé à son profil. Pas de formules génériques.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const insight = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ insight })
}