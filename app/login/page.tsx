'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      router.push('/plan')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp 0.6s ease both; }
        .login-input {
          width: 100%;
          background: #fff;
          border: 0.5px solid #e0e0e0;
          border-radius: 6px;
          padding: 10px 14px;
          color: #111;
          font-size: 14px;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
        .login-btn {
          width: 100%;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s;
          font-family: inherit;
        }
        .login-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(0,0,0,0.22);
          transform: translateY(-1px);
        }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <a href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.3px' }}>MyTradePlan</span>
      </a>

      <div className="login-card" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '2.25rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>

        <h1 style={{ color: '#111', fontSize: '22px', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>Connexion</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '1.75rem', lineHeight: 1.5 }}>Content de te revoir sur MyTradePlan.</p>

        {error && (
          <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '6px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: '#555', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>Email</div>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="login-input"
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ color: '#555', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>Mot de passe</div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="login-input"
          />
        </div>

        <button onClick={handleLogin} disabled={loading} className="login-btn">
          {loading ? 'Connexion...' : 'Se connecter →'}
        </button>

        <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', marginTop: '1.25rem' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Créer un compte</Link>
        </p>

      </div>

      <p style={{ color: '#ccc', fontSize: '12px', marginTop: '2rem' }}>
        © 2025 MyTradePlan · Tous droits réservés
      </p>

    </main>
  )
}