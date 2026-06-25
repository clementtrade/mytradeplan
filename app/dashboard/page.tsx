'use client'

import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

const trades = [
  { dir: 'LONG',  setup: 'Break & retest', r: +2.1, plan: true  },
  { dir: 'SHORT', setup: 'Mean reversion',  r: -1.0, plan: false },
  { dir: 'LONG',  setup: 'Continuation',   r: +3.2, plan: true  },
  { dir: 'LONG',  setup: 'Break & retest', r: +1.8, plan: true  },
  { dir: 'SHORT', setup: 'Break & retest', r: -0.8, plan: true  },
]

const setups = [
  { name: 'Break & retest', r: '+2.4R', wr: 78, pos: true  },
  { name: 'Continuation',   r: '+1.8R', wr: 65, pos: true  },
  { name: 'Mean reversion', r: '−0.4R', wr: 35, pos: false },
]

function buildCalendar() {
  const juneOffset = 6
  const juneDays = 30
  const today = 26
  const results: (boolean | null)[] = [
    null, null,
    true, false, true, true, true,
    null, null,
    false, true, true, false, true,
    null, null,
    true, true, false, true, true,
    null, null,
    true, true, null,
    null, null, null, null,
  ]
  const cells: { day: number | null; result: boolean | null; isToday: boolean }[] = []
  for (let i = 0; i < juneOffset; i++) cells.push({ day: null, result: null, isToday: false })
  for (let d = 1; d <= juneDays; d++) {
    cells.push({ day: d, result: results[d - 1], isToday: d === today })
  }
  return cells
}

const calCells = buildCalendar()

const equityPoints = [44, 40, 33, 37, 26, 19, 13, 8, 4, 2]
const svgW = 320
const svgH = 48
function pointsToPath(pts: number[]) {
  const step = svgW / (pts.length - 1)
  return pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${y}`).join(' ')
}
const linePath = pointsToPath(equityPoints)
const areaPath = linePath + ` L${svgW},${svgH - 2} L0,${svgH - 2} Z`

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .topbar {
          padding: 14px 28px; border-bottom: 0.5px solid #e8e8e8;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px); z-index: 10;
        }
        .topbar-left { display: flex; align-items: baseline; gap: 10px; }
        .page-title { font-size: 15px; font-weight: 700; color: #111; letter-spacing: -0.3px; }
        .page-date { font-size: 12px; color: #aaa; }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .pill-plan {
          display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600;
          padding: 4px 12px; border-radius: 20px; background: #f0fdf4;
          color: #16a34a; border: 0.5px solid #bbf7d0;
        }
        .dot-green { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; }
        .btn-add-trade {
          display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;
          background: #111; color: #fff; border: none; padding: 7px 14px;
          border-radius: 8px; cursor: pointer; text-decoration: none; transition: opacity 0.15s;
        }
        .btn-add-trade:hover { opacity: 0.85; }

        .body { padding: 20px 28px; display: flex; flex-direction: column; gap: 16px; }

        .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .kpi-card { background: #f9f9f9; border-radius: 10px; padding: 12px 14px; }
        .kpi-label { font-size: 11px; color: #aaa; margin-bottom: 4px; }
        .kpi-val { font-size: 20px; font-weight: 700; color: #111; font-variant-numeric: tabular-nums; letter-spacing: -0.5px; }
        .kpi-val.green { color: #16a34a; }
        .kpi-sub { font-size: 10px; color: #bbb; margin-top: 2px; }

        .grid-2 { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 14px; }

        .panel { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px; padding: 14px 16px; }
        .panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .panel-title { font-size: 12px; font-weight: 600; color: #111; }
        .panel-link { font-size: 11px; color: #aaa; text-decoration: none; transition: color 0.15s; }
        .panel-link:hover { color: #111; }

        .trade-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 0.5px solid #f5f5f5; }
        .trade-row:last-child { border-bottom: none; padding-bottom: 0; }
        .badge { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 4px; }
        .badge-long  { background: #dcfce7; color: #15803d; }
        .badge-short { background: #fee2e2; color: #b91c1c; }
        .trade-setup { flex: 1; font-size: 12px; color: #444; }
        .trade-r { font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; }
        .trade-r.pos { color: #16a34a; }
        .trade-r.neg { color: #dc2626; }
        .trade-plan { font-size: 10px; font-weight: 500; min-width: 46px; text-align: right; }
        .trade-plan.yes { color: #16a34a; }
        .trade-plan.no  { color: #dc2626; }

        .equity-header {
          display: flex; justify-content: space-between; font-size: 10px; color: #aaa;
          margin-bottom: 5px; margin-top: 12px; padding-top: 12px; border-top: 0.5px solid #f0f0f0;
        }
        .equity-total { color: #16a34a; font-weight: 600; }

        .setup-row { margin-bottom: 10px; }
        .setup-row:last-child { margin-bottom: 0; }
        .setup-head { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .setup-name { font-size: 12px; color: #111; }
        .setup-stat { font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums; }
        .setup-stat.pos { color: #16a34a; }
        .setup-stat.neg { color: #dc2626; }
        .bar-track { height: 5px; background: #f0f0f0; border-radius: 3px; }
        .bar-fill  { height: 100%; border-radius: 3px; }
        .bar-green { background: #16a34a; }
        .bar-red   { background: #dc2626; }

        .insight {
          background: #fffbeb; border: 0.5px solid #fde68a; border-radius: 8px;
          padding: 8px 10px; font-size: 11px; color: #92400e;
          display: flex; align-items: flex-start; gap: 6px; margin-top: 12px;
        }

        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
        .cal-head  { font-size: 10px; color: #aaa; text-align: center; padding-bottom: 6px; }
        .cal-day   { aspect-ratio: 1; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #ccc; }
        .cal-day.win      { background: #bbf7d0; color: #14532d; font-weight: 600; }
        .cal-day.loss     { background: #fecaca; color: #7f1d1d; font-weight: 600; }
        .cal-day.today    { outline: 1.5px solid #111; outline-offset: -1px; color: #111; font-weight: 600; }
        .cal-day.no-trade { color: #ccc; }
        .cal-day.empty    { opacity: 0; pointer-events: none; }
        .cal-legend { display: flex; gap: 14px; margin-top: 10px; }
        .cal-leg-item { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #aaa; }
        .cal-leg-dot { width: 9px; height: 9px; border-radius: 3px; }
      `}</style>

      <Sidebar />

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <span className="page-title">Dashboard</span>
            <span className="page-date">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <div className="topbar-right">
            <div className="pill-plan">
              <div className="dot-green" />
              Plan du jour prêt
            </div>
            <Link href="/journal" className="btn-add-trade">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Ajouter un trade
            </Link>
          </div>
        </div>

        <div className="body">

          {/* KPIs */}
          <div className="kpi-row">
            {[
              { label: 'Win rate',     val: '71%',   green: true,  sub: 'sur 38 trades'   },
              { label: 'R moyen',      val: '+1.8R',  green: true,  sub: 'trades gagnants' },
              { label: 'Profit factor',val: '2.4',    green: false, sub: 'ce mois'          },
              { label: 'Discipline',   val: '84%',   green: true,  sub: 'plan respecté'   },
            ].map((k) => (
              <div key={k.label} className="kpi-card">
                <div className="kpi-label">{k.label}</div>
                <div className={`kpi-val ${k.green ? 'green' : ''}`}>{k.val}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Journal + Setups */}
          <div className="grid-2">
            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">Journal récent</span>
                <Link href="/journal" className="panel-link">Voir tout →</Link>
              </div>
              {trades.map((t, i) => (
                <div key={i} className="trade-row">
                  <span className={`badge ${t.dir === 'LONG' ? 'badge-long' : 'badge-short'}`}>{t.dir}</span>
                  <span className="trade-setup">{t.setup}</span>
                  <span className={`trade-r ${t.r > 0 ? 'pos' : 'neg'}`}>
                    {t.r > 0 ? '+' : ''}{t.r.toFixed(1)}R
                  </span>
                  <span className={`trade-plan ${t.plan ? 'yes' : 'no'}`}>
                    {t.plan ? '✓ plan' : '✗ plan'}
                  </span>
                </div>
              ))}
              <div className="equity-header">
                <span>Capital cumulé (R)</span>
                <span className="equity-total">+8.7R ce mois</span>
              </div>
              <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: '52px' }}>
                <path d={areaPath} fill="#bbf7d0" opacity="0.45" />
                <path d={linePath} fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={svgW} cy={equityPoints[equityPoints.length - 1]} r="3.5" fill="#16a34a" />
              </svg>
            </div>

            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">Performance par setup</span>
              </div>
              {setups.map((s) => (
                <div key={s.name} className="setup-row">
                  <div className="setup-head">
                    <span className="setup-name">{s.name}</span>
                    <span className={`setup-stat ${s.pos ? 'pos' : 'neg'}`}>{s.r} · {s.wr}%</span>
                  </div>
                  <div className="bar-track">
                    <div className={`bar-fill ${s.pos ? 'bar-green' : 'bar-red'}`} style={{ width: `${s.wr}%` }} />
                  </div>
                </div>
              ))}
              <div className="insight">
                <span>💡</span>
                <span>Ton edge est sur Break &amp; retest — tu performes 2× mieux que sur Mean reversion.</span>
              </div>
            </div>
          </div>

          {/* Calendrier */}
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">Calendrier — juin 2025</span>
              <div className="cal-legend">
                <div className="cal-leg-item">
                  <div className="cal-leg-dot" style={{ background: '#bbf7d0', border: '0.5px solid #86efac' }} />
                  Jour gagnant
                </div>
                <div className="cal-leg-item">
                  <div className="cal-leg-dot" style={{ background: '#fecaca', border: '0.5px solid #fca5a5' }} />
                  Jour perdant
                </div>
                <div className="cal-leg-item">
                  <div className="cal-leg-dot" style={{ border: '1.5px solid #111' }} />
                  Aujourd&apos;hui
                </div>
              </div>
            </div>
            <div className="cal-grid">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={i} className="cal-head">{d}</div>
              ))}
              {calCells.map((cell, i) => {
                if (cell.day === null) return <div key={i} className="cal-day empty" />
                let cls = 'cal-day'
                if (cell.isToday)          cls += ' today'
                else if (cell.result === true)  cls += ' win'
                else if (cell.result === false) cls += ' loss'
                else                            cls += ' no-trade'
                return <div key={i} className={cls}>{cell.day}</div>
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}