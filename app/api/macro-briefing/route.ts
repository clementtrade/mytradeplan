import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

function generateBriefingPrompt(profile: any) {
  const market = profile.market || 'indices'
  const approach = profile.approach || 'day trading'
  const tf = profile.tf || 'intraday'
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return `Tu es un analyste macro senior spécialisé pour les traders actifs.

Aujourd'hui nous sommes le ${today}.

Le trader a le profil suivant :
- Marché : ${market}
- Approche : ${approach}
- Timeframe : ${tf}

Génère un briefing macro du jour SPÉCIFIQUE à ce profil. Structure ta réponse ainsi :

**🌍 Contexte macro global**
2-3 points clés macro qui impactent ce marché aujourd'hui (Fed, données éco, géopolitique, sentiment).

**📅 Catalyseurs du jour**
Les publications économiques et événements importants à surveiller aujourd'hui.

**⚠️ Risques du jour**
Ce qui pourrait créer de la volatilité ou changer le sentiment de marché.

**🎯 Biais directionnel**
Ton biais haussier/baissier/neutre pour la session avec justification macro courte.

IMPORTANT : Ne donne AUCUN niveau de prix, zone de support ou résistance. Reste uniquement sur le contexte macro et fondamental. Le trader gère lui-même son analyse technique.

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