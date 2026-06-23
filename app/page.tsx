export default function Home() {
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
        .btn-main {
          background: #111; color: #fff; font-size: 0.9rem; font-weight: 500;
          padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s; display: inline-block;
        }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .btn-sec {
          background: transparent; color: #111; font-size: 0.9rem;
          padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none;
          border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s, transform 0.2s; display: inline-block;
        }
        .btn-sec:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.1); transform: translateY(-1px); }
        .feature-card {
          padding: 1.5rem; border: 0.5px solid #e8e8e8; border-radius: 10px;
          background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s, transform 0.2s; cursor: default;
        }
        .feature-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .nav-link { font-size: 0.875rem; color: #666; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .plan-card { padding: 2rem; border-radius: 10px; transition: box-shadow 0.2s, transform 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .plan-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .mockup-float { animation: float 4s ease-in-out infinite; }
        .mockup-float-2 { animation: float 4s 0.5s ease-in-out infinite; }
        .mockup-float-3 { animation: float 4s 1s ease-in-out infinite; }
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
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>MyTradePlan</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="/features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/register" className="btn-main" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}>Essayer gratuitement</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '6rem 2rem 4rem', textAlign: 'center' }}>
        <div className="anim-1" style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Journal de trading IA · Tous marchés</div>
        <h1 className="anim-2" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '1.5rem' }}>
          Trade avec un plan,<br />performe avec des données.
        </h1>
        <p className="anim-3" style={{ fontSize: '1.125rem', color: '#555', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          MyTradePlan te guide chaque matin avec un plan pré-marché IA personnalisé, et analyse tes trades pour identifier ton edge réel.
        </p>
        <div className="anim-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <a href="/register" className="btn-main">Commencer gratuitement</a>
          <a href="/features" className="btn-sec">Voir comment ça marche</a>
        </div>
        <div className="anim-5" style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {["L'IA prépare ton plan, toi tu trades", "Trouve ton vrai edge", "Transforme tes erreurs en edge"].map((b, i) => (
            <div key={i} style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#444', fontWeight: 500 }}>{b}</div>
          ))}
        </div>
      </section>

      {/* Features 4 cards */}
      <section id="features" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.5px' }}>Tout ce qu'il faut pour mieux trader</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
          {[
            { title: 'Plan pré-marché IA', desc: 'Chaque matin, un plan personnalisé basé sur ton profil de trader et les conditions du marché.' },
            { title: 'Journal de trades', desc: 'Enregistre chaque trade avec contexte, zone, cible, confirmation et résultat en R.' },
            { title: 'Stats & performance', desc: 'Win rate, R moyen, meilleurs setups — visualise ton edge et progresse.' },
            { title: 'Discipline tracker', desc: "Mesure ton respect du plan trade après trade. La discipline, c'est le vrai edge." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', color: '#111' }}>{f.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ background: '#f9f9f9', padding: '4rem 2rem', borderTop: '0.5px solid #f0f0f0', borderBottom: '0.5px solid #f0f0f0' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', textAlign: 'center', marginBottom: '0.5rem' }}>Processus</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Comment ça marche</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', textAlign: 'center', marginBottom: '2.5rem' }}>3 étapes pour trader avec méthode</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '760px', margin: '0 auto' }}>
          {[
            { n: '1', title: 'Crée ton profil', desc: "Ton marché, ta méthode, tes problèmes récurrents. L'IA mémorise tout et s'adapte à toi." },
            { n: '2', title: 'Prépare ta session', desc: "L'IA te pose les bonnes questions chaque matin. Ton plan est structuré en moins de 5 minutes." },
            { n: '3', title: 'Analyse & progresse', desc: "Journal + stats + insights IA pour identifier ton vrai edge et progresser trade après trade." },
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

      {/* Feature — Plan du matin */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Plan du matin</div>
            <div className="feat-title">L'IA te guide.<br />Tu trades avec un plan.</div>
            <div className="feat-desc">Avant d'ouvrir tes charts, MyTradePlan te pose les bonnes questions. Biais, setup, zone d'invalidation — ton plan est structuré en 5 minutes.</div>
            <div className="feat-point">✓ Personnalisé à ton profil de trader</div>
            <div className="feat-point">✓ Questions ciblées sur le contexte du jour</div>
            <div className="feat-point">✓ Synthèse claire avant l'ouverture</div>
          </div>
          <div className="mockup-card mockup-float">
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', paddingBottom: '6px', borderBottom: '0.5px solid #f0f0f0', fontWeight: 500 }}>Plan du matin · Aujourd'hui</div>
            <div className="chat-ai"><div className="chat-tag">MyTradePlan IA</div>Quel est ton biais directionnel pour cette session ?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user"><div className="chat-tag-u">Toi</div>Haussier si le marché tient ses supports.</div></div>
            <div className="chat-ai"><div className="chat-tag">MyTradePlan IA</div>Quel setup vas-tu privilégier aujourd'hui ?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><div className="chat-user"><div className="chat-tag-u">Toi</div>Break & retest en long.</div></div>
            <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '3px 8px 8px 8px', padding: '8px 10px', fontSize: '11px', maxWidth: '88%' }}>
              <div style={{ fontSize: '9px', color: '#16a34a', marginBottom: '2px', fontWeight: 600 }}>Plan structuré ✓</div>
              <span style={{ color: '#555' }}>Biais haussier · Break & retest · Attends la confirmation avant d'entrer.</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '0.5px solid #f5f5f5', paddingTop: '7px' }}>
              <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '5px', padding: '6px 8px', fontSize: '11px', color: '#aaa' }}>Réponds ici...</div>
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
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>75%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Win rate</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.9R</div><div style={{ fontSize: '10px', color: '#aaa' }}>R moyen</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>88%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Discipline</div></div>
            </div>
          </div>
          <div>
            <div className="feat-tag">Journal de trades</div>
            <div className="feat-title">Chaque trade documenté.<br />Chaque erreur analysée.</div>
            <div className="feat-desc">Enregistre contexte, zone, cible, confirmation et résultat en R. Identifie tes patterns et améliore ta discipline trade après trade.</div>
            <div className="feat-point">✓ Résultat en R par trade</div>
            <div className="feat-point">✓ Suivi du respect du plan</div>
            <div className="feat-point">✓ Historique complet et détaillé</div>
          </div>
        </div>
      </section>

      {/* Feature — Stats */}
      <section style={{ padding: '4rem 2rem', borderBottom: '0.5px solid #f0f0f0' }}>
        <div className="feat-section">
          <div>
            <div className="feat-tag">Stats & performance</div>
            <div className="feat-title">Trouve ton edge.<br />Arrête de deviner.</div>
            <div className="feat-desc">Win rate, R moyen, profit factor — et la performance par setup pour savoir exactement quelles configurations te font gagner de l'argent.</div>
            <div className="feat-point">✓ Performance par type de setup</div>
            <div className="feat-point">✓ Courbe de capital en R cumulé</div>
            <div className="feat-point">✓ Insight IA sur tes forces et faiblesses</div>
          </div>
          <div className="mockup-card mockup-float-3">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>71%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Win rate</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, color: '#16a34a', fontFamily: 'monospace' }}>+1.8R</div><div style={{ fontSize: '10px', color: '#aaa' }}>R moyen</div></div>
              <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px', textAlign: 'center' }}><div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}>84%</div><div style={{ fontSize: '10px', color: '#aaa' }}>Discipline</div></div>
            </div>
            <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance par setup</div>
            {[
              { name: 'Break & retest', wr: 78, r: '+2.4R', pos: true },
              { name: 'Continuation', wr: 65, r: '+1.8R', pos: true },
              { name: 'Mean reversion', wr: 35, r: '-0.4R', pos: false },
            ].map((s, i) => (
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
              <strong>💡 Insight</strong> — Tu performes 2x mieux sur Break & retest. C'est ton edge.
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Un tarif simple et transparent</h2>
        <p style={{ color: '#666', marginBottom: '3rem' }}>Commence gratuitement, upgrade quand tu es prêt.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>

          {/* Gratuit */}
          <div className="plan-card" style={{ border: '0.5px solid #e8e8e8' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Gratuit</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>0€</div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: '#555', lineHeight: 2 }}>
              <li>✓ 5 trades / mois</li>
              <li>✓ Plan pré-marché basique</li>
              <li>✓ Stats essentielles</li>
            </ul>
            <a href="/register" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.875rem', textDecoration: 'none', color: '#111' }}>Commencer</a>
          </div>

          {/* Starter */}
          <div className="plan-card" style={{ border: '0.5px solid #e8e8e8' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Starter</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>10€<span style={{ fontSize: '1rem', fontWeight: 400, color: '#888' }}>/mois</span></div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: '#555', lineHeight: 2 }}>
              <li>✓ 10 trades / mois</li>
              <li>✓ Plan IA complet chaque matin</li>
              <li>✓ Stats avancées & patterns</li>
              <li>✓ Discipline tracker</li>
            </ul>
            <a href="/register" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.875rem', textDecoration: 'none', color: '#111' }}>Choisir Starter</a>
          </div>

          {/* Pro */}
          <div className="plan-card" style={{ border: '2px solid #111' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>Pro <span style={{ background: '#111', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', marginLeft: '6px' }}>Populaire</span></div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>29€<span style={{ fontSize: '1rem', fontWeight: 400, color: '#888' }}>/mois</span></div>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: '#555', lineHeight: 2 }}>
              <li>✓ Trades illimités</li>
              <li>✓ Plan IA complet chaque matin</li>
              <li>✓ Stats avancées & patterns</li>
              <li>✓ Discipline tracker</li>
              <li>✓ Briefing Macro IA</li>
            </ul>
            <a href="/register" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', padding: '0.75rem', background: '#111', color: '#fff', borderRadius: '6px', fontSize: '0.875rem', textDecoration: 'none' }}>Essayer gratuitement</a>
          </div>

        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: '#f9f9f9', borderTop: '0.5px solid #e8e8e8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.75rem' }}>Prêt à trader avec un plan ?</h2>
        <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '2rem' }}>Rejoins des traders qui progressent chaque jour.</p>
        <a href="/register" className="btn-main">Commencer gratuitement →</a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>MyTradePlan</span>
        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2025 MyTradePlan · Tous droits réservés</span>
      </footer>

    </main>
  )
}