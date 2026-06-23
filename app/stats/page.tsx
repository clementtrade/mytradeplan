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

  const wins = trades.filter(t => t.result_r > 0)
  const losses = trades.filter(t => t.result_r <= 0)
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0
  const totalR = trades.reduce((sum, t) => sum + t.result_r, 0)
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.result_r, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.result_r, 0) / losses.length) : 0
  const profitFactor = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : '—'
  const expectancy = trades.length > 0 ? ((winRate / 100) * avgWin - (1 - winRate / 100) * avgLoss).toFixed(2) : '0'
  const followedPlan = trades.length > 0 ? Math.round((trades.filter(t => t.followed_plan).length / trades.length) * 100) : 0

  // Setups stats — utilise setup_type
  const setupStats = trades.reduce((acc: Record<string, {wins: number, total: number, totalR: number}>, t) => {
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

  // Equity curve
  const equityCurve = trades.reduce((acc: {x: number, r: number}[], t, i) => {
    const prev = acc[i - 1]?.r ?? 0
    return [...acc, { x: i + 1, r: parseFloat((prev + t.result_r).toFixed(2)) }]
  }, [])

  const maxR = Math.max(...equityCurve.map(p => p.r), 0.1)
  const minR = Math.min(...equityCurve.map(p => p.r), -0.1)
  const range = maxR - minR
  function getY(r: number) { return 100 - ((r - minR) / range) * 80 }
  const points = equityCurve.map((p, i) => {
    const x = trades.length > 1 ? (i / (trades.length - 1)) * 560 + 20 : 20
    return `${x},${getY(p.r)}`
  }).join(' ')

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
        .stats-anim { animation: fadeUp 0.6s ease both; }
        .stat-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 10px; padding: 1rem 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .setup-row { padding: 10px 0; border-bottom: 0.5px solid #f5f5f5; }
        .setup-row:last-child { border-bottom: none; }
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Navbar */}
        <div className="stats-anim" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <a href="/dashboard" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/plan" className="nav-link">Plan du matin</a>
            <a href="/journal" className="nav-link">Journal</a>
            <a href="/stats" className="nav-link" style={{ color: '#111', fontWeight: 600 }}>Stats</a>
          </div>
        </div>
        <div style={{ borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}></div>

        {/* Header */}
        <div className="stats-anim" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '4px' }}>Stats & performance</h1>
          <div style={{ color: '#888', fontSize: '13px' }}>{trades.length} trades analysés</div>
        </div>

        {/* Stats principales */}
        <div className="stats-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.25rem' }}>
          {[
            { label: 'Win Rate', value: `${winRate}%`, color: winRate >= 50 ? '#16a34a' : '#dc2626' },
            { label: 'Total R', value: `${totalR >= 0 ? '+' : ''}${totalR.toFixed(2)}R`, color: totalR >= 0 ? '#16a34a' : '#dc2626' },
            { label: 'Profit Factor', value: profitFactor, color: '#111' },
            { label: 'Expectancy', value: `${expectancy}R`, color: parseFloat(expectancy) >= 0 ? '#16a34a' : '#dc2626' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: '22px', fontWeight: 700, fontFamily: 'monospace' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="stats-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total trades', value: trades.length, color: '#111' },
            { label: 'Trades gagnants', value: wins.length, color: '#16a34a' },
            { label: 'Discipline', value: `${followedPlan}%`, color: followedPlan >= 70 ? '#16a34a' : '#d97706' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: '20px', fontWeight: 700, fontFamily: 'monospace' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Courbe de capital */}
        <div className="stats-anim" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#888', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Courbe de capital (R cumulé)</div>
          <svg width="100%" viewBox="0 0 600 120" style={{ overflow: 'visible' }}>
            <line x1="20" y1={getY(0)} x2="580" y2={getY(0)} stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4,4"/>
            {equityCurve.length > 1 && (
              <polyline points={points} fill="none" stroke={totalR >= 0 ? '#16a34a' : '#dc2626'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
            {equityCurve.map((p, i) => {
              const x = trades.length > 1 ? (i / (trades.length - 1)) * 560 + 20 : 20
              return <circle key={i} cx={x} cy={getY(p.r)} r="3" fill={p.r >= 0 ? '#16a34a' : '#dc2626'}/>
            })}
          </svg>
        </div>

        {/* Performance par setup */}
        <div className="stats-anim" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#888', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Performance par setup</div>
          {setupList.map(setup => (
            <div key={setup.name} className="setup-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{setup.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: setup.avgR >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{setup.avgR >= 0 ? '+' : ''}{setup.avgR}R moy.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                  <div style={{ width: `${setup.winRate}%`, height: '100%', background: setup.winRate >= 50 ? '#16a34a' : '#dc2626', borderRadius: '3px' }}></div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: setup.winRate >= 50 ? '#16a34a' : '#dc2626', width: '30px', textAlign: 'right' }}>{setup.winRate}%</span>
              </div>
              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>{setup.total} trades</div>
            </div>
          ))}

          {bestSetup && worstSetup && bestSetup.name !== worstSetup.name && (
            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '10px 12px', marginTop: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#d97706', marginBottom: '3px' }}>💡 INSIGHT</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
                Tu performes mieux sur <strong>{bestSetup.name}</strong> ({bestSetup.winRate}% WR). Sois prudent sur <strong>{worstSetup.name}</strong> — ce n'est peut-être pas ton edge.
              </div>
            </div>
          )}
        </div>

        {/* Derniers trades */}
        <div className="stats-anim" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ color: '#888', fontSize: '12px', fontWeight: 500, marginBottom: '1rem' }}>Derniers trades</div>
          {trades.slice(-5).reverse().map(trade => (
            <div key={trade.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid #f5f5f5' }}>
              <span style={{ color: '#111', fontSize: '13px', fontWeight: 600, width: '60px' }}>{trade.instrument}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: trade.direction === 'long' ? '#dcfce7' : '#fee2e2', color: trade.direction === 'long' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{trade.direction.toUpperCase()}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f5f5f5', color: '#555', margin: '0 8px' }}>{trade.setup_type || '—'}</span>
              <span style={{ color: '#aaa', fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.contexte}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', color: trade.result_r >= 0 ? '#16a34a' : '#dc2626' }}>{trade.result_r >= 0 ? '+' : ''}{trade.result_r}R</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}