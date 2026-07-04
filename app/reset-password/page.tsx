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
  const [ready, setReady] = useState(false)

  // Au chargement : on récupère la session depuis le lien de l'email.
  // Supabase renvoie soit un "code" (dans ?code=...), soit un token dans le #hash.
  useEffect(() => {
    async function initSession() {
      try {
        // Cas 1 : nouveau format — code dans l'URL (?code=xxx)
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
          setReady(true)
          return
        }

        // Cas 2 : ancien format — tokens dans le hash (#access_token=...)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          const hashParams = new URLSearchParams(hash.substring(1))
          const access_token = hashParams.get('access_token')
          const refresh_token = hashParams.get('refresh_token')
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token })
            setReady(true)
            return
          }
        }

        // Cas 3 : peut-être déjà une session active
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setReady(true)
          return
        }

        // Sinon : lien invalide ou expiré
        setError("Ce lien est invalide ou a expiré. Merci de refaire une demande de réinitialisation.")
      } catch {
        setError("Ce lien est invalide ou a expiré. Merci de refaire une demande de réinitialisation.")
      }
    }
    initSession()
  }, [])

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
                disabled={!ready}
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
                disabled={!ready}
              />
            </div>

            <button onClick={handleReset} disabled={loading || !password || !confirm || !ready} className="btn">
              {loading ? 'Mise à jour...' : ready ? 'Mettre à jour →' : 'Vérification du lien...'}
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