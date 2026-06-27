export default function FeaturesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif', color: '#111' }}>
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
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .btn-main { background: #111; color: #fff; font-size: 0.9rem; font-weight: 500; padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: box-shadow 0.2s, transform 0.2s; display: inline-block; }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; padding: 6rem 3rem; border-bottom: 0.5px solid #f0f0f0; max-width: 1100px; margin: 0 auto; }
        .feat-section-bg { background: #f9f9f9; border-bottom: 0.5px solid #f0f0f0; }
        .feat-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .feat-h2 { font-size: 2.25rem; font-weight: 700; color: #111; letter-spacing: -1px; line-height: 1.15; margin-bottom: 1.25rem; }
        .feat-desc { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 1.5rem; }
        .feat-point { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #444; margin-bottom: 10px; }
        .feat-check { width: 22px; height: 22px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .mockup-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 16px; padding: 1.5rem; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
        .dash-kpi { background: #111; border-radius: 8px; padding: 9px 11px; }
        .dash-kpi-l { font-size: 9px; color: #888; margin-bottom: 3px; }
        .dash-kpi-v { font-size: 15px; font-weight: 700; font-family: monospace; }
        .dash-badge-l { background: #dcfce7; color: #16a34a; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .dash-badge-s { background: #fee2e2; color: #dc2626; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .dash-cal { aspect-ratio: 1; border-radius: 5px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; }
        .cal-win { background: #c8f0d8; color: #15803d; }
        .cal-loss { background: #fdd0d0; color: #dc2626; }
        .cal-neu { background: #f5f5f5; color: #ccc; }
        .cal-we { background: #f5f5f5; color: #ddd; opacity: 0.35; }
        .cal-r { font-size: 7px; opacity: 0.8; margin-top: 1px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link" style={{ color: '#111', fontWeight: 600 }}>Fonctionnalités</a>
          <a href="/#pricing" className="nav-link">Tarifs</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/register" className="btn-main">Essayer gratuitement</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="anim-1" style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.25rem' }}>Fonctionnalités</div>
        <h1 className="anim-2" style={{ fontSize: '3.5rem', fontWeight: 700, color: '#111', letterSpacing: '-1.5px', marginBottom: '1.25rem', lineHeight: 1.1 }}>
          Tout ce dont vous avez besoin<br />pour mieux trader
        </h1>
        <p className="anim-3" style={{ fontSize: '1.125rem', color: '#888', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Chaque fonctionnalité a été pensée pour un trader actif qui veut progresser — pas juste collecter des données.
        </p>
        <a href="/register" className="btn-main anim-4" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Commencer gratuitement →</a>
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
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>MyTradePlan IA</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Plan du matin · 08h14</div>
            </div>
            <div style={{ marginLeft: 'auto', background: '#22c55e', color: '#fff', fontSize: '9px', fontWeight: 600, padding: '3px 10px', borderRadius: '4px' }}>En direct</div>
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
              Quel est votre risque max par trade aujourd'hui ?
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
              {/* Mini sidebar */}
              <div style={{ width: '40px', background: '#fff', borderRight: '0.5px solid #e8e8e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: '6px', flexShrink: 0 }}>
                <div style={{ width: '22px', height: '22px', background: '#111', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px', fontWeight: 800, marginBottom: '4px' }}>M</div>
                <div style={{ width: '28px', height: '28px', background: '#111', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px' }}>▦</div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>☀</div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>◈</div>
                <div style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ddd', fontSize: '11px' }}>▤</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header */}
                <div style={{ height: '42px', borderBottom: '0.5px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Dashboard</span>
                    <span style={{ fontSize: '10px', color: '#bbb' }}>27 juin 2026</span>
                  </div>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '9px', padding: '3px 9px', borderRadius: '4px', border: '0.5px solid #bbf7d0', fontWeight: 600 }}>● Plan prêt</span>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  {/* KPIs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', marginBottom: '10px' }}>
                    <div className="dash-kpi"><div className="dash-kpi-l">Réussite</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>71%</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">R moyen</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>+1.8R</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">F. profit</div><div className="dash-kpi-v" style={{ color: '#fff' }}>2.4</div></div>
                    <div className="dash-kpi"><div className="dash-kpi-l">Discipline</div><div className="dash-kpi-v" style={{ color: '#4ade80' }}>84%</div></div>
                  </div>
                  {/* Trades + Setups */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Trades récents</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-l">LONG</span><span style={{ fontSize: '9px', color: '#555' }}>B&R</span></div>
                        <span style={{ fontSize: '9px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+2.1R</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-s">SHORT</span><span style={{ fontSize: '9px', color: '#555' }}>MR</span></div>
                        <span style={{ fontSize: '9px', color: '#dc2626', fontFamily: 'monospace', fontWeight: 700 }}>-1.0R</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="dash-badge-l">LONG</span><span style={{ fontSize: '9px', color: '#555' }}>Cont.</span></div>
                        <span style={{ fontSize: '9px', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700 }}>+3.2R</span>
                      </div>
                    </div>
                    <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Par setup</div>
                      <div style={{ marginBottom: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '9px', color: '#111' }}>Break & retest</span><span style={{ fontSize: '8px', color: '#16a34a' }}>78%</span></div>
                        <div style={{ height: '4px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '78%', height: '100%', background: '#111', borderRadius: '2px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '9px', color: '#111' }}>Continuation</span><span style={{ fontSize: '8px', color: '#16a34a' }}>65%</span></div>
                        <div style={{ height: '4px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '65%', height: '100%', background: '#111', borderRadius: '2px' }}></div></div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span style={{ fontSize: '9px', color: '#111' }}>Mean reversion</span><span style={{ fontSize: '8px', color: '#dc2626' }}>35%</span></div>
                        <div style={{ height: '4px', background: '#e8e8e8', borderRadius: '2px' }}><div style={{ width: '35%', height: '100%', background: '#dc2626', borderRadius: '2px' }}></div></div>
                      </div>
                    </div>
                  </div>
                  {/* Calendrier */}
                  <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#111' }}>Calendrier · Juin 2026</span>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '8px', color: '#aaa' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '1px', background: '#c8f0d8', display: 'inline-block' }}></span>Gain</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: 6, height: 6, borderRadius: '1px', background: '#fdd0d0', display: 'inline-block' }}></span>Perte</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '2px' }}>
                      {['L','M','M','J','V','S','D'].map((d, i) => (
                        <div key={i} style={{ textAlign: 'center', fontSize: '7px', color: i >= 5 ? '#ddd' : '#bbb', fontWeight: 600 }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                      <div className="dash-cal cal-neu"></div>
                      <div className="dash-cal cal-win">2<span className="cal-r">+1.5</span></div><div className="dash-cal cal-loss">3<span className="cal-r">-1.0</span></div><div className="dash-cal cal-win">4<span className="cal-r">+0.8</span></div><div className="dash-cal cal-win">5<span className="cal-r">+2.1</span></div><div className="dash-cal cal-we">6</div><div className="dash-cal cal-we">7</div>
                      <div className="dash-cal cal-win">8<span className="cal-r">+1.3</span></div><div className="dash-cal cal-win" style={{ outline: '1.5px solid #111', outlineOffset: '-1px' }}>9<span className="cal-r">+2.1</span></div><div className="dash-cal cal-loss">10<span className="cal-r">-0.5</span></div><div className="dash-cal cal-win">11<span className="cal-r">+0.7</span></div><div className="dash-cal cal-win">12<span className="cal-r">+1.1</span></div><div className="dash-cal cal-we">13</div><div className="dash-cal cal-we">14</div>
                      <div className="dash-cal cal-neu">15</div><div className="dash-cal cal-win">16<span className="cal-r">+1.8</span></div><div className="dash-cal cal-loss">17<span className="cal-r">-1.2</span></div><div className="dash-cal cal-win">18<span className="cal-r">+0.9</span></div><div className="dash-cal cal-win">19<span className="cal-r">+2.3</span></div><div className="dash-cal cal-we">20</div><div className="dash-cal cal-we">21</div>
                      <div className="dash-cal cal-win">22<span className="cal-r">+1.5</span></div><div className="dash-cal cal-win">23<span className="cal-r">+2.3</span></div><div className="dash-cal cal-loss">24<span className="cal-r">-1.0</span></div><div className="dash-cal cal-win">25<span className="cal-r">+0.7</span></div><div className="dash-cal cal-win" style={{ outline: '1px solid #888', outlineOffset: '-1px' }}>26<span className="cal-r">+2.0</span></div><div className="dash-cal cal-we">27</div><div className="dash-cal cal-we">28</div>
                    </div>
                    {/* Mini modal IA */}
                    <div style={{ position: 'absolute', right: '6px', top: '6px', background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '8px 10px', width: '140px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10 }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#111' }}>9 juin · +2.1R</div>
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
            <div className="feat-label">Dashboard IA</div>
            <h2 className="feat-h2">Votre trading,<br />enfin visible.</h2>
            <p className="feat-desc">Un tableau de bord complet pour suivre vos performances en temps réel. Cliquez sur n'importe quel jour du calendrier et obtenez une analyse IA instantanée de votre session.</p>
            <div className="feat-point"><div className="feat-check">✓</div>KPIs en temps réel — réussite, R moyen, discipline</div>
            <div className="feat-point"><div className="feat-check">✓</div>Calendrier visuel vert/rouge par session</div>
            <div className="feat-point"><div className="feat-check">✓</div>Analyse IA au clic sur chaque journée</div>
            <div style={{ marginTop: '1.5rem', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>Ce que vos concurrents ne voient pas</div>
              <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>MyTradePlan identifie automatiquement vos patterns — les jours où vous sur-tradez, les setups que vous évitez, les sessions où vous êtes hors plan.</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 3 — Briefing Macro */}
      <div className="feat-section" style={{ borderBottom: 'none' }}>
        <div>
          <div className="feat-label">Briefing Macro IA</div>
          <h2 className="feat-h2">Le contexte macro<br />en 30 secondes.</h2>
          <p className="feat-desc">Chaque matin, MyTradePlan analyse les données macro, les catalyseurs du jour et les flux institutionnels pour vous donner un biais directionnel clair et personnalisé.</p>
          <div className="feat-point"><div className="feat-check">✓</div>Analyse Fed, inflation, flux institutionnels</div>
          <div className="feat-point"><div className="feat-check">✓</div>Catalyseurs économiques du jour avec horaires</div>
          <div className="feat-point"><div className="feat-check">✓</div>Biais directionnel avec score de confiance IA</div>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }} className="float-3">
          <div style={{ background: '#111', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Briefing Macro IA</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Généré pour votre profil · Order Flow · Futures US</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '5px 12px', fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>↺ Actualiser</div>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#dc2626', flexShrink: 0 }}></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>Fed hawkish — Contexte macro</span>
              </div>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.7, paddingLeft: '15px' }}>Les minutes du FOMC de juin confirment une majorité hawkish persistante. Les attentes de baisse révisées à une seule coupe fin 2026, comprimant l'appétit pour le risque.</div>
            </div>
            <div style={{ paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>Rééquilibrage fin de trimestre</span>
              </div>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.7, paddingLeft: '15px' }}>J-3 avant la clôture du Q2. Le rééquilibrage institutionnel génère des flux atypiques. Restez discipliné, évitez les mean reversions.</div>
            </div>
            <div style={{ paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>Catalyseurs du jour</span>
              </div>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.7, paddingLeft: '15px' }}>PCE Core à 14h30 (indicateur préféré de la Fed). Toute surprise à la hausse renforcera les craintes hawkish. UMich Sentiment Final à 16h00.</div>
            </div>
            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '10px', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Biais directionnel</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400e' }}>BAISSIER · Short uniquement · Évitez les mean reversions · Liquidité réduite après 19h00</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', fontFamily: 'monospace' }}>BAISSIER</div><div style={{ fontSize: '9px', color: '#aaa', marginTop: '3px' }}>Biais macro</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '12px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>78%</div><div style={{ fontSize: '9px', color: '#aaa', marginTop: '3px' }}>Confiance IA</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>2 données</div><div style={{ fontSize: '9px', color: '#aaa', marginTop: '3px' }}>Catalyseurs</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ color: '#888', fontSize: '1rem', marginBottom: '2rem' }}>Commencez gratuitement, passez au Pro quand vous êtes prêt.</p>
        <a href="/register" className="btn-main" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Commencer gratuitement →</a>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2026 MyTradePlan · Tous droits réservés</span>
      </footer>
    </main>
  )
}