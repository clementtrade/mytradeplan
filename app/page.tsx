'use client'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [annual, setAnnual] = useState(false)
  const [slide, setSlide] = useState(0)
  const timerRef = useRef<any>(null)
  const DUR = 4000

  function goSlide(i: number) {
    clearInterval(timerRef.current)
    setSlide(i)
    const bar = document.getElementById('prog')
    if (bar) {
      bar.style.transition = 'none'
      bar.style.width = '0%'
      setTimeout(() => {
        bar.style.transition = `width ${DUR}ms linear`
        bar.style.width = '100%'
      }, 30)
    }
    timerRef.current = setInterval(() => {
      setSlide(s => {
        const next = (s + 1) % 3
        const b = document.getElementById('prog')
        if (b) {
          b.style.transition = 'none'
          b.style.width = '0%'
          setTimeout(() => {
            b.style.transition = `width ${DUR}ms linear`
            b.style.width = '100%'
          }, 30)
        }
        return next
      })
    }, DUR)
  }

  useEffect(() => {
    goSlide(0)
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        .anim-1 { animation: fadeUp 0.7s ease both; }
        .anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .anim-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .anim-5 { animation: fadeUp 0.7s 0.6s ease both; }
        .btn-main { background: #111; color: #fff; font-size: 0.9rem; font-weight: 600; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: box-shadow 0.2s, transform 0.2s; display: inline-block; }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .btn-sec { background: transparent; color: #111; font-size: 0.9rem; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; border: 0.5px solid #ddd; transition: border-color 0.2s; display: inline-block; }
        .btn-sec:hover { border-color: #111; }
        .nav-link { font-size: 0.875rem; color: #666; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .feature-card { padding: 1.5rem; border: 0.5px solid #e8e8e8; border-radius: 10px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.05); transition: box-shadow 0.2s, transform 0.2s; cursor: default; }
        .feature-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .plan-card { padding: 2rem; border-radius: 12px; transition: box-shadow 0.2s, transform 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .plan-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; max-width: 900px; margin: 0 auto; }
        .feat-tag { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.75rem; }
        .feat-title { font-size: 1.4rem; font-weight: 700; color: #111; letter-spacing: -0.3px; margin-bottom: 0.75rem; line-height: 1.25; }
        .feat-desc { font-size: 0.875rem; color: #666; line-height: 1.7; margin-bottom: 1rem; }
        .feat-point { font-size: 0.875rem; color: #444; margin-bottom: 4px; }
        .mockup-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px; padding: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .chat-ai { background: #f5f5f5; border-radius: 3px 8px 8px 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 11px; color: #333; max-width: 88%; }
        .chat-user { background: #111; border-radius: 8px 3px 8px 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 11px; color: #fff; max-width: 80%; margin-left: auto; }
        .chat-tag { font-size: 9px; color: #aaa; margin-bottom: 2px; }
        .chat-tag-u { font-size: 9px; color: rgba(255,255,255,0.4); margin-bottom: 2px; text-align: right; }
        .trade-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 0.5px solid #f5f5f5; }
        .badge-long { background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .badge-short { background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
        .bar-bg { flex: 1; height: 5px; background: #f0f0f0; border-radius: 3px; }
        .feat-check { width: 20px; height: 20px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
        .plan-feature-on { font-size: 13px; color: #444; display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .plan-feature-off { font-size: 13px; color: #ccc; display: flex; align-items: center; gap: 8px; margin-bottom: 8px; text-decoration: line-through; }
        .plan-check { width: 16px; height: 16px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .plan-cross { width: 16px; height: 16px; border-radius: 50%; background: #f0f0f0; color: #ccc; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .toggle-wrap { display: flex; align-items: center; gap: 12px; justify-content: center; margin-bottom: 2.5rem; }
        .toggle-btn { position: relative; width: 44px; height: 24px; background: #e8e8e8; border-radius: 20px; cursor: pointer; border: none; transition: background 0.2s; }
        .toggle-btn.on { background: #111; }
        .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .toggle-btn.on .toggle-knob { left: 23px; }
        .toggle-label { font-size: 13px; color: #666; }
        .toggle-label.active { color: #111; font-weight: 600; }
        .save-badge { background: #f0fdf4; color: #16a34a; border: 0.5px solid #86efac; border-radius: 20px; padding: 2px 10px; font-size: 11px; font-weight: 600; }
        .hero-kpi { background: #111; border-radius: 6px; padding: 8px 10px; }
        .hero-kpi-l { font-size: 9px; color: #888; margin-bottom: 3px; }
        .hero-kpi-v { font-size: 15px; font-weight: 700; font-family: monospace; }
        .hero-cc { aspect-ratio: 1; border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; }
        .hero-cw { background: #c8f0d8; color: #15803d; }
        .hero-cl { background: #fdd0d0; color: #dc2626; }
        .hero-cn { background: #f5f5f5; color: #ccc; }
        .hero-cwe { background: #f5f5f5; color: #ddd; opacity: 0.35; }
        .hero-cr { font-size: 6px; opacity: 0.7; margin-top: 1px; }
        .hero-ai-b { background: #f5f5f5; border-radius: 3px 8px 8px 8px; padding: 8px 10px; font-size: 11px; color: #333; max-width: 88%; margin-bottom: 6px; }
        .hero-ai-lbl { font-size: 9px; color: #16a34a; font-weight: 600; margin-bottom: 2px; }
        .hero-usr-b { background: #111; border-radius: 8px 3px 8px 8px; padding: 8px 10px; font-size: 11px; color: #fff; max-width: 78%; margin-left: auto; margin-bottom: 6px; }
        .car-tab { font-size: 12px; padding: 6px 14px; border-radius: 20px; border: 0.5px solid #e8e8e8; background: #fff; color: #888; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .car-tab.on { background: #111; color: #fff; border-color: #111; }
        .car-dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; border: none; padding: 0; cursor: pointer; transition: all 0.3s; }
        .car-dot.on { background: #111; width: 18px; border-radius: 3px; }
        .slide { position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 1.25rem; opacity: 0; transition: opacity 0.5s ease; pointer-events: none; overflow: hidden; display: flex; flex-direction: column; gap: 10px; }
        .slide.on { opacity: 1; pointer-events: all; }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>MyTradePlan</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/login" className="nav-link">Sign in</a>
          <a href="/register" className="btn-main" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>Try for free</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(140deg,#fff 55%,#f0fdf4 100%)', padding: '4rem 4rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,197,94,0.06) 0%,transparent 65%)', pointerEvents: 'none' }}></div>

        {/* TEXTE GAUCHE */}
        <div>
          <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '20px', padding: '4px 14px', marginBottom: '1.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'glow 2s ease-in-out infinite', display: 'inline-block' }}></span>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>AI pre-market plan · All markets</span>
          </div>
          <h1 className="anim-2" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-1.5px', color: '#111', marginBottom: '1.25rem' }}>
            Trade with a plan.<br />
            <span style={{ color: '#22c55e' }}>Perform with data.</span>
          </h1>
          <p className="anim-3" style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '420px' }}>
            MyTradePlan guides you every morning with a personalized AI pre-market plan, and analyzes your trades to identify your real edge.
          </p>
          <div className="anim-4" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[{ label: 'Dashboard', i: 0 }, { label: 'Morning Plan', i: 1 }, { label: 'Macro Briefing', i: 2 }].map(t => (
              <button key={t.i} className={`car-tab${slide === t.i ? ' on' : ''}`} onClick={() => goSlide(t.i)}>{t.label}</button>
            ))}
          </div>
          <div className="anim-5" style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem' }}>
            <a href="/register" className="btn-main" style={{ fontSize: '14px', padding: '12px 24px' }}>Start for free →</a>
            <a href="/features" className="btn-sec" style={{ fontSize: '14px', padding: '12px 24px' }}>See how it works</a>
          </div>
          <div className="anim-5" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#999' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>Free to start
            </span>
            <span style={{ width: '1px', height: '12px', background: '#e8e8e8', display: 'inline-block' }}></span>
            No credit card required
          </div>
        </div>

        {/* CARROUSEL DROITE */}
        <div style={{ position: 'relative', background: '#fff', border: '2px solid #e8e8e8', borderRadius: '16px', height: '460px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>

          {/* SLIDE 0 : Dashboard */}
          <div className={`slide${slide === 0 ? ' on' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '18px', height: '18px', background: '#111', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px', fontWeight: 800 }}>M</div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>Dashboard</span>
                <span style={{ fontSize: '9px', color: '#bbb' }}>June 27, 2026</span>
              </div>
              <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '8px', padding: '2px 8px', borderRadius: '4px', fontWeight: 500, border: '0.5px solid #bbf7d0' }}>● Plan ready</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
              <div className="hero-kpi"><div className="hero-kpi-l">Win rate</div><div className="hero-kpi-v" style={{ color: '#4ade80' }}>71%</div></div>
              <div className="hero-kpi"><div className="hero-kpi-l">Avg R</div><div className="hero-kpi-v" style={{ color: '#4ade80' }}>+1.8R</div></div>
              <div className="hero-kpi"><div className="hero-kpi-l">P. Factor</div><div className="hero-kpi-v" style={{ color: '#fff' }}>2.4</div></div>
              <div className="hero-kpi"><div className="hero-kpi-l">Discipline</div><div className="hero-kpi-v" style={{ color: '#4ade80' }}>84%</div></div>
            </div>
            <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>Calendar · June 2026</span>
                <div style={{ display: 'flex', gap: '6px', fontSize: '8px', color: '#aaa' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: 7, height: 7, borderRadius: '2px', background: '#c8f0d8', display: 'inline-block' }}></span>Win</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: 7, height: 7, borderRadius: '2px', background: '#fdd0d0', display: 'inline-block' }}></span>Loss</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '2px' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: '7px', color: i >= 5 ? '#ddd' : '#bbb', fontWeight: 600 }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                <div className="hero-cc hero-cn"></div>
                <div className="hero-cc hero-cw">2<span className="hero-cr">+1.5</span></div>
                <div className="hero-cc hero-cl">3<span className="hero-cr">-1.0</span></div>
                <div className="hero-cc hero-cw">4<span className="hero-cr">+0.8</span></div>
                <div className="hero-cc hero-cw">5<span className="hero-cr">+2.1</span></div>
                <div className="hero-cc hero-cwe">6</div><div className="hero-cc hero-cwe">7</div>
                <div className="hero-cc hero-cw">8<span className="hero-cr">+1.3</span></div>
                <div className="hero-cc hero-cw" style={{ outline: '2px solid #22c55e', outlineOffset: '-2px' }}>9<span className="hero-cr">+2.1</span></div>
                <div className="hero-cc hero-cl">10<span className="hero-cr">-0.5</span></div>
                <div className="hero-cc hero-cw">11<span className="hero-cr">+0.7</span></div>
                <div className="hero-cc hero-cw">12<span className="hero-cr">+1.1</span></div>
                <div className="hero-cc hero-cwe">13</div><div className="hero-cc hero-cwe">14</div>
                <div className="hero-cc hero-cn">15</div>
                <div className="hero-cc hero-cw">16<span className="hero-cr">+1.8</span></div>
                <div className="hero-cc hero-cl">17<span className="hero-cr">-1.2</span></div>
                <div className="hero-cc hero-cw">18<span className="hero-cr">+0.9</span></div>
                <div className="hero-cc hero-cw">19<span className="hero-cr">+2.3</span></div>
                <div className="hero-cc hero-cwe">20</div><div className="hero-cc hero-cwe">21</div>
                <div className="hero-cc hero-cw">22<span className="hero-cr">+1.5</span></div>
                <div className="hero-cc hero-cw">23<span className="hero-cr">+2.3</span></div>
                <div className="hero-cc hero-cl">24<span className="hero-cr">-1.0</span></div>
                <div className="hero-cc hero-cw">25<span className="hero-cr">+0.7</span></div>
                <div className="hero-cc hero-cw" style={{ outline: '2px solid #888', outlineOffset: '-2px' }}>26<span className="hero-cr">+2.0</span></div>
                <div className="hero-cc hero-cwe">27</div><div className="hero-cc hero-cwe">28</div>
              </div>
              <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '6px', padding: '6px 8px', fontSize: '9px', color: '#15803d', marginTop: '6px', fontWeight: 500 }}>
                AI Insight — Break & retest: 78% of your wins. Focus on this setup.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#888', marginBottom: '5px' }}>Recent trades</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px' }}>LONG</span><span style={{ fontSize: '9px', color: '#555' }}>Break & retest</span></div>
                  <span style={{ fontSize: '9px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+2.1R</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '3px' }}>SHORT</span><span style={{ fontSize: '9px', color: '#555' }}>Mean reversion</span></div>
                  <span style={{ fontSize: '9px', color: '#dc2626', fontFamily: 'monospace', fontWeight: 700 }}>-1.0R</span>
                </div>
              </div>
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#888', marginBottom: '5px' }}>By setup</div>
                <div style={{ marginBottom: '5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '9px', color: '#111' }}>Break & retest</span><span style={{ fontSize: '8px', color: '#16a34a' }}>78%</span></div>
                  <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px' }}><div style={{ width: '78%', height: '100%', background: '#22c55e', borderRadius: '2px' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '9px', color: '#111' }}>Continuation</span><span style={{ fontSize: '8px', color: '#16a34a' }}>65%</span></div>
                  <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '2px' }}><div style={{ width: '65%', height: '100%', background: '#22c55e', borderRadius: '2px' }}></div></div>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 1 : Morning Plan */}
          <div className={`slide${slide === 1 ? ' on' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600 }}>M</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>MyTradePlan AI</div>
                <div style={{ fontSize: '9px', color: '#aaa' }}>Morning plan · Today</div>
              </div>
              <div style={{ marginLeft: 'auto', background: '#f0fdf4', color: '#16a34a', fontSize: '9px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, border: '0.5px solid #bbf7d0' }}>Live</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', overflow: 'hidden' }}>
              <div className="hero-ai-b"><div className="hero-ai-lbl">MyTradePlan AI</div>GEX is negative today and Volume Profile shows a B shape below VAL. What's your directional bias?</div>
              <div className="hero-usr-b">Bearish — short only on rejection.</div>
              <div className="hero-ai-b"><div className="hero-ai-lbl">MyTradePlan AI</div>Good. B shape below VAL confirms distribution. Which setup will you focus on?</div>
              <div className="hero-usr-b">Break & retest on failed bounce.</div>
              <div className="hero-ai-b"><div className="hero-ai-lbl">MyTradePlan AI</div>Perfect. What's your max risk per trade today?</div>
              <div className="hero-usr-b">1R max, no exceptions.</div>
              <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 10px 10px 10px', padding: '9px 11px', fontSize: '11px' }}>
                <div style={{ color: '#16a34a', fontSize: '10px', fontWeight: 600, marginBottom: '3px' }}>Plan ready ✓</div>
                <span style={{ color: '#444' }}>Bearish bias · Break & retest only · Max 1R · No entries before 9:30 ET · Avoid mean reversions today.</span>
              </div>
            </div>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#bbb' }}>Reply here...</span>
              <div style={{ background: '#111', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', color: '#fff' }}>→</div>
            </div>
          </div>

          {/* SLIDE 2 : Macro Briefing */}
          <div className={`slide${slide === 2 ? ' on' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>Macro AI Briefing</div>
                <div style={{ fontSize: '10px', color: '#bbb', marginTop: '2px' }}>Generated for your profile · Order Flow · Futures US</div>
              </div>
              <div style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '6px', padding: '4px 10px', fontSize: '10px', color: '#888' }}>↺ Refresh</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
              <div style={{ fontSize: '11px', color: '#333', lineHeight: 1.7, paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
                <strong style={{ color: '#111' }}>Fed & macro context</strong> — June FOMC minutes confirm a persistently hawkish majority. Rate cut expectations revised down to a single cut in late 2026, compressing risk appetite on equities.
              </div>
              <div style={{ fontSize: '11px', color: '#333', lineHeight: 1.7, paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
                <strong style={{ color: '#111' }}>Quarter-end rebalancing</strong> — Today marks J-3 before Q2 close. Institutional rebalancing generates atypical order flow that contradicts apparent directional momentum. Stay disciplined.
              </div>
              <div style={{ fontSize: '11px', color: '#333', lineHeight: 1.7, paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
                <strong style={{ color: '#111' }}>Key catalysts today</strong> — PCE Core at 08:30 ET. Any upside surprise will reinforce hawkish fears. UMich Sentiment Final at 10:00 ET.
              </div>
              <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '9px 11px', fontSize: '11px', color: '#92400e', fontWeight: 600 }}>
                Bias: BEARISH · Short only · Avoid mean reversions · Reduced liquidity after 1:00 PM ET
              </div>
            </div>
          </div>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
            {[0, 1, 2].map(i => (
              <button key={i} className={`car-dot${slide === i ? ' on' : ''}`} onClick={() => goSlide(i)}></button>
            ))}
          </div>
          <div id="prog" style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: '#22c55e', width: '0%', zIndex: 10 }}></div>
        </div>
      </section>

      {/* BANDE STATS */}
      <div style={{ background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8', borderBottom: '0.5px solid #e8e8e8', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', alignItems: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>5 min</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>to prepare your session</div></div>
          <div style={{ width: '0.5px', height: '32px', background: '#e8e8e8' }}></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>100%</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>personalized to your profile</div></div>
          <div style={{ width: '0.5px', height: '32px', background: '#e8e8e8' }}></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>All markets</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Futures, Forex, Crypto...</div></div>
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.5px' }}>Everything you need to trade better</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'AI pre-market plan', desc: 'Every morning, a personalized plan based on your trader profile and current market conditions.' },
            { title: 'Trade journal', desc: 'Log every trade with context, zone, target, confirmation and R result.' },
            { title: 'Stats & performance', desc: 'Win rate, avg R, best setups — visualize your edge and improve.' },
            { title: 'Discipline tracker', desc: 'Measure your plan adherence trade after trade. Discipline is your real edge.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: '#111' }}>{f.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#f9f9f9', padding: '4rem 2rem', borderTop: '0.5px solid #f0f0f0', borderBottom: '0.5px solid #f0f0f0' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '0.5rem' }}>Process</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>How it works</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', textAlign: 'center', marginBottom: '2.5rem' }}>3 steps to trade with a method</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '760px', margin: '0 auto' }}>
          {[
            { n: '1', title: 'Build your profile', desc: 'Your market, your method, your recurring issues. The AI remembers everything and adapts to you.' },
            { n: '2', title: 'Prepare your session', desc: 'The AI asks the right questions every morning. Your plan is structured in under 5 minutes.' },
            { n: '3', title: 'Analyze & improve', desc: 'Journal + stats + AI insights to identify your real edge and improve trade after trade.' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div className="step-num">{s.n}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature — Morning plan */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Morning plan</div>
            <div className="feat-title">AI guides you.<br />You trade with a plan.</div>
            <div className="feat-desc">Before opening your charts, MyTradePlan asks the right questions. Bias, setup, invalidation zone — your plan is structured in 5 minutes.</div>
            <div className="feat-point">✓ Personalized to your trader profile</div>
            <div className="feat-point">✓ Questions focused on today's context</div>
            <div className="feat-point">✓ Clear summary before the open</div>
          </div>
          <div className="mockup-card" style={{ animation: 'float 5s ease-in-out infinite' }}>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Morning plan · Today</div>
            <div className="chat-ai"><div className="chat-tag">MyTradePlan AI</div>What is your directional bias for this session?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user"><div className="chat-tag-u">You</div>Bullish if market holds support.</div></div>
            <div className="chat-ai"><div className="chat-tag">MyTradePlan AI</div>Which setup will you focus on today?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user"><div className="chat-tag-u">You</div>Break & retest long.</div></div>
            <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 8px 8px 8px', padding: '8px 10px', fontSize: '11px', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#16a34a', marginBottom: '2px', fontWeight: 600 }}>Plan ready ✓</div>
              <span style={{ color: '#555' }}>Bullish bias · Break & retest · Wait for confirmation before entering.</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '0.5px solid #f5f5f5', paddingTop: '7px' }}>
              <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '5px', padding: '6px 8px', fontSize: '11px', color: '#aaa' }}>Reply here...</div>
              <div style={{ background: '#111', borderRadius: '5px', padding: '6px 10px', fontSize: '11px', color: '#fff' }}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature — Journal */}
      <section style={{ padding: '4rem 2rem', background: '#f9f9f9', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div className="mockup-card" style={{ animation: 'float 5s 0.5s ease-in-out infinite' }}>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Latest trades</div>
            <div className="trade-row"><span className="badge-long">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Break & retest</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>+2.1R</span></div>
            <div className="trade-row"><span className="badge-short">SHORT</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Mean reversion</span><span style={{ color: '#dc2626', fontWeight: 700, fontFamily: 'monospace' }}>-1.0R</span></div>
            <div className="trade-row"><span className="badge-long">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Continuation</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>+3.2R</span></div>
            <div className="trade-row" style={{ border: 'none' }}><span className="badge-long">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Break & retest</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>+1.8R</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '10px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>75%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Win rate</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.9R</div><div style={{ fontSize: '10px', color: '#aaa' }}>Avg R</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>88%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Discipline</div></div>
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
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Stats & performance</div>
            <div className="feat-title">Find your edge.<br />Stop guessing.</div>
            <div className="feat-desc">Win rate, avg R, profit factor — and performance by setup to know exactly which configurations make you money.</div>
            <div className="feat-point">✓ Performance by setup type</div>
            <div className="feat-point">✓ Cumulative R equity curve</div>
            <div className="feat-point">✓ AI insight on your strengths and weaknesses</div>
          </div>
          <div className="mockup-card" style={{ animation: 'float 5s 1s ease-in-out infinite' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>71%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Win rate</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</div><div style={{ fontSize: '10px', color: '#aaa' }}>Avg R</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>84%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Discipline</div></div>
            </div>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance by setup</div>
            {[{ name: 'Break & retest', wr: 78, r: '+2.4R', pos: true }, { name: 'Continuation', wr: 65, r: '+1.8R', pos: true }, { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false }].map((s, i) => (
              <div key={i} style={{ paddingBottom: '8px', marginBottom: '8px', borderBottom: i < 2 ? '0.5px solid #f5f5f5' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>{s.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.pos ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{s.r}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className="bar-bg"><div style={{ width: `${s.wr}%`, height: '100%', background: s.pos ? '#16a34a' : '#dc2626', borderRadius: '3px' }}></div></div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: s.pos ? '#16a34a' : '#dc2626' }}>{s.wr}%</span>
                </div>
              </div>
            ))}
            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#92400e' }}>
              Insight — You perform 2x better on Break & retest. That's your edge.
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Pricing</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Simple and transparent</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Start for free, upgrade when you're ready.</p>
        <div className="toggle-wrap">
          <span className={`toggle-label${!annual ? ' active' : ''}`}>Monthly</span>
          <button className={`toggle-btn${annual ? ' on' : ''}`} onClick={() => setAnnual(!annual)}>
            <div className="toggle-knob"></div>
          </button>
          <span className={`toggle-label${annual ? ' active' : ''}`}>Annual</span>
          {annual && <span className="save-badge">-17% · save €60/year</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
          <div className="plan-card" style={{ border: '0.5px solid #e8e8e8' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Free</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1rem' }}>To discover MyTradePlan</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>€0</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.25rem' }}>Forever</div>
            <div style={{ borderTop: '0.5px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 trades / month</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 morning plans / month</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Essential stats</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Advanced stats</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Macro AI Briefing</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>AI Insight calendar</div>
            </div>
            <a href="/register" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', border: '0.5px solid #ddd', borderRadius: '8px', fontSize: '0.875rem', textDecoration: 'none', color: '#111', fontWeight: 500 }}>Start for free</a>
          </div>
          <div className="plan-card" style={{ border: '2px solid #111', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>⭐ Most popular</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Pro</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1rem' }}>For the serious trader</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{annual ? '€24.99' : '€29.99'}</div>
              <div style={{ fontSize: '1rem', color: '#888', marginBottom: '2px' }}>/month</div>
            </div>
            {annual ? (
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginBottom: '4px' }}>€299.88/year · save €60</div>
            ) : (
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>or €24.99/month billed annually</div>
            )}
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.25rem' }}>7 days free · no credit card</div>
            <div style={{ borderTop: '0.5px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Unlimited trades</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Unlimited plans</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Advanced stats & patterns</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Discipline tracker</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong>Macro AI Briefing</strong></div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong>AI Insight calendar</strong></div>
            </div>
            <a href="/register" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: '#111', color: '#fff', borderRadius: '8px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Try free for 7 days →</a>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '12px', color: '#aaa' }}>No credit card required · Cancel anytime</div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Ready to trade with a plan?</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '2rem' }}>Join traders who improve every day.</p>
        <a href="/register" className="btn-main">Start for free →</a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2026 MyTradePlan · All rights reserved</span>
      </footer>
    </main>
  )
}