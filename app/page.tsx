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
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; max-width: 960px; margin: 0 auto; }
        .feat-tag { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.75rem; }
        .feat-title { font-size: 1.4rem; font-weight: 700; color: #111; letter-spacing: -0.3px; margin-bottom: 0.75rem; line-height: 1.25; }
        .feat-desc { font-size: 0.875rem; color: #666; line-height: 1.7; margin-bottom: 1rem; }
        .feat-point { font-size: 0.875rem; color: #444; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
        .feat-chk { width: 16px; height: 16px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; flex-shrink: 0; }
        .mockup-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px; padding: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .chat-ai { background: #f5f5f5; border-radius: 3px 8px 8px 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 11px; color: #333; max-width: 88%; }
        .chat-user { background: #111; border-radius: 8px 3px 8px 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 11px; color: #fff; max-width: 80%; margin-left: auto; }
        .chat-tag { font-size: 9px; color: #aaa; margin-bottom: 2px; }
        .chat-tag-u { font-size: 9px; color: rgba(255,255,255,0.4); margin-bottom: 2px; text-align: right; }
        .trade-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 0.5px solid #f5f5f5; }
        .badge-long { background: #dcfce7; color: #16a34a; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .badge-short { background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
        .bl { background: #dcfce7; color: #16a34a; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
        .bs { background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
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
        .dash-kpi { background: #111; border-radius: 8px; padding: 8px 10px; }
        .dash-kpi-l { font-size: 8px; color: #888; margin-bottom: 3px; }
        .dash-kpi-v { font-size: 13px; font-weight: 700; font-family: monospace; }
        .dash-badge-l { background: #dcfce7; color: #16a34a; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .dash-badge-s { background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .dash-cal { aspect-ratio: 1; border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; }
        .cal-win { background: #c8f0d8; color: #15803d; }
        .cal-loss { background: #fdd0d0; color: #dc2626; }
        .cal-neu { background: #f5f5f5; color: #ccc; }
        .cal-we { background: #f5f5f5; color: #ddd; opacity: 0.35; }
        .cal-r { font-size: 6px; opacity: 0.8; margin-top: 1px; }
        .mockup-float { animation: float 5s ease-in-out infinite; }
        .mockup-float-2 { animation: float 5s 0.5s ease-in-out infinite; }
        .mockup-float-3 { animation: float 5s 1s ease-in-out infinite; }
        .mockup-float-4 { animation: float 5s 1.5s ease-in-out infinite; }
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
          {/* GAUCHE : Morning Plan */}
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
                <span style={{ color: '#444' }}>Short uniquement · Break & retest · Pas de mean reversion aujourd'hui.</span>
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

      {/* How it works */}
      <section style={{ background: '#fff', padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '0.5rem' }}>Processus</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Comment ça marche</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', textAlign: 'center', marginBottom: '2.5rem' }}>3 étapes pour trader avec méthode</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '760px', margin: '0 auto' }}>
          {[
            { n: '1', title: 'Créez votre profil', desc: "Votre marché, votre méthode, vos erreurs récurrentes. L'IA mémorise tout et s'adapte à vous." },
            { n: '2', title: 'Préparez votre session', desc: "L'IA pose les bonnes questions chaque matin. Votre plan est structuré en moins de 5 minutes." },
            { n: '3', title: 'Analysez & progressez', desc: "Journal + stats + insights IA pour identifier votre edge et vous améliorer trade après trade." },
          ].map((s, i) => (
            <div key={i} style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '1.25rem' }}>
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

      {/* FEATURE 1 : Plan du matin */}
      <section style={{ padding: '4rem 2.5rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Plan du matin</div>
            <div className="feat-title">L'IA vous guide.<br />Vous tradez avec un plan.</div>
            <div className="feat-desc">Avant d'ouvrir vos graphiques, MyTradePlan pose les bonnes questions. Biais, setup, zone d'invalidation — votre plan est structuré en 5 minutes.</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Personnalisé à votre profil de trader</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Questions centrées sur le contexte du jour</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Résumé clair avant l'ouverture</div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} className="mockup-float">
            <div style={{ background: '#111', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#111' }}>M</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#fff' }}>MyTradePlan IA</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Plan du matin · 08h14</div>
              </div>
              <div style={{ marginLeft: 'auto', background: '#22c55e', color: '#fff', fontSize: '8px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>En direct</div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ background: '#f5f5f5', borderRadius: '3px 8px 8px 8px', padding: '7px 9px', fontSize: '10px', color: '#333', maxWidth: '88%' }}>
                <div style={{ fontSize: '8px', color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan IA</div>
                Le GEX est-il positif ou négatif ce matin ?
              </div>
              <div style={{ background: '#111', borderRadius: '8px 3px 8px 8px', padding: '7px 9px', fontSize: '10px', color: '#fff', maxWidth: '78%', marginLeft: 'auto' }}>Négatif, gamma négatif.</div>
              <div style={{ background: '#f5f5f5', borderRadius: '3px 8px 8px 8px', padding: '7px 9px', fontSize: '10px', color: '#333', maxWidth: '88%' }}>
                <div style={{ fontSize: '8px', color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan IA</div>
                Forme du Volume Profile — D, B ou P ?
              </div>
              <div style={{ background: '#111', borderRadius: '8px 3px 8px 8px', padding: '7px 9px', fontSize: '10px', color: '#fff', maxWidth: '78%', marginLeft: 'auto' }}>Forme B, sous le VAL.</div>
              <div style={{ background: '#f5f5f5', borderRadius: '3px 8px 8px 8px', padding: '7px 9px', fontSize: '10px', color: '#333', maxWidth: '88%' }}>
                <div style={{ fontSize: '8px', color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>MyTradePlan IA</div>
                Quel est votre risque max par trade ?
              </div>
              <div style={{ background: '#111', borderRadius: '8px 3px 8px 8px', padding: '7px 9px', fontSize: '10px', color: '#fff', maxWidth: '78%', marginLeft: 'auto' }}>1R max, sans exception.</div>
              <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 8px 8px 8px', padding: '8px 10px', fontSize: '10px', maxWidth: '92%' }}>
                <div style={{ color: '#16a34a', fontSize: '9px', fontWeight: 600, marginBottom: '3px' }}>Plan prêt ✓</div>
                <span style={{ color: '#444' }}>Biais baissier · Short uniquement · Break & retest · Max 1R · Pas d'entrée avant 9h30 · Évitez les mean reversions.</span>
              </div>
            </div>
            <div style={{ padding: '0 14px 12px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#bbb' }}>Répondre ici...</span>
                <div style={{ background: '#111', borderRadius: '6px', padding: '5px 12px', fontSize: '10px', color: '#fff' }}>→</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2 : Dashboard */}
      <section style={{ padding: '4rem 2.5rem', background: '#f9f9f9', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} className="mockup-float-2">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '36px', background: '#fff', borderRight: '0.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', gap: '6px', flexShrink: 0 }}>
                <div style={{ width: '20px', height: '20px', background: '#111', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '7px', fontWeight: 800, marginBottom: '4px' }}>M</div>
                <div style={{ width: '26px', height: '26px', background: '#111', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px' }}>▦</div>
                <div style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '9px' }}>☀</div>
                <div style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '9px' }}>◈</div>
                <div style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '9px' }}>▤</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: '36px', borderBottom: '0.5px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>Dashboard</span>
                    <span style={{ fontSize: '9px', color: '#bbb' }}>27 juin 2026</span>
                  </div>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '8px', padding: '2px 7px', borderRadius: '4px', border: '0.5px solid #bbf7d0', fontWeight: 500 }}>● Plan prêt</span>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '5px', marginBottom: '8px' }}>
                    <div className="dash-kpi"><div className="dash-kpi-l">Réussite</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>71%</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">R moyen</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>+1.8R</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">F. profit</div><div className="dash-kpi-v" style={{ color: '#fff' }}>2.4</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">Discipline</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>84%</div></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '7px', padding: '7px' }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Trades récents</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0', borderBottom: '0.5px solid #f0f0f0' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span className="dash-badge-l">LONG</span><span style={{ fontSize: '8px', color: '#555' }}>B&R</span></div><span style={{ fontSize: '8px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+2.1R</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0', borderBottom: '0.5px solid #f0f0f0' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span className="dash-badge-s">SHORT</span><span style={{ fontSize: '8px', color: '#555' }}>MR</span></div><span style={{ fontSize: '8px', color: '#dc2626', fontFamily: 'monospace', fontWeight: 700 }}>-1.0R</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span className="dash-badge-l">LONG</span><span style={{ fontSize: '8px', color: '#555' }}>Cont.</span></div><span style={{ fontSize: '8px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+3.2R</span></div>
                    </div>
                    <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '7px', padding: '7px' }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Par setup</div>
                      <div style={{ marginBottom: '4px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '8px', color: '#111' }}>Break & retest</span><span style={{ fontSize: '7px', color: '#16a34a' }}>78%</span></div><div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '78%', height: '100%', background: '#111', borderRadius: '2px' }}></div></div></div>
                      <div style={{ marginBottom: '4px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '8px', color: '#111' }}>Continuation</span><span style={{ fontSize: '7px', color: '#16a34a' }}>65%</span></div><div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '65%', height: '100%', background: '#111', borderRadius: '2px' }}></div></div></div>
                      <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '8px', color: '#111' }}>Mean reversion</span><span style={{ fontSize: '7px', color: '#dc2626' }}>35%</span></div><div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '35%', height: '100%', background: '#dc2626', borderRadius: '2px' }}></div></div></div>
                    </div>
                  </div>
                  <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '7px', padding: '7px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '8px', fontWeight: 700, color: '#111' }}>Calendrier · Juin 2026</span>
                      <div style={{ display: 'flex', gap: '4px', fontSize: '7px', color: '#aaa' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 5, height: 5, borderRadius: '1px', background: '#c8f0d8', display: 'inline-block' }}></span>Gain</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 5, height: 5, borderRadius: '1px', background: '#fdd0d0', display: 'inline-block' }}></span>Perte</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1px', marginBottom: '1px' }}>
                      {['L','M','M','J','V','S','D'].map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: '6px', color: i >= 5 ? '#ddd' : '#bbb', fontWeight: 600 }}>{d}</div>)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1px' }}>
                      <div className="dash-cal cal-neu"></div>
                      <div className="dash-cal cal-win">2<span className="cal-r">+1.5</span></div><div className="dash-cal cal-loss">3<span className="cal-r">-1.0</span></div><div className="dash-cal cal-win">4<span className="cal-r">+0.8</span></div><div className="dash-cal cal-win">5<span className="cal-r">+2.1</span></div><div className="dash-cal cal-we">6</div><div className="dash-cal cal-we">7</div>
                      <div className="dash-cal cal-win">8<span className="cal-r">+1.3</span></div><div className="dash-cal cal-win" style={{ outline: '1.5px solid #111', outlineOffset: '-1px' }}>9<span className="cal-r">+2.1</span></div><div className="dash-cal cal-loss">10<span className="cal-r">-0.5</span></div><div className="dash-cal cal-win">11<span className="cal-r">+0.7</span></div><div className="dash-cal cal-win">12<span className="cal-r">+1.1</span></div><div className="dash-cal cal-we">13</div><div className="dash-cal cal-we">14</div>
                      <div className="dash-cal cal-neu">15</div><div className="dash-cal cal-win">16<span className="cal-r">+1.8</span></div><div className="dash-cal cal-loss">17<span className="cal-r">-1.2</span></div><div className="dash-cal cal-win">18<span className="cal-r">+0.9</span></div><div className="dash-cal cal-win">19<span className="cal-r">+2.3</span></div><div className="dash-cal cal-we">20</div><div className="dash-cal cal-we">21</div>
                      <div className="dash-cal cal-win">22<span className="cal-r">+1.5</span></div><div className="dash-cal cal-win">23<span className="cal-r">+2.3</span></div><div className="dash-cal cal-loss">24<span className="cal-r">-1.0</span></div><div className="dash-cal cal-win">25<span className="cal-r">+0.7</span></div><div className="dash-cal cal-win" style={{ outline: '1px solid #888', outlineOffset: '-1px' }}>26<span className="cal-r">+2.0</span></div><div className="dash-cal cal-we">27</div><div className="dash-cal cal-we">28</div>
                    </div>
                    <div style={{ position: 'absolute', right: '6px', top: '6px', background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '7px 9px', width: '130px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', zIndex: 10 }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#111' }}>9 juin · +2.1R</div>
                      <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '4px' }}>3 trades</div>
                      <div style={{ fontSize: '8px', color: '#16a34a', fontWeight: 600, marginBottom: '2px' }}>Analyse IA</div>
                      <div style={{ fontSize: '8px', color: '#555', lineHeight: 1.5 }}>Vos shorts alignés avec le flux. Évitez le mean reversion quand le GEX est négatif.</div>
                      <div style={{ fontSize: '8px', fontWeight: 600, color: '#d97706', marginTop: '3px' }}>Discipline : 67%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="feat-tag">Dashboard IA</div>
            <div className="feat-title">Votre trading,<br />enfin visible.</div>
            <div className="feat-desc">Un tableau de bord complet pour suivre vos performances en temps réel. Cliquez sur n'importe quel jour du calendrier et obtenez une analyse IA instantanée de votre session.</div>
            <div className="feat-point"><div className="feat-chk">✓</div>KPIs en temps réel — réussite, R moyen, discipline</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Calendrier visuel vert/rouge par session</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Analyse IA au clic sur chaque journée</div>
            <div style={{ marginTop: '1.25rem', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', marginBottom: '3px' }}>Ce que vos concurrents ne voient pas</div>
              <div style={{ fontSize: '12px', color: '#444', lineHeight: 1.6 }}>MyTradePlan identifie automatiquement vos patterns — les jours où vous sur-tradez, les setups que vous évitez, les sessions où vous êtes hors plan.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 3 : Macro Briefing */}
      <section style={{ padding: '4rem 2.5rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} className="mockup-float-3">
            <div style={{ background: '#111', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Briefing Macro IA</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Généré pour votre profil · Order Flow · Futures US</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '4px 10px', fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>↺ Actualiser</div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>Fed hawkish — Contexte macro</span>
                </div>
                <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.65, paddingLeft: '12px' }}>Les minutes du FOMC de juin confirment une majorité hawkish persistante. Les attentes de baisse révisées à une seule coupe fin 2026, comprimant l'appétit pour le risque.</div>
              </div>
              <div style={{ paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>Rééquilibrage fin de trimestre</span>
                </div>
                <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.65, paddingLeft: '12px' }}>J-3 avant la clôture du Q2. Le rééquilibrage institutionnel génère des flux atypiques. Restez discipliné, évitez les mean reversions.</div>
              </div>
              <div style={{ paddingBottom: '8px', borderBottom: '0.5px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>Catalyseurs du jour</span>
                </div>
                <div style={{ fontSize: '10px', color: '#555', lineHeight: 1.65, paddingLeft: '12px' }}>PCE Core à 14h30. Toute surprise à la hausse renforcera les craintes hawkish. UMich Sentiment Final à 16h00.</div>
              </div>
              <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '9px', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Biais directionnel</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>BAISSIER · Short uniquement · Évitez les mean reversions · Liquidité réduite après 19h00</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '7px', textAlign: 'center' }}><div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', fontFamily: 'monospace' }}>BAISSIER</div><div style={{ fontSize: '8px', color: '#aaa', marginTop: '2px' }}>Biais macro</div></div>
                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '7px', textAlign: 'center' }}><div style={{ fontSize: '11px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>78%</div><div style={{ fontSize: '8px', color: '#aaa', marginTop: '2px' }}>Confiance IA</div></div>
                <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '7px', textAlign: 'center' }}><div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>2 données</div><div style={{ fontSize: '8px', color: '#aaa', marginTop: '2px' }}>Catalyseurs</div></div>
              </div>
            </div>
          </div>
          <div>
            <div className="feat-tag">Briefing Macro IA</div>
            <div className="feat-title">Le contexte macro<br />en 30 secondes.</div>
            <div className="feat-desc">Chaque matin, MyTradePlan analyse les données macro, les catalyseurs du jour et les flux institutionnels pour vous donner un biais directionnel clair et personnalisé.</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Analyse Fed, inflation, flux institutionnels</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Catalyseurs économiques du jour</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Biais directionnel avec score de confiance IA</div>
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