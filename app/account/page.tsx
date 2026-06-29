'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profil' | 'abonnement' | 'securite'>('profil')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  // Profil
  const [fullName, setFullName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)

  // Sécurité
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData) {
        setProfile(profileData)
        setFullName(profileData.full_name || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    setSavingProfile(true)
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setProfileSaved(true)
    setSavingProfile(false)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  async function savePassword() {
    setPasswordError('')
    if (newPassword !== confirmPassword) { setPasswordError('Les mots de passe ne correspondent pas.'); return }
    if (newPassword.length < 6) { setPasswordError('Au moins 6 caractères requis.'); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { setPasswordError(error.message); setSavingPassword(false); return }
    setPasswordSaved(true)
    setNewPassword('')
    setConfirmPassword('')
    setSavingPassword(false)
    setTimeout(() => setPasswordSaved(false), 3000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'CL'

  const sidebarW = sidebarExpanded ? 200 : 52

  const planLabel = profile?.is_pro ? 'Pro' : 'Gratuit'
  const planColor = profile?.is_pro ? '#16a34a' : '#888'
  const planBg = profile?.is_pro ? '#f0fdf4' : '#f5f5f5'
  const planBorder = profile?.is_pro ? '#bbf7d0' : '#e8e8e8'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sidebar { position: fixed; left: 0; top: 0; height: 100vh; background: #fff; border-right: 0.5px solid #e8e8e8; display: flex; flex-direction: column; transition: width 0.2s cubic-bezier(0.4,0,0.2,1); overflow: hidden; z-index: 100; }
        .sb-logo { height: 52px; min-height: 52px; display: flex; align-items: center; padding: 0 14px; border-bottom: 0.5px solid #e8e8e8; white-space: nowrap; }
        .sb-dot { width: 24px; height: 24px; min-width: 24px; background: #111; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 800; }
        .sb-brand { font-size: 13px; font-weight: 700; color: #111; margin-left: 10px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
        .sidebar.exp .sb-brand { opacity: 1; }
        .profile-btn { display: flex; align-items: center; margin: 10px 6px 4px; padding: 8px; border-radius: 10px; background: #f5f5f5; border: 0.5px solid #e8e8e8; cursor: pointer; text-decoration: none; overflow: hidden; }
        .profile-avatar { width: 28px; height: 28px; min-width: 28px; background: #111; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; }
        .profile-info { margin-left: 9px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
        .sidebar.exp .profile-info { opacity: 1; }
        .profile-name { font-size: 12px; font-weight: 700; color: #111; }
        .profile-role { font-size: 10px; color: #aaa; margin-top: 1px; }
        .sb-divider { height: 0.5px; background: #e8e8e8; margin: 6px 12px; }
        .sb-section { font-size: 10px; font-weight: 600; color: #ccc; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 20px 2px; white-space: nowrap; opacity: 0; transition: opacity 0.1s 0.07s; }
        .sidebar.exp .sb-section { opacity: 1; }
        .nav-item { display: flex; align-items: center; height: 38px; padding: 0 14px; margin: 1px 6px; border-radius: 8px; cursor: pointer; text-decoration: none; color: #888; overflow: hidden; transition: background 0.15s, color 0.15s; }
        .nav-item:hover { background: #f5f5f5; color: #111; }
        .nav-item.active { background: #111; color: #fff; }
        .nav-icon { font-size: 14px; min-width: 24px; display: flex; align-items: center; justify-content: center; }
        .nav-lbl { font-size: 12.5px; font-weight: 500; margin-left: 8px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
        .sidebar.exp .nav-lbl { opacity: 1; }
        .tab { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: #888; transition: all 0.15s; font-family: inherit; }
        .tab.active { background: #111; color: #fff; }
        .tab:hover:not(.active) { background: #f5f5f5; color: #111; }
        .input { width: 100%; background: #fff; border: 0.5px solid #e0e0e0; border-radius: 8px; padding: 10px 14px; color: #111; font-size: 14px; outline: none; font-family: inherit; transition: border-color 0.15s; box-sizing: border-box; }
        .input:focus { border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
        .btn-save { background: #111; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: opacity 0.2s; }
        .btn-save:hover { opacity: 0.85; }
        .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
        .label { font-size: 12px; font-weight: 500; color: #555; margin-bottom: 6px; display: block; }
        .section-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 4px; }
        .section-desc { font-size: 13px; color: #888; margin-bottom: 1.5rem; }
        .divider { height: 0.5px; background: #f0f0f0; margin: 1.5rem 0; }
      `}</style>

      {/* SIDEBAR */}
      <div
        className={`sidebar${sidebarExpanded ? ' exp' : ''}`}
        style={{ width: sidebarW }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="sb-logo">
          <div className="sb-dot">M</div>
          <span className="sb-brand">MyTradePlan</span>
        </div>
        <a href="/account" className="profile-btn">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <div className="profile-name">{profile?.full_name || 'Mon profil'}</div>
            <div className="profile-role">{profile?.market || 'Trader'}</div>
          </div>
        </a>
        <div className="sb-divider"></div>
        <div className="sb-section">Session</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/dashboard" className="nav-item">
            <span className="nav-icon">▦</span>
            <span className="nav-lbl">Dashboard</span>
          </a>
          <a href="/plan" className="nav-item">
            <span className="nav-icon">☀</span>
            <span className="nav-lbl">Plan du matin</span>
          </a>
          <a href="/debrief" className="nav-item">
            <span className="nav-icon">◈</span>
            <span className="nav-lbl">Débrief Macro IA</span>
          </a>
          <a href="/journal" className="nav-item">
            <span className="nav-icon" style={{ fontSize: '13px', fontWeight: 700 }}>▤</span>
            <span className="nav-lbl">Journal</span>
          </a>
        </nav>
        <div className="sb-divider"></div>
        <div className="sb-section">Compte</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/account" className="nav-item active">
            <span className="nav-icon">⚙</span>
            <span className="nav-lbl">Mon compte</span>
          </a>
        </nav>
        <div style={{ marginTop: 'auto', padding: '12px 6px' }}>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>
            <span className="nav-icon">↩</span>
            <span className="nav-lbl">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* MAIN */}
      <main style={{ marginLeft: sidebarW, flex: 1, padding: '0 2rem 3rem', transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#ccc', fontSize: '13px' }}>Chargement...</div>
        ) : (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>

            {/* HEADER */}
            <div style={{ height: '52px', display: 'flex', alignItems: 'center', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>Mon compte</span>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem', background: '#f5f5f5', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
              {(['profil', 'abonnement', 'securite'] as const).map(tab => (
                <button key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'profil' ? '👤 Profil' : tab === 'abonnement' ? '💳 Abonnement' : '🔒 Sécurité'}
                </button>
              ))}
            </div>

            {/* PROFIL */}
            {activeTab === 'profil' && (
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '1.75rem' }}>
                <div className="section-title">Informations du profil</div>
                <div className="section-desc">Gérez votre nom et vos informations de compte.</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: '10px' }}>
                  <div style={{ width: '52px', height: '52px', background: '#111', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 700, flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>{profile?.full_name || 'Nom non défini'}</div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{user?.email}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="label">Nom complet</label>
                  <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ton prénom et nom" />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="label">Email</label>
                  <input className="input" value={user?.email || ''} disabled style={{ background: '#f9f9f9', color: '#aaa', cursor: 'not-allowed' }} />
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '5px' }}>L'email ne peut pas être modifié.</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="btn-save" onClick={saveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  {profileSaved && <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500 }}>✓ Enregistré !</span>}
                </div>
              </div>
            )}

            {/* ABONNEMENT */}
            {activeTab === 'abonnement' && (
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '1.75rem' }}>
                <div className="section-title">Abonnement</div>
                <div className="section-desc">Gérez votre plan et votre facturation.</div>

                {/* Plan actuel */}
                <div style={{ background: planBg, border: `0.5px solid ${planBorder}`, borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Plan actuel</div>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: planColor }}>{planLabel}</div>
                    </div>
                    <div style={{ background: planBg, border: `0.5px solid ${planBorder}`, borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600, color: planColor }}>
                      {profile?.is_pro ? '✓ Actif' : 'Gratuit'}
                    </div>
                  </div>
                  {profile?.is_pro && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `0.5px solid ${planBorder}`, fontSize: '12px', color: '#888' }}>
                      Accès à toutes les fonctionnalités Pro — Briefing Macro IA, IA Insight calendrier, trades illimités.
                    </div>
                  )}
                </div>

                {!profile?.is_pro ? (
                  <div>
                    <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                      Passez au plan <strong>Pro</strong> pour débloquer le Briefing Macro IA, l'IA Insight sur chaque session, les trades illimités et bien plus.
                    </div>
                    <a href="/pricing" style={{ display: 'inline-block', background: '#111', color: '#fff', borderRadius: '8px', padding: '10px 22px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                      Passer au Pro →
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="divider"></div>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '1rem' }}>
                      Pour annuler votre abonnement ou modifier votre moyen de paiement, contactez-nous.
                    </div>
                    <a href="mailto:support@mytradeplan.app" style={{ display: 'inline-block', background: '#fff', color: '#111', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '10px 22px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                      Contacter le support
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* SÉCURITÉ */}
            {activeTab === 'securite' && (
              <div style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '14px', padding: '1.75rem' }}>
                <div className="section-title">Sécurité</div>
                <div className="section-desc">Modifiez votre mot de passe.</div>

                {passwordError && (
                  <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '1rem' }}>
                    {passwordError}
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <label className="label">Nouveau mot de passe</label>
                  <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="label">Confirmer le mot de passe</label>
                  <input className="input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && savePassword()} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="btn-save" onClick={savePassword} disabled={savingPassword || !newPassword || !confirmPassword}>
                    {savingPassword ? 'Mise à jour...' : 'Mettre à jour'}
                  </button>
                  {passwordSaved && <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 500 }}>✓ Mot de passe mis à jour !</span>}
                </div>

                <div className="divider"></div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Déconnexion</div>
                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '1rem' }}>Déconnectez-vous de votre compte sur cet appareil.</div>
                  <button onClick={handleLogout} style={{ background: '#fff', color: '#dc2626', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}