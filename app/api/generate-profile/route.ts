import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const answers = await request.json()

  const prompt = `Tu es l'assistant de MyTradePlan. Un trader vient de terminer son onboarding avec ces réponses :

Marché : ${answers.market}
Timeframe : ${answers.tf}
Approche : ${answers.approach}
Principal problème : ${answers.problem}
Risque par trade : ${answers.risk}

Réponds UNIQUEMENT avec ce JSON, sans aucun texte avant ou après, sans balises markdown :
{"type":"Trader intraday Order Flow sur Futures","framework_matin":"1. Vérifier le regime de volatilité 2. Identifier la structure du volume profile 3. Repérer les zones clés 4. Définir le biais","setup_type":"Break and retest sur niveau clé avec confirmation order flow","point_a_travailler":"${answers.problem}","message":"Message personnalisé court pour ce trader"}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()

  try {
    const profile = JSON.parse(clean)
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ 
      type: 'Profil en cours de configuration',
      framework_matin: clean,
      setup_type: answers.approach,
      point_a_travailler: answers.problem,
      message: 'Bienvenue sur MyTradePlan !'
    })
  }
}