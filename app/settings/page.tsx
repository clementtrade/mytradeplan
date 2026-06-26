'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [form, setForm] = useState({
    market: '',
    tf: '',
    approach: '',
    tools: '',
    framework_matin: '',
    problem: '',
    risk: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({
          market: data.market || '',
          tf: data.tf || '',
          approach: data.approach || '',
          tools: data.tools || '',
          framework_matin: data.framework_matin || '',
          problem: data.problem || '',
          risk: data.risk || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    setSaving(true)
    setSaved(false)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      market: form.market,
      tf: form.tf,
      approach: form.approach,
      tools: form.tools,
      framework_matin: form.framework_matin,
      problem: form.problem,
      risk: form.risk,
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sidebarW = sidebarExpanded ? 200 : 52
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CL'

  const MARKETS = ['Futures US', 'Actions', 'Forex', 'Crypto', 'Options']
  const TFS = ['Scalping', 'Intraday court', 'Intraday classique', 'Swing', 'Position']
  const APPROACHES = ['SMC / ICT', 'Price Action', 'Order Flow', 'Indicateurs', 'Macro']
  const PROBLEMS = ['Je trade hors plan', 'Je coupe mes gains trop tôt', 'Je laisse courir mes pertes', 'Je revenge trade', 'Pas de plan clair']
  const RISKS = ['Moins de 0.5%', '0.5% à 1%', '1% à 2%', '2% à 5%', 'Plus de 5%']

  const inputStyle = {
    width: '100%', background: '#fff', border: '0.5px solid #e0e0e0',
    borderRadius: '8px', padding: '9px 12px', color: '#111', fontSize: '13px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const,
  }
  const labelStyle = { fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }
  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9', fontFamily: 'Inter, sans-serif' }}>
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
        .card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
        .card-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 1.25rem; }
        select:focus { border-color: #111 !important; outline: none; }
        textarea:focus { border-color: #111 !important; outline: none; }
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
          <a href="/debrief" className="nav-item">
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
          <a href="/settings" className="nav-item active">
            <span className="nav-icon">⚙</span>
            <span className="nav-lbl">Paramètres</span>
          </a>
        </nav>
      </div>

      {/* MAIN */}
      <main style={{ marginLeft: sidebarW, flex: 1, minWidth: 0, transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)', padding: '0 2rem 3rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>Paramètres</span>
            <button
              onClick={saveProfile}
              disabled={saving}
              style={{
                background: saved ? '#16a34a' : '#111',
                color: '#fff', border: 'none', borderRadius: '8px',
                padding: '7px 18px', fontSize: '13px', fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer', transition: 'background 0.2s',
              }}
            >
              {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#bbb', fontSize: '13px' }}>Chargement...</div>
          ) : (
            <>
              {/* Profil trader */}
              <div className="card">
                <div className="card-title">Profil trader</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Marché</label>
                    <select style={selectStyle} value={form.market} onChange={e => setForm({ ...form, market: e.target.value })}>
                      {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeframe</label>
                    <select style={selectStyle} value={form.tf} onChange={e => setForm({ ...form, tf: e.target.value })}>
                      {TFS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Approche</label>
                    <select style={selectStyle} value={form.approach} onChange={e => setForm({ ...form, approach: e.target.value })}>
                      {APPROACHES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Process du matin */}
              <div className="card">
                <div className="card-title">Process du matin</div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Outils et données du matin</label>
                  <textarea
                    value={form.tools}
                    onChange={e => setForm({ ...form, tools: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: 'none' as const }}
                    placeholder="GEX, Volume Profile, Bookmap..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Ordre d'analyse</label>
                  <textarea
                    value={form.framework_matin}
                    onChange={e => setForm({ ...form, framework_matin: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: 'none' as const }}
                    placeholder="1. Je regarde le GEX... 2. Je trace..."
                  />
                </div>
              </div>

              {/* Psychologie */}
              <div className="card">
                <div className="card-title">Psychologie & risque</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Problème principal</label>
                    <select style={selectStyle} value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })}>
                      {PROBLEMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Risque par trade</label>
                    <select style={selectStyle} value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })}>
                      {RISKS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Déconnexion */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-title">Compte</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#111', fontWeight: 500 }}>Se déconnecter</div>
                    <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>Tu devras te reconnecter pour accéder à l'app</div>
                  </div>
                  <button
                    onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
                    style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '7px 16px', fontSize: '13px', color: '#dc2626', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>

            </>
          )}
        </div>
      </main>
    </div>
  )
}