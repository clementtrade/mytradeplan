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
    <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '380px' }}>
        
        <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px', marginBottom: '1.5rem' }}>MYTRADEPLAN</div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '0.5rem' }}>Connexion</h1>
        <p style={{ color: 'rgba(229,231,235,0.4)', fontSize: '13px', marginBottom: '1.5rem' }}>Content de te revoir 👋</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '10px 14px', color: '#EF4444', fontSize: '13px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', background: '#0A0E1A', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mot de passe</div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', background: '#0A0E1A', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', background: '#10B981', color: 'black', border: 'none', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Connexion...' : 'Se connecter →'}
        </button>

        <p style={{ color: 'rgba(229,231,235,0.4)', fontSize: '13px', textAlign: 'center', marginTop: '1.25rem' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: '#10B981', textDecoration: 'none' }}>Créer un compte</Link>
        </p>

      </div>
    </main>
  )
}