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
      .replace(/━+/g, '<hr style="border:none;border-top:0.5px solid #e8e8e8;margin:10px 0;">')
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

  // PAGE D'ACCUEIL AVANT LE PLAN
  if (!started) {
    return (
      <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .plan-anim { animation: fadeUp 0.5s ease both; }
          .btn-start {
            width: 100%; background: #111; color: #fff; border: none; border-radius: 8px;
            padding: 14px; font-weight: 600; font-size: 15px; cursor: pointer;
            box-shadow: 0 4px 14px rgba(0,0,0,0.15);
            transition: box-shadow 0.2s, transform 0.2s; margin-bottom: 1.25rem;
            font-family: inherit;
          }
          .btn-start:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.22); transform: translateY(-1px); }
        `}</style>

        {/* Navbar */}
        <nav style={{ background: '#fff', borderBottom: '0.5px solid #e8e8e8', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/dashboard" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/plan" style={{ color: '#111', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Plan du matin</a>
            <a href="/journal" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Journal</a>
            <a href="/stats" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>Stats</a>
          </div>
        </nav>

        {/* Contenu centré */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="plan-anim" style={{ maxWidth: '440px', width: '100%' }}>

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Plan du matin</div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Prêt pour la session ?</h1>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6 }}>L'IA va te poser quelques questions sur le contexte du jour pour construire ton plan.</p>
            </div>

            {profile && (
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ton profil</div>
                <div style={{ color: '#111', fontSize: '13px', fontWeight: 500 }}>{profile.market} · {profile.tf} · {profile.approach}</div>
              </div>
            )}

            <button className="btn-start" onClick={startPlan}>
              Commencer mon plan →
            </button>

            {/* Briefing Macro */}
            <div style={{ background: '#fff', border: `0.5px solid ${isPro ? '#d1fae5' : '#e8e8e8'}`, borderRadius: '10px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>Daily Briefing Macro</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Personnalisé à ton profil</div>
                </div>
                {!isPro && (
                  <div style={{ background: '#f5f5f5', border: '0.5px solid #e0e0e0', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', color: '#888' }}>
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
                      style={{ width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: '7px', padding: '10px', fontWeight: 600, fontSize: '13px', cursor: macroLoading ? 'not-allowed' : 'pointer', opacity: macroLoading ? 0.6 : 1, fontFamily: 'inherit' }}
                    >
                      {macroLoading ? 'Génération en cours...' : '📊 Générer mon briefing macro →'}
                    </button>
                  ) : (
                    <div>
                      <div style={{ color: '#444', fontSize: '13px', lineHeight: 1.7 }}
                        dangerouslySetInnerHTML={{ __html: formatText(macroResult) }}
                      />
                      <button
                        onClick={getMacroBriefing}
                        style={{ marginTop: '0.75rem', background: 'transparent', color: '#111', border: '0.5px solid #ddd', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Actualiser
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
                    <div style={{ width: '100%', background: '#111', color: '#fff', borderRadius: '7px', padding: '10px', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>
                      📊 Générer mon briefing macro →
                    </div>
                    <div style={{ marginTop: '0.75rem', color: '#aaa', fontSize: '13px', lineHeight: 1.7 }}>
                      Fed en mode hawkish, données NFP vendredi...
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                    <a href="/pricing" style={{ color: '#111', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>Passer au plan Pro →</a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    )
  }

  // PAGE DE CHAT
  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .msg-anim { animation: fadeIn 0.3s ease both; }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .dot { animation: pulse 1.2s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .chat-input {
          flex: 1; background: transparent; border: none; color: #111;
          font-size: 14px; outline: none; font-family: inherit; padding: 6px 8px;
        }
        .chat-input::placeholder { color: #aaa; }
        .nav-link-plan { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link-plan:hover { color: #111; }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e8e8e8', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <a href="/dashboard" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ color: '#111', fontWeight: 600, fontSize: '14px' }}>Plan du matin</span>
          <a href="/journal" className="nav-link-plan">Journal</a>
          <a href="/stats" className="nav-link-plan">Stats</a>
          {profile && (
            <div style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '11px', padding: '3px 10px', borderRadius: '4px', fontWeight: 500 }}>
              En session
            </div>
          )}
        </div>
      </nav>

      {/* Zone messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {messages.map((m, i) => (
            <div key={i} className="msg-anim" style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'ai' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600, flexShrink: 0, marginRight: '8px', marginTop: '2px' }}>M</div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                background: m.role === 'user' ? '#111' : '#fff',
                border: m.role === 'ai' ? '0.5px solid #e8e8e8' : 'none',
                color: m.role === 'user' ? '#fff' : '#111',
                fontSize: '14px',
                lineHeight: 1.7,
                boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
              }}>
                {m.role === 'ai' && (
                  <div style={{ color: '#aaa', fontSize: '10px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MyTradePlan IA</div>
                )}
                {m.role === 'ai'
                  ? <div dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
                  : <div>{m.text}</div>
                }
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-anim" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600, flexShrink: 0 }}>M</div>
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '4px 12px 12px 12px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#aaa' }} />
                  <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#aaa' }} />
                  <div className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#aaa' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '0.75rem 1rem 1.25rem', background: '#f9f9f9', flexShrink: 0 }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '12px', display: 'flex', gap: '8px', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <input
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Réponds ici..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background: input.trim() && !loading ? '#111' : '#f0f0f0',
              color: input.trim() && !loading ? '#fff' : '#aaa',
              border: 'none', borderRadius: '8px',
              padding: '8px 18px',
              fontWeight: 700, fontSize: '14px',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            →
          </button>
        </div>
      </div>

    </main>
  )
}