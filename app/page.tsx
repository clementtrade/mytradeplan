'use client'
import { useState } from 'react'

export default function Home() {
  const [annual, setAnnual] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'Inter, sans-serif' }}>
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
        .btn-main { background: #111; color: #fff; font-size: 0.9rem; font-weight: 600; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: box-shadow 0.2s, transform 0.2s; display: inline-block; }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .btn-sec { background: transparent; color: #111; font-size: 0.9rem; padding: 0.75rem 1.75rem; border-radius: 8px; text-decoration: none; border: 0.5px solid #ddd; transition: border-color 0.2s; display: inline-block; }
        .btn-sec:hover { border-color: #111; }
        .nav-link { font-size: 0.875rem; color: #666; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .feat-check { width: 20px; height: 20px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
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
        .chat-ai { background: #f5f5f5; border-radius: 3px 10px 10px 10px; padding: 9px 12px; font-size: 12px; color: #333; max-width: 88%; margin-bottom: 6px; }
        .chat-ai-lbl { font-size: 9px; color: #16a34a; font-weight: 600; margin-bottom: 2px; }
        .chat-user { background: #111; border-radius: 10px 3px 10px 10px; padding: 9px 12px; font-size: 12px; color: #fff; max-width: 78%; margin-left: auto; margin-bottom: 6px; }
        .trade-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 0.5px solid #f5f5f5; }
        .badge-long { background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .badge-short { background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
        .bar-bg { flex: 1; height: 5px; background: #f0f0f0; border-radius: 3px; }
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
        .dash-kpi { background: #1a1a1a; border-radius: 10px; padding: 10px 12px; }
        .dash-kpi-lbl { font-size: 9px; color: #888; margin-bottom: 4px; }
        .dash-kpi-val { font-size: 18px; font-weight: 700; font-family: monospace; }
        .dash-badge-l { background: #dcfce7; color: #16a34a; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .dash-badge-s { background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .dash-cal { aspect-ratio: 1; border-radius: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; }
        .cal-win { background: #c8f0d8; color: #15803d; }
        .cal-loss { background: #fdd0d0; color: #dc2626; }
        .cal-neu { background: #f5f5f5; color: #ccc; }
        .cal-we { background: #f5f5f5; color: #ddd; opacity: 0.35; }
        .cal-r { font-size: 7px; opacity: 0.8; margin-top: 1px; }
        .mockup-float { animation: float 5s ease-in-out infinite; }
        .mockup-float-2 { animation: float 5s 0.5s ease-in-out infinite; }
        .mockup-float-3 { animation: float 5s 1s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>MyTradePlan</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/register" className="btn-main" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>Essai gratuit</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div className="anim-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '20px', padding: '5px 14px', marginBottom: '1.5rem' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a', animation: 'glow 2s ease-in-out infinite' }}></div>
            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>Plan IA pré-marché · Tous marchés</span>
          </div>
          <h1 className="anim-2" style={{ fontSize: '2.75rem', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1.25rem' }}>
            Tradez avec un plan.<br />
            <span style={{ color: '#666' }}>Performez avec les données.</span>
          </h1>
          <p className="anim-3" style={{ fontSize: '1rem', color: '#666', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '400px' }}>
            MyTradePlan vous guide chaque matin avec un plan IA personnalisé, et analyse vos trades pour identifier votre véritable edge.
          </p>
          <div className="anim-4" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
            {["L'IA construit votre plan, vous tradez", 'Trouvez votre edge par setup', 'Transformez vos erreurs en avantage'].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                <div className="feat-check">✓</div>
                {p}
              </div>
            ))}
          </div>
          <div className="anim-5" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
            <a href="/register" className="btn-main">Commencer gratuitement →</a>
            <a href="/features" className="btn-sec">Voir comment ça marche</a>
          </div>
          <div className="anim-5" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div>
              <span style={{ fontSize: '12px', color: '#888' }}>Gratuit pour démarrer</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: '#e8e8e8' }}></div>
            <span style={{ fontSize: '12px', color: '#888' }}>Sans carte bancaire</span>
          </div>
        </div>

        {/* 2 MOCKUPS FLOTTANTS */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch', padding: '2.5rem 0.5rem', minHeight: '480px' }}>

          {/* GAUCHE : Plan du matin */}
          <div style={{ flex: 1, background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', animation: 'floatL 5s ease-in-out infinite', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600, flexShrink: 0 }}>M</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>MyTradePlan IA</div>
                <div style={{ fontSize: '10px', color: '#aaa' }}>Plan du matin · Aujourd'hui</div>
              </div>
              <div style={{ marginLeft: 'auto', background: '#f0fdf4', color: '#16a34a', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 500 }}>En direct</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px', flex: 1 }}>
              <div style={{ background: '#f5f5f5', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#333', maxWidth: '88%' }}>
                <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan IA</div>
                Le GEX est-il positif ou négatif ce matin ?
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: '#111', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#fff', maxWidth: '78%' }}>Négatif, gamma négatif.</div>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#333', maxWidth: '88%' }}>
                <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan IA</div>
                Forme du Volume Profile — D, B ou P ?
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: '#111', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#fff', maxWidth: '78%' }}>Forme B, sous le VAL.</div>
              </div>
              <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', maxWidth: '92%' }}>
                <div style={{ color: '#16a34a', fontSize: '10px', fontWeight: 600, marginBottom: '3px' }}>Plan prêt ✓</div>
                <span style={{ color: '#444' }}>Short uniquement · Break & retest vers les puts bas · Pas de mean reversion aujourd'hui.</span>
              </div>
            </div>
            <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: '12px', color: '#aaa' }}>Répondre ici...</span>
              <div style={{ background: '#111', borderRadius: '7px', padding: '6px 14px', fontSize: '12px', color: '#fff' }}>→</div>
            </div>
          </div>

          {/* DROITE : Stats */}
          <div style={{ flex: 1, background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', animation: 'floatR 5s 0.6s ease-in-out infinite', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>Stats & Performance</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>71%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Taux de réussite</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>R moyen</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>2.4</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Facteur de profit</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>84%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Discipline</div></div>
            </div>
            <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>P&L cumulé</div>
            <svg viewBox="0 0 220 65" style={{ width: '100%', height: '65px', marginBottom: '12px' }}>
              <defs><linearGradient id="gSt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a34a" stopOpacity="0.15"/><stop offset="100%" stopColor="#16a34a" stopOpacity="0"/></linearGradient></defs>
              <path d="M5,52 L30,46 L55,36 L75,40 L100,28 L120,20 L145,13 L175,7 L210,3 L210,62 L5,62 Z" fill="url(#gSt)"/>
              <path d="M5,52 L30,46 L55,36 L75,40 L100,28 L120,20 L145,13 L175,7 L210,3" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="210" cy="3" r="4" fill="#16a34a"/>
              <rect x="175" y="-3" width="38" height="14" rx="5" fill="#16a34a"/>
              <text x="179" y="8" fontSize="8" fill="white" fontWeight="600">+8.7R</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 500, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance par setup</div>
              {[{ name: 'Break & retest', wr: 78, r: '+2.4R', pos: true }, { name: 'Continuation', wr: 65, r: '+1.8R', pos: true }, { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false }].map((s, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#111' }}>{s.name}</span>
                    <span style={{ fontSize: '11px', color: s.pos ? '#16a34a' : '#dc2626', fontWeight: 700, fontFamily: 'monospace' }}>{s.r} · {s.wr}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px' }}>
                    <div style={{ width: `${s.wr}%`, height: '100%', background: s.pos ? '#16a34a' : '#dc2626', borderRadius: '3px' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#92400e' }}>
              <strong>💡 Insight IA</strong> — Votre edge est sur le Break & retest. Concentrez-vous dessus.
            </div>
          </div>
        </div>
      </section>

      {/* BANDE STATS */}
      <div style={{ background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8', borderBottom: '0.5px solid #e8e8e8', padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', alignItems: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>5 min</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>pour préparer votre session</div></div>
          <div style={{ width: '0.5px', height: '32px', background: '#e8e8e8' }}></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>100%</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>personnalisé à votre profil</div></div>
          <div style={{ width: '0.5px', height: '32px', background: '#e8e8e8' }}></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>Tous marchés</div><div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Futures, Forex, Crypto...</div></div>
        </div>
      </div>

      {/* DASHBOARD SECTION */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Dashboard</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Un dashboard complet à portée de main</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '2.5rem' }}>Cliquez sur n'importe quel jour du calendrier pour obtenir une analyse IA de votre session.</p>

        <div style={{ position: 'relative', background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }} id="dash-wrap">
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '44px', background: '#fff', borderRight: '0.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: '8px', zIndex: 5 }}>
            <div style={{ width: '22px', height: '22px', background: '#111', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 800, marginBottom: '6px' }}>M</div>
            <div style={{ width: '30px', height: '30px', background: '#111', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 700 }}>CL</div>
            <div style={{ width: '28px', height: '0.5px', background: '#e8e8e8' }}></div>
            <div style={{ width: '30px', height: '30px', background: '#111', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px' }}>▦</div>
            <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '11px' }}>☀</div>
            <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '11px' }}>◈</div>
            <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '10px' }}>▤</div>
          </div>

          <div style={{ marginLeft: '44px', padding: '0 1rem 1rem' }}>
            <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Dashboard</span>
                <span style={{ fontSize: '11px', color: '#bbb' }}>Vendredi 27 juin 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '0.5px solid #86efac', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>Plan prêt
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px', marginBottom: '0.875rem' }}>
              <div className="dash-kpi"><div className="dash-kpi-lbl">Taux réussite</div><div className="dash-kpi-val" style={{ color: '#4ade80' }}>71%</div></div>
              <div className="dash-kpi"><div className="dash-kpi-lbl">R moyen</div><div className="dash-kpi-val" style={{ color: '#4ade80' }}>+1.8R</div></div>
              <div className="dash-kpi"><div className="dash-kpi-lbl">Fact. profit</div><div className="dash-kpi-val" style={{ color: '#fff' }}>2.4</div></div>
              <div className="dash-kpi"><div className="dash-kpi-lbl">Discipline</div><div className="dash-kpi-val" style={{ color: '#4ade80' }}>84%</div></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '0.875rem' }}>
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', marginBottom: '7px' }}>Trades récents</div>
                {[{ d: 'long', s: 'Break & retest', r: '+2.1R', c: '#16a34a' }, { d: 'short', s: 'Mean reversion', r: '-1.0R', c: '#dc2626' }, { d: 'long', s: 'Continuation', r: '+3.2R', c: '#16a34a' }].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 2 ? '0.5px solid #f5f5f5' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span className={t.d === 'long' ? 'dash-badge-l' : 'dash-badge-s'}>{t.d.toUpperCase()}</span>
                      <span style={{ fontSize: '10px', color: '#555' }}>{t.s}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: t.c, fontFamily: 'monospace', fontWeight: 700 }}>{t.r}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', marginBottom: '7px' }}>Performance par setup</div>
                {[{ n: 'Break & retest', w: 78, pos: true }, { n: 'Continuation', w: 65, pos: true }, { n: 'Mean reversion', w: 35, pos: false }].map((s, i) => (
                  <div key={i} style={{ marginBottom: '7px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#111' }}>{s.n}</span>
                      <span style={{ fontSize: '9px', color: s.pos ? '#16a34a' : '#dc2626', fontFamily: 'monospace', fontWeight: 700 }}>{s.w}%</span>
                    </div>
                    <div style={{ height: '4px', background: '#f0f0f0', borderRadius: '3px' }}>
                      <div style={{ width: `${s.w}%`, height: '100%', background: s.pos ? '#111' : '#dc2626', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '0.75rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>Calendrier · Juin 2026</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#aaa' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: 8, height: 8, borderRadius: '2px', background: '#c8f0d8', display: 'inline-block' }}></span>Gain</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: 8, height: 8, borderRadius: '2px', background: '#fdd0d0', display: 'inline-block' }}></span>Perte</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '3px' }}>
                {['L','M','M','J','V','S','D'].map((d, i) => (
                  <div key={i} style={{ textAlign: 'center', fontSize: '8px', color: i >= 5 ? '#ddd' : '#bbb', paddingBottom: '2px', fontWeight: 600 }}>{d}</div>
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
                <div className="dash-cal cal-win" id="target-cell" style={{ outline: '2px solid #111', outlineOffset: '-2px' }}>9<span className="cal-r">+2.1</span></div>
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
                <div className="dash-cal cal-win" style={{ outline: '2px solid #888', outlineOffset: '-2px' }}>26<span className="cal-r">+2.0</span></div>
                <div className="dash-cal cal-we">27</div>
                <div className="dash-cal cal-we">28</div>
              </div>

              <div id="dash-modal" style={{ display: 'none', background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1rem', position: 'absolute', right: '0.75rem', top: '0.75rem', width: '220px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 10 }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>9 juin 2026</div>
                  <div style={{ fontSize: '10px', color: '#bbb', marginTop: '1px' }}>3 trades · +2.1R</div>
                </div>
                <div style={{ fontSize: '9px', fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Trades</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-s">SHORT</span><span style={{ fontSize: '9px', color: '#555' }}>Break & retest</span></div>
                  <span style={{ fontSize: '10px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+2.1R</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #f5f5f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-l">LONG</span><span style={{ fontSize: '9px', color: '#555' }}>Mean reversion</span></div>
                  <span style={{ fontSize: '10px', color: '#dc2626', fontFamily: 'monospace', fontWeight: 700 }}>-1.0R</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-s">SHORT</span><span style={{ fontSize: '9px', color: '#555' }}>Continuation</span></div>
                  <span style={{ fontSize: '10px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+1.0R</span>
                </div>
                <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px', marginTop: '8px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Analyse IA</div>
                  <div style={{ fontSize: '10px', color: '#333', lineHeight: 1.6 }}>Vos 2 shorts étaient alignés avec le flux. Le long Mean reversion était hors plan — évitez-le quand le GEX est négatif.</div>
                  <div style={{ marginTop: '5px', fontSize: '10px', fontWeight: 600, color: '#d97706' }}>Discipline : 67% · À améliorer.</div>
                </div>
              </div>

              <svg id="dash-cursor" style={{ position: 'absolute', pointerEvents: 'none', zIndex: 30, width: '16px', height: '16px', opacity: 0, transition: 'left 1.2s cubic-bezier(0.4,0,0.2,1), top 1.2s cubic-bezier(0.4,0,0.2,1)', left: '20px', top: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }} viewBox="0 0 20 20" fill="none">
                <path d="M4 2L16 10L10 11L8 18L4 2Z" fill="white" stroke="#111" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.5px' }}>Tout ce dont vous avez besoin pour mieux trader</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Plan IA pré-marché', desc: 'Chaque matin, un plan personnalisé basé sur votre profil de trader et les conditions du marché.' },
            { title: 'Journal de trading', desc: 'Enregistrez chaque trade avec le contexte, la zone, la cible, la confirmation et le résultat en R.' },
            { title: 'Stats & performance', desc: 'Taux de réussite, R moyen, meilleurs setups — visualisez votre edge et progressez.' },
            { title: 'Suivi de discipline', desc: "Mesurez votre respect du plan trade après trade. La discipline est votre véritable edge." },
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
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '0.5rem' }}>Processus</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Comment ça marche</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', textAlign: 'center', marginBottom: '2.5rem' }}>3 étapes pour trader avec méthode</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '760px', margin: '0 auto' }}>
          {[
            { n: '1', title: 'Créez votre profil', desc: 'Votre marché, votre méthode, vos erreurs récurrentes. L\'IA mémorise tout et s\'adapte à vous.' },
            { n: '2', title: 'Préparez votre session', desc: "L'IA pose les bonnes questions chaque matin. Votre plan est structuré en moins de 5 minutes." },
            { n: '3', title: 'Analysez & progressez', desc: "Journal + stats + insights IA pour identifier votre edge et vous améliorer trade après trade." },
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

      {/* Feature — Plan matin */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Plan du matin</div>
            <div className="feat-title">L'IA vous guide.<br />Vous tradez avec un plan.</div>
            <div className="feat-desc">Avant d'ouvrir vos graphiques, MyTradePlan pose les bonnes questions. Biais, setup, zone d'invalidation — votre plan est structuré en 5 minutes.</div>
            <div className="feat-point">✓ Personnalisé à votre profil de trader</div>
            <div className="feat-point">✓ Questions centrées sur le contexte du jour</div>
            <div className="feat-point">✓ Résumé clair avant l'ouverture</div>
          </div>
          <div className="mockup-card mockup-float">
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Plan du matin · Aujourd'hui</div>
            <div className="chat-ai"><div className="chat-ai-lbl">MyTradePlan IA</div>Quel est votre biais directionnel pour cette session ?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user">Haussier si le marché tient le support.</div></div>
            <div className="chat-ai"><div className="chat-ai-lbl">MyTradePlan IA</div>Sur quel setup allez-vous vous concentrer ?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user">Break & retest long.</div></div>
            <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 8px 8px 8px', padding: '8px 10px', fontSize: '11px', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#16a34a', marginBottom: '2px', fontWeight: 600 }}>Plan prêt ✓</div>
              <span style={{ color: '#555' }}>Biais haussier · Break & retest · Attendez la confirmation avant d'entrer.</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '0.5px solid #f5f5f5', paddingTop: '7px' }}>
              <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '5px', padding: '6px 8px', fontSize: '11px', color: '#aaa' }}>Répondre ici...</div>
              <div style={{ background: '#111', borderRadius: '5px', padding: '6px 10px', fontSize: '11px', color: '#fff' }}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature — Journal */}
      <section style={{ padding: '4rem 2rem', background: '#f9f9f9', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div className="mockup-card mockup-float-2">
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Derniers trades</div>
            <div className="trade-row"><span className="badge-long">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Break & retest</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>+2.1R</span></div>
            <div className="trade-row"><span className="badge-short">SHORT</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Mean reversion</span><span style={{ color: '#dc2626', fontWeight: 700, fontFamily: 'monospace' }}>-1.0R</span></div>
            <div className="trade-row"><span className="badge-long">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Continuation</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>+3.2R</span></div>
            <div className="trade-row" style={{ border: 'none' }}><span className="badge-long">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 8px', fontSize: '12px' }}>Break & retest</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>+1.8R</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '10px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>75%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Réussite</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.9R</div><div style={{ fontSize: '10px', color: '#aaa' }}>R moyen</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>88%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Discipline</div></div>
            </div>
          </div>
          <div>
            <div className="feat-tag">Journal de trading</div>
            <div className="feat-title">Chaque trade documenté.<br />Chaque erreur analysée.</div>
            <div className="feat-desc">Enregistrez le contexte, la zone, la cible, la confirmation et le résultat en R. Identifiez vos patterns et améliorez votre discipline trade après trade.</div>
            <div className="feat-point">✓ Résultat en R par trade</div>
            <div className="feat-point">✓ Suivi du respect du plan</div>
            <div className="feat-point">✓ Historique complet détaillé</div>
          </div>
        </div>
      </section>

      {/* Feature — Stats */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Stats & performance</div>
            <div className="feat-title">Trouvez votre edge.<br />Arrêtez de deviner.</div>
            <div className="feat-desc">Taux de réussite, R moyen, facteur de profit — et performance par setup pour savoir exactement quelles configurations vous rapportent.</div>
            <div className="feat-point">✓ Performance par type de setup</div>
            <div className="feat-point">✓ Courbe equity R cumulé</div>
            <div className="feat-point">✓ Insight IA sur vos forces et faiblesses</div>
          </div>
          <div className="mockup-card mockup-float-3">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>71%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Réussite</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</div><div style={{ fontSize: '10px', color: '#aaa' }}>R moyen</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>84%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Discipline</div></div>
            </div>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance par setup</div>
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
              <strong>💡 Insight</strong> — Vous performez 2x mieux sur le Break & retest. C'est votre edge.
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Tarifs</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Simple et transparent</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Démarrez gratuitement, passez au Pro quand vous êtes prêt.</p>
        <div className="toggle-wrap">
          <span className={`toggle-label${!annual ? ' active' : ''}`}>Mensuel</span>
          <button className={`toggle-btn${annual ? ' on' : ''}`} onClick={() => setAnnual(!annual)}>
            <div className="toggle-knob"></div>
          </button>
          <span className={`toggle-label${annual ? ' active' : ''}`}>Annuel</span>
          {annual && <span className="save-badge">-17% · économisez 60€/an</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
          <div className="plan-card" style={{ border: '0.5px solid #e8e8e8' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Gratuit</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1rem' }}>Pour découvrir MyTradePlan</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>0€</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.25rem' }}>Pour toujours</div>
            <div style={{ borderTop: '0.5px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 trades / mois</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 plans du matin / mois</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Stats essentielles</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Stats avancées</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Briefing Macro IA</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Insight IA calendrier</div>
            </div>
            <a href="/register" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', border: '0.5px solid #ddd', borderRadius: '8px', fontSize: '0.875rem', textDecoration: 'none', color: '#111', fontWeight: 500 }}>Commencer gratuitement</a>
          </div>
          <div className="plan-card" style={{ border: '2px solid #111', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>⭐ Le plus populaire</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Pro</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1rem' }}>Pour le trader sérieux</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{annual ? '24,99€' : '29,99€'}</div>
              <div style={{ fontSize: '1rem', color: '#888', marginBottom: '2px' }}>/mois</div>
            </div>
            {annual ? (
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginBottom: '4px' }}>299,88€/an · économisez 60€</div>
            ) : (
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>ou 24,99€/mois facturé annuellement</div>
            )}
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.25rem' }}>7 jours gratuits · sans CB</div>
            <div style={{ borderTop: '0.5px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Trades illimités</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Plans illimités</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Stats avancées & patterns</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Suivi de discipline</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong>Briefing Macro IA</strong></div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong>Insight IA calendrier</strong></div>
            </div>
            <a href="/register" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: '#111', color: '#fff', borderRadius: '8px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Essayer gratuitement 7 jours →</a>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '12px', color: '#aaa' }}>Sans carte bancaire · Résiliez à tout moment</div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '2rem' }}>Rejoignez les traders qui progressent chaque jour.</p>
        <a href="/register" className="btn-main">Commencer gratuitement →</a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2026 MyTradePlan · Tous droits réservés</span>
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