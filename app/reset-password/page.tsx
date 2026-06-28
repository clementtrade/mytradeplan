'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
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

        {!success ? (
          <>
            <h1 style={{ color: '#111', fontSize: '22px', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>Nouveau mot de passe</h1>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Choisissez un nouveau mot de passe pour votre compte.
            </p>

            {error && (
              <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '6px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#555', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>Nouveau mot de passe</div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ color: '#555', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>Confirmer le mot de passe</div>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                className="input"
              />
            </div>

            <button onClick={handleReset} disabled={loading || !password || !confirm} className="btn">
              {loading ? 'Mise à jour...' : 'Mettre à jour →'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
            <h1 style={{ color: '#111', fontSize: '20px', fontWeight: 700, marginBottom: '0.75rem' }}>Mot de passe mis à jour !</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Redirection vers le dashboard...</p>
          </div>
        )}
      </div>

      <p style={{ color: '#ccc', fontSize: '12px', marginTop: '2rem' }}>
        © 2026 MyTradePlan · Tous droits réservés
      </p>
    </main>
  )
}