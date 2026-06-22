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
  created_at: string
}

export default function StatsPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('trades').select('*').order('created_at', { ascending: true })
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

  const equityCurve = trades.reduce((acc: {x: number, r: number}[], t, i) => {
    const prev = acc[i - 1]?.r ?? 0
    return [...acc, { x: i + 1, r: parseFloat((prev + t.result_r).toFixed(2)) }]
  }, [])

  const maxR = Math.max(...equityCurve.map(p => p.r), 0.1)
  const minR = Math.min(...equityCurve.map(p => p.r), -0.1)
  const range = maxR - minR

  function getY(r: number) {
    return 120 - ((r - minR) / range) * 100
  }

  const points = equityCurve.map((p, i) => {
    const x = trades.length > 1 ? (i / (trades.length - 1)) * 560 + 20 : 20
    const y = getY(p.r)
    return `${x},${y}`
  }).join(' ')

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '14px' }}>Chargement...</div>
      </main>
    )
  }

  if (trades.length === 0) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(229,231,235,0.3)', fontSize: '14px', marginBottom: '8px' }}>Aucun trade encore.</div>
          <div style={{ color: 'rgba(229,231,235,0.2)', fontSize: '13px' }}>Ajoute des trades dans le journal pour voir tes stats.</div>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0E1A', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 600, marginBottom: '2rem' }}>Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Win Rate', value: `${winRate}%`, color: winRate >= 50 ? '#10B981' : '#EF4444' },
            { label: 'Profit Factor', value: profitFactor, color: '#F9FAFB' },
            { label: 'Expectancy', value: `${expectancy}R`, color: parseFloat(expectancy) >= 0 ? '#10B981' : '#EF4444' },
            { label: 'Total R', value: `${totalR >= 0 ? '+' : ''}${totalR.toFixed(2)}R`, color: totalR >= 0 ? '#10B981' : '#EF4444' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: '22px', fontWeight: 700, fontFamily: 'monospace' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total trades', value: trades.length },
            { label: 'Trades gagnants', value: wins.length },
            { label: 'Plan suivi', value: `${followedPlan}%` },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ color: '#F9FAFB', fontSize: '20px', fontWeight: 700, fontFamily: 'monospace' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Courbe de capital (R cumulé)</div>
          <svg width="100%" viewBox="0 0 600 140" style={{ overflow: 'visible' }}>
            <line x1="20" y1={getY(0)} x2="580" y2={getY(0)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {equityCurve.length > 1 && (
              <polyline points={points} fill="none" stroke={totalR >= 0 ? '#10B981' : '#EF4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {equityCurve.map((p, i) => {
              const x = trades.length > 1 ? (i / (trades.length - 1)) * 560 + 20 : 20
              const y = getY(p.r)
              return <circle key={i} cx={x} cy={y} r="3" fill={p.r >= 0 ? '#10B981' : '#EF4444'} />
            })}
          </svg>
        </div>

        <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.25rem' }}>
          <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Derniers trades</div>
          {trades.slice(-5).reverse().map(trade => (
            <div key={trade.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 500, width: '60px' }}>{trade.instrument}</span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: trade.direction === 'long' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: trade.direction === 'long' ? '#10B981' : '#EF4444', fontFamily: 'monospace' }}>{trade.direction.toUpperCase()}</span>
              <span style={{ color: 'rgba(229,231,235,0.5)', fontSize: '12px', flex: 1, margin: '0 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.contexte}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: trade.result_r >= 0 ? '#10B981' : '#EF4444' }}>{trade.result_r >= 0 ? '+' : ''}{trade.result_r}R</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}