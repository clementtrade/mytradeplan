'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 'market',
    type: 'choice',
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
    type: 'choice',
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
    type: 'choice',
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
    id: 'tools',
    type: 'text',
    question: 'Quels outils et données tu regardes chaque matin avant de trader ?',
    placeholder: 'Note tes outils ici...',
    hint: 'Sois précis — c\'est ce que l\'IA utilisera pour te poser les bonnes questions chaque matin.'
  },
  {
    id: 'framework_matin',
    type: 'text',
    question: 'Dans quel ordre tu analyses ces données ?',
    placeholder: 'Note ton process ici...',
    hint: 'Décris ton processus du début à la fin, même en quelques mots.'
  },
  {
    id: 'problem',
    type: 'choice',
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
    type: 'choice',
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
  const [textValue, setTextValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const q = QUESTIONS[current]
  const progress = Math.round((current / QUESTIONS.length) * 100)

  const canContinue = q.type === 'choice' ? !!selected : textValue.trim().length > 5

  async function handleNext() {
    if (!canContinue) return
    const value = q.type === 'choice' ? selected! : textValue.trim()
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    setSelected(null)
    setTextValue('')

    if (current + 1 >= QUESTIONS.length) {
      setLoading(true)
      try {
        const res = await fetch('/api/generate-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers),
        })
        const data = await res.json()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').upsert({
            id: user.id,
            market: newAnswers.market,
            tf: newAnswers.tf,
            approach: newAnswers.approach,
            tools: newAnswers.tools,
            framework_matin: newAnswers.framework_matin,
            problem: newAnswers.problem,
            risk: newAnswers.risk,
            profile_type: data.type,
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
      <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid #e8e8e8', borderTop: '2px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>Création de ton profil...</div>
          <div style={{ fontSize: '13px', color: '#aaa' }}>L'IA analyse tes réponses</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    )
  }

  if (profile) {
    return (
      <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .profile-anim { animation: fadeUp 0.5s ease both; }
          .btn-go {
            width: 100%; background: #111; color: #fff; border: none; border-radius: 8px;
            padding: 14px; font-weight: 600; font-size: 15px; cursor: pointer;
            box-shadow: 0 4px 14px rgba(0,0,0,0.15);
            transition: box-shadow 0.2s, transform 0.2s; font-family: inherit;
          }
          .btn-go:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.22); transform: translateY(-1px); }
        `}</style>
        <div className="profile-anim" style={{ maxWidth: '480px', width: '100%' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '20px' }}>✓</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.4rem' }}>Profil créé !</h1>
            <p style={{ fontSize: '14px', color: '#888' }}>Voici ce que l'IA a retenu sur toi.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type de trader</div>
              <div style={{ color: '#111', fontSize: '14px', fontWeight: 500 }}>{profile.type}</div>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tes outils du matin</div>
              <div style={{ color: '#111', fontSize: '14px', lineHeight: 1.6 }}>{answers.tools}</div>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ton process du matin</div>
              <div style={{ color: '#111', fontSize: '14px', lineHeight: 1.6 }}>{answers.framework_matin}</div>
            </div>

            <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#aaa', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Setup principal</div>
              <div style={{ color: '#111', fontSize: '14px' }}>{profile.setup_type}</div>
            </div>

            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ color: '#d97706', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Point à travailler</div>
              <div style={{ color: '#111', fontSize: '14px' }}>{profile.point_a_travailler}</div>
            </div>

            <div style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ color: '#16a34a', fontSize: '11px', fontWeight: 500, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message de l'IA</div>
              <div style={{ color: '#111', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>"{profile.message}"</div>
            </div>
          </div>

          <button className="btn-go" onClick={() => router.push('/plan')}>
            Commencer mon plan du matin →
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .q-anim { animation: fadeUp 0.4s ease both; }
        .choice-btn {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; border-radius: 10px; cursor: pointer;
          text-align: left; width: 100%; transition: all 0.15s;
          background: #fff; border: 0.5px solid #e8e8e8;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .choice-btn:hover { border-color: #111; box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
        .choice-btn.selected { border: 1.5px solid #111; background: #f9f9f9; box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
        .btn-next {
          width: 100%; padding: 14px; border-radius: 8px; border: none;
          font-weight: 600; font-size: 15px; transition: all 0.2s; font-family: inherit;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        }
        .textarea-input {
          width: 100%; border-radius: 10px; padding: 14px 16px;
          color: #111; font-size: 14px; outline: none; font-family: inherit;
          resize: none; line-height: 1.6; transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box; background: #fff;
        }
        .textarea-input:focus { border-color: #111 !important; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e8e8e8', padding: '1rem 2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.3px' }}>MyTradePlan</span>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="q-anim" style={{ maxWidth: '480px', width: '100%' }}>

          {/* Progress */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>
              <span>Question {current + 1} sur {QUESTIONS.length}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}>
              <div style={{ height: '3px', background: '#111', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 500, letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>MyTradePlan IA</div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#111', marginBottom: q.type === 'text' ? '0.5rem' : '0', letterSpacing: '-0.2px' }}>{q.question}</div>
            {q.type === 'text' && (
              <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.5, marginTop: '4px' }}>{(q as any).hint}</div>
            )}
          </div>

          {/* Choix ou texte */}
          {q.type === 'choice' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
              {(q as any).choices.map((c: any) => (
                <button
                  key={c.label}
                  onClick={() => setSelected(c.label)}
                  className={`choice-btn${selected === c.label ? ' selected' : ''}`}
                >
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{c.icon}</span>
                  <span>
                    <div style={{ color: '#111', fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{c.label}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{c.sub}</div>
                  </span>
                  {selected === c.label && (
                    <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ marginBottom: '1.5rem' }}>
              <textarea
                className="textarea-input"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                placeholder={(q as any).placeholder}
                rows={4}
                style={{ border: textValue.trim().length > 5 ? '1.5px solid #111' : '0.5px solid #e0e0e0' }}
              />
              <div style={{ fontSize: '11px', color: '#ccc', marginTop: '6px', textAlign: 'right' }}>
                {textValue.trim().length} caractères
              </div>
            </div>
          )}

          {/* Bouton continuer */}
          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="btn-next"
            style={{
              background: canContinue ? '#111' : '#f0f0f0',
              color: canContinue ? '#fff' : '#aaa',
              cursor: canContinue ? 'pointer' : 'not-allowed',
            }}
          >
            {current + 1 === QUESTIONS.length ? 'Créer mon profil →' : 'Continuer →'}
          </button>

        </div>
      </div>
    </main>
  )
}