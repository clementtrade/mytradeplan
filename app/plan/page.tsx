'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function PlanPage() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [macroResult, setMacroResult] = useState('')
  const [macroLoading, setMacroLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) {
          setProfile(data)
          setIsPro(data.is_pro === true)
        }
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function formatText(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/━+/g, '<hr style="border:none;border-top:0.5px solid rgba(255,255,255,0.15);margin:8px 0;">')
      .split('\n')
      .map((line, i) => `<div key=${i} style="min-height:4px">${line || '&nbsp;'}</div>`)
      .join('')
  }

  async function getMacroBriefing() {
    setMacroLoading(true)
    setMacroResult('')
    try {
      const res = await fetch('/api/macro-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      const data = await res.json()
      setMacroResult(data.reply)
    } catch {
      setMacroResult('Erreur de connexion. Réessaie.')
    }
    setMacroLoading(false)
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
      <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px', marginBottom: '1rem' }}>MYTRADEPLAN IA</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 600, marginBottom: '0.75rem' }}>Plan du matin</h1>

          {profile && (
            <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', fontFamily: 'monospace', marginBottom: '6px' }}>TON PROFIL</div>
              <div style={{ color: 'white', fontSize: '13px' }}>{profile.market} · {profile.tf} · {profile.approach}</div>
            </div>
          )}

          {/* Bouton commencer EN HAUT */}
          <button
            onClick={startPlan}
            style={{ width: '100%', background: '#10B981', color: 'black', border: 'none', borderRadius: '8px', padding: '14px 32px', fontFamily: 'monospace', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '1.5rem', letterSpacing: '0.5px' }}
          >
            Commencer mon plan →
          </button>

          {/* Macro Briefing EN DESSOUS */}
          <div style={{ background: '#111827', border: `0.5px solid ${isPro ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '1.25rem', textAlign: 'left', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1px' }}>DAILY BRIEFING MACRO</div>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>Personnalisé à ton profil de trader</div>
              </div>
              {!isPro && (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🔒 Pro
                </div>
              )}
            </div>

            {isPro ? (
              <div>
                {!macroResult ? (
                  <button
                    onClick={getMacroBriefing}
                    disabled={macroLoading}
                    style={{ width: '100%', background: '#10B981', color: 'black', border: 'none', borderRadius: '6px', padding: '10px 16px', fontWeight: 700, fontSize: '13px', cursor: macroLoading ? 'not-allowed' : 'pointer', fontFamily: 'monospace', opacity: macroLoading ? 0.7 : 1 }}
                  >
                    {macroLoading ? '⏳ Génération en cours...' : '📊 Générer mon briefing macro →'}
                  </button>
                ) : (
                  <div>
                    <div style={{ color: 'rgba(229,231,235,0.85)', fontSize: '13px', lineHeight: 1.7 }}
                      dangerouslySetInnerHTML={{ __html: formatText(macroResult) }}
                    />
                    <button
                      onClick={getMacroBriefing}
                      style={{ marginTop: '0.75rem', background: 'transparent', color: '#10B981', border: '0.5px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace' }}
                    >
                      Actualiser
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
                  <div style={{ width: '100%', background: '#10B981', color: 'black', borderRadius: '6px', padding: '10px 16px', fontWeight: 700, fontSize: '13px', textAlign: 'center', fontFamily: 'monospace' }}>
                    📊 Générer mon briefing macro →
                  </div>
                  <div style={{ marginTop: '0.75rem', color: 'rgba(229,231,235,0.5)', fontSize: '13px', lineHeight: 1.7 }}>
                    Fed en mode hawkish, données NFP vendredi, résistance clé sur les 4500...
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                  <a href="/pricing" style={{ color: '#10B981', fontSize: '12px', textDecoration: 'none', fontFamily: 'monospace' }}>Passer au plan Pro →</a>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px' }}>MYTRADEPLAN IA</div>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textDecoration: 'none' }}>← Dashboard</a>
      </div>

      {/* Zone messages — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '82%',
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                background: m.role === 'user' ? '#10B981' : '#111827',
                border: m.role === 'ai' ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
                color: m.role === 'user' ? 'black' : 'white',
                fontSize: '14px',
                lineHeight: 1.7,
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
              <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px' }}>
                <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '1px', marginBottom: '6px' }}>MYTRADEPLAN IA</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(229,231,235,0.4)' }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input — collé sous les messages, pas en bas d'écran */}
      <div style={{ padding: '0.75rem 1rem 1.25rem', background: '#0A0E1A' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', gap: '8px', padding: '8px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Réponds ici..."
            disabled={loading}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit', padding: '6px 8px' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: input.trim() && !loading ? '#10B981' : 'rgba(16,185,129,0.15)',
              color: input.trim() && !loading ? 'black' : 'rgba(255,255,255,0.2)',
              border: 'none', borderRadius: '8px',
              padding: '8px 18px',
              fontFamily: 'monospace', fontWeight: 700, fontSize: '13px',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            →
          </button>
        </div>
      </div>

    </main>
  )
}