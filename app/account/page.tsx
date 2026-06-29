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
  const [fullName, setFullName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [portalLoading, setPortalLoading] = useState(false)

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

  async function openPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setPortalLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'CL'

  const sidebarW = sidebarExpanded ? 200 : 52

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
        .acc-input { width: 100%; height: 36px; border: 0.5px solid #e0e0e0; border-radius: 8px; padding: 0 12px; font-size: 13px; color: #111; background: #fff; font-family: inherit; outline: none; transition: border-color 0.15s; }
        .acc-input:focus { border-color: #111; }
        .acc-input:disabled { background: #f9f9f9; color: #bbb; cursor: not-allowed; }
        .acc-hint { font-size: 11px; color: #bbb; margin-top: 4px; }
        .acc-tab { font-size: 13px; color: #888; padding: 8px 0; cursor: pointer; border-bottom: 1.5px solid transparent; margin-right: 1.5rem; margin-bottom: -0.5px; background: none; border-top: none; border-left: none; border-right: none; font-family: inherit; transition: color 0.15s, border-color 0.15s; }
        .acc-tab.active { color: #111; border-bottom-color: #111; font-weight: 600; }
        .acc-tab:hover:not(.active) { color: #111; }
        .btn-save { height: 32px; padding: 0 16px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity 0.15s; }
        .btn-save:hover { opacity: 0.82; }
        .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-ghost { height: 32px; padding: 0 16px; background: transparent; color: #666; border: 0.5px solid #e0e0e0; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: inherit; transition: border-color 0.15s, color 0.15s; text-decoration: none; display: inline-flex; align-items: center; }
        .btn-ghost:hover { border-color: #111; color: #111; }
        .btn-danger { height: 32px; padding: 0 16px; background: transparent; color: #dc2626; border: 0.5px solid #fca5a5; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: inherit; }
        .acc-section { padding-bottom: 1.5rem; margin-bottom: 1.5rem; border-bottom: 0.5px solid #f0f0f0; }
        .acc-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
        .acc-section-title { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 3px; }
        .acc-section-desc { font-size: 12px; color: #aaa; margin-bottom: 1rem; }
        .field-row { display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 0.875rem; }
        .field-row-label { width: 130px; flex-shrink: 0; font-size: 13px; color: #666; line-height: 36px; }
        .field-row-input { flex: 1; }
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
      </div>

      {/* MAIN */}
      <main style={{ marginLeft: sidebarW, flex: 1, padding: '0 2.5rem 3rem', transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)', maxWidth: '780px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#ccc', fontSize: '13px' }}>Chargement...</div>
        ) : (
          <>
            {/* HEADER */}
            <div style={{ height: '52px', display: 'flex', alignItems: 'center', borderBottom: '0.5px solid #e8e8e8', marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#111', letterSpacing: '-0.3px' }}>Mon compte</div>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', borderBottom: '0.5px solid #e8e8e8', marginBottom: '1.75rem' }}>
              {(['profil', 'abonnement', 'securite'] as const).map(tab => (
                <button
                  key={tab}
                  className={`acc-tab${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'profil' ? 'Profil' : tab === 'abonnement' ? 'Abonnement & facturation' : 'Sécurité'}
                </button>
              ))}
            </div>

            {/* PROFIL */}
            {activeTab === 'profil' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f5f5f5', border: '0.5px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 600, color: '#555', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{profile?.full_name || 'Nom non défini'}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{user?.email}</div>
                  </div>
                </div>

                <div className="acc-section">
                  <div className="acc-section-title">Informations personnelles</div>
                  <div className="acc-section-desc">Votre nom est affiché dans l'application.</div>
                  <div className="field-row">
                    <div className="field-row-label">Nom complet</div>
                    <div className="field-row-input">
                      <input className="acc-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Votre prénom et nom" />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-row-label">Email</div>
                    <div className="field-row-input">
                      <input className="acc-input" type="text" value={user?.email || ''} disabled />
                      <div className="acc-hint">L'adresse email ne peut pas être modifiée.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.25rem', paddingLeft: '145px' }}>
                    <button className="btn-save" onClick={saveProfile} disabled={savingProfile}>
                      {savingProfile ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    {profileSaved && <span style={{ fontSize: '12px', color: '#16a34a' }}>✓ Enregistré</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ABONNEMENT & FACTURATION */}
            {activeTab === 'abonnement' && (
              <div>
                <div className="acc-section">
                  <div className="acc-section-title">Plan actuel</div>
                  <div className="acc-section-desc">Votre plan et vos droits d'accès.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: profile?.is_pro ? '#f0fdf4' : '#f5f5f5',
                      color: profile?.is_pro ? '#16a34a' : '#888',
                      border: `0.5px solid ${profile?.is_pro ? '#bbf7d0' : '#e8e8e8'}`
                    }}>
                      {profile?.is_pro ? '✓ Pro' : 'Gratuit'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>
                      {profile?.is_pro ? 'Toutes les fonctionnalités débloquées' : '5 trades · 5 plans par mois'}
                    </span>
                  </div>
                  {profile?.is_pro ? (
                    <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.7 }}>
                      Trades illimités · Plans illimités · Briefing Macro IA · Insight IA calendrier
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                        Passez au plan Pro pour débloquer le Briefing Macro IA, l'Insight IA sur chaque session et les trades illimités.
                      </div>
                      <a href="/pricing" className="btn-save" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                        Passer au Pro →
                      </a>
                    </>
                  )}
                </div>

                {profile?.is_pro && (
                  <div className="acc-section">
                    <div className="acc-section-title">Gérer l'abonnement</div>
                    <div className="acc-section-desc">Modifiez votre plan, votre moyen de paiement ou consultez vos factures.</div>
                    <button className="btn-save" onClick={openPortal} disabled={portalLoading}>
                      {portalLoading ? 'Chargement...' : 'Gérer mon abonnement →'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SÉCURITÉ */}
            {activeTab === 'securite' && (
              <div>
                <div className="acc-section">
                  <div className="acc-section-title">Changer le mot de passe</div>
                  <div className="acc-section-desc">Choisissez un mot de passe d'au moins 6 caractères.</div>
                  {passwordError && (
                    <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '9px 12px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem' }}>
                      {passwordError}
                    </div>
                  )}
                  <div className="field-row">
                    <div className="field-row-label">Nouveau mot de passe</div>
                    <div className="field-row-input">
                      <input className="acc-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field-row-label">Confirmer</div>
                    <div className="field-row-input">
                      <input className="acc-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && savePassword()} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '1.25rem', paddingLeft: '145px' }}>
                    <button className="btn-save" onClick={savePassword} disabled={savingPassword || !newPassword || !confirmPassword}>
                      {savingPassword ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                    {passwordSaved && <span style={{ fontSize: '12px', color: '#16a34a' }}>✓ Mot de passe mis à jour</span>}
                  </div>
                </div>

                <div className="acc-section">
                  <div className="acc-section-title">Déconnexion</div>
                  <div className="acc-section-desc">Déconnectez-vous de votre compte sur cet appareil.</div>
                  <button className="btn-danger" onClick={handleLogout}>Se déconnecter</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}