'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, totalR: 0, winRate: 0 })
  const [isPro, setIsPro] = useState(false)
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      if (profileData) {
        setProfile(profileData)
        setIsPro(profileData.is_pro === true)
      }

      const { data: trades } = await supabase
        .from('trades').select('result_r').eq('user_id', user.id)
      if (trades && trades.length > 0) {
        const totalR = trades.reduce((sum, t) => sum + t.result_r, 0)
        const wins = trades.filter(t => t.result_r > 0).length
        setStats({
          total: trades.length,
          totalR: parseFloat(totalR.toFixed(2)),
          winRate: Math.round((wins / trades.length) * 100)
        })
      }
    }
    load()
  }, [])

  const cards = [
    {
      emoji: '📋',
      title: 'Plan du matin',
      desc: "Prépare ta session avec l'IA avant d'ouvrir tes charts.",
      pill: 'Commencer ma session',
      pillColor: { background: '#f0fdf4', color: '#16a34a' },
      href: '/plan',
      pro: false,
    },
    {
      emoji: '📒',
      title: 'Journal de trades',
      desc: 'Enregistre et analyse chaque trade en R.',
      pill: `${stats.total} trades enregistrés`,
      pillColor: { background: '#f5f5f5', color: '#666' },
      href: '/journal',
      pro: false,
    },
    {
      emoji: '📊',
      title: 'Stats & performance',
      desc: 'Win rate, R moyen, discipline — visualise ton edge.',
      pill: stats.totalR >= 0 ? `+${stats.totalR}R au total` : `${stats.totalR}R au total`,
      pillColor: { background: stats.totalR >= 0 ? '#f0fdf4' : '#fff5f5', color: stats.totalR >= 0 ? '#16a34a' : '#dc2626' },
      href: '/stats',
      pro: false,
    },
    {
      emoji: '🌍',
      title: 'Briefing Macro IA',
      desc: 'Actualités macro personnalisées à ton profil de trader.',
      pill: isPro ? 'Accéder au briefing' : 'Pro',
      pillColor: isPro ? { background: '#f0fdf4', color: '#16a34a' } : { background: '#111', color: '#fff' },
      href: isPro ? '/plan' : '/pricing',
      pro: !isPro,
    },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .dash-card {
          background: #fff; border: 0.5px solid #e8e8e8; border-radius: 12px;
          padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          cursor: pointer; transition: box-shadow 0.2s, transform 0.2s;
          text-decoration: none; display: block;
        }
        .dash-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
      `}</style>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Navbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', animation: 'fadeUp 0.5s ease both' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111', letterSpacing: '-0.3px' }}>MyTradePlan</span>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/journal" className="nav-link">Journal</a>
            <a href="/stats" className="nav-link">Stats</a>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} style={{ background: 'transparent', border: '0.5px solid #e0e0e0', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>
        <div style={{ borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}></div>

        {/* Header */}
        <div style={{ animation: 'fadeUp 0.5s 0.1s ease both', opacity: 0 }}>
          <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{today}</div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
            Bonjour {profile?.full_name || 'trader'} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '2rem' }}>Que veux-tu faire aujourd'hui ?</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {cards.map((card, i) => (
            <a key={i} href={card.href} className="dash-card" style={{ animationDelay: `${0.15 + i * 0.1}s`, animation: 'fadeUp 0.6s ease both', opacity: 0 }}>
              <div style={{ fontSize: '22px', marginBottom: '0.75rem' }}>{card.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#111', marginBottom: '4px' }}>{card.title}</div>
              <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.5, marginBottom: '1rem' }}>{card.desc}</div>
              <div style={{ ...card.pillColor, borderRadius: '6px', padding: '4px 10px', fontSize: '12px', display: 'inline-block' }}>
                {card.pill}
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  )
}