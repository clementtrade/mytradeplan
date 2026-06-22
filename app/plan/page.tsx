'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PlanPage() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    loadProfile()
  }, [])

  function formatText(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/━+/g, '<hr style="border:none;border-top:0.5px solid rgba(255,255,255,0.15);margin:8px 0;">')
      .split('\n')
      .map((line, i) => `<div key=${i} style="min-height:4px">${line || '&nbsp;'}</div>`)
      .join('')
  }

  async function startPlan() {
    setStarted(true)
    setLoading(true)
    try {
      const res = await fetch('/api/morning-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], start: true, profile }),
      })
      const data = await res.json()
      setMessages([{ role: 'ai', text: data.reply }])
    } catch {
      setMessages([{ role: 'ai', text: 'Erreur de connexion. Réessaie.' }])
    }
    setLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: 'user', text: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/morning-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, start: false, profile }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'ai', text: data.reply }])
    } catch {
      setMessages([...newMessages, { role: 'ai', text: 'Erreur de connexion.' }])
    }
    setLoading(false)
  }

  if (!started) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 1rem' }}>
          <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px', marginBottom: '1rem' }}>MYTRADEPLAN IA</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 600, marginBottom: '0.75rem' }}>Plan du matin</h1>
          {profile && (
            <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', fontFamily: 'monospace', marginBottom: '6px' }}>TON PROFIL</div>
              <div style={{ color: 'white', fontSize: '13px' }}>{profile.market} · {profile.tf} · {profile.approach}</div>
            </div>
          )}
          <p style={{ color: 'rgba(229,231,235,0.5)', fontSize: '14px', marginBottom: '2rem', lineHeight: 1.7 }}>
            L'IA connaît ton profil. Elle va te poser uniquement les questions sur le contexte d'aujourd'hui.
          </p>
          <button
            onClick={startPlan}
            style={{ background: '#10B981', color: 'black', border: 'none', borderRadius: '8px', padding: '12px 32px', fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            Commencer mon plan →
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, maxWidth: '680px', width: '100%', margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '12px 16px',
              borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              background: m.role === 'user' ? '#10B981' : '#111827',
              border: m.role === 'ai' ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              color: m.role === 'user' ? 'black' : 'white',
              fontSize: '14px', lineHeight: 1.7,
            }}>
              {m.role === 'ai' && (
                <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '1px', marginBottom: '8px' }}>MYTRADEPLAN IA</div>
              )}
              {m.role === 'ai'
                ? <div dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
                : <div>{m.text}</div>
              }
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '4px 12px 12px 12px', padding: '12px 16px' }}>
              <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '1px', marginBottom: '6px' }}>MYTRADEPLAN IA</div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(229,231,235,0.4)' }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: '1rem', background: '#0A0E1A', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Réponds ici..."
            disabled={loading}
            style={{ flex: 1, background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ background: input.trim() && !loading ? '#10B981' : 'rgba(16,185,129,0.2)', color: input.trim() && !loading ? 'black' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </main>
  )
}