'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Trade = {
  id: string
  instrument: string
  direction: string
  result_r: number
  followed_plan: boolean
  contexte: string
  setup_type: string
  created_at: string
}

export default function StatsPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'semaine' | 'mois' | 'tout'>('tout')
  const [calMonth, setCalMonth] = useState(() => new Date())

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('trades').select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
      if (data) setTrades(data)
      setLoading(false)
    }
    load()
  }, [])

  const filteredTrades = trades.filter(t => {
    if (filter === 'tout') return true
    const date = new Date(t.created_at)
    const now = new Date()
    if (filter === 'semaine') {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
      return date >= weekAgo
    }
    if (filter === 'mois') {
      const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1)
      return date >= monthAgo
    }
    return true
  })

  const wins = filteredTrades.filter(t => t.result_r > 0)
  const losses = filteredTrades.filter(t => t.result_r <= 0)
  const winRate = filteredTrades.length > 0 ? Math.round((wins.length / filteredTrades.length) * 100) : 0
  const totalR = parseFloat(filteredTrades.reduce((sum, t) => sum + t.result_r, 0).toFixed(2))
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.result_r, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.result_r, 0) / losses.length) : 0
  const profitFactor = avgLoss > 0 ? parseFloat((avgWin / avgLoss).toFixed(2)) : 0
  const followedPlan = filteredTrades.length > 0 ? Math.round((filteredTrades.filter(t => t.followed_plan).length / filteredTrades.length) * 100) : 0
  const avgR = filteredTrades.length > 0 ? parseFloat((totalR / filteredTrades.length).toFixed(2)) : 0

  const setupStats = filteredTrades.reduce((acc: Record<string, { wins: number, total: number, totalR: number }>, t) => {
    const setup = t.setup_type || 'Non défini'
    if (!acc[setup]) acc[setup] = { wins: 0, total: 0, totalR: 0 }
    acc[setup].total++
    acc[setup].totalR += t.result_r
    if (t.result_r > 0) acc[setup].wins++
    return acc
  }, {})

  const setupList = Object.entries(setupStats)
    .map(([name, s]) => ({ name, winRate: Math.round((s.wins / s.total) * 100), avgR: parseFloat((s.totalR / s.total).toFixed(2)), total: s.total }))
    .sort((a, b) => b.avgR - a.avgR)
    .slice(0, 4)

  const bestSetup = setupList[0]
  const worstSetup = setupList[setupList.length - 1]

  const equityCurve = filteredTrades.reduce((acc: { x: number, r: number }[], t, i) => {
    const prev = acc[i - 1]?.r ?? 0
    return [...acc, { x: i + 1, r: parseFloat((prev + t.result_r).toFixed(2)) }]
  }, [])

  const maxR = Math.max(...equityCurve.map(p => p.r), 0.1)
  const minR = Math.min(...equityCurve.map(p => p.r), -0.1)
  const range = maxR - minR || 1
  function getY(r: number) { return 100 - ((r - minR) / range) * 80 }
  const points = equityCurve.map((p, i) => {
    const x = filteredTrades.length > 1 ? (i / (filteredTrades.length - 1)) * 560 + 20 : 20
    return `${x},${getY(p.r)}`
  }).join(' ')

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
  const calTrades = Object.values(tradesByDay)
  const calWinDays = calTrades.filter(r => r > 0).length
  const calTotalR = parseFloat(calTrades.reduce((s, r) => s + r, 0).toFixed(2))
  const calWR = calTrades.length > 0 ? Math.round((calWinDays / calTrades.length) * 100) : 0
  const today = new Date()

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ color: '#aaa', fontSize: '14px' }}>Chargement...</div>
    </main>
  )

  if (trades.length === 0) return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>Aucun trade encore.</div>
        <a href="/journal" style={{ color: '#111', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Ajouter un trade →</a>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .sa { animation: fadeUp 0.5s ease both; }
        .stat-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.04); transition: box-shadow 0.2s, transform 0.2s; }
        .stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .chart-wrap { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .filter-btn { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; border: 0.5px solid #e0e0e0; background: #fff; color: #888; transition: all 0.15s; }
        .filter-btn.active { background: #111; color: #fff; border-color: #111; }
        .filter-btn:hover:not(.active) { border-color: #111; color: #111; }
        .setup-row { padding: 10px 0; border-bottom: 0.5px solid #f5f5f5; }
        .setup-row:last-child { border-bottom: none; }
        .cal-day { height: 52px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; transition: transform 0.15s; position: relative; }
        .cal-day:hover { transform: scale(1.06); z-index: 2; }
        .cal-win { background: #dcfce7; color: #16a34a; cursor: default; }
        .cal-loss { background: #fee2e2; color: #dc2626; cursor: default; }
        .cal-neutral { background: #f9f9f9; color: #ccc; }
        .cal-empty { background: transparent; }
        .cal-today { border: 2px solid #111 !important; }
        .cal-r { font-size: 9px; font-weight: 500; margin-top: 2px; opacity: 0.85; }
        .cal-future { background: #f9f9f9; color: #e0e0e0; }
      `}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Navbar */}
        <div className="sa" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <a href="/dashboard" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/plan" className="nav-link">Plan du matin</a>
            <a href="/journal" className="nav-link">Journal</a>
            <a href="/stats" className="nav-link" style={{ color: '#111', fontWeight: 600 }}>Stats</a>
          </div>
        </div>
        <div style={{ borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}></div>

        {/* Header + filtres */}
        <div className="sa" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '4px' }}>Stats & performance</h1>
            <div style={{ color: '#888', fontSize: '13px' }}>{filteredTrades.length} trades analysés</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['semaine', 'mois', 'tout'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`filter-btn${filter === f ? ' active' : ''}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="sa" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '1.25rem' }}>
          <div className="stat-card">
            <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Win Rate</div>
            <div style={{ color: winRate >= 50 ? '#16a34a' : '#dc2626', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>{winRate}%</div>
          </div>
          <div className="stat-card">
            <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>R moyen</div>
            <div style={{ color: avgR >= 0 ? '#16a34a' : '#dc2626', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>{avgR >= 0 ? '+' : ''}{avgR}R</div>
          </div>
          <div className="stat-card">
            <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profit Factor</div>
            <div style={{ color: '#111', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>{profitFactor || '—'}</div>
          </div>
          <div className="stat-card">
            <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discipline</div>
            <div style={{ color: followedPlan >= 70 ? '#16a34a' : '#d97706', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>{followedPlan}%</div>
          </div>
        </div>

        {/* Equity curve + Setup perf */}
        <div className="sa" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
          <div className="chart-wrap">
            <div style={{ color: '#111', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Capital cumulé (R)</div>
            <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '1rem' }}>Equity curve sur la période</div>
            <svg width="100%" viewBox="0 0 600 120" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="gEq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={totalR >= 0 ? '#16a34a' : '#dc2626'} stopOpacity="0.12"/>
                  <stop offset="100%" stopColor={totalR >= 0 ? '#16a34a' : '#dc2626'} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <line x1="20" y1={getY(0)} x2="580" y2={getY(0)} stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4,4"/>
              {equityCurve.length > 1 && (
                <>
                  <polygon points={`${points} ${filteredTrades.length > 1 ? ((filteredTrades.length - 1) / (filteredTrades.length - 1)) * 560 + 20 : 20},110 20,110`} fill="url(#gEq)"/>
                  <polyline points={points} fill="none" stroke={totalR >= 0 ? '#16a34a' : '#dc2626'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
              {equityCurve.map((p, i) => {
                const x = filteredTrades.length > 1 ? (i / (filteredTrades.length - 1)) * 560 + 20 : 20
                return <circle key={i} cx={x} cy={getY(p.r)} r="3" fill={p.r >= 0 ? '#16a34a' : '#dc2626'}/>
              })}
            </svg>
          </div>

          <div className="chart-wrap">
            <div style={{ color: '#111', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Performance par setup</div>
            <div style={{ color: '#aaa', fontSize: '11px', marginBottom: '1rem' }}>Win rate et R moyen par configuration</div>
            {setupList.map(setup => (
              <div key={setup.name} className="setup-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{setup.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: setup.avgR >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{setup.avgR >= 0 ? '+' : ''}{setup.avgR}R · {setup.winRate}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                    <div style={{ width: `${setup.winRate}%`, height: '100%', background: setup.winRate >= 50 ? '#16a34a' : '#dc2626', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            ))}
            {bestSetup && worstSetup && bestSetup.name !== worstSetup.name && (
              <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '8px 10px', marginTop: '10px', fontSize: '11px', color: '#92400e' }}>
                <strong>💡 Insight</strong> — Tu performes mieux sur {bestSetup.name} ({bestSetup.winRate}% WR). Sois prudent sur {worstSetup.name}.
              </div>
            )}
          </div>
        </div>

        {/* Trading Calendar */}
        <div className="sa chart-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>Trading Calendar</div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Résultat journalier en R cumulé</div>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '11px', color: '#888' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#dcfce7' }}></div>Gain</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#fee2e2' }}></div>Perte</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#f9f9f9' }}></div>Pas de trade</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#111', letterSpacing: '-0.3px' }}>{monthNames[calMonthIdx]} {calYear}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx - 1, 1))} style={{ background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '5px 14px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>← Préc.</button>
              <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx + 1, 1))} style={{ background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '5px 14px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>Suiv. →</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px', marginBottom: '6px' }}>
            {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: i >= 5 ? '#ddd' : '#aaa', padding: '4px' }}>{d}</div>
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
              return (
                <div key={day} className={cls} style={{ opacity: isWeekend ? 0.3 : 1 }}>
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
              <div style={{ fontSize: '18px', fontWeight: 700, color: calTotalR >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{calTotalR >= 0 ? '+' : ''}{calTotalR}R</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Total du mois</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>{calTrades.length}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Jours tradés</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>{calWinDays}/{calTrades.length}</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Jours gagnants</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: calWR >= 50 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{calWR}%</div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>Win rate mensuel</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}