export default function FeaturesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif', color: '#111' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .anim-1 { animation: fadeUp 0.6s ease both; }
        .anim-2 { animation: fadeUp 0.6s 0.1s ease both; }
        .anim-3 { animation: fadeUp 0.6s 0.2s ease both; }
        .float { animation: float 4s ease-in-out infinite; }
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .btn-main {
          background: #111; color: #fff; font-size: 0.875rem; font-weight: 500;
          padding: 0.65rem 1.5rem; border-radius: 6px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s; display: inline-block;
        }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .feat-section { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 4rem 2rem; border-bottom: 0.5px solid #f0f0f0; max-width: 960px; margin: 0 auto; }
        .feat-tag { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #888; background: #f5f5f5; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 1rem; }
        .feat-tag-pro { background: #111; color: #fff; }
        .feat-title { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.5px; margin-bottom: 0.75rem; line-height: 1.25; }
        .feat-desc { font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 1.25rem; }
        .feat-point { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #444; margin-bottom: 6px; }
        .feat-point::before { content: '✓'; color: #111; font-weight: 700; flex-shrink: 0; }
        .mockup { border-radius: 12px; padding: 1.25rem; }
        .msg-ai { background: #f5f5f5; border-radius: 4px 10px 10px 10px; padding: 8px 12px; margin-bottom: 6px; font-size: 11px; color: #333; max-width: 90%; }
        .msg-user { background: #111; border-radius: 10px 4px 10px 10px; padding: 8px 12px; margin-bottom: 6px; font-size: 11px; color: #fff; max-width: 85%; margin-left: auto; }
        .msg-tag { font-size: 9px; font-weight: 600; color: #aaa; margin-bottom: 3px; }
        .msg-tag-user { font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 3px; text-align: right; }
        .trade-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 0.5px solid #f5f5f5; font-size: 12px; }
        .badge { font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }
        .bar-wrap { display: flex; align-items: center; gap: 8px; }
        .bar-bg { flex: 1; height: 5px; background: #f0f0f0; border-radius: 3px; }
        .bar-fill { height: 100%; border-radius: 3px; }
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
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="anim-1" style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Fonctionnalités</div>
        <h1 className="anim-2" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111', letterSpacing: '-1px', marginBottom: '1rem', lineHeight: 1.15 }}>
          Tout ce dont tu as besoin<br />pour trader mieux
        </h1>
        <p className="anim-3" style={{ fontSize: '1rem', color: '#888', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Chaque fonctionnalité a été pensée pour un trader actif qui veut progresser — pas juste collecter des données.
        </p>
      </div>

      {/* Feature 1 — Plan du matin */}
      <div className="feat-section">
        <div>
          <div className="feat-tag">Plan du matin</div>
          <div className="feat-title">L'IA te guide.<br />Tu trades avec un plan.</div>
          <div className="feat-desc">Avant d'ouvrir tes charts, MyTradePlan te pose les bonnes questions. Tu réponds, l'IA structure ton plan et te donne un biais clair pour la session.</div>
          <div className="feat-point">Personnalisé à ton marché et ta méthode</div>
          <div className="feat-point">Questions ciblées sur le contexte du jour</div>
          <div className="feat-point">Plan structuré en moins de 5 minutes</div>
        </div>
        <div className="float mockup" style={{ background: '#fff', border: '0.5px solid #e8e8e8', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '10px', fontWeight: 600, borderBottom: '0.5px solid #f0f0f0', paddingBottom: '8px' }}>Plan du matin · Aujourd'hui</div>
          <div className="msg-ai">
            <div className="msg-tag">MyTradePlan IA</div>
            Bonjour ! Quel est ton biais directionnel pour cette session ?
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className="msg-user">
              <div className="msg-tag-user">Toi</div>
              Plutôt haussier si le marché tient ses supports.
            </div>
          </div>
          <div className="msg-ai">
            <div className="msg-tag">MyTradePlan IA</div>
            Quel setup vas-tu privilégier ? Break & retest, continuation, mean reversion ?
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className="msg-user">
              <div className="msg-tag-user">Toi</div>
              Break and retest en long.
            </div>
          </div>
          <div className="msg-ai" style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0' }}>
            <div className="msg-tag" style={{ color: '#16a34a' }}>MyTradePlan IA · Synthèse</div>
            <strong style={{ color: '#16a34a' }}>Plan structuré ✓</strong><br />
            <span style={{ color: '#555', fontSize: '11px' }}>Biais haussier · Break & retest long · Attends la confirmation avant d'entrer.</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '0.5px solid #f0f0f0', paddingTop: '8px' }}>
            <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '6px', padding: '7px 10px', fontSize: '11px', color: '#aaa' }}>Réponds ici...</div>
            <div style={{ background: '#111', borderRadius: '6px', padding: '7px 12px', fontSize: '11px', color: '#fff' }}>→</div>
          </div>
        </div>
      </div>

      {/* Feature 2 — Journal */}
      <div className="feat-section" style={{ direction: 'rtl' as const }}>
        <div style={{ direction: 'ltr' as const }}>
          <div className="feat-tag">Journal de trades</div>
          <div className="feat-title">Chaque trade documenté.<br />Chaque erreur analysée.</div>
          <div className="feat-desc">Enregistre contexte, zone, cible, confirmation et résultat en R. Identifie tes patterns et améliore ta discipline trade après trade.</div>
          <div className="feat-point">Résultat en R par trade</div>
          <div className="feat-point">Suivi du respect du plan</div>
          <div className="feat-point">Historique complet et détaillé</div>
        </div>
        <div className="float mockup" style={{ background: '#fff', border: '0.5px solid #e8e8e8', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', direction: 'ltr' as const }}>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '10px', fontWeight: 600 }}>Derniers trades</div>
          <div className="trade-row">
            <span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>LONG</span>
            <span style={{ color: '#555', flex: 1, margin: '0 10px' }}>Break & retest</span>
            <span style={{ fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+2.1R</span>
          </div>
          <div className="trade-row">
            <span className="badge" style={{ background: '#fee2e2', color: '#dc2626' }}>SHORT</span>
            <span style={{ color: '#555', flex: 1, margin: '0 10px' }}>Mean reversion</span>
            <span style={{ fontWeight: 700, color: '#dc2626', fontFamily: 'monospace' }}>-1.0R</span>
          </div>
          <div className="trade-row">
            <span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>LONG</span>
            <span style={{ color: '#555', flex: 1, margin: '0 10px' }}>Continuation</span>
            <span style={{ fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+3.2R</span>
          </div>
          <div className="trade-row" style={{ border: 'none' }}>
            <span className="badge" style={{ background: '#dcfce7', color: '#16a34a' }}>LONG</span>
            <span style={{ color: '#555', flex: 1, margin: '0 10px' }}>Break & retest</span>
            <span style={{ fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</span>
          </div>
          <div style={{ marginTop: '10px', background: '#f9f9f9', borderRadius: '8px', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#aaa' }}>Win rate</div><div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>75%</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#aaa' }}>R moyen</div><div style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.9R</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '9px', color: '#aaa' }}>Discipline</div><div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace' }}>88%</div></div>
          </div>
        </div>
      </div>

      {/* Feature 3 — Stats */}
      <div className="feat-section">
        <div>
          <div className="feat-tag">Stats & performance</div>
          <div className="feat-title">Visualise ton edge.<br />Identifie tes patterns.</div>
          <div className="feat-desc">Win rate, R moyen, profit factor, courbe de capital — et surtout, la performance détaillée par type de setup pour savoir où est ton vrai edge.</div>
          <div className="feat-point">Performance par setup (Break & retest, Continuation...)</div>
          <div className="feat-point">Courbe de capital en R cumulé</div>
          <div className="feat-point">Insight IA sur tes forces et faiblesses</div>
        </div>
        <div className="float mockup" style={{ background: '#fff', border: '0.5px solid #e8e8e8', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '14px' }}>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#aaa' }}>Win rate</div>
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace' }}>71%</div>
            </div>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#aaa' }}>R moyen</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</div>
            </div>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#aaa' }}>Discipline</div>
              <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'monospace' }}>84%</div>
            </div>
          </div>
          <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance par setup</div>
          {[
            { name: 'Break & retest', wr: 78, r: '+2.4R', pos: true },
            { name: 'Continuation', wr: 65, r: '+1.8R', pos: true },
            { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false },
          ].map(s => (
            <div key={s.name} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#111' }}>{s.name}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: s.pos ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{s.r}</span>
              </div>
              <div className="bar-wrap">
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${s.wr}%`, background: s.pos ? '#16a34a' : '#dc2626' }}></div></div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: s.pos ? '#16a34a' : '#dc2626', width: '28px', textAlign: 'right' }}>{s.wr}%</span>
              </div>
            </div>
          ))}
          <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '6px', padding: '8px 10px', marginTop: '8px' }}>
            <div style={{ fontSize: '9px', fontWeight: 600, color: '#d97706', marginBottom: '2px' }}>💡 INSIGHT</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Tu performes 2x mieux sur Break & retest. C'est ton edge.</div>
          </div>
        </div>
      </div>

      {/* Feature 4 — Briefing Macro */}
      <div className="feat-section" style={{ direction: 'rtl' as const, borderBottom: 'none' }}>
        <div style={{ direction: 'ltr' as const }}>
          <div className={`feat-tag feat-tag-pro`}>Pro</div>
          <div className="feat-title">Briefing Macro IA.<br />Personnalisé à ton profil.</div>
          <div className="feat-desc">Un clic chaque matin et l'IA génère un briefing macro complet basé sur ton marché — Fed, données éco, catalyseurs du jour, biais directionnel macro.</div>
          <div className="feat-point">Adapté à ton marché (indices, forex, commodities)</div>
          <div className="feat-point">Catalyseurs du jour avec horaires précis</div>
          <div className="feat-point">Biais macro argumenté — sans niveaux techniques</div>
        </div>
        <div className="float mockup" style={{ background: '#0A0E1A', direction: 'ltr' as const }}>
          <div style={{ color: '#10B981', fontSize: '9px', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '10px' }}>DAILY BRIEFING MACRO · FUTURES US</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🌍 Contexte macro</div>
          <div style={{ color: 'rgba(229,231,235,0.8)', fontSize: '11px', lineHeight: 1.6, marginBottom: '12px' }}>Fed en attente prolongée · PMI Flash aujourd'hui · DXY stable à 104</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📅 Catalyseurs du jour</div>
          <div style={{ color: 'rgba(229,231,235,0.8)', fontSize: '11px', lineHeight: 1.6, marginBottom: '12px' }}>08h45 ET — PMI Flash Manufacturing ⚡ Haute importance<br />10h00 ET — Ventes de logements neufs</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎯 Biais directionnel</div>
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '0.5px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '8px 10px', color: '#10B981', fontSize: '11px', lineHeight: 1.5 }}>
            Haussier si PMI &gt; 50 · Surveille la réaction à 08h45 ET avant d'engager
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '2rem' }}>Commence gratuitement, upgrade quand tu es prêt.</p>
        <a href="/register" className="btn-main">Commencer gratuitement →</a>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
        © 2025 MyTradePlan · Tous droits réservés
      </footer>

    </main>
  )
}