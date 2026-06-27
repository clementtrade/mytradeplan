'use client'
import { useState } from 'react'

export default function Home() {
  const [annual, setAnnual] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: '#0d1b2a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatL { 0%,100%{transform:rotate(-3deg) translateY(0)} 50%{transform:rotate(-3deg) translateY(-7px)} }
        @keyframes floatR { 0%,100%{transform:rotate(3deg) translateY(0)} 50%{transform:rotate(3deg) translateY(-5px)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes glow { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .anim-1 { animation: fadeUp 0.7s ease both; }
        .anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .anim-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .anim-5 { animation: fadeUp 0.7s 0.6s ease both; }
        .btn-main { background: linear-gradient(135deg,#c9a84c,#e8c96d); color: #0d1b2a; font-size: 0.9rem; font-weight: 700; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; transition: opacity 0.2s, transform 0.2s; display: inline-block; }
        .btn-main:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-sec { background: rgba(255,255,255,0.05); color: #7a9bb5; font-size: 0.9rem; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; border: 0.5px solid rgba(255,255,255,0.08); transition: all 0.2s; display: inline-block; }
        .btn-sec:hover { border-color: rgba(201,168,76,0.4); color: #c9a84c; }
        .nav-link { font-size: 0.875rem; color: #4a6580; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #c9a84c; }
        .feat-check { width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg,#c9a84c,#e8c96d); color: #0d1b2a; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
        .feature-card { padding: 1.5rem; border: 0.5px solid rgba(255,255,255,0.07); border-radius: 10px; background: rgba(255,255,255,0.03); transition: border-color 0.2s, transform 0.2s; cursor: default; }
        .feature-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-2px); }
        .plan-card { padding: 2rem; border-radius: 12px; transition: transform 0.2s; }
        .plan-card:hover { transform: translateY(-2px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; max-width: 900px; margin: 0 auto; }
        .feat-tag { font-size: 0.7rem; color: #c9a84c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.75rem; }
        .feat-title { font-size: 1.4rem; font-weight: 700; color: #fff; letter-spacing: -0.3px; margin-bottom: 0.75rem; line-height: 1.25; }
        .feat-desc { font-size: 0.875rem; color: #4a6580; line-height: 1.7; margin-bottom: 1rem; }
        .feat-point { font-size: 0.875rem; color: #7a9bb5; margin-bottom: 4px; }
        .mockup-card { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 1rem; }
        .chat-ai { background: rgba(255,255,255,0.06); border-radius: 3px 10px 10px 10px; padding: 9px 12px; font-size: 12px; color: #7a9bb5; max-width: 88%; margin-bottom: 6px; }
        .chat-ai-lbl { font-size: 9px; color: #c9a84c; font-weight: 600; margin-bottom: 2px; }
        .chat-user { background: linear-gradient(135deg,#c9a84c,#e8c96d); border-radius: 10px 3px 10px 10px; padding: 9px 12px; font-size: 12px; color: #0d1b2a; font-weight: 600; max-width: 78%; margin-left: auto; margin-bottom: 6px; }
        .trade-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 0.5px solid rgba(255,255,255,0.05); }
        .badge-long { background: rgba(34,197,94,0.15); color: #4ade80; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; border: 0.5px solid rgba(34,197,94,0.25); }
        .badge-short { background: rgba(239,68,68,0.15); color: #f87171; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; border: 0.5px solid rgba(239,68,68,0.25); }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#c9a84c,#e8c96d); color: #0d1b2a; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .bar-bg { flex: 1; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; }
        .plan-feature-on { font-size: 13px; color: #7a9bb5; display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .plan-feature-off { font-size: 13px; color: #2e4a62; display: flex; align-items: center; gap: 8px; margin-bottom: 8px; text-decoration: line-through; }
        .plan-check { width: 16px; height: 16px; border-radius: 50%; background: linear-gradient(135deg,#c9a84c,#e8c96d); color: #0d1b2a; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .plan-cross { width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.05); color: #2e4a62; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .toggle-wrap { display: flex; align-items: center; gap: 12px; justify-content: center; margin-bottom: 2.5rem; }
        .toggle-btn { position: relative; width: 44px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 20px; cursor: pointer; border: none; transition: background 0.2s; }
        .toggle-btn.on { background: linear-gradient(135deg,#c9a84c,#e8c96d); }
        .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
        .toggle-btn.on .toggle-knob { left: 23px; }
        .toggle-label { font-size: 13px; color: #4a6580; }
        .toggle-label.active { color: #c9a84c; font-weight: 600; }
        .save-badge { background: rgba(201,168,76,0.15); color: #c9a84c; border: 0.5px solid rgba(201,168,76,0.3); border-radius: 20px; padding: 2px 10px; font-size: 11px; font-weight: 600; }
        .dash-kpi { background: rgba(201,168,76,0.1); border: 0.5px solid rgba(201,168,76,0.2); border-radius: 10px; padding: 10px 12px; }
        .dash-kpi-lbl { font-size: 9px; color: rgba(201,168,76,0.6); margin-bottom: 4px; }
        .dash-kpi-val { font-size: 18px; font-weight: 700; font-family: monospace; color: #c9a84c; }
        .dash-badge-l { background: rgba(34,197,94,0.15); color: #4ade80; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 0.5px solid rgba(34,197,94,0.2); }
        .dash-badge-s { background: rgba(239,68,68,0.15); color: #f87171; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 0.5px solid rgba(239,68,68,0.2); }
        .dash-cal { aspect-ratio: 1; border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; }
        .cal-win { background: rgba(34,197,94,0.15); color: #4ade80; }
        .cal-loss { background: rgba(239,68,68,0.15); color: #f87171; }
        .cal-neu { background: rgba(255,255,255,0.04); color: #2e4a62; }
        .cal-we { background: rgba(255,255,255,0.02); color: #1a2f42; opacity: 0.4; }
        .cal-r { font-size: 7px; opacity: 0.8; margin-top: 1px; }
        .mockup-float { animation: float 5s ease-in-out infinite; }
        .mockup-float-2 { animation: float 5s 0.5s ease-in-out infinite; }
        .mockup-float-3 { animation: float 5s 1s ease-in-out infinite; }
        .divider { width: 0.5px; height: 32px; background: rgba(255,255,255,0.08); }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(13,27,42,0.95)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px', color: '#fff' }}>MyTradePlan</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/login" className="nav-link">Sign in</a>
          <a href="/register" className="btn-main" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>Try for free</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

        {/* TEXTE */}
        <div>
          <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: '20px', padding: '5px 14px', marginBottom: '1.5rem' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c9a84c', animation: 'glow 2s ease-in-out infinite' }}></div>
            <span style={{ fontSize: '12px', color: '#c9a84c', fontWeight: 500 }}>AI pre-market plan · All markets</span>
          </div>
          <h1 className="anim-2" style={{ fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.25rem', color: '#fff' }}>
            Trade with a plan.<br />
            <span style={{ color: '#c9a84c' }}>Perform with data.</span>
          </h1>
          <p className="anim-3" style={{ fontSize: '1rem', color: '#4a6580', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '400px' }}>
            MyTradePlan guides you every morning with a personalized AI pre-market plan, and analyzes your trades to identify your real edge.
          </p>
          <div className="anim-4" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
            {['AI builds your plan, you trade', 'Find your real edge by setup', 'Turn your mistakes into edge'].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#7a9bb5' }}>
                <div className="feat-check">✓</div>
                {p}
              </div>
            ))}
          </div>
          <div className="anim-5" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
            <a href="/register" className="btn-main">Start for free →</a>
            <a href="/features" className="btn-sec">See how it works</a>
          </div>
          <div className="anim-5" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c9a84c', animation: 'glow 2s ease-in-out infinite' }}></div>
              <span style={{ fontSize: '12px', color: '#2e4a62' }}>Free to start</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.08)' }}></div>
            <span style={{ fontSize: '12px', color: '#2e4a62' }}>No credit card required</span>
          </div>
        </div>

        {/* 2 MOCKUPS FLOTTANTS */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch', padding: '2.5rem 0.5rem', minHeight: '480px' }}>

          {/* GAUCHE : Morning Plan */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', animation: 'floatL 5s ease-in-out infinite', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#0d1b2a', fontWeight: 700, flexShrink: 0 }}>M</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>MyTradePlan AI</div>
                <div style={{ fontSize: '10px', color: '#2e4a62' }}>Morning plan · Today</div>
              </div>
              <div style={{ marginLeft: 'auto', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 500, border: '0.5px solid rgba(201,168,76,0.3)' }}>Live</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px', flex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#7a9bb5', maxWidth: '88%' }}>
                <div style={{ fontSize: '9px', color: '#c9a84c', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan AI</div>
                Is GEX positive or negative this morning?
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#0d1b2a', fontWeight: 600, maxWidth: '78%' }}>Negative, negative Gamma.</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#7a9bb5', maxWidth: '88%' }}>
                <div style={{ fontSize: '9px', color: '#c9a84c', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan AI</div>
                Volume Profile shape — D, B or P?
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#0d1b2a', fontWeight: 600, maxWidth: '78%' }}>B shape, below VAL.</div>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.25)', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', maxWidth: '92%' }}>
                <div style={{ color: '#c9a84c', fontSize: '10px', fontWeight: 600, marginBottom: '3px' }}>Plan ready ✓</div>
                <span style={{ color: '#7a9bb5' }}>Short only · Break & retest toward lower puts · No mean reversion today.</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: '12px', color: '#2e4a62' }}>Reply here...</span>
              <div style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', borderRadius: '7px', padding: '6px 14px', fontSize: '12px', color: '#0d1b2a', fontWeight: 700 }}>→</div>
            </div>
          </div>

          {/* DROITE : Stats */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'floatR 5s 0.6s ease-in-out infinite', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>Stats & Performance</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace' }}>71%</div>
                <div style={{ fontSize: '10px', color: '#2e4a62', marginTop: '2px' }}>Win rate</div>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace' }}>+1.8R</div>
                <div style={{ fontSize: '10px', color: '#2e4a62', marginTop: '2px' }}>Avg R</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>2.4</div>
                <div style={{ fontSize: '10px', color: '#2e4a62', marginTop: '2px' }}>Profit Factor</div>
              </div>
              <div style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace' }}>84%</div>
                <div style={{ fontSize: '10px', color: '#2e4a62', marginTop: '2px' }}>Discipline</div>
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#2e4a62', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cumulative P&L</div>
            <svg viewBox="0 0 220 65" style={{ width: '100%', height: '65px', marginBottom: '12px' }}>
              <defs>
                <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#c9a84c" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M5,52 L30,46 L55,36 L75,40 L100,28 L120,20 L145,13 L175,7 L210,3 L210,62 L5,62 Z" fill="url(#gGold)"/>
              <path d="M5,52 L30,46 L55,36 L75,40 L100,28 L120,20 L145,13 L175,7 L210,3" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="210" cy="3" r="4" fill="#c9a84c"/>
              <rect x="175" y="-3" width="38" height="14" rx="5" fill="#c9a84c"/>
              <text x="179" y="8" fontSize="8" fill="#0d1b2a" fontWeight="700">+8.7R</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#2e4a62', fontWeight: 500, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance by setup</div>
              {[{ name: 'Break & retest', wr: 78, r: '+2.4R', pos: true }, { name: 'Continuation', wr: 65, r: '+1.8R', pos: true }, { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false }].map((s, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#7a9bb5' }}>{s.name}</span>
                    <span style={{ fontSize: '11px', color: s.pos ? '#c9a84c' : '#f87171', fontWeight: 700, fontFamily: 'monospace' }}>{s.r} · {s.wr}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                    <div style={{ width: `${s.wr}%`, height: '100%', background: s.pos ? 'linear-gradient(135deg,#c9a84c,#e8c96d)' : '#f87171', borderRadius: '3px' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.25)', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#c9a84c' }}>
              <strong>💡 Insight</strong> — Your edge is on Break & retest. Focus on it.
            </div>
          </div>
        </div>
      </section>

      {/* BANDE STATS */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', alignItems: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '-0.5px' }}>5 min</div><div style={{ fontSize: '12px', color: '#4a6580', marginTop: '2px' }}>to prepare your session</div></div>
          <div className="divider"></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '-0.5px' }}>100%</div><div style={{ fontSize: '12px', color: '#4a6580', marginTop: '2px' }}>personalized to your profile</div></div>
          <div className="divider"></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '-0.5px' }}>All markets</div><div style={{ fontSize: '12px', color: '#4a6580', marginTop: '2px' }}>Futures, Forex, Crypto...</div></div>
        </div>
      </div>

      {/* DASHBOARD SECTION */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Dashboard</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '0.75rem', color: '#fff' }}>A complete dashboard at your fingertips</h2>
        <p style={{ fontSize: '0.875rem', color: '#4a6580', marginBottom: '2.5rem' }}>Click on any day in the calendar to get an AI-powered analysis of your session.</p>
        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }} id="dash-wrap">
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '44px', background: 'rgba(255,255,255,0.02)', borderRight: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: '8px', zIndex: 5 }}>
            <div style={{ width: '22px', height: '22px', background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d1b2a', fontSize: '9px', fontWeight: 800, marginBottom: '6px' }}>M</div>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d1b2a', fontSize: '9px', fontWeight: 700 }}>CL</div>
            <div style={{ width: '28px', height: '0.5px', background: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ width: '30px', height: '30px', background: 'rgba(201,168,76,0.15)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '11px' }}>▦</div>
            <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e4a62', fontSize: '11px' }}>☀</div>
            <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e4a62', fontSize: '11px' }}>◈</div>
            <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e4a62', fontSize: '10px' }}>▤</div>
          </div>
          <div style={{ marginLeft: '44px', padding: '0 1rem 1rem' }}>
            <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid rgba(255,255,255,0.06)', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Dashboard</span>
                <span style={{ fontSize: '11px', color: '#2e4a62' }}>Friday, June 27, 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(201,168,76,0.15)', border: '0.5px solid rgba(201,168,76,0.3)', color: '#c9a84c', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', display: 'inline-block', animation: 'glow 2s infinite' }}></span>Plan ready
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px', marginBottom: '0.875rem' }}>
              <div className="dash-kpi"><div className="dash-kpi-lbl">Win rate</div><div className="dash-kpi-val">71%</div></div>
              <div className="dash-kpi"><div className="dash-kpi-lbl">Avg R</div><div className="dash-kpi-val">+1.8R</div></div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px' }}><div style={{ fontSize: '9px', color: '#2e4a62', marginBottom: '4px' }}>Profit factor</div><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>2.4</div></div>
              <div className="dash-kpi"><div className="dash-kpi-lbl">Discipline</div><div className="dash-kpi-val">84%</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '0.875rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#2e4a62', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent trades</div>
                {[{ d: 'long', s: 'Break & retest', r: '+2.1R', c: '#4ade80' }, { d: 'short', s: 'Mean reversion', r: '-1.0R', c: '#f87171' }, { d: 'long', s: 'Continuation', r: '+3.2R', c: '#4ade80' }].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 2 ? '0.5px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span className={t.d === 'long' ? 'dash-badge-l' : 'dash-badge-s'}>{t.d.toUpperCase()}</span>
                      <span style={{ fontSize: '10px', color: '#4a6580' }}>{t.s}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: t.c, fontFamily: 'monospace', fontWeight: 700 }}>{t.r}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#2e4a62', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance by setup</div>
                {[{ n: 'Break & retest', w: 78, pos: true }, { n: 'Continuation', w: 65, pos: true }, { n: 'Mean reversion', w: 35, pos: false }].map((s, i) => (
                  <div key={i} style={{ marginBottom: '7px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#7a9bb5' }}>{s.n}</span>
                      <span style={{ fontSize: '9px', color: s.pos ? '#c9a84c' : '#f87171', fontFamily: 'monospace', fontWeight: 700 }}>{s.w}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                      <div style={{ width: `${s.w}%`, height: '100%', background: s.pos ? 'linear-gradient(135deg,#c9a84c,#e8c96d)' : '#f87171', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.75rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>Calendar · June 2026</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#2e4a62' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: 8, height: 8, borderRadius: '2px', background: 'rgba(34,197,94,0.2)', display: 'inline-block' }}></span>Win</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: 8, height: 8, borderRadius: '2px', background: 'rgba(239,68,68,0.2)', display: 'inline-block' }}></span>Loss</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '3px' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: '8px', color: i >= 5 ? '#1a2f42' : '#2e4a62', paddingBottom: '2px', fontWeight: 600 }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
                <div className="dash-cal cal-neu"></div>
                <div className="dash-cal cal-win">2<span className="cal-r">+1.5</span></div>
                <div className="dash-cal cal-loss">3<span className="cal-r">-1.0</span></div>
                <div className="dash-cal cal-win">4<span className="cal-r">+0.8</span></div>
                <div className="dash-cal cal-win">5<span className="cal-r">+2.1</span></div>
                <div className="dash-cal cal-we">6</div>
                <div className="dash-cal cal-we">7</div>
                <div className="dash-cal cal-win">8<span className="cal-r">+1.3</span></div>
                <div className="dash-cal cal-win" id="target-cell" style={{ outline: '2px solid #c9a84c', outlineOffset: '-2px' }}>9<span className="cal-r">+2.1</span></div>
                <div className="dash-cal cal-loss">10<span className="cal-r">-0.5</span></div>
                <div className="dash-cal cal-win">11<span className="cal-r">+0.7</span></div>
                <div className="dash-cal cal-win">12<span className="cal-r">+1.1</span></div>
                <div className="dash-cal cal-we">13</div>
                <div className="dash-cal cal-we">14</div>
                <div className="dash-cal cal-neu">15</div>
                <div className="dash-cal cal-win">16<span className="cal-r">+1.8</span></div>
                <div className="dash-cal cal-loss">17<span className="cal-r">-1.2</span></div>
                <div className="dash-cal cal-win">18<span className="cal-r">+0.9</span></div>
                <div className="dash-cal cal-win">19<span className="cal-r">+2.3</span></div>
                <div className="dash-cal cal-we">20</div>
                <div className="dash-cal cal-we">21</div>
                <div className="dash-cal cal-win">22<span className="cal-r">+1.5</span></div>
                <div className="dash-cal cal-win">23<span className="cal-r">+2.3</span></div>
                <div className="dash-cal cal-loss">24<span className="cal-r">-1.0</span></div>
                <div className="dash-cal cal-win">25<span className="cal-r">+0.7</span></div>
                <div className="dash-cal cal-win" style={{ outline: '1px solid rgba(255,255,255,0.15)', outlineOffset: '-1px' }}>26<span className="cal-r">+2.0</span></div>
                <div className="dash-cal cal-we">27</div>
                <div className="dash-cal cal-we">28</div>
              </div>
              <div id="dash-modal" style={{ display: 'none', background: 'rgba(13,27,42,0.98)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: '12px', padding: '1rem', position: 'absolute', right: '0.75rem', top: '0.75rem', width: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>June 9, 2026</div>
                    <div style={{ fontSize: '10px', color: '#2e4a62', marginTop: '1px' }}>3 trades · +2.1R</div>
                  </div>
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#2e4a62', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Trades</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-s">SHORT</span><span style={{ fontSize: '9px', color: '#4a6580' }}>Break & retest</span></div>
                  <span style={{ fontSize: '10px', color: '#4ade80', fontFamily: 'monospace', fontWeight: 700 }}>+2.1R</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-l">LONG</span><span style={{ fontSize: '9px', color: '#4a6580' }}>Mean reversion</span></div>
                  <span style={{ fontSize: '10px', color: '#f87171', fontFamily: 'monospace', fontWeight: 700 }}>-1.0R</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-s">SHORT</span><span style={{ fontSize: '9px', color: '#4a6580' }}>Continuation</span></div>
                  <span style={{ fontSize: '10px', color: '#4ade80', fontFamily: 'monospace', fontWeight: 700 }}>+1.0R</span>
                </div>
                <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '8px', marginTop: '8px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>AI Insight</div>
                  <div style={{ fontSize: '10px', color: '#7a9bb5', lineHeight: 1.6 }}>Your 2 shorts were aligned with the flow. The long Mean reversion was off-plan — avoid this when GEX is negative.</div>
                  <div style={{ marginTop: '5px', fontSize: '10px', fontWeight: 600, color: '#c9a84c' }}>Discipline: 67% · Needs improvement.</div>
                </div>
              </div>
              <svg id="dash-cursor" style={{ position: 'absolute', pointerEvents: 'none', zIndex: 30, width: '16px', height: '16px', opacity: 0, transition: 'left 1.2s cubic-bezier(0.4,0,0.2,1), top 1.2s cubic-bezier(0.4,0,0.2,1)', left: '20px', top: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} viewBox="0 0 20 20" fill="none">
                <path d="M4 2L16 10L10 11L8 18L4 2Z" fill="#e8c96d" stroke="#c9a84c" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.5px', color: '#fff' }}>Everything you need to trade better</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'AI pre-market plan', desc: 'Every morning, a personalized plan based on your trader profile and current market conditions.' },
            { title: 'Trade journal', desc: 'Log every trade with context, zone, target, confirmation and R result.' },
            { title: 'Stats & performance', desc: 'Win rate, avg R, best setups — visualize your edge and improve.' },
            { title: 'Discipline tracker', desc: 'Measure your plan adherence trade after trade. Discipline is your real edge.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: '#c9a84c' }}>{f.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#4a6580', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'rgba(255,255,255,0.02)', padding: '4rem 2rem', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.7rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '0.5rem' }}>Process</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.5px', marginBottom: '0.5rem', color: '#fff' }}>How it works</h2>
        <p style={{ fontSize: '0.875rem', color: '#4a6580', textAlign: 'center', marginBottom: '2.5rem' }}>3 steps to trade with a method</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '760px', margin: '0 auto' }}>
          {[
            { n: '1', title: 'Build your profile', desc: 'Your market, your method, your recurring issues. The AI remembers everything and adapts to you.' },
            { n: '2', title: 'Prepare your session', desc: 'The AI asks the right questions every morning. Your plan is structured in under 5 minutes.' },
            { n: '3', title: 'Analyze & improve', desc: 'Journal + stats + AI insights to identify your real edge and improve trade after trade.' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div className="step-num">{s.n}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: '#4a6580', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature — Morning plan */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Morning plan</div>
            <div className="feat-title">AI guides you.<br />You trade with a plan.</div>
            <div className="feat-desc">Before opening your charts, MyTradePlan asks the right questions. Bias, setup, invalidation zone — your plan is structured in 5 minutes.</div>
            <div className="feat-point">✓ Personalized to your trader profile</div>
            <div className="feat-point">✓ Questions focused on today's context</div>
            <div className="feat-point">✓ Clear summary before the open</div>
          </div>
          <div className="mockup-card mockup-float">
            <div style={{ fontSize: '10px', color: '#2e4a62', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', fontWeight: 500 }}>Morning plan · Today</div>
            <div className="chat-ai"><div className="chat-ai-lbl">MyTradePlan AI</div>What is your directional bias for this session?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user">Bullish if market holds support.</div></div>
            <div className="chat-ai"><div className="chat-ai-lbl">MyTradePlan AI</div>Which setup will you focus on today?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user">Break & retest long.</div></div>
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.25)', borderRadius: '3px 8px 8px 8px', padding: '8px 10px', fontSize: '11px', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#c9a84c', marginBottom: '2px', fontWeight: 600 }}>Plan ready ✓</div>
              <span style={{ color: '#7a9bb5' }}>Bullish bias · Break & retest · Wait for confirmation before entering.</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: '7px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '5px', padding: '6px 8px', fontSize: '11px', color: '#2e4a62' }}>Reply here...</div>
              <div style={{ background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', borderRadius: '5px', padding: '6px 10px', fontSize: '11px', color: '#0d1b2a', fontWeight: 700 }}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature — Journal */}
      <section style={{ padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="feat-section">
          <div className="mockup-card mockup-float-2">
            <div style={{ fontSize: '10px', color: '#2e4a62', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', fontWeight: 500 }}>Latest trades</div>
            <div className="trade-row"><span className="badge-long">LONG</span><span style={{ color: '#4a6580', flex: 1, margin: '0 8px', fontSize: '12px' }}>Break & retest</span><span style={{ color: '#4ade80', fontWeight: 700, fontFamily: 'monospace' }}>+2.1R</span></div>
            <div className="trade-row"><span className="badge-short">SHORT</span><span style={{ color: '#4a6580', flex: 1, margin: '0 8px', fontSize: '12px' }}>Mean reversion</span><span style={{ color: '#f87171', fontWeight: 700, fontFamily: 'monospace' }}>-1.0R</span></div>
            <div className="trade-row"><span className="badge-long">LONG</span><span style={{ color: '#4a6580', flex: 1, margin: '0 8px', fontSize: '12px' }}>Continuation</span><span style={{ color: '#4ade80', fontWeight: 700, fontFamily: 'monospace' }}>+3.2R</span></div>
            <div className="trade-row" style={{ border: 'none' }}><span className="badge-long">LONG</span><span style={{ color: '#4a6580', flex: 1, margin: '0 8px', fontSize: '12px' }}>Break & retest</span><span style={{ color: '#4ade80', fontWeight: 700, fontFamily: 'monospace' }}>+1.8R</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: '#c9a84c' }}>75%</div><div style={{ fontSize: '10px', color: '#2e4a62' }}>Win rate</div></div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80', fontFamily: 'monospace' }}>+1.9R</div><div style={{ fontSize: '10px', color: '#2e4a62' }}>Avg R</div></div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: '#c9a84c' }}>88%</div><div style={{ fontSize: '10px', color: '#2e4a62' }}>Discipline</div></div>
            </div>
          </div>
          <div>
            <div className="feat-tag">Trade journal</div>
            <div className="feat-title">Every trade documented.<br />Every mistake analyzed.</div>
            <div className="feat-desc">Log context, zone, target, confirmation and R result. Identify your patterns and improve your discipline trade after trade.</div>
            <div className="feat-point">✓ Result in R per trade</div>
            <div className="feat-point">✓ Plan adherence tracking</div>
            <div className="feat-point">✓ Complete detailed history</div>
          </div>
        </div>
      </section>

      {/* Feature — Stats */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Stats & performance</div>
            <div className="feat-title">Find your edge.<br />Stop guessing.</div>
            <div className="feat-desc">Win rate, avg R, profit factor — and performance by setup to know exactly which configurations make you money.</div>
            <div className="feat-point">✓ Performance by setup type</div>
            <div className="feat-point">✓ Cumulative R equity curve</div>
            <div className="feat-point">✓ AI insight on your strengths and weaknesses</div>
          </div>
          <div className="mockup-card mockup-float-3">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: '#c9a84c' }}>71%</div><div style={{ fontSize: '10px', color: '#2e4a62' }}>Win rate</div></div>
              <div style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#c9a84c', fontFamily: 'monospace' }}>+1.8R</div><div style={{ fontSize: '10px', color: '#2e4a62' }}>Avg R</div></div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>84%</div><div style={{ fontSize: '10px', color: '#2e4a62' }}>Discipline</div></div>
            </div>
            <div style={{ fontSize: '10px', color: '#2e4a62', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance by setup</div>
            {[{ name: 'Break & retest', wr: 78, r: '+2.4R', pos: true }, { name: 'Continuation', wr: 65, r: '+1.8R', pos: true }, { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false }].map((s, i) => (
              <div key={i} style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: i < 2 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7a9bb5' }}>{s.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.pos ? '#c9a84c' : '#f87171', fontFamily: 'monospace' }}>{s.r}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="bar-bg"><div style={{ width: `${s.wr}%`, height: '100%', background: s.pos ? 'linear-gradient(135deg,#c9a84c,#e8c96d)' : '#f87171', borderRadius: '3px' }}></div></div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.pos ? '#c9a84c' : '#f87171' }}>{s.wr}%</span>
                </div>
              </div>
            ))}
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.25)', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#c9a84c' }}>
              <strong>💡 Insight</strong> — You perform 2x better on Break & retest. That's your edge.
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Pricing</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px', color: '#fff' }}>Simple and transparent</h2>
        <p style={{ color: '#4a6580', marginBottom: '2rem' }}>Start for free, upgrade when you're ready.</p>
        <div className="toggle-wrap">
          <span className={`toggle-label${!annual ? ' active' : ''}`}>Monthly</span>
          <button className={`toggle-btn${annual ? ' on' : ''}`} onClick={() => setAnnual(!annual)}>
            <div className="toggle-knob"></div>
          </button>
          <span className={`toggle-label${annual ? ' active' : ''}`}>Annual</span>
          {annual && <span className="save-badge">-17% · save €60/year</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
          <div className="plan-card" style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px', color: '#fff' }}>Free</div>
            <div style={{ fontSize: '12px', color: '#4a6580', marginBottom: '1rem' }}>To discover MyTradePlan</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>€0</div>
            <div style={{ fontSize: '12px', color: '#2e4a62', marginBottom: '1.25rem' }}>Forever</div>
            <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 trades / month</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 morning plans / month</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Essential stats</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Advanced stats</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Macro AI Briefing</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>AI Insight calendar</div>
            </div>
            <a href="/register" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.875rem', textDecoration: 'none', color: '#7a9bb5', fontWeight: 500 }}>Start for free</a>
          </div>
          <div className="plan-card" style={{ border: '1px solid rgba(201,168,76,0.4)', position: 'relative', background: 'rgba(201,168,76,0.05)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#c9a84c,#e8c96d)', color: '#0d1b2a', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>⭐ Most popular</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px', color: '#fff' }}>Pro</div>
            <div style={{ fontSize: '12px', color: '#4a6580', marginBottom: '1rem' }}>For the serious trader</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: '#c9a84c' }}>{annual ? '€24.99' : '€29.99'}</div>
              <div style={{ fontSize: '1rem', color: '#4a6580', marginBottom: '2px' }}>/month</div>
            </div>
            {annual ? (
              <div style={{ fontSize: '11px', color: '#c9a84c', fontWeight: 600, marginBottom: '4px' }}>€299.88/year · save €60</div>
            ) : (
              <div style={{ fontSize: '11px', color: '#2e4a62', marginBottom: '4px' }}>or €24.99/month billed annually</div>
            )}
            <div style={{ fontSize: '12px', color: '#2e4a62', marginBottom: '1.25rem' }}>7 days free · no credit card</div>
            <div style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Unlimited trades</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Unlimited plans</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Advanced stats & patterns</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Discipline tracker</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong style={{ color: '#c9a84c' }}>Macro AI Briefing</strong></div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong style={{ color: '#c9a84c' }}>AI Insight calendar</strong></div>
            </div>
            <a href="/register" className="btn-main" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', fontSize: '0.875rem', textDecoration: 'none' }}>Try free for 7 days →</a>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '12px', color: '#2e4a62' }}>No credit card required · Cancel anytime</div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(201,168,76,0.04)', borderTop: '0.5px solid rgba(201,168,76,0.15)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Ready to trade with a plan?</h2>
        <p style={{ fontSize: '0.875rem', color: '#4a6580', marginBottom: '2rem' }}>Join traders who improve every day.</p>
        <a href="/register" className="btn-main">Start for free →</a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#2e4a62' }}>© 2026 MyTradePlan · All rights reserved</span>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var cursor = document.getElementById('dash-cursor');
          var modal = document.getElementById('dash-modal');
          var target = document.getElementById('target-cell');
          var wrap = document.getElementById('dash-wrap');
          if(!cursor||!modal||!target||!wrap) return;

          function animate() {
            var wrapR = wrap.getBoundingClientRect();
            var calCard = target.closest('[style*="position: relative"]');
            if(!calCard) return;
            var calR = calCard.getBoundingClientRect();
            var targetR = target.getBoundingClientRect();
            var startX = calR.left - wrapR.left + 20;
            var startY = calR.top - wrapR.top + 60;
            var endX = targetR.left - wrapR.left + targetR.width/2 - 2;
            var endY = targetR.top - wrapR.top + targetR.height/2 - 2;

            modal.style.display = 'none';
            cursor.style.opacity = '1';
            cursor.style.left = startX + 'px';
            cursor.style.top = startY + 'px';

            setTimeout(function() {
              cursor.style.left = endX + 'px';
              cursor.style.top = endY + 'px';
            }, 300);

            setTimeout(function() {
              cursor.style.transform = 'scale(0.8)';
              setTimeout(function() {
                cursor.style.transform = 'scale(1)';
                modal.style.display = 'block';
                setTimeout(function() {
                  modal.style.display = 'none';
                  cursor.style.opacity = '0';
                  setTimeout(animate, 1500);
                }, 4000);
              }, 150);
            }, 1600);
          }
          setTimeout(animate, 1000);
        })();
      `}} />
    </main>
  )
}