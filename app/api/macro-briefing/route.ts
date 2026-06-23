import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

function generateBriefingPrompt(profile: any) {
  const market = profile.market || 'indices'
  const approach = profile.approach || 'day trading'
  const tf = profile.tf || 'intraday'

  return `Tu es un analyste macro senior spécialisé pour les traders actifs.

Le trader a le profil suivant :
- Marché : ${market}
- Approche : ${approach}
- Timeframe : ${tf}

Génère un briefing macro du jour SPÉCIFIQUE à ce profil. Structure ta réponse ainsi :

**🌍 Contexte macro global**
2-3 points clés qui impactent ce marché aujourd'hui.

**📊 Points clés pour ${market}**
Les niveaux, catalyseurs et données économiques importants à surveiller.

**⚠️ Risques du jour**
Ce qui pourrait créer de la volatilité ou invalider les setups habituels.

**🎯 Biais directionnel**
Ton biais haussier/baissier/neutre pour la session avec justification courte.

Sois concis, factuel et orienté trading. Maximum 250 mots.`
}

export async function POST(req: Request) {
  const { profile } = await req.json()

  if (!profile) {
    return Response.json({ reply: 'Profil manquant.' }, { status: 400 })
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: generateBriefingPrompt(profile)
    }]
  })

  const text = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')

  return Response.json({ reply: text })
}