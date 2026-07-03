'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState(true)

  // Vérifie qu'on arrive bien depuis Stripe (présence du session_id).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setHasSession(!!params.get('session_id'))
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .success-card { animation: fadeUp 0.6s ease both; }
        .success-check { animation: pop 0.5s 0.15s ease both; }
        .btn-go {
          display: block; width: 100%; text-align: center;
          background: #111; color: #fff; border: none; border-radius: 8px;
          padding: 14px; font-weight: 600; font-size: 15px; cursor: pointer;
          text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s; font-family: inherit;
          box-sizing: border-box;
        }
        .btn-go:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.22); transform: translateY(-1px); }
        .btn-sec {
          display: block; width: 100%; text-align: center;
          background: transparent; color: #888; border: none;
          padding: 12px; font-weight: 500; font-size: 13px; cursor: pointer;
          text-decoration: none; margin-top: 8px; font-family: inherit;
        }
        .btn-sec:hover { color: #111; }
      `}</style>

      <a href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.3px' }}>MyTradePlan</span>
      </a>

      <div className="success-card" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '2.5rem 2.25rem', width: '100%', maxWidth: '440px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', textAlign: 'center' }}>

        <div className="success-check" style={{ width: '64px', height: '64px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '28px', color: '#16a34a' }}>✓</div>

        <h1 style={{ color: '#111', fontSize: '24px', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.5px' }}>Paiement réussi !</h1>
        <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Ton compte <strong style={{ color: '#111' }}>Pro</strong> est activé. Tu as maintenant accès à toutes les fonctionnalités — stats avancées, briefing macro IA et insights sur ton calendrier.
        </p>

        <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', marginBottom: '1.75rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ color: '#16a34a', fontSize: '13px' }}>✓</span>
            <span style={{ fontSize: '13px', color: '#444' }}>Trades et plans du matin illimités</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ color: '#16a34a', fontSize: '13px' }}>✓</span>
            <span style={{ fontSize: '13px', color: '#444' }}>Stats avancées et suivi de discipline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#16a34a', fontSize: '13px' }}>✓</span>
            <span style={{ fontSize: '13px', color: '#444' }}>Briefing Macro IA et insights calendrier</span>
          </div>
        </div>

        <a href="/dashboard" className="btn-go">Accéder à mon dashboard →</a>
        <a href="/plan" className="btn-sec">Commencer mon plan du matin</a>

        {!hasSession && (
          <p style={{ fontSize: '12px', color: '#ccc', marginTop: '1.25rem', lineHeight: 1.5 }}>
            Si ton compte Pro n'apparaît pas dans quelques minutes, contacte-nous.
          </p>
        )}
      </div>

      <p style={{ color: '#ccc', fontSize: '12px', marginTop: '2rem' }}>
        © 2026 MyTradePlan · Tous droits réservés
      </p>
    </main>
  )
}