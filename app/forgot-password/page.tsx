'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .input { width: 100%; background: #fff; border: 0.5px solid #e0e0e0; border-radius: 6px; padding: 10px 14px; color: #111; font-size: 14px; outline: none; font-family: inherit; transition: border-color 0.15s; box-sizing: border-box; }
        .input:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
        .btn { width: 100%; background: #111; color: #fff; border: none; border-radius: 8px; padding: 12px; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity 0.2s; }
        .btn:hover:not(:disabled) { opacity: 0.85; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <a href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.3px' }}>MyTradePlan</span>
      </a>

      <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '2.25rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>

        {!sent ? (
          <>
            <h1 style={{ color: '#111', fontSize: '22px', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>Mot de passe oublié</h1>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {error && (
              <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '6px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: '#555', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>Email</div>
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                className="input"
              />
            </div>

            <button onClick={handleReset} disabled={loading || !email} className="btn">
              {loading ? 'Envoi en cours...' : 'Envoyer le lien →'}
            </button>

            <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', marginTop: '1.25rem' }}>
              <Link href="/login" style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>← Retour à la connexion</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
              <h1 style={{ color: '#111', fontSize: '20px', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Email envoyé !</h1>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Vérifiez votre boîte mail — un lien de réinitialisation vous a été envoyé à <strong style={{ color: '#111' }}>{email}</strong>.
              </p>
              <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '1.5rem' }}>
                Vous ne trouvez pas l'email ? Vérifiez vos spams.
              </p>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', background: '#111', color: '#fff', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>

      <p style={{ color: '#ccc', fontSize: '12px', marginTop: '2rem' }}>
        © 2026 MyTradePlan · Tous droits réservés
      </p>
    </main>
  )
}