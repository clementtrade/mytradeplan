'use client'
import { useState } from 'react'
import AnimatedBackground from '../components/AnimatedBackground'

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .plan-feature-on { font-size: 13px; color: #444; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .plan-feature-off { font-size: 13px; color: #ccc; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; text-decoration: line-through; }
        .plan-check { width: 18px; height: 18px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .plan-cross { width: 18px; height: 18px; border-radius: 50%; background: #f0f0f0; color: #ccc; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }
        .toggle-btn { position: relative; width: 44px; height: 24px; background: #e8e8e8; border-radius: 20px; cursor: pointer; border: none; transition: background 0.2s; }
        .toggle-btn.on { background: #111; }
        .toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .toggle-btn.on .toggle-knob { left: 23px; }
        .plan-card { background: #fff; border-radius: 16px; padding: 2rem; transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
      `}</style>

      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid #e8e8e8', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/dashboard" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
        <a href="/dashboard" style={{ fontSize: '13px', color: '#888', textDecoration: 'none' }}>← Retour au dashboard</a>
      </div>

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Tarifs</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Passe au niveau supérieur</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>Briefing Macro IA, IA Insight, analyses avancées — tout pour progresser.</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '13px', color: annual ? '#888' : '#111', fontWeight: annual ? 400 : 600 }}>Mensuel</span>
          <button className={`toggle-btn${annual ? ' on' : ''}`} onClick={() => setAnnual(!annual)}>
            <div className="toggle-knob"></div>
          </button>
          <span style={{ fontSize: '13px', color: annual ? '#111' : '#888', fontWeight: annual ? 600 : 400 }}>Annuel</span>
          {annual && (
            <span style={{ background: '#f0fdf4', color: '#16a34a', border: '0.5px solid #86efac', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>
              Économisez 60€/an
            </span>
          )}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Gratuit */}
          <div className="plan-card" style={{ border: '0.5px solid #e8e8e8', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' }}>Gratuit</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1.25rem' }}>Pour découvrir MyTradePlan</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#111', marginBottom: '4px' }}>0€</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.5rem' }}>Pour toujours</div>
            <div style={{ borderTop: '0.5px solid #f0f0f0', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 trades / mois</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>5 plans du matin / mois</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Stats essentielles</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Stats avancées</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>Briefing Macro IA</div>
              <div className="plan-feature-off"><div className="plan-cross">✗</div>IA Insight calendrier</div>
            </div>
            <div style={{ display: 'block', textAlign: 'center', padding: '0.75rem', border: '0.5px solid #e8e8e8', borderRadius: '8px', fontSize: '13px', color: '#888', fontWeight: 500 }}>
              Plan actuel
            </div>
          </div>

          {/* Pro */}
          <div className="plan-card" style={{ border: '2px solid #111', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#111', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>⭐ Recommandé</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111', marginBottom: '4px' }}>Pro</div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '1.25rem' }}>Pour le trader sérieux</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '4px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#111', lineHeight: 1 }}>
                {annual ? '14,99€' : '19,99€'}
              </div>
              <div style={{ fontSize: '1rem', color: '#888', marginBottom: '2px' }}>/mois</div>
            </div>
            {annual ? (
              <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginBottom: '4px' }}>
                soit 179,99€ facturés annuellement · économisez 60€
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>
                ou 14,99€/mois en choisissant l'annuel
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.5rem' }}>7 jours gratuits · sans carte bancaire</div>
            <div style={{ borderTop: '0.5px solid #f0f0f0', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Trades illimités</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Plans illimités</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Stats avancées & patterns</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div>Discipline tracker</div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong>Briefing Macro IA</strong></div>
              <div className="plan-feature-on"><div className="plan-check">✓</div><strong>IA Insight calendrier</strong></div>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ plan: annual ? 'annual' : 'monthly' }),
                })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }}
              style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.875rem', background: '#111', color: '#fff', borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Essayer 7 jours gratuitement →
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '12px', color: '#aaa' }}>
          Pas de carte bancaire requise · Annule à tout moment · Support inclus
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '3rem', borderTop: '0.5px solid #e8e8e8', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '1.25rem' }}>Questions fréquentes</h3>
          {[
            { q: 'Puis-je annuler à tout moment ?', r: 'Oui, sans engagement ni frais. Vous gardez l\'accès Pro jusqu\'à la fin de la période payée.' },
            { q: 'Que se passe-t-il après les 7 jours gratuits ?', r: 'Vous êtes automatiquement basculé sur le plan Gratuit, sans être débité. Vous choisissez ensuite si vous voulez continuer en Pro.' },
            { q: 'La facturation annuelle, c\'est quoi ?', r: 'Vous payez 179,99€ une fois par an au lieu de 19,99€ × 12 = 239,88€. Vous économisez 60€.' },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>{faq.q}</div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{faq.r}</div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </main>
  )
}