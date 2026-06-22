import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { asset } = await req.json()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Tu es un analyste macro pour traders actifs. Fais un briefing court et précis sur ${asset} : quelles actualités récentes (Fed, données éco, géopolitique, sentiment) peuvent impacter cet actif aujourd'hui ? Sois concis, factuel, et orienté trading. Maximum 200 mots.`
    }]
  })

  const text = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')

  return Response.json({ reply: text })
}