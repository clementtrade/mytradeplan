import AnimatedBackground from '../components/AnimatedBackground'

export default function FeaturesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif', color: '#111' }}>
      <AnimatedBackground />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .anim-1 { animation: fadeUp 0.6s ease both; }
        .anim-2 { animation: fadeUp 0.6s 0.1s ease both; }
        .anim-3 { animation: fadeUp 0.6s 0.2s ease both; }
        .anim-4 { animation: fadeUp 0.6s 0.3s ease both; }
        .float { animation: float 5s ease-in-out infinite; }
        .float-2 { animation: float 5s 0.5s ease-in-out infinite; }
        .float-3 { animation: float 5s 1s ease-in-out infinite; }
        .float-4 { animation: float 5s 1.5s ease-in-out infinite; }
        .float-5 { animation: float 5s 2s ease-in-out infinite; }
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .btn-main { background: #111; color: #fff; font-size: 0.9rem; font-weight: 500; padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: box-shadow 0.2s, transform 0.2s; display: inline-block; }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; padding: 6rem 3rem; border-bottom: 0.5px solid #f0f0f0; max-width: 1100px; margin: 0 auto; }
        .feat-section-bg { background: #f9f9f9; border-bottom: 0.5px solid #f0f0f0; }
        .feat-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; font-family: var(--font-mono); }
        .feat-h2 { font-size: 2.25rem; font-weight: 600; color: #111; letter-spacing: -1px; line-height: 1.15; margin-bottom: 1.25rem; font-family: var(--font-serif); }
        .feat-desc { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 1.5rem; }
        .feat-point { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #444; margin-bottom: 10px; }
        .feat-check { width: 22px; height: 22px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .dash-kpi { background: #111; border-radius: 8px; padding: 9px 11px; }
        .dash-kpi-l { font-size: 9px; color: #888; margin-bottom: 3px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 1.5px; }
        .dash-kpi-v { font-size: 15px; font-weight: 700; font-family: var(--font-mono); }
        .dash-cal { aspect-ratio: 1; border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; font-family: var(--font-mono); }
        .cal-win { background: #c8f0d8; color: #15803d; }
        .cal-loss { background: #fdd0d0; color: #dc2626; }
        .cal-neu { background: #f5f5f5; color: #ccc; }
        .cal-we { background: #f5f5f5; color: #ddd; opacity: 0.35; }
        .cal-r { font-size: 7px; opacity: 0.8; margin-top: 1px; font-family: var(--font-mono); }
        .adv-card { background: #f9f9f9; border: 0.5px solid #e8e8e8; border-radius: 8px; padding: 10px; overflow: hidden; }
        .macro-line { font-size: 11px; color: #555; line-height: 1.65; margin-bottom: 3px; }
        .macro-bold { font-weight: 700; color: #111; }
        .macro-blue { color: #2a78d6; }
        .macro-section { font-size: 11px; font-weight: 600; margin-bottom: 6px; font-family: var(--font-serif); }
        .macro-divider { height: 0.5px; background: #f0f0f0; margin: 10px 0; }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link" style={{ color: '#111', fontWeight: 600 }}>Fonctionnalités</a>
          <a href="/#pricing" className="nav-link">Tarifs</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/register" className="btn-main">Essayer gratuitement</a>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="anim-1" style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>Fonctionnalités</div>
        <h1 className="anim-2" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#111', letterSpacing: '-1.5px', marginBottom: '1.25rem', lineHeight: 1.1, fontFamily: 'var(--font-serif)' }}>
          Tout ce dont vous avez besoin<br />pour mieux trader
        </h1>
        <p className="anim-3" style={{ fontSize: '1.125rem', color: '#888', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Chaque fonctionnalité a été pensée pour un trader actif qui veut progresser — pas juste collecter des données.
        </p>
        <a href="/register" className="btn-main anim-4" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Commencer gratuitement</a>
      </div>

      {/* FEATURE 1 — Plan du matin */}
      <div className="feat-section">
        <div>
          <div className="feat-label">Plan du matin</div>
          <h2 className="feat-h2">L'IA vous guide.<br />Vous tradez avec un plan.</h2>
          <p className="feat-desc">Avant d'ouvrir vos graphiques, MyTradePlan pose les bonnes questions. Biais, setup, zone d'invalidation — votre plan est structuré en 5 minutes.</p>
          <div className="feat-point"><div className="feat-check">✓</div>Personnalisé à votre profil de trader</div>
          <div className="feat-point"><div className="feat-check">✓</div>Questions centrées sur le contexte du jour</div>
          <div className="feat-point"><div className="feat-check">✓</div>Résumé clair avant l'ouverture</div>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }} className="float">
          <div style={{ background: '#111', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#111' }}>M</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-serif)' }}>MyTradePlan IA</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Plan du matin · 08h14</div>
            </div>
            <div style={{ marginLeft: 'auto', background: '#22c55e', color: '#fff', fontSize: '9px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>En direct</div>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#f5f5f5', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#333', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 600, marginBottom: '3px' }}>MyTradePlan IA</div>
              Le GEX est-il positif ou négatif ce matin ?
            </div>
            <div style={{ background: '#111', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#fff', maxWidth: '78%', marginLeft: 'auto' }}>Négatif, gamma négatif.</div>
            <div style={{ background: '#f5f5f5', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#333', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 600, marginBottom: '3px' }}>MyTradePlan IA</div>
              Forme du Volume Profile — D, B ou P ?
            </div>
            <div style={{ background: '#111', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#fff', maxWidth: '78%', marginLeft: 'auto' }}>Forme B, sous le VAL.</div>
            <div style={{ background: '#f5f5f5', borderRadius: '3px 10px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#333', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 600, marginBottom: '3px' }}>MyTradePlan IA</div>
              Quel est votre risque max par trade ?
            </div>
            <div style={{ background: '#111', borderRadius: '10px 3px 10px 10px', padding: '9px 12px', fontSize: '12px', color: '#fff', maxWidth: '78%', marginLeft: 'auto' }}>1R max, sans exception.</div>
            <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 10px 10px 10px', padding: '10px 12px', fontSize: '12px', maxWidth: '92%' }}>
              <div style={{ color: '#16a34a', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }}>Plan prêt ✓</div>
              <span style={{ color: '#444' }}>Biais baissier · Short uniquement · Break & retest · Max 1R · Pas d'entrée avant 9h30 · Évitez les mean reversions.</span>
            </div>
          </div>
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#bbb' }}>Répondre ici...</span>
              <div style={{ background: '#111', borderRadius: '7px', padding: '7px 16px', fontSize: '12px', color: '#fff' }}>→</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 2 — Dashboard */}
      <div className="feat-section-bg">
        <div className="feat-section">
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }} className="float-2">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '40px', background: '#fff', borderRight: '0.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: '6px', flexShrink: 0 }}>
                <div style={{ width: '22px', height: '22px', background: '#111', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px', fontWeight: 800, marginBottom: '4px' }}>M</div>
                <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px' }}>▦</div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>☀</div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>◈</div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>▤</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: '42px', borderBottom: '0.5px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>Dashboard</span>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '9px', padding: '3px 9px', borderRadius: '4px', border: '0.5px solid #bbf7d0', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Plan prêt</span>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', marginBottom: '10px' }}>
                    <div className="dash-kpi"><div className="dash-kpi-l">Win rate</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>71%</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">Gain moy.</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>+283$</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">F. profit</div><div className="dash-kpi-v" style={{ color: '#fff' }}>2.4</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">Perte moy.</div><div className="dash-kpi-v" style={{ color: '#f87171' }}>-254$</div></div>
                  </div>
                  <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, color: '#111', marginBottom: '5px', fontFamily: 'var(--font-serif)' }}>Calendrier · Juin 2026</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '2px' }}>
                      {['L','M','M','J','V','S','D'].map((d, i) => (
                        <div key={i} style={{ textAlign: 'center', fontSize: '7px', color: i >= 5 ? '#ddd' : '#bbb', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
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
                      <div className="dash-cal cal-win">15<span className="cal-r">+220$</span></div>
                      <div className="dash-cal cal-win">16<span className="cal-r">+455$</span></div>
                      <div className="dash-cal cal-loss">17<span className="cal-r">-280$</span></div>
                      <div className="dash-cal cal-win">18<span className="cal-r">+130$</span></div>
                      <div className="dash-cal cal-win">19<span className="cal-r">+340$</span></div>
                      <div className="dash-cal cal-we">20</div>
                      <div className="dash-cal cal-we">21</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="feat-label">Dashboard IA</div>
            <h2 className="feat-h2">Votre trading,<br />enfin visible.</h2>
            <p className="feat-desc">Un tableau de bord complet pour suivre vos performances en temps réel. Importez votre CSV broker et visualisez votre PnL jour par jour. Cliquez sur n'importe quel jour pour obtenir une analyse IA instantanée.</p>
            <div className="feat-point"><div className="feat-check">✓</div>KPIs en temps réel — win rate, gain/perte moyen, profit factor</div>
            <div className="feat-point"><div className="feat-check">✓</div>Calendrier visuel PnL $ vert/rouge par session</div>
            <div className="feat-point"><div className="feat-check">✓</div>Analyse IA au clic sur chaque journée</div>
            <div style={{ marginTop: '1.5rem', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>Ce que vos concurrents ne voient pas</div>
              <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>MyTradePlan identifie automatiquement vos patterns — les jours où vous sur-tradez, les setups que vous évitez, les sessions où vous êtes hors plan.</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 3 — Stats avancées */}
      <div className="feat-section">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', border: '0.5px solid #ddd6fe', borderRadius: '20px', padding: '3px 12px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '1.5px' }}>PRO</span>
          </div>
          <div className="feat-label">Stats avancées</div>
          <h2 className="feat-h2">Allez au-delà<br />du win rate.</h2>
          <p className="feat-desc">Des indicateurs quantitatifs pour comprendre votre véritable edge — expectancy, Sharpe ratio, drawdown max, et la courbe RR vs Win rate pour savoir exactement où vous en êtes par rapport au break even.</p>
          <div className="feat-point"><div className="feat-check">✓</div>Expectancy, Sharpe ratio, Max drawdown, Streak</div>
          <div className="feat-point"><div className="feat-check">✓</div>Consistency score et distance au break even</div>
          <div className="feat-point"><div className="feat-check">✓</div>Courbe RR vs Win rate avec conseils prop firm personnalisés</div>
          <div style={{ marginTop: '1.5rem', background: '#f5f3ff', border: '0.5px solid #ddd6fe', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', marginBottom: '4px' }}>Fonctionnalité Pro</div>
            <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>Les conseils s'adaptent automatiquement à votre RR moyen et votre style de trading.</div>
          </div>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }} className="float-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>Stats avancées</span>
            <span style={{ fontSize: '10px', color: '#aaa' }}>toutes périodes</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '6px', marginBottom: '6px' }}>
            <div className="adv-card">
              <div style={{ fontSize: '9px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Expectancy</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-mono)' }}>+87$</div>
              <div style={{ fontSize: '8px', color: '#aaa', margin: '3px 0 5px', fontFamily: 'var(--font-mono)' }}>gain espéré / trade</div>
              <div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '65%', height: '100%', background: '#16a34a', borderRadius: '2px' }}></div></div>
            </div>
            <div className="adv-card">
              <div style={{ fontSize: '9px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Sharpe ratio</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>1.42</div>
              <div style={{ fontSize: '8px', color: '#aaa', margin: '3px 0 5px', fontFamily: 'var(--font-mono)' }}>rendement / risque</div>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                <div style={{ flex: 1, height: '3px', background: '#16a34a', borderRadius: '2px' }}></div>
                <div style={{ flex: 1, height: '3px', background: '#16a34a', borderRadius: '2px' }}></div>
                <div style={{ flex: 1, height: '3px', background: '#e8e8e8', borderRadius: '2px' }}></div>
                <div style={{ flex: 1, height: '3px', background: '#e8e8e8', borderRadius: '2px' }}></div>
              </div>
              <div style={{ fontSize: '8px', color: '#16a34a' }}>Bon</div>
            </div>
            <div className="adv-card">
              <div style={{ fontSize: '9px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Max drawdown</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-mono)' }}>-842$</div>
              <div style={{ fontSize: '8px', color: '#aaa', margin: '3px 0 5px', fontFamily: 'var(--font-mono)' }}>pire série de pertes</div>
              <div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '28%', height: '100%', background: '#dc2626', borderRadius: '2px' }}></div></div>
            </div>
            <div className="adv-card">
              <div style={{ fontSize: '9px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Consistency</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="32" height="32" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#e8e8e8" strokeWidth="6"/>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" strokeDasharray="138" strokeDashoffset="48" transform="rotate(-90 26 26)"/>
                </svg>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>65%</div>
                  <div style={{ fontSize: '8px', color: '#aaa', fontFamily: 'var(--font-mono)' }}>plan suivi</div>
                </div>
              </div>
            </div>
          </div>
          <div className="adv-card" style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '9px', fontWeight: 600, color: '#111', marginBottom: '6px', fontFamily: 'var(--font-serif)' }}>RR vs Win rate · Break even</div>
            <div style={{ width: '100%', overflow: 'hidden', marginBottom: '4px' }}>
              <svg viewBox="0 0 300 55" style={{ width: '100%', height: '55px', display: 'block' }} preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a78d6" stopOpacity="0.08"/>
                    <stop offset="100%" stopColor="#2a78d6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,3 C10,4 22,8 40,14 C60,21 80,28 105,36 C130,43 155,48 195,51 C225,53 260,54 300,55 L300,55 L0,55 Z" fill="url(#bg3)"/>
                <path d="M0,3 C10,4 22,8 40,14 C60,21 80,28 105,36 C130,43 155,48 195,51 C225,53 260,54 300,55" fill="none" stroke="#2a78d6" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="30" cy="20" r="4" fill="#16a34a" stroke="#fff" strokeWidth="1.5"/>
                <line x1="30" x2="30" y1="0" y2="55" stroke="#16a34a" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.4"/>
                <text x="35" y="14" fontSize="8" fill="#16a34a" fontWeight="600">71% WR</text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#bbb', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              <span>RR 1:1</span><span>RR 1:5</span><span>RR 1:10</span>
            </div>
            <div style={{ background: '#ecfeff', border: '0.5px solid #a5f3fc', borderRadius: '5px', padding: '5px 8px', fontSize: '9px', color: '#0891b2', lineHeight: 1.5 }}>
              Stratégie idéale en prop firm — risque 1% par trade en évaluation.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
            <div className="adv-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-mono)' }}>+29%</div>
              <div style={{ fontSize: '8px', color: '#aaa', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Distance BE</div>
            </div>
            <div className="adv-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-mono)' }}>+3W</div>
              <div style={{ fontSize: '8px', color: '#aaa', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Streak</div>
            </div>
            <div className="adv-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-mono)' }}>+910$</div>
              <div style={{ fontSize: '8px', color: '#aaa', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Meilleur jour</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 4 — Briefing Macro */}
      <div className="feat-section-bg">
        <div className="feat-section">
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }} className="float-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>Débrief Macro IA</div>
                <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Briefing du jour généré par IA selon ton profil</div>
              </div>
              <div style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '6px', padding: '4px 10px', fontSize: '10px', color: '#666' }}>Rafraîchir</div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Briefing Macro — Jeudi 2 juillet 2026</div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#2a78d6' }}>Contexte macro global</div>
            <div className="macro-line"><span className="macro-bold">Fed en mode attente prolongée</span> : <span className="macro-blue">Posture "higher for longer" confirmée</span>, le marché digère encore l'absence de signal clair de pivot.</div>
            <div className="macro-line"><span className="macro-bold">Marché du travail sous surveillance</span> : Données ADP surprises à la hausse, <span className="macro-blue">tension avant les NFP de demain</span>. Les desks se positionnent prudemment.</div>
            <div className="macro-line" style={{ marginBottom: '4px' }}><span className="macro-bold">Appétit pour le risque fragile</span> : <span className="macro-blue">Les flux actions restent défensifs en début de session.</span></div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#2a78d6' }}>Catalyseurs du jour</div>
            <div className="macro-line"><span className="macro-bold">Inscriptions chômage hebdomadaires</span> <span className="macro-blue">(13h30 UTC)</span> — particulièrement scrutées à 24h des NFP</div>
            <div className="macro-line"><span className="macro-bold">ISM Services juin</span> <span className="macro-blue">(15h00 UTC)</span> — indicateur clé sur la résilience économique</div>
            <div className="macro-line" style={{ marginBottom: '4px' }}><span className="macro-bold">Discours membres Fed</span> en après-midi — <span className="macro-blue">tout signal hawkish/dovish amplifié</span></div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#d97706' }}>Risques du jour</div>
            <div className="macro-line">Surprise sur les inscriptions → <span className="macro-blue">spike de volatilité brutal sur ES/NQ</span></div>
            <div className="macro-line" style={{ marginBottom: '4px' }}>Liquidité réduite fin de session → <span className="macro-blue">slippage accru, faux mouvements en order flow</span></div>
            <div className="macro-divider"></div>
            <div className="macro-section" style={{ color: '#dc2626' }}>Biais directionnel</div>
            <div className="macro-line"><span className="macro-bold">Neutre à légèrement baissier</span> — <span className="macro-blue">Favoriser les setups réactifs sur catalyseurs plutôt que les positions directionnelles tenues.</span></div>
          </div>
          <div>
            <div className="feat-label">Briefing Macro IA</div>
            <h2 className="feat-h2">Le contexte macro<br />en 30 secondes.</h2>
            <p className="feat-desc">Chaque matin, MyTradePlan analyse les données macro, les catalyseurs du jour et les flux institutionnels pour vous donner un biais directionnel clair et personnalisé.</p>
            <div className="feat-point"><div className="feat-check">✓</div>Analyse Fed, inflation, flux institutionnels</div>
            <div className="feat-point"><div className="feat-check">✓</div>Catalyseurs économiques du jour avec horaires</div>
            <div className="feat-point"><div className="feat-check">✓</div>Biais directionnel avec score de confiance IA</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ color: '#888', fontSize: '1rem', marginBottom: '2rem' }}>Commencez gratuitement, passez au Pro quand vous êtes prêt.</p>
        <a href="/register" className="btn-main" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Commencer gratuitement</a>
      </div>

      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>2026 MyTradePlan · Tous droits réservés</span>
      </footer>
      </div>
    </main>
  )
}