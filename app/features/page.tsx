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
        .btn-main {
          background: #111; color: #fff; font-size: 0.9rem; font-weight: 500;
          padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s; display: inline-block;
        }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; padding: 6rem 3rem; border-bottom: 0.5px solid #f0f0f0; max-width: 1100px; margin: 0 auto; }
        .feat-section-bg { background: #f9f9f9; border-bottom: 0.5px solid #f0f0f0; }
        .feat-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .feat-h2 { font-size: 2.25rem; font-weight: 700; color: #111; letter-spacing: -1px; line-height: 1.15; margin-bottom: 1.25rem; }
        .feat-desc { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 1.5rem; }
        .feat-point { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #444; margin-bottom: 10px; }
        .feat-check { width: 22px; height: 22px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .mockup-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 16px; padding: 1.5rem; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
        .chat-ai { background: #f5f5f5; border-radius: 4px 12px 12px 12px; padding: 12px 14px; margin-bottom: 8px; font-size: 13px; color: #333; max-width: 90%; }
        .chat-user { background: #111; border-radius: 12px 4px 12px 12px; padding: 12px 14px; margin-bottom: 8px; font-size: 13px; color: #fff; max-width: 82%; margin-left: auto; }
        .chat-tag { font-size: 10px; color: #aaa; margin-bottom: 4px; font-weight: 500; }
        .chat-tag-u { font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 4px; text-align: right; }
        .trade-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 0.5px solid #f5f5f5; }
        .badge-l { background: #dcfce7; color: #16a34a; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 5px; }
        .badge-s { background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 5px; }
        .setup-row { padding: 10px 0; border-bottom: 0.5px solid #f5f5f5; }
        .setup-row:last-child { border-bottom: none; }
        .bar-bg { flex: 1; height: 6px; background: #f0f0f0; border-radius: 3px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link" style={{ color: '#111', fontWeight: 600 }}>Fonctionnalités</a>
          <a href="/#pricing" className="nav-link">Pricing</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/register" className="btn-main">Essayer gratuitement</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="anim-1" style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.25rem' }}>Fonctionnalités</div>
        <h1 className="anim-2" style={{ fontSize: '3.5rem', fontWeight: 700, color: '#111', letterSpacing: '-1.5px', marginBottom: '1.25rem', lineHeight: 1.1 }}>
          Tout ce dont tu as besoin<br />pour mieux trader
        </h1>
        <p className="anim-3" style={{ fontSize: '1.125rem', color: '#888', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Chaque fonctionnalité a été pensée pour un trader actif qui veut progresser — pas juste collecter des données.
        </p>
        <a href="/register" className="btn-main anim-4" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Commencer gratuitement →</a>
      </div>

      {/* Feature 1 — Plan du matin */}
      <div className="feat-section">
        <div>
          <div className="feat-label">Plan du matin</div>
          <h2 className="feat-h2">L'IA te guide.<br />Tu trades avec un plan.</h2>
          <p className="feat-desc">Avant d'ouvrir tes charts, MyTradePlan te pose les bonnes questions. Tu réponds, l'IA structure ton plan et te donne une synthèse claire pour la session.</p>
          <div className="feat-point"><div className="feat-check">✓</div>Personnalisé à ton marché et ta méthode</div>
          <div className="feat-point"><div className="feat-check">✓</div>Questions ciblées sur le contexte du jour</div>
          <div className="feat-point"><div className="feat-check">✓</div>Plan structuré en moins de 5 minutes</div>
        </div>
        <div className="mockup-card float">
          <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Plan du matin · Aujourd'hui</div>
          <div className="chat-ai"><div className="chat-tag">MyTradePlan IA</div>Quel est ton biais directionnel pour cette session ?</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user"><div className="chat-tag-u">Toi</div>Haussier si le marché tient ses supports.</div></div>
          <div className="chat-ai"><div className="chat-tag">MyTradePlan IA</div>Quel setup vas-tu privilégier aujourd'hui ?</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user"><div className="chat-tag-u">Toi</div>Break & retest en long.</div></div>
          <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '4px 12px 12px 12px', padding: '12px 14px', fontSize: '13px', maxWidth: '90%', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: '#16a34a', marginBottom: '4px', fontWeight: 600 }}>Plan structuré ✓</div>
            <span style={{ color: '#555' }}>Biais haussier · Break & retest · Attends la confirmation avant d'entrer.</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', borderTop: '0.5px solid #f5f5f5', paddingTop: '10px' }}>
            <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#aaa' }}>Réponds ici...</div>
            <div style={{ background: '#111', borderRadius: '8px', padding: '10px 16px', fontSize: '12px', color: '#fff' }}>→</div>
          </div>
        </div>
      </div>

      {/* Feature 2 — Journal */}
      <div className="feat-section-bg">
        <div className="feat-section">
          <div className="mockup-card float-2">
            <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Derniers trades</div>
            <div className="trade-row"><span className="badge-l">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 12px', fontSize: '13px' }}>Break & retest</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace', fontSize: '14px' }}>+2.1R</span></div>
            <div className="trade-row"><span className="badge-s">SHORT</span><span style={{ color: '#555', flex: 1, margin: '0 12px', fontSize: '13px' }}>Mean reversion</span><span style={{ color: '#dc2626', fontWeight: 700, fontFamily: 'monospace', fontSize: '14px' }}>-1.0R</span></div>
            <div className="trade-row"><span className="badge-l">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 12px', fontSize: '13px' }}>Continuation</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace', fontSize: '14px' }}>+3.2R</span></div>
            <div className="trade-row" style={{ border: 'none' }}><span className="badge-l">LONG</span><span style={{ color: '#555', flex: 1, margin: '0 12px', fontSize: '13px' }}>Break & retest</span><span style={{ color: '#16a34a', fontWeight: 700, fontFamily: 'monospace', fontSize: '14px' }}>+1.8R</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '14px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>75%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Win rate</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.9R</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>R moyen</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>88%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Discipline</div></div>
            </div>
          </div>
          <div>
            <div className="feat-label">Journal de trades</div>
            <h2 className="feat-h2">Chaque trade documenté.<br />Chaque erreur analysée.</h2>
            <p className="feat-desc">Enregistre contexte, zone, cible, confirmation et résultat en R. Identifie tes patterns et améliore ta discipline trade après trade.</p>
            <div className="feat-point"><div className="feat-check">✓</div>Résultat en R par trade</div>
            <div className="feat-point"><div className="feat-check">✓</div>Suivi du respect du plan</div>
            <div className="feat-point"><div className="feat-check">✓</div>Historique complet et détaillé</div>
          </div>
        </div>
      </div>

      {/* Feature 3 — Stats */}
      <div className="feat-section">
        <div>
          <div className="feat-label">Stats & performance</div>
          <h2 className="feat-h2">Trouve ton edge.<br />Arrête de deviner.</h2>
          <p className="feat-desc">Win rate, R moyen, profit factor — et la performance par setup pour savoir exactement quelles configurations te font gagner de l'argent.</p>
          <div className="feat-point"><div className="feat-check">✓</div>Performance par type de setup</div>
          <div className="feat-point"><div className="feat-check">✓</div>Courbe de capital en R cumulé</div>
          <div className="feat-point"><div className="feat-check">✓</div>Insight IA sur tes forces et faiblesses</div>
        </div>
        <div className="mockup-card float-3">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>71%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Win rate</div></div>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>R moyen</div></div>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace' }}>84%</div><div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>Discipline</div></div>
          </div>
          <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance par setup</div>
          {[
            { name: 'Break & retest', wr: 78, r: '+2.4R', pos: true },
            { name: 'Continuation', wr: 65, r: '+1.8R', pos: true },
            { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false },
          ].map((s, i) => (
            <div key={i} className="setup-row">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{s.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: s.pos ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{s.r} · {s.wr}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="bar-bg"><div style={{ width: `${s.wr}%`, height: '100%', background: s.pos ? '#16a34a' : '#dc2626', borderRadius: '3px' }}></div></div>
              </div>
            </div>
          ))}
          <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '10px 12px', marginTop: '12px', fontSize: '12px', color: '#92400e' }}>
            <strong>💡 Insight</strong> — Tu performes 2x mieux sur Break & retest. C'est ton edge — concentre-toi dessus.
          </div>
        </div>
      </div>

      {/* Feature 4 — Briefing Macro */}
      <div className="feat-section-bg">
        <div className="feat-section" style={{ borderBottom: 'none' }}>
          <div style={{ background: '#0A0E1A', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }} className="float-4">
            <div style={{ color: '#10B981', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1.5px', marginBottom: '14px' }}>DAILY BRIEFING MACRO · FUTURES US</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🌍 Contexte macro</div>
            <div style={{ color: 'rgba(229,231,235,0.85)', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>Fed en attente prolongée · PMI Flash aujourd'hui 15h30 · DXY stable à 104 · Earnings season en cours</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📅 Catalyseurs du jour</div>
            <div style={{ color: 'rgba(229,231,235,0.85)', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>08h45 ET — PMI Flash Manufacturing ⚡ Haute importance<br />10h00 ET — Ventes de logements neufs</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎯 Biais directionnel</div>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '0.5px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#10B981', fontSize: '13px', lineHeight: 1.6 }}>
              Haussier si PMI &gt; 50 · Surveille la réaction à 08h45 ET avant d'engager
            </div>
          </div>
          <div>
            <div style={{ background: '#111', color: '#fff', fontSize: '11px', padding: '4px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '1rem', fontWeight: 500 }}>Pro</div>
            <div className="feat-label">Briefing Macro IA</div>
            <h2 className="feat-h2">Le contexte macro.<br />Personnalisé à ton profil.</h2>
            <p className="feat-desc">Un clic chaque matin et l'IA génère un briefing macro complet basé sur ton marché — Fed, données éco, catalyseurs du jour, biais directionnel sans niveaux techniques.</p>
            <div className="feat-point"><div className="feat-check">✓</div>Adapté à ton marché (indices, forex, commodities)</div>
            <div className="feat-point"><div className="feat-check">✓</div>Catalyseurs du jour avec horaires précis</div>
            <div className="feat-point"><div className="feat-check">✓</div>Biais macro argumenté — sans niveaux techniques</div>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ color: '#888', fontSize: '1rem', marginBottom: '2rem' }}>Commence gratuitement, upgrade quand tu es prêt.</p>
        <a href="/register" className="btn-main" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>Commencer gratuitement →</a>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2025 MyTradePlan · Tous droits réservés</span>
      </footer>

    </main>
  )
}