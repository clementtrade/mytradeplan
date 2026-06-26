'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function DebriefPage() {
  const [profile, setProfile] = useState<any>(null)
  const [macroText, setMacroText] = useState('')
  const [macroLoading, setMacroLoading] = useState(false)
  const [macroLoaded, setMacroLoaded] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (profileData) setProfile(profileData)
    }
    load()
  }, [])

  async function getMacroBriefing() {
    stopSpeech()
    setMacroLoading(true)
    setMacroText('')
    try {
      const res = await fetch('/api/macro-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      const data = await res.json()
      setMacroText(data.reply)
      setMacroLoaded(true)
    } catch {
      setMacroText('Erreur de connexion. Réessaie.')
      setMacroLoaded(true)
    }
    setMacroLoading(false)
  }

  function speak() {
    if (!macroText) return
    stopSpeech()
    const clean = macroText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/#{1,3} /g, '')
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = 'fr-FR'
    utterance.rate = 1.25
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  function stopSpeech() {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  function formatMacro(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split('\n')
      .map((line) => `<div style="min-height:4px">${line || '&nbsp;'}</div>`)
      .join('')
  }

  const sidebarW = sidebarExpanded ? 200 : 52
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CL'
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sidebar { position: fixed; left: 0; top: 0; height: 100vh; background: #fff; border-right: 0.5px solid #e8e8e8; display: flex; flex-direction: column; transition: width 0.2s cubic-bezier(0.4,0,0.2,1); overflow: hidden; z-index: 100; }
        .sb-logo { height: 52px; min-height: 52px; display: flex; align-items: center; padding: 0 14px; border-bottom: 0.5px solid #e8e8e8; white-space: nowrap; }
        .sb-dot { width: 24px; height: 24px; min-width: 24px; background: #111; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 800; }
        .sb-brand { font-size: 13px; font-weight: 700; color: #111; margin-left: 10px; letter-spacing: -0.3px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
        .sidebar.exp .sb-brand { opacity: 1; }
        .profile-btn { display: flex; align-items: center; margin: 10px 6px 4px; padding: 8px; border-radius: 10px; background: #f5f5f5; border: 0.5px solid #e8e8e8; cursor: pointer; text-decoration: none; overflow: hidden; }
        .profile-avatar { width: 28px; height: 28px; min-width: 28px; background: #111; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; }
        .profile-info { margin-left: 9px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
        .sidebar.exp .profile-info { opacity: 1; }
        .profile-name { font-size: 12px; font-weight: 700; color: #111; }
        .profile-role { font-size: 10px; color: #aaa; margin-top: 1px; }
        .sb-divider { height: 0.5px; background: #e8e8e8; margin: 6px 12px; }
        .sb-section { font-size: 10px; font-weight: 600; color: #ccc; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 20px 2px; white-space: nowrap; opacity: 0; transition: opacity 0.1s 0.07s; }
        .sidebar.exp .sb-section { opacity: 1; }
        .nav-item { display: flex; align-items: center; height: 38px; padding: 0 14px; margin: 1px 6px; border-radius: 8px; cursor: pointer; text-decoration: none; color: #888; overflow: hidden; transition: background 0.15s, color 0.15s; }
        .nav-item:hover { background: #f5f5f5; color: #111; }
        .nav-item.active { background: #111; color: #fff; }
        .nav-icon { font-size: 14px; min-width: 24px; display: flex; align-items: center; justify-content: center; }
        .nav-lbl { font-size: 12.5px; font-weight: 500; margin-left: 8px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
        .sidebar.exp .nav-lbl { opacity: 1; }
        .nav-item.active .nav-lbl { color: #fff; }
        .macro-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: #111; color: #fff; border: none; border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; width: 100%; }
        .macro-btn:hover { background: #333; }
        .macro-btn:disabled { background: #555; cursor: wait; }
        .speak-btn { display: flex; align-items: center; gap: 6px; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .speaking { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* SIDEBAR */}
      <div
        className={`sidebar${sidebarExpanded ? ' exp' : ''}`}
        style={{ width: sidebarW }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="sb-logo">
          <div className="sb-dot">M</div>
          <span className="sb-brand">MyTradePlan</span>
        </div>
        <a href="/settings" className="profile-btn">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <div className="profile-name">{profile?.full_name || 'Mon profil'}</div>
            <div className="profile-role">{profile?.market || 'Trader'}</div>
          </div>
        </a>
        <div className="sb-divider"></div>
        <div className="sb-section">Session</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/dashboard" className="nav-item">
            <span className="nav-icon">▦</span>
            <span className="nav-lbl">Dashboard</span>
          </a>
          <a href="/plan" className="nav-item">
            <span className="nav-icon">☀</span>
            <span className="nav-lbl">Plan du matin</span>
          </a>
          <a href="/debrief" className="nav-item active">
            <span className="nav-icon">◈</span>
            <span className="nav-lbl">Débrief Macro IA</span>
          </a>
          <a href="/journal" className="nav-item">
            <span className="nav-icon" style={{ fontSize: '13px', fontWeight: 700 }}>▤</span>
            <span className="nav-lbl">Journal</span>
          </a>
        </nav>
        <div className="sb-divider"></div>
        <div className="sb-section">Compte</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/settings" className="nav-item">
            <span className="nav-icon">⚙</span>
            <span className="nav-lbl">Paramètres</span>
          </a>
        </nav>
      </div>

      {/* MAIN */}
      <main style={{ marginLeft: sidebarW, flex: 1, minWidth: 0, transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)', padding: '0 2rem 3rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>Débrief Macro IA</span>
              <span style={{ fontSize: '13px', color: '#aaa' }}>{dateFormatted}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {macroLoaded && !macroLoading && (
                speaking ? (
                  <button onClick={stopSpeech} className="speak-btn" style={{ background: '#fee2e2', color: '#dc2626' }}>
                    <span className="speaking">⏹</span> Stop
                  </button>
                ) : (
                  <button onClick={speak} className="speak-btn" style={{ background: '#f5f5f5', color: '#111' }}>
                    🔊 Écouter
                  </button>
                )
              )}
              {macroLoaded && (
                <button onClick={getMacroBriefing} disabled={macroLoading} style={{ background: 'none', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', color: '#888', cursor: 'pointer' }}>
                  ↺ Rafraîchir
                </button>
              )}
            </div>
          </div>

          {/* CONTENU */}
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>Briefing du jour</div>
                <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>Généré par IA selon ton profil trader</div>
              </div>
              {speaking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                  <span className="speaking">🔊</span> Lecture en cours...
                </div>
              )}
            </div>

            {!macroLoaded ? (
              <button className="macro-btn" onClick={getMacroBriefing} disabled={macroLoading}>
                {macroLoading ? <>⏳ Génération en cours...</> : <>◈ Générer le débrief macro du jour</>}
              </button>
            ) : macroLoading ? (
              <div style={{ color: '#aaa', fontSize: '13px', padding: '1rem 0' }}>⏳ Génération en cours...</div>
            ) : (
              <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: formatMacro(macroText) }}/>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}