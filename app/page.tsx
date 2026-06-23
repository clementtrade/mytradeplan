export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: '#111', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.7s ease both; }
        .anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .anim-4 { animation: fadeUp 0.7s 0.45s ease both; }
        .btn-main { 
          background: #111; color: #fff; font-size: 0.9rem; font-weight: 500;
          padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s;
          display: inline-block;
        }
        .btn-main:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.25); transform: translateY(-1px); }
        .btn-sec {
          background: transparent; color: #111; font-size: 0.9rem;
          padding: 0.75rem 1.75rem; border-radius: 6px; text-decoration: none;
          border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: box-shadow 0.2s, transform 0.2s;
          display: inline-block;
        }
        .btn-sec:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.1); transform: translateY(-1px); }
        .feature-card {
          padding: 1.5rem; border: 0.5px solid #e8e8e8; border-radius: 10px;
          background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }
        .feature-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .nav-link { font-size: 0.875rem; color: #666; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
        .plan-card {
          padding: 2rem; border-radius: 10px; transition: box-shadow 0.2s, transform 0.2s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .plan-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: '0.5px solid #e8e8e8' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>MyTradePlan</span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" className="nav-link">Fonctionnalités</a>
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
        <div className="anim-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/register" className="btn-main">Commencer gratuitement</a>
          <a href="#features" className="btn-sec">Voir comment ça marche</a>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.5px' }}>Tout ce qu'il faut pour trader mieux</h2>
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

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Un tarif simple et transparent</h2>
        <p style={{ color: '#666', marginBottom: '3rem' }}>Commence gratuitement, upgrade quand tu es prêt.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
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

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e8e8e8', padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
        © 2025 MyTradePlan · Tous droits réservés
      </footer>

    </main>
  )
}