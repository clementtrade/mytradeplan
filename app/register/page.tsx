'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AnimatedBackground from '../components/AnimatedBackground'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Capture le plan choisi (?plan=pro&billing=mensuel|annuel) et le garde
  // pour la fin de l'onboarding, où on redirigera vers Stripe.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const plan = params.get('plan')
    const billing = params.get('billing')
    if (plan === 'pro') {
      localStorage.setItem('plan', 'pro')
      localStorage.setItem('billing', billing === 'annuel' ? 'annuel' : 'mensuel')
    }
  }, [])

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ email: email })
          .eq('id', data.user.id)
      }
      router.push('/onboarding')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .register-card { animation: fadeUp 0.6s ease both; }
        .register-input {
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
        .register-input:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
        .register-btn {
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
        .register-btn:hover:not(:disabled) {
          box-shadow: 0 6px 20px rgba(0,0,0,0.22);
          transform: translateY(-1px);
        }
        .register-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <AnimatedBackground />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <a href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.3px' }}>MyTradePlan</span>
      </a>

      <div className="register-card" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '2.25rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
        <h1 style={{ color: '#111', fontSize: '22px', fontWeight: 600, marginBottom: '0.4rem', letterSpacing: '-0.5px', fontFamily: 'var(--font-serif)' }}>Créer un compte</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '1.75rem', lineHeight: 1.5 }}>Commence à structurer ton trading dès aujourd'hui.</p>

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
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="register-input"
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ color: '#555', fontSize: '12px', fontWeight: 500, marginBottom: '6px' }}>Mot de passe</div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="register-input"
          />
        </div>

        <button onClick={handleRegister} disabled={loading} className="register-btn">
          {loading ? 'Création en cours...' : 'Créer mon compte →'}
        </button>

        <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', marginTop: '1.25rem' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
        </p>
      </div>

      <p style={{ color: '#ccc', fontSize: '12px', marginTop: '2rem' }}>
        © 2026 MyTradePlan · Tous droits réservés
      </p>
      </div>
    </main>
  )
}