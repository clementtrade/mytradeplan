'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 'market',
    question: 'Sur quel marché tu trades ?',
    choices: [
      { icon: '📈', label: 'Futures US', sub: 'ES, NQ, CL, GC...' },
      { icon: '🏢', label: 'Actions', sub: 'Stocks US ou européens' },
      { icon: '💱', label: 'Forex', sub: 'EUR/USD, GBP/USD...' },
      { icon: '₿', label: 'Crypto', sub: 'BTC, ETH, altcoins' },
      { icon: '📊', label: 'Options', sub: 'Sur actions ou indices' },
    ]
  },
  {
    id: 'tf',
    question: 'Sur quel timeframe tu travailles ?',
    choices: [
      { icon: '⚡', label: 'Scalping', sub: 'Moins d\'1 minute' },
      { icon: '🔥', label: 'Intraday court', sub: '1 à 5 minutes' },
      { icon: '📊', label: 'Intraday classique', sub: '15 min à 1 heure' },
      { icon: '🌙', label: 'Swing', sub: 'H4 / Daily' },
      { icon: '🌍', label: 'Position', sub: 'Weekly et plus' },
    ]
  },
  {
    id: 'approach',
    question: 'Quelle est ton approche principale ?',
    choices: [
      { icon: '🧱', label: 'SMC / ICT', sub: 'Structure, OB, FVG, liquidité' },
      { icon: '🕯️', label: 'Price Action', sub: 'S/R, chandeliers, structure' },
      { icon: '🌊', label: 'Order Flow', sub: 'Footprint, DOM, institutionnels' },
      { icon: '📉', label: 'Indicateurs', sub: 'RSI, MACD, EMA...' },
      { icon: '🌐', label: 'Macro', sub: 'Données économiques' },
    ]
  },
  {
    id: 'problem',
    question: 'Ton plus grand problème en ce moment ?',
    choices: [
      { icon: '😤', label: 'Je trade hors plan', sub: 'FOMO, impulsivité' },
      { icon: '✂️', label: 'Je coupe mes gains trop tôt', sub: 'Peur de rendre' },
      { icon: '🙈', label: 'Je laisse courir mes pertes', sub: 'Espoir de retournement' },
      { icon: '💥', label: 'Je revenge trade', sub: 'Après une perte' },
      { icon: '🗺️', label: 'Pas de plan clair', sub: 'J\'improvise trop' },
    ]
  },
  {
    id: 'risk',
    question: 'Quel risque tu prends par trade ?',
    choices: [
      { icon: '🟢', label: 'Moins de 0.5%', sub: 'Très conservateur' },
      { icon: '🟡', label: '0.5% à 1%', sub: 'Conservateur' },
      { icon: '🟠', label: '1% à 2%', sub: 'Modéré' },
      { icon: '🔴', label: '2% à 5%', sub: 'Agressif' },
      { icon: '⚫', label: 'Plus de 5%', sub: 'Pas de règle fixe' },
    ]
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const q = QUESTIONS[current]
  const progress = Math.round((current / QUESTIONS.length) * 100)

  function handleSelect(label: string) {
    setSelected(label)
  }

  async function handleNext() {
    if (!selected) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)

    if (current + 1 >= QUESTIONS.length) {
      setLoading(true)
      try {
        // Générer le profil avec l'IA
        const res = await fetch('/api/generate-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers),
        })
        const data = await res.json()
        
        // Sauvegarder dans Supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            market: newAnswers.market,
            tf: newAnswers.tf,
            approach: newAnswers.approach,
            problem: newAnswers.problem,
            risk: newAnswers.risk,
            profile_type: data.type,
            framework_matin: data.framework_matin,
            setup_type: data.setup_type,
            message: data.message,
          })
        }
        
        setProfile(data)
      } catch {
        setProfile({ error: 'Erreur de génération' })
      }
      setLoading(false)
    } else {
      setCurrent(current + 1)
    }
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '14px', marginBottom: '1rem' }}>MyTradePlan IA</div>
          <div style={{ color: 'rgba(229,231,235,0.5)', fontSize: '14px' }}>Création de ton profil en cours...</div>
        </div>
      </main>
    )
  }

  if (profile) {
    return (
      <main style={{ minHeight: '100vh', background: '#0A0E1A', padding: '2rem' }}>
        <div style={{ maxWidth: '500px', margin: '3rem auto', background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
          <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px', marginBottom: '1rem' }}>PROFIL CRÉÉ ✓</div>
          <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '1.5rem' }}>Ton profil trader</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#0A0E1A', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Type de trader</div>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{profile.type}</div>
            </div>
            <div style={{ background: '#0A0E1A', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Framework chaque matin</div>
              <div style={{ color: 'white', fontSize: '14px', lineHeight: 1.6 }}>{profile.framework_matin}</div>
            </div>
            <div style={{ background: '#0A0E1A', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Setup principal</div>
              <div style={{ color: 'white', fontSize: '14px' }}>{profile.setup_type}</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '0.5px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ color: '#F59E0B', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Point à travailler</div>
              <div style={{ color: 'white', fontSize: '14px' }}>{profile.point_a_travailler}</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '0.5px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ color: '#10B981', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Message de ton IA</div>
              <div style={{ color: 'white', fontSize: '14px', fontStyle: 'italic' }}>"{profile.message}"</div>
            </div>
          </div>

          <button
            onClick={() => router.push('/plan')}
            style={{ marginTop: '1.5rem', width: '100%', background: '#10B981', color: 'black', border: 'none', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            Commencer mon plan du matin →
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0E1A', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', margin: '3rem auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(229,231,235,0.4)', fontFamily: 'monospace', marginBottom: '8px' }}>
            <span>Question {current + 1} sur {QUESTIONS.length}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
            <div style={{ height: '3px', background: '#10B981', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '11px', color: '#10B981', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '8px' }}>MYTRADEPLAN IA</div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'white' }}>{q.question}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
          {q.choices.map((c) => (
            <button
              key={c.label}
              onClick={() => handleSelect(c.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                border: selected === c.label ? '1px solid #10B981' : '0.5px solid rgba(255,255,255,0.08)',
                background: selected === c.label ? 'rgba(16,185,129,0.1)' : '#111827',
                textAlign: 'left', width: '100%', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
              <span>
                <div style={{ color: selected === c.label ? '#10B981' : 'white', fontWeight: 500, fontSize: '14px' }}>{c.label}</div>
                <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '12px' }}>{c.sub}</div>
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selected}
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
            background: selected ? '#10B981' : 'rgba(16,185,129,0.2)',
            color: selected ? 'black' : 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace', fontWeight: 700, fontSize: '14px',
            cursor: selected ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
          }}
        >
          {current + 1 === QUESTIONS.length ? 'Créer mon profil →' : 'Continuer →'}
        </button>

      </div>
    </main>
  )
}