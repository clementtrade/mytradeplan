'use client'
import { useState } from 'react'

export default function Home() {
  const [annual, setAnnual] = useState(false)
  const stripeUrl = annual ? 'https://buy.stripe.com/5kQ28t8bOg6D6Sa4HP3gk02' : 'https://buy.stripe.com/8x2aEZ3Vy4nVfoGdel3gk00'

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
        .plan-card { padding: 2rem; border-radius: 12px; transition: box-shadow 0.2s, transform 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .plan-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; max-width: 960px; margin: 0 auto; }
        .feat-tag { font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.75rem; }
        .feat-title { font-size: 1.4rem; font-weight: 700; color: #111; letter-spacing: -0.3px; margin-bottom: 0.75rem; line-height: 1.25; }
        .feat-desc { font-size: 0.875rem; color: #666; line-height: 1.7; margin-bottom: 1rem; }
        .feat-point { font-size: 0.875rem; color: #444; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
        .feat-chk { width: 16px; height: 16px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; flex-shrink: 0; }
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
        .adv-mini { background: #f9f9f9; border: 0.5px solid #e8e8e8; border-radius: 7px; padding: 8px; }
        .macro-line { font-size: 10px; color: #555; line-height: 1.6; margin-bottom: 3px; }
        .macro-bold { font-weight: 700; color: #111; }
        .macro-blue { color: #2a78d6; }
        .macro-section { font-size: 10px; font-weight: 700; margin-bottom: 5px; }
        .macro-divider { height: 0.5px; background: #e8e8e8; margin: 8px 0; }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>MyTradePlan</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/account" className="nav-link">Mon compte</a>
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
            <a href="/register" className="btn-main">Commencer gratuitement</a>
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

        <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch', padding: '2.5rem 0.5rem', minHeight: '480px' }}>
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

          <div style={{ flex: 1, background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', animation: 'floatR 5s 0.6s ease-in-out infinite', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>Stats & Performance</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>71%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Win rate</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+283$</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Gain moy/jour</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>2.4</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Profit factor</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '12px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>84%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Discipline</div></div>
            </div>
            <svg viewBox="0 0 220 65" style={{ width: '100%', height: '65px', marginBottom: '12px' }}>
              <defs><linearGradient id="gSt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a34a" stopOpacity="0.15"/><stop offset="100%" stopColor="#16a34a" stopOpacity="0"/></linearGradient></defs>
              <path d="M5,52 L30,46 L55,36 L75,40 L100,28 L120,20 L145,13 L175,7 L210,3 L210,62 L5,62 Z" fill="url(#gSt)"/>
              <path d="M5,52 L30,46 L55,36 L75,40 L100,28 L120,20 L145,13 L175,7 L210,3" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="210" cy="3" r="4" fill="#16a34a"/>
            </svg>
            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#92400e', marginTop: 'auto' }}>
              <strong>Insight IA</strong> — Votre edge est sur le Break & retest. Concentrez-vous dessus.
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
              <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 8px 8px 8px', padding: '8px 10px', fontSize: '10px', maxWidth: '92%' }}>
                <div style={{ color: '#16a34a', fontSize: '9px', fontWeight: 600, marginBottom: '3px' }}>Plan prêt ✓</div>
                <span style={{ color: '#444' }}>Biais baissier · Short uniquement · Break & retest · Max 1R.</span>
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
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>Dashboard</span>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '8px', padding: '2px 7px', borderRadius: '4px', border: '0.5px solid #bbf7d0', fontWeight: 500 }}>Plan prêt</span>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '5px', marginBottom: '8px' }}>
                    <div className="dash-kpi"><div className="dash-kpi-l">Win rate</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>71%</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">Gain moy.</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>+283$</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">F. profit</div><div className="dash-kpi-v" style={{ color: '#fff' }}>2.4</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">Perte moy.</div><div className="dash-kpi-v" style={{ color: '#f87171' }}>-254$</div></div>
                  </div>
                  <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '7px', padding: '7px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: '#111', marginBottom: '5px' }}>Calendrier · Juin 2026</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1px', marginBottom: '1px' }}>
                      {['L','M','M','J','V','S','D'].map((d, i) => <div key={i} style={{ textAlign: 'center', fontSize: '6px', color: i >= 5 ? '#ddd' : '#bbb', fontWeight: 600 }}>{d}</div>)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1px' }}>
                      <div className="dash-cal cal-neu"></div>
                      <div className="dash-cal cal-win">2<span className="cal-r">+595$</span></div>
                      <div className="dash-cal cal-loss">3<span className="cal-r">-336$</span></div>
                      <div className="dash-cal cal-win">4<span className="cal-r">+260$</span></div>
                      <div className="dash-cal cal-win">5<span className="cal-r">+44$</span></div>
                      <div className="dash-cal cal-we">6</div>
                      <div className="dash-cal cal-we">7</div>
                      <div className="dash-cal cal-win">8<span className="cal-r">+333$</span></div>
                      <div className="dash-cal cal-win">9<span className="cal-r">+188$</span></div>
                      <div className="dash-cal cal-neu">10</div>
                      <div className="dash-cal cal-loss">11<span className="cal-r">-173$</span></div>
                      <div className="dash-cal cal-win">12<span className="cal-r">+910$</span></div>
                      <div className="dash-cal cal-we">13</div>
                      <div className="dash-cal cal-we">14</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="feat-tag">Dashboard IA</div>
            <div className="feat-title">Votre trading,<br />enfin visible.</div>
            <div className="feat-desc">Importez votre CSV broker et visualisez votre PnL jour par jour. Cliquez sur n'importe quel jour pour obtenir une analyse IA instantanée de votre session.</div>
            <div className="feat-point"><div className="feat-chk">✓</div>KPIs en temps réel — win rate, gain/perte moyen, profit factor</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Calendrier visuel PnL $ vert/rouge par session</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Analyse IA au clic sur chaque journée</div>
          </div>
        </div>
      </section>

      {/* FEATURE 3 : Stats avancées */}
      <section style={{ padding: '4rem 2.5rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', border: '0.5px solid #ddd6fe', borderRadius: '20px', padding: '3px 10px', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 600 }}>PRO</span>
            </div>
            <div className="feat-tag" style={{ marginTop: '4px' }}>Stats avancées</div>
            <div className="feat-title">Allez au-delà<br />du win rate.</div>
            <div className="feat-desc">Des indicateurs quantitatifs pour comprendre votre véritable edge — expectancy, Sharpe ratio, drawdown max, et la courbe RR vs Win rate pour savoir exactement où vous en êtes par rapport au break even.</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Expectancy, Sharpe ratio, Max drawdown, Streak</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Consistency score et distance au break even</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Courbe RR vs Win rate avec conseils prop firm personnalisés</div>
            <div style={{ marginTop: '1rem', background: '#f5f3ff', border: '0.5px solid #ddd6fe', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#7c3aed', marginBottom: '4px' }}>Fonctionnalité Pro</div>
              <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>Les conseils s'adaptent automatiquement à votre RR moyen et votre style de trading.</div>
            </div>
          </div>
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }} className="mockup-float-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#111' }}>Stats avancées</span>
              <span style={{ fontSize: '9px', color: '#aaa' }}>toutes périodes</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '5px', marginBottom: '5px' }}>
              <div className="adv-mini">
                <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '2px' }}>Expectancy</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+87$</div>
                <div style={{ fontSize: '7px', color: '#aaa', margin: '2px 0 4px' }}>gain espéré / trade</div>
                <div style={{ height: '2px', background: '#e8e8e8', borderRadius: '1px' }}><div style={{ width: '65%', height: '100%', background: '#16a34a', borderRadius: '1px' }}></div></div>
              </div>
              <div className="adv-mini">
                <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '2px' }}>Sharpe ratio</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>1.42</div>
                <div style={{ fontSize: '7px', color: '#aaa', margin: '2px 0 4px' }}>rendement / risque</div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{ flex: 1, height: '2px', background: '#16a34a', borderRadius: '1px' }}></div>
                  <div style={{ flex: 1, height: '2px', background: '#16a34a', borderRadius: '1px' }}></div>
                  <div style={{ flex: 1, height: '2px', background: '#e8e8e8', borderRadius: '1px' }}></div>
                  <div style={{ flex: 1, height: '2px', background: '#e8e8e8', borderRadius: '1px' }}></div>
                </div>
                <div style={{ fontSize: '7px', color: '#16a34a', marginTop: '2px' }}>Bon</div>
              </div>
              <div className="adv-mini">
                <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '2px' }}>Max drawdown</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', fontFamily: 'monospace' }}>-842$</div>
                <div style={{ fontSize: '7px', color: '#aaa', margin: '2px 0 4px' }}>pire série</div>
                <div style={{ height: '2px', background: '#e8e8e8', borderRadius: '1px' }}><div style={{ width: '28%', height: '100%', background: '#dc2626', borderRadius: '1px' }}></div></div>
              </div>
              <div className="adv-mini">
                <div style={{ fontSize: '8px', color: '#aaa', marginBottom: '2px' }}>Consistency</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="28" height="28" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="#e8e8e8" strokeWidth="6"/>
                    <circle cx="26" cy="26" r="22" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" strokeDasharray="138" strokeDashoffset="48" transform="rotate(-90 26 26)"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>65%</div>
                    <div style={{ fontSize: '7px', color: '#aaa' }}>plan suivi</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="adv-mini" style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '8px', fontWeight: 600, color: '#111', marginBottom: '5px' }}>RR vs Win rate · Break even</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '44px', gap: '1px', marginBottom: '4px' }}>
                <svg viewBox="0 0 140 40" style={{ width: '100%', height: '44px' }} preserveAspectRatio="none">
                  <defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a78d6" stopOpacity="0.1"/><stop offset="100%" stopColor="#2a78d6" stopOpacity="0"/></linearGradient></defs>
                  <path d="M0,2 C5,3 12,5 22,9 C35,14 48,20 62,26 C78,32 95,36 120,38 C130,39 136,39 140,40 L140,40 L0,40 Z" fill="url(#bg2)"/>
                  <path d="M0,2 C5,3 12,5 22,9 C35,14 48,20 62,26 C78,32 95,36 120,38 C130,39 136,39 140,40" fill="none" stroke="#2a78d6" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="16" cy="15" r="3" fill="#16a34a" stroke="#fff" strokeWidth="1.2"/>
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#bbb', marginBottom: '4px' }}>
                <span>RR 1:1</span><span>RR 1:5</span><span>RR 1:10</span>
              </div>
              <div style={{ background: '#ecfeff', border: '0.5px solid #a5f3fc', borderRadius: '4px', padding: '4px 6px', fontSize: '8px', color: '#0891b2', lineHeight: 1.4 }}>
                Stratégie idéale en prop firm — risque 1% par trade en évaluation.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '5px' }}>
              <div className="adv-mini" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+29%</div>
                <div style={{ fontSize: '7px', color: '#aaa', marginTop: '2px' }}>Distance BE</div>
              </div>
              <div className="adv-mini" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+3W</div>
                <div style={{ fontSize: '7px', color: '#aaa', marginTop: '2px' }}>Streak</div>
              </div>
              <div className="adv-mini" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+910$</div>
                <div style={{ fontSize: '7px', color: '#aaa', marginTop: '2px' }}>Meilleur jour</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 4 : Briefing Macro IA */}
      <section style={{ padding: '4rem 2.5rem', background: '#f9f9f9', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }} className="mockup-float-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#111' }}>Débrief Macro IA</div>
                <div style={{ fontSize: '9px', color: '#aaa', marginTop: '1px' }}>Briefing du jour généré par IA selon ton profil</div>
              </div>
              <div style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '5px', padding: '3px 8px', fontSize: '9px', color: '#666' }}>Rafraîchir</div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Briefing Macro — Jeudi 2 juillet 2026</div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#2a78d6' }}>Contexte macro global</div>
            <div className="macro-line"><span className="macro-bold">Fed en mode attente prolongée</span> : <span className="macro-blue">Posture "higher for longer" confirmée</span>, le marché digère l'absence de signal clair de pivot.</div>
            <div className="macro-line"><span className="macro-bold">Marché du travail sous surveillance</span> : Données ADP surprises à la hausse, <span className="macro-blue">tension avant les NFP de demain</span>.</div>
            <div className="macro-line" style={{ marginBottom: '6px' }}><span className="macro-bold">Appétit pour le risque fragile</span> : <span className="macro-blue">Flux actions restent défensifs en début de session.</span></div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#2a78d6' }}>Catalyseurs du jour</div>
            <div className="macro-line"><span className="macro-bold">Inscriptions chômage</span> <span className="macro-blue">(13h30 UTC)</span> — scrutées à 24h des NFP</div>
            <div className="macro-line"><span className="macro-bold">ISM Services juin</span> <span className="macro-blue">(15h00 UTC)</span> — indicateur clé résilience éco.</div>
            <div className="macro-line" style={{ marginBottom: '6px' }}><span className="macro-bold">Discours Fed</span> en après-midi — <span className="macro-blue">tout signal hawkish/dovish amplifié</span></div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#d97706' }}>Risques du jour</div>
            <div className="macro-line">Surprise chômage → <span className="macro-blue">spike de volatilité sur ES/NQ</span></div>
            <div className="macro-line" style={{ marginBottom: '6px' }}>Liquidité réduite fin de session → <span className="macro-blue">slippage accru, faux mouvements order flow</span></div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#dc2626' }}>Biais directionnel</div>
            <div className="macro-line"><span className="macro-bold">Neutre à légèrement baissier</span> — <span className="macro-blue">Favoriser les setups réactifs sur catalyseurs plutôt que les positions directionnelles tenues.</span></div>
          </div>
          <div>
            <div className="feat-tag">Briefing Macro IA</div>
            <div className="feat-title">Le contexte macro<br />en 30 secondes.</div>
            <div className="feat-desc">Chaque matin, MyTradePlan analyse les données macro, les catalyseurs du jour et les flux institutionnels pour vous donner un biais directionnel clair et personnalisé.</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Analyse Fed, inflation, flux institutionnels</div>
            <div className="feat-point"><div className="feat-chk">✓</div>Catalyseurs économiques du jour avec horaires</div>
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
          <button className={`toggle-btn${annual ? ' on' : ''}`} onClick={() => setAnnual(!annual)}><div className="toggle-knob"></div></button>
          <span className={`toggle-label${annual ? ' active' : ''}`}>Annuel</span>
          {annual && <span className="save-badge">Économisez 60€/an</span>}
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
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>Le plus populaire</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Pro</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1rem' }}>Pour le trader sérieux</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{annual ? '14,99€' : '19,99€'}</div>
              <div style={{ fontSize: '1rem', color: '#888', marginBottom: '2px' }}>/mois</div>
            </div>
            {annual ? (
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginBottom: '4px' }}>179,99€/an · économisez 60€</div>
            ) : (
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>ou 14,99€/mois facturé annuellement</div>
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
            <a href={stripeUrl} style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: '#111', color: '#fff', borderRadius: '8px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Essayer gratuitement 7 jours</a>
          </div>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '12px', color: '#aaa' }}>Sans carte bancaire · Résiliez à tout moment</div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '2rem' }}>Rejoignez les traders qui progressent chaque jour.</p>
        <a href="/register" className="btn-main">Commencer gratuitement</a>
      </section>

      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>2026 MyTradePlan · Tous droits réservés</span>
      </footer>
    </main>
  )
}