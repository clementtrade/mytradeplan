'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Trade = {
  id: string
  created_at: string
  instrument: string
  direction: string
  setup_type: string
  contexte: string
  result_r: number
  followed_plan: boolean
  notes: string
}

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [calMonth, setCalMonth] = useState(() => new Date())
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [planReady, setPlanReady] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: tradesData } = await supabase
        .from('trades').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (tradesData) setTrades(tradesData)
      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (profileData) setProfile(profileData)
      const today = new Date().toISOString().split('T')[0]
      const { data: planData } = await supabase
        .from('morning_plans').select('id').eq('user_id', user.id).gte('created_at', today).limit(1)
      if (planData && planData.length > 0) setPlanReady(true)
      setLoading(false)
    }
    load()
  }, [])

  const wins = trades.filter(t => t.result_r > 0)
  const losses = trades.filter(t => t.result_r <= 0)
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + t.result_r, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + t.result_r, 0) / losses.length) : 0
  const profitFactor = avgLoss > 0 ? parseFloat((avgWin / avgLoss).toFixed(1)) : 0
  const followedPlan = trades.length > 0 ? Math.round((trades.filter(t => t.followed_plan).length / trades.length) * 100) : 0
  const avgR = trades.length > 0 ? parseFloat((trades.reduce((s, t) => s + t.result_r, 0) / trades.length).toFixed(1)) : 0
  const recentTrades = trades.slice(0, 4)

  const setupStats = trades.reduce((acc: Record<string, { wins: number; total: number; totalR: number }>, t) => {
    const setup = t.setup_type || 'Non défini'
    if (!acc[setup]) acc[setup] = { wins: 0, total: 0, totalR: 0 }
    acc[setup].total++
    acc[setup].totalR += t.result_r
    if (t.result_r > 0) acc[setup].wins++
    return acc
  }, {})
  const setupList = Object.entries(setupStats)
    .map(([name, s]) => ({ name, winRate: Math.round((s.wins / s.total) * 100), avgR: parseFloat((s.totalR / s.total).toFixed(1)), total: s.total }))
    .sort((a, b) => b.avgR - a.avgR).slice(0, 3)

  const tradesAsc = [...trades].reverse()
  const equityCurve = tradesAsc.reduce((acc: { x: number; r: number }[], t, i) => {
    const prev = acc[i - 1]?.r ?? 0
    return [...acc, { x: i + 1, r: parseFloat((prev + t.result_r).toFixed(2)) }]
  }, [])
  const totalR = equityCurve.length > 0 ? equityCurve[equityCurve.length - 1].r : 0
  const maxR = Math.max(...equityCurve.map(p => p.r), 0.1)
  const minR = Math.min(...equityCurve.map(p => p.r), -0.1)
  const range = maxR - minR || 1
  const chartH = 80
  function getY(r: number) { return chartH - ((r - minR) / range) * (chartH - 10) }
  const points = equityCurve.map((p, i) => {
    const x = equityCurve.length > 1 ? (i / (equityCurve.length - 1)) * 540 + 20 : 20
    return `${x},${getY(p.r)}`
  }).join(' ')
  const lastX = equityCurve.length > 1 ? 560 : 20
  const lastY = equityCurve.length > 0 ? getY(equityCurve[equityCurve.length - 1].r) : chartH / 2

  const calYear = calMonth.getFullYear()
  const calMonthIdx = calMonth.getMonth()
  const firstDay = new Date(calYear, calMonthIdx, 1).getDay()
  const daysInMonth = new Date(calYear, calMonthIdx + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const tradesByDay: Record<string, number> = {}
  trades.forEach(t => {
    const d = new Date(t.created_at)
    if (d.getFullYear() === calYear && d.getMonth() === calMonthIdx) {
      const key = d.getDate().toString()
      tradesByDay[key] = (tradesByDay[key] || 0) + t.result_r
    }
  })
  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const today = new Date()
  const calTrades = Object.values(tradesByDay)
  const calWinDays = calTrades.filter(r => r > 0).length
  const calTotalR = parseFloat(calTrades.reduce((s, r) => s + r, 0).toFixed(1))
  const calWR = calTrades.length > 0 ? Math.round((calWinDays / calTrades.length) * 100) : 0

  const sidebarW = sidebarExpanded ? 200 : 52
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CL'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .sa { animation: fadeUp 0.4s ease both; }
        .sa1 { animation-delay: 0.04s; } .sa2 { animation-delay: 0.08s; }
        .sa3 { animation-delay: 0.12s; } .sa4 { animation-delay: 0.16s; }
        .sa5 { animation-delay: 0.20s; }
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
        .kpi-card { background: #1a1a1a; border-radius: 14px; padding: 1.25rem 1.4rem; transition: transform 0.15s; }
        .kpi-card:hover { transform: translateY(-2px); }
        .mid-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 14px; padding: 1.25rem; }
        .trade-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 0.5px solid #f2f2f2; }
        .trade-row:last-child { border-bottom: none; }
        .badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.4px; }
        .badge-long { background: #dcfce7; color: #16a34a; }
        .badge-short { background: #fee2e2; color: #dc2626; }
        .setup-row { padding: 8px 0; border-bottom: 0.5px solid #f2f2f2; }
        .setup-row:last-child { border-bottom: none; }
        .cal-day { aspect-ratio: 1; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; transition: transform 0.15s; cursor: default; }
        .cal-day:hover { transform: scale(1.06); z-index: 2; position: relative; }
        .cal-win { background: #c8f0d8; color: #15803d; }
        .cal-loss { background: #fdd0d0; color: #dc2626; }
        .cal-neutral { background: #f5f5f5; color: #ccc; }
        .cal-empty { background: transparent; }
        .cal-future { background: #f5f5f5; color: #ddd; }
        .cal-today { outline: 2px solid #888; outline-offset: -2px; }
        .cal-r { font-size: 9px; margin-top: 2px; opacity: 0.75; }
        .cal-weekend { opacity: 0.3; }
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
          <a href="/dashboard" className="nav-item active">
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
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#ccc', fontSize: '13px' }}>Chargement...</div>
        ) : (
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

            {/* HEADER */}
            <div className="sa sa1" style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>Dashboard</span>
                <span style={{ fontSize: '13px', color: '#aaa' }}>{dateFormatted}</span>
              </div>
              <a href="/plan" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: planReady ? '#f0fdf4' : '#fff', border: `0.5px solid ${planReady ? '#86efac' : '#e8e8e8'}`, color: planReady ? '#15803d' : '#888', padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: planReady ? '#22c55e' : '#d1d5db', display: 'inline-block', flexShrink: 0 }}></span>
                {planReady ? 'Plan prêt' : 'Plan du matin'}
              </a>
            </div>

            {trades.length === 0 ? (
              <div className="sa sa2" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📒</div>
                <div style={{ color: '#bbb', fontSize: '14px', marginBottom: '8px' }}>Aucun trade encore enregistré.</div>
                <a href="/journal" style={{ color: '#111', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Ajouter un trade →</a>
              </div>
            ) : (
              <>
                {/* KPI CARDS */}
                <div className="sa sa2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '1.5rem' }}>
                  <div className="kpi-card">
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Win rate</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 700, color: winRate >= 50 ? '#4ade80' : '#f87171', fontFamily: 'monospace', letterSpacing: '-2px', lineHeight: 1 }}>{winRate}%</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>{trades.length} trades</div>
                  </div>
                  <div className="kpi-card">
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>R moyen</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 700, color: avgR >= 0 ? '#4ade80' : '#f87171', fontFamily: 'monospace', letterSpacing: '-2px', lineHeight: 1 }}>{avgR >= 0 ? '+' : ''}{avgR}R</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>trades gagnants</div>
                  </div>
                  <div className="kpi-card">
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Profit factor</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: '-2px', lineHeight: 1 }}>{profitFactor || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>ce mois</div>
                  </div>
                  <div className="kpi-card">
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 500 }}>Discipline</div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 700, color: followedPlan >= 70 ? '#4ade80' : '#facc15', fontFamily: 'monospace', letterSpacing: '-2px', lineHeight: 1 }}>{followedPlan}%</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>plan respecté</div>
                  </div>
                </div>

                {/* JOURNAL + SETUP */}
                <div className="sa sa3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                  <div className="mid-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#888' }}>Journal récent</span>
                      <a href="/journal" style={{ fontSize: '12px', color: '#aaa', textDecoration: 'none', fontWeight: 500 }}>Voir tout →</a>
                    </div>
                    {recentTrades.map(t => {
                      const d = new Date(t.created_at)
                      const ds = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
                      return (
                        <div key={t.id} className="trade-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <span className={`badge badge-${t.direction === 'long' ? 'long' : 'short'}`}>{t.direction}</span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{t.setup_type || t.instrument}</div>
                              <div style={{ fontSize: '11px', color: '#bbb' }}>{ds}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 700, fontFamily: 'monospace', color: t.result_r > 0 ? '#16a34a' : '#dc2626' }}>
                              {t.result_r > 0 ? '+' : ''}{t.result_r}R
                            </span>
                            <span style={{ fontSize: '11px', color: t.followed_plan ? '#16a34a' : '#d97706', minWidth: '40px' }}>
                              {t.followed_plan ? '✓ plan' : '✗ plan'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mid-card">
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#888', marginBottom: '1rem' }}>Performances par setup</div>
                    {setupList.map((s) => (
                      <div key={s.name} className="setup-row">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{s.name}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: s.avgR >= 0 ? '#16a34a' : '#dc2626' }}>
                            {s.avgR >= 0 ? '+' : ''}{s.avgR}R · {s.winRate}%
                          </span>
                        </div>
                        <div style={{ height: '7px', background: '#f0f0f0', borderRadius: '4px' }}>
                          <div style={{ width: `${s.winRate}%`, height: '100%', background: s.winRate >= 50 ? '#111' : '#dc2626', borderRadius: '4px', transition: 'width 0.6s ease' }}></div>
                        </div>
                      </div>
                    ))}
                    {setupList.length >= 2 && (
                      <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '10px', padding: '10px 12px', marginTop: '14px', fontSize: '12px', color: '#92400e', lineHeight: 1.6, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span>□</span>
                        <span>Ton edge est sur <strong>{setupList[0].name}</strong> — {Math.round(setupList[0].avgR / Math.abs(setupList[setupList.length-1].avgR || 1))}× mieux que {setupList[setupList.length-1].name}.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* EQUITY CURVE */}
                <div className="sa sa4 mid-card" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Capital cumulé (R)</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: totalR >= 0 ? '#16a34a' : '#dc2626' }}>
                      {totalR >= 0 ? '+' : ''}{totalR}R ce mois
                    </span>
                  </div>
                  {equityCurve.length > 1 ? (
                    <svg width="100%" viewBox="0 0 580 90" style={{ overflow: 'visible', display: 'block' }}>
                      <defs>
                        <linearGradient id="gEq" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={totalR >= 0 ? '#16a34a' : '#dc2626'} stopOpacity="0.18"/>
                          <stop offset="100%" stopColor={totalR >= 0 ? '#16a34a' : '#dc2626'} stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <line x1="20" y1={getY(0)} x2="560" y2={getY(0)} stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4,3"/>
                      <polygon points={`${points} ${lastX},${chartH + 5} 20,${chartH + 5}`} fill="url(#gEq)"/>
                      <polyline points={points} fill="none" stroke={totalR >= 0 ? '#16a34a' : '#dc2626'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx={lastX} cy={lastY} r="4" fill={totalR >= 0 ? '#16a34a' : '#dc2626'}/>
                    </svg>
                  ) : (
                    <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '12px' }}>Pas assez de données</div>
                  )}
                </div>

                {/* CALENDRIER */}
                <div className="sa sa5 mid-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#111', letterSpacing: '-0.3px' }}>Calendrier · {monthNames[calMonthIdx]} {calYear}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#aaa' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, borderRadius: '3px', background: '#c8f0d8', display: 'inline-block' }}></span>Jour gagnant</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, borderRadius: '3px', background: '#fdd0d0', display: 'inline-block' }}></span>Jour perdant</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 12, height: 12, borderRadius: '3px', outline: '1.5px solid #888', display: 'inline-block' }}></span>Aujourd'hui</span>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx - 1, 1))} style={{ background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>← Préc.</button>
                        <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx + 1, 1))} style={{ background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>Suiv. →</button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px', marginBottom: '6px' }}>
                    {['L','M','M','J','V','S','D'].map((d, i) => (
                      <div key={`${d}${i}`} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: i >= 5 ? '#ddd' : '#aaa', paddingBottom: '4px' }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px' }}>
                    {Array(startOffset).fill(null).map((_, i) => (
                      <div key={`e${i}`} className="cal-day cal-empty"></div>
                    ))}
                    {Array(daysInMonth).fill(null).map((_, i) => {
                      const day = i + 1
                      const key = day.toString()
                      const r = tradesByDay[key]
                      const isFuture = new Date(calYear, calMonthIdx, day) > today
                      const isToday = day === today.getDate() && calMonthIdx === today.getMonth() && calYear === today.getFullYear()
                      const isWeekend = (() => { const d = new Date(calYear, calMonthIdx, day).getDay(); return d === 0 || d === 6 })()
                      let cls = 'cal-day '
                      if (isFuture || isWeekend) cls += 'cal-future'
                      else if (r !== undefined) cls += r > 0 ? 'cal-win' : 'cal-loss'
                      else cls += 'cal-neutral'
                      if (isToday) cls += ' cal-today'
                      if (isWeekend) cls += ' cal-weekend'
                      return (
                        <div key={day} className={cls}>
                          {day}
                          {r !== undefined && !isWeekend && !isFuture && (
                            <span className="cal-r">{r >= 0 ? '+' : ''}{r.toFixed(1)}R</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '0.5px solid #f0f0f0' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: calTotalR >= 0 ? '#16a34a' : '#dc2626' }}>{calTotalR >= 0 ? '+' : ''}{calTotalR}R</div>
                      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px' }}>Total du mois</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#111' }}>{calTrades.length}</div>
                      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px' }}>Jours tradés</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#16a34a' }}>{calWinDays}/{calTrades.length || 0}</div>
                      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px' }}>Jours gagnants</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: calWR >= 50 ? '#16a34a' : '#dc2626' }}>{calWR}%</div>
                      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px' }}>Win rate mensuel</div>
                    </div>
                  </div>
                </div>

              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}