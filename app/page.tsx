'use client'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [annual, setAnnual] = useState(false)
  const animRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<any[]>([])
  const progTimerRef = useRef<any>(null)
  const sceneRef = useRef(0)

  useEffect(() => {
    const timers: any[] = []
    let progTimer: any = null
    let progVal = 0
    const SCENE_DUR = 8000

    function clearAll() {
      timers.forEach(clearTimeout)
      timers.length = 0
      clearInterval(progTimer)
    }

    function showScene(i: number) {
      const scenes = ['scene0', 'scene1', 'scene2']
      const dots = ['id0', 'id1', 'id2']
      scenes.forEach((s, j) => {
        const el = document.getElementById(s)
        if (el) el.style.opacity = j === i ? '1' : '0'
      })
      dots.forEach((d, j) => {
        const el = document.getElementById(d)
        if (!el) return
        el.style.background = j === i ? '#111' : '#ddd'
        el.style.width = j === i ? '18px' : '6px'
        el.style.borderRadius = j === i ? '3px' : '50%'
      })
    }

    function startProgress(dur: number, cb: () => void) {
      const prog = document.getElementById('prog')
      if (!prog) return
      progVal = 0
      prog.style.transition = 'none'
      prog.style.width = '0%'
      const step = 50
      const inc = (step / dur) * 100
      progTimer = setInterval(() => {
        progVal += inc
        prog.style.width = Math.min(progVal, 100) + '%'
        if (progVal >= 100) { clearInterval(progTimer); cb() }
      }, step)
    }

    function typeText(el: HTMLElement, text: string, speed: number, cb?: () => void) {
      let i = 0
      el.textContent = ''
      const t = setInterval(() => {
        el.textContent += text[i]
        i++
        if (i >= text.length) { clearInterval(t); if (cb) cb() }
      }, speed)
      timers.push(t)
    }

    function addBubble(container: HTMLElement, type: string, text: string, delay: number, cb?: () => void) {
      const t = setTimeout(() => {
        const div = document.createElement('div')
        if (type === 'ai') {
          div.style.cssText = 'background:#f5f5f5;border-radius:3px 10px 10px 10px;padding:10px 12px;font-size:12px;color:#333;max-width:85%;margin-bottom:6px;opacity:0;transform:translateY(6px);transition:opacity 0.3s ease,transform 0.3s ease;font-family:Inter,sans-serif;'
        } else if (type === 'user') {
          div.style.cssText = 'background:#111;border-radius:10px 3px 10px 10px;padding:10px 12px;font-size:12px;color:#fff;max-width:75%;margin-left:auto;margin-bottom:6px;opacity:0;transform:translateY(6px);transition:opacity 0.3s ease,transform 0.3s ease;font-family:Inter,sans-serif;'
        } else {
          div.style.cssText = 'background:#f0fdf4;border:0.5px solid #bbf7d0;border-radius:3px 10px 10px 10px;padding:10px 12px;font-size:12px;max-width:90%;margin-bottom:6px;opacity:0;transform:translateY(6px);transition:opacity 0.3s ease,transform 0.3s ease;font-family:Inter,sans-serif;'
          div.innerHTML = '<div style="font-size:10px;color:#16a34a;font-weight:600;margin-bottom:3px;">Plan ready ✓</div><span id="plan-text" style="color:#444;"></span>'
        }
        container.appendChild(div)
        setTimeout(() => { div.style.opacity = '1'; div.style.transform = 'translateY(0)' }, 30)
        if (type !== 'plan') {
          typeText(div, text, 25, cb)
        } else {
          const planEl = div.querySelector('#plan-text') as HTMLElement
          if (planEl) typeText(planEl, text, 20, cb)
        }
      }, delay)
      timers.push(t)
    }

    function runScene0() {
      showScene(0)
      const cursor = document.getElementById('cur0')
      const modal = document.getElementById('cal-modal-s0')
      const cell = document.getElementById('tc9')
      const calCard = cell?.closest('[data-calcard]') as HTMLElement
      if (!cursor || !modal || !cell || !calCard) return
      modal.style.display = 'none'
      cursor.style.opacity = '1'
      cursor.style.left = '20px'
      cursor.style.top = '20px'
      const mText = document.getElementById('modal-text')
      const mDisc = document.getElementById('modal-disc')
      if (mText) mText.textContent = ''
      if (mDisc) mDisc.style.display = 'none'

      const t1 = setTimeout(() => {
        const calR = calCard.getBoundingClientRect()
        const cellR = cell.getBoundingClientRect()
        cursor.style.left = (cellR.left - calR.left + cellR.width / 2 - 4) + 'px'
        cursor.style.top = (cellR.top - calR.top + cellR.height / 2 - 4) + 'px'
      }, 700)
      timers.push(t1)

      const t2 = setTimeout(() => {
        cursor.style.transform = 'scale(0.8)'
        setTimeout(() => { cursor.style.transform = 'scale(1)' }, 150)
        modal.style.display = 'block'
        if (mText) typeText(mText, "Your 2 shorts aligned with the flow. The long Mean reversion was off-plan — avoid this when GEX is negative.", 20, () => {
          if (mDisc) mDisc.style.display = 'block'
        })
      }, 1900)
      timers.push(t2)

      startProgress(SCENE_DUR, () => {
        clearAll()
        cursor.style.opacity = '0'
        modal.style.display = 'none'
        runScene1()
      })
    }

    function runScene1() {
      showScene(1)
      const container = document.getElementById('chat-container')
      if (!container) return
      container.innerHTML = ''
      const msgs = [
        { type: 'ai', text: 'Is GEX positive or negative this morning?', delay: 400 },
        { type: 'user', text: 'Negative, negative Gamma.', delay: 1900 },
        { type: 'ai', text: 'Volume Profile shape — D, B or P?', delay: 3100 },
        { type: 'user', text: 'B shape, below VAL.', delay: 4500 },
        { type: 'plan', text: 'Short only · Break & retest · No mean reversion today.', delay: 5800 },
      ]
      msgs.forEach(m => addBubble(container, m.type, m.text, m.delay))
      startProgress(SCENE_DUR, () => { clearAll(); runScene2() })
    }

    function runScene2() {
      showScene(2)
      const container = document.getElementById('macro-container')
      if (!container) return
      container.innerHTML = ''
      const lines = [
        { text: 'Fed hawkish — June minutes confirm persistent hawkish majority. Rate cut expectations revised to 1 cut in 2026.', delay: 300 },
        { text: 'GEX negative — Negative gamma amplifies directional moves. Favors clean breakouts on NQ and ES.', delay: 2400 },
        { text: 'Dollar strength — USD well bid, creating latent pressure on equities and USD-denominated commodities.', delay: 4400 },
        { text: 'Bias: BEARISH · Short only · Avoid mean reversions · Wait for Break & retest confirmation.', delay: 6000, highlight: true },
      ]
      lines.forEach((l: any) => {
        const t = setTimeout(() => {
          const div = document.createElement('div')
          if (l.highlight) {
            div.style.cssText = 'background:#fffbeb;border:0.5px solid #fde68a;border-radius:8px;padding:10px 12px;font-size:12px;color:#92400e;opacity:0;transform:translateY(4px);transition:opacity 0.3s ease,transform 0.3s ease;font-family:Inter,sans-serif;'
            div.textContent = l.text
          } else {
            div.style.cssText = 'font-size:12px;color:#333;line-height:1.7;opacity:0;transform:translateY(4px);transition:opacity 0.3s ease,transform 0.3s ease;overflow:hidden;white-space:nowrap;font-family:Inter,sans-serif;'
          }
          container.appendChild(div)
          setTimeout(() => { div.style.opacity = '1'; div.style.transform = 'translateY(0)' }, 30)
          if (!l.highlight) typeText(div, l.text, 14)
        }, l.delay)
        timers.push(t)
      })
      startProgress(SCENE_DUR, () => { clearAll(); runScene0() })
    }

    const startTimer = setTimeout(runScene0, 600)
    timers.push(startTimer)

    return () => { clearAll(); clearTimeout(startTimer) }
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
        .kpi-dark { background: #1a1a1a; border-radius: 10px; padding: 12px 14px; }
        .kpi-lbl { font-size: 10px; color: #888; margin-bottom: 5px; }
        .kpi-val { font-size: 20px; font-weight: 700; font-family: monospace; }
        .cal-c { aspect-ratio: 1; border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; }
        .cal-w { background: #c8f0d8; color: #15803d; }
        .cal-lo { background: #fdd0d0; color: #dc2626; }
        .cal-n { background: #f5f5f5; color: #ccc; }
        .cal-we { background: #f5f5f5; color: #ddd; opacity: 0.3; }
        .cal-r { font-size: 7px; opacity: 0.8; margin-top: 1px; }
        .cal-sel { outline: 2px solid #111; outline-offset: -2px; }
        .b-l { background: #dcfce7; color: #16a34a; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 3px; }
        .b-s { background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 3px; }
        .ind-dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; transition: all 0.3s; display: inline-block; }
        .scene { position: absolute; top: 0; left: 0; right: 0; bottom: 0; padding: 1.5rem; opacity: 0; transition: opacity 0.5s ease; pointer-events: none; overflow: hidden; }
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
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2.5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'center' }}>
        <div>
          <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '20px', padding: '5px 14px', marginBottom: '1.5rem' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }}></div>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>AI pre-market plan · All markets</span>
          </div>
          <h1 className="anim-2" style={{ fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.25rem' }}>
            Trade with a plan.<br />
            <span style={{ color: '#666' }}>Perform with data.</span>
          </h1>
          <p className="anim-3" style={{ fontSize: '1rem', color: '#666', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '400px' }}>
            MyTradePlan guides you every morning with a personalized AI pre-market plan, and analyzes your trades to identify your real edge.
          </p>
          <div className="anim-4" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
            {['AI builds your plan, you trade', 'Find your real edge by setup', 'Turn your mistakes into edge'].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
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
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div>
              <span style={{ fontSize: '12px', color: '#888' }}>Free to start</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: '#e8e8e8' }}></div>
            <span style={{ fontSize: '12px', color: '#888' }}>No credit card required</span>
          </div>
        </div>

        {/* ANIMATED BOX */}
        <div style={{ border: '2px solid #e8e8e8', borderRadius: '16px', overflow: 'hidden', background: '#fff', position: 'relative', minHeight: '600px' }} ref={animRef}>

          {/* SCENE 0 : Dashboard */}
          <div className="scene" id="scene0" style={{ opacity: 1, pointerEvents: 'all' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '0.5px solid #e8e8e8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '22px', height: '22px', background: '#111', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 800 }}>M</div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Dashboard</span>
                  <span style={{ fontSize: '11px', color: '#bbb' }}>June 27, 2026</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f0fdf4', border: '0.5px solid #86efac', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>Plan ready
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                <div className="kpi-dark"><div className="kpi-lbl">Win rate</div><div className="kpi-val" style={{ color: '#4ade80' }}>71%</div></div>
                <div className="kpi-dark"><div className="kpi-lbl">Avg R</div><div className="kpi-val" style={{ color: '#4ade80' }}>+1.8R</div></div>
                <div className="kpi-dark"><div className="kpi-lbl">P. Factor</div><div className="kpi-val" style={{ color: '#fff' }}>2.4</div></div>
                <div className="kpi-dark"><div className="kpi-lbl">Discipline</div><div className="kpi-val" style={{ color: '#4ade80' }}>84%</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', marginBottom: '8px' }}>Recent trades</div>
                  {[{ d: 'long', s: 'Break & retest', r: '+2.1R', c: '#16a34a' }, { d: 'short', s: 'Mean reversion', r: '-1.0R', c: '#dc2626' }, { d: 'long', s: 'Continuation', r: '+3.2R', c: '#16a34a' }].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 2 ? '0.5px solid #f5f5f5' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className={t.d === 'long' ? 'b-l' : 'b-s'}>{t.d.toUpperCase()}</span>
                        <span style={{ fontSize: '10px', color: '#555' }}>{t.s}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: t.c, fontFamily: 'monospace', fontWeight: 700 }}>{t.r}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '10px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', marginBottom: '8px' }}>Performance by setup</div>
                  {[{ n: 'Break & retest', w: 78, pos: true }, { n: 'Continuation', w: 65, pos: true }, { n: 'Mean reversion', w: 35, pos: false }].map((s, i) => (
                    <div key={i} style={{ marginBottom: '7px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: '#111' }}>{s.n}</span>
                        <span style={{ fontSize: '9px', color: s.pos ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{s.w}%</span>
                      </div>
                      <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '3px' }}>
                        <div style={{ width: `${s.w}%`, height: '100%', background: s.pos ? '#111' : '#dc2626', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '10px', position: 'relative', flex: 1 }} data-calcard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>Calendar · June 2026</span>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '9px', color: '#aaa' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '2px', background: '#c8f0d8', display: 'inline-block' }}></span>Win</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '2px', background: '#fdd0d0', display: 'inline-block' }}></span>Loss</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '3px' }}>
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} style={{ textAlign: 'center', fontSize: '8px', color: i >= 5 ? '#ddd' : '#bbb', fontWeight: 600, paddingBottom: '2px' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
                  <div className="cal-c cal-n"></div>
                  <div className="cal-c cal-w">2<span className="cal-r">+1.5</span></div>
                  <div className="cal-c cal-lo">3<span className="cal-r">-1.0</span></div>
                  <div className="cal-c cal-w">4<span className="cal-r">+0.8</span></div>
                  <div className="cal-c cal-w">5<span className="cal-r">+2.1</span></div>
                  <div className="cal-c cal-we">6</div><div className="cal-c cal-we">7</div>
                  <div className="cal-c cal-w">8<span className="cal-r">+1.3</span></div>
                  <div className="cal-c cal-w cal-sel" id="tc9">9<span className="cal-r">+2.1</span></div>
                  <div className="cal-c cal-lo">10<span className="cal-r">-0.5</span></div>
                  <div className="cal-c cal-w">11<span className="cal-r">+0.7</span></div>
                  <div className="cal-c cal-w">12<span className="cal-r">+1.1</span></div>
                  <div className="cal-c cal-we">13</div><div className="cal-c cal-we">14</div>
                  <div className="cal-c cal-n">15</div>
                  <div className="cal-c cal-w">16<span className="cal-r">+1.8</span></div>
                  <div className="cal-c cal-lo">17<span className="cal-r">-1.2</span></div>
                  <div className="cal-c cal-w">18<span className="cal-r">+0.9</span></div>
                  <div className="cal-c cal-w">19<span className="cal-r">+2.3</span></div>
                  <div className="cal-c cal-we">20</div><div className="cal-c cal-we">21</div>
                  <div className="cal-c cal-w">22<span className="cal-r">+1.5</span></div>
                  <div className="cal-c cal-w">23<span className="cal-r">+2.3</span></div>
                  <div className="cal-c cal-lo">24<span className="cal-r">-1.0</span></div>
                  <div className="cal-c cal-w">25<span className="cal-r">+0.7</span></div>
                  <div className="cal-c cal-w" style={{ outline: '2px solid #888', outlineOffset: '-2px' }}>26<span className="cal-r">+2.0</span></div>
                  <div className="cal-c cal-we">27</div><div className="cal-c cal-we">28</div>
                </div>

                <div id="cal-modal-s0" style={{ display: 'none', position: 'absolute', right: '8px', top: '8px', width: '220px', background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 20 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>June 9, 2026</div>
                  <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '10px' }}>3 trades · +2.1R</div>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>AI Insight</div>
                  <div id="modal-text" style={{ fontSize: '11px', color: '#333', lineHeight: 1.6 }}></div>
                  <div id="modal-disc" style={{ display: 'none', marginTop: '6px', fontSize: '11px', fontWeight: 600, color: '#d97706' }}>Discipline: 67% · Needs improvement.</div>
                </div>

                <svg id="cur0" style={{ position: 'absolute', pointerEvents: 'none', zIndex: 30, width: '16px', height: '16px', opacity: 0, transition: 'left 1s cubic-bezier(0.4,0,0.2,1), top 1s cubic-bezier(0.4,0,0.2,1)', left: '20px', top: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }} viewBox="0 0 20 20" fill="none">
                  <path d="M4 2L16 10L10 11L8 18L4 2Z" fill="white" stroke="#111" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* SCENE 1 : Morning plan */}
          <div className="scene" id="scene1">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #e8e8e8' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600 }}>M</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>MyTradePlan AI</div>
                  <div style={{ fontSize: '10px', color: '#aaa' }}>Morning plan · Today</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#f0fdf4', color: '#16a34a', fontSize: '10px', padding: '3px 10px', borderRadius: '4px', fontWeight: 500 }}>Live</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }} id="chat-container"></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                <span style={{ fontSize: '12px', color: '#bbb' }}>Reply here...</span>
                <div style={{ background: '#111', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#fff' }}>→</div>
              </div>
            </div>
          </div>

          {/* SCENE 2 : Macro briefing */}
          <div className="scene" id="scene2">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #e8e8e8' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Macro AI Briefing</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>Generated for your profile · Order Flow</div>
                </div>
                <div style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', color: '#888' }}>↺ Refresh</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }} id="macro-container"></div>
            </div>
          </div>

          {/* Indicators */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 10 }}>
            <div id="id0" className="ind-dot" style={{ background: '#111', width: '18px', borderRadius: '3px' }}></div>
            <div id="id1" className="ind-dot"></div>
            <div id="id2" className="ind-dot"></div>
          </div>

          {/* Progress bar */}
          <div id="prog" style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: '#111', width: '0%', zIndex: 10 }}></div>
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