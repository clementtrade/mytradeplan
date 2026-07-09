'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppBackground from '../components/AppBackground'

type Trade = {
  id: string
  created_at: string
  instrument: string
  direction: string
  setup_type: string
  contexte: string
  zone: string
  cible: string
  confirmation: string
  followed_plan: boolean
  notes: string
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f1f8f4' }} />}>
      <JournalContent />
    </Suspense>
  )
}

function JournalContent() {
  const searchParams = useSearchParams()
  const prefilledDate = searchParams.get('date')

  const [trades, setTrades] = useState<Trade[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isPro, setIsPro] = useState(false)
  const [tradeLimitReached, setTradeLimitReached] = useState(false)
  const [tradesThisMonth, setTradesThisMonth] = useState(0)
  const [form, setForm] = useState({
    instrument: '',
    direction: 'long',
    setup_type: '',
    contexte: '',
    zone: '',
    cible: '',
    confirmation: '',
    followed_plan: true,
    notes: '',
    trade_date: '',
  })

  useEffect(() => {
    loadTrades()
    loadProfile()
  }, [])

  useEffect(() => {
    if (prefilledDate) {
      resetForm()
      setForm(f => ({ ...f, trade_date: prefilledDate }))
      setEditingId(null)
      setShowForm(true)
    }
  }, [prefilledDate])

  useEffect(() => {
    function closeMenu() { setMenuOpenId(null) }
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setIsPro(data.is_pro === true)
        if (!data.is_pro) {
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
          const { count } = await supabase
            .from('trades')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', startOfMonth)
          const c = count ?? 0
          setTradesThisMonth(c)
          if (c >= 5) setTradeLimitReached(true)
        }
      }
    }
  }

  async function loadTrades() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('trades').select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setTrades(data)
    setLoading(false)
  }

  function resetForm() {
    setForm({ instrument: '', direction: 'long', setup_type: '', contexte: '', zone: '', cible: '', confirmation: '', followed_plan: true, notes: '', trade_date: '' })
  }

  function startNewTrade() {
    resetForm()
    setEditingId(null)
    setShowForm(true)
  }

  function startEditTrade(trade: Trade) {
    setForm({
      instrument: trade.instrument || '',
      direction: trade.direction || 'long',
      setup_type: trade.setup_type || '',
      contexte: trade.contexte || '',
      zone: trade.zone || '',
      cible: trade.cible || '',
      confirmation: trade.confirmation || '',
      followed_plan: trade.followed_plan,
      notes: trade.notes || '',
      trade_date: '',
    })
    setEditingId(trade.id)
    setShowForm(true)
    setExpanded(null)
    setMenuOpenId(null)
  }

  async function saveTrade() {
    if (!form.instrument) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const payload: any = {
      instrument: form.instrument,
      direction: form.direction,
      setup_type: form.setup_type,
      contexte: form.contexte,
      zone: form.zone,
      cible: form.cible,
      confirmation: form.confirmation,
      followed_plan: form.followed_plan,
      notes: form.notes,
    }

    if (!editingId && form.trade_date) {
      payload.created_at = new Date(form.trade_date + 'T12:00:00').toISOString()
    }

    if (editingId) {
      await supabase.from('trades').update(payload).eq('id', editingId)
    } else {
      await supabase.from('trades').insert({ user_id: user?.id, ...payload })
      if (!isPro) {
        const newCount = tradesThisMonth + 1
        setTradesThisMonth(newCount)
        if (newCount >= 5) setTradeLimitReached(true)
      }
    }

    resetForm()
    setShowForm(false)
    setEditingId(null)
    loadTrades()
    setSaving(false)
  }

  async function deleteTrade(id: string) {
    setDeleting(true)
    await supabase.from('trades').delete().eq('id', id)
    setDeleteConfirmId(null)
    setExpanded(null)
    loadTrades()
    setDeleting(false)
  }

  const followedCount = trades.filter(t => t.followed_plan).length
  const disciplineRate = trades.length > 0 ? Math.round((followedCount / trades.length) * 100) : 0

  const sidebarW = sidebarExpanded ? 200 : 52
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CL'

  const inputStyle = {
    width: '100%', background: '#fff', border: '0.5px solid #e0e0e0',
    borderRadius: '6px', padding: '8px 12px', color: '#111', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit', resize: 'none' as const,
    boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
  }
  const labelStyle = { color: '#888', fontSize: '12px', fontWeight: 500, marginBottom: '5px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .journal-anim { animation: fadeUp 0.5s ease both; }
        .sidebar { position: fixed; left: 0; top: 0; height: 100vh; background: #fff; border-right: 0.5px solid #e8e8e8; display: flex; flex-direction: column; transition: width 0.2s cubic-bezier(0.4,0,0.2,1); overflow: hidden; z-index: 100; }
        .sb-logo { height: 52px; min-height: 52px; display: flex; align-items: center; padding: 0 14px; border-bottom: 0.5px solid #e8e8e8; white-space: nowrap; }
        .sb-dot { width: 24px; height: 24px; min-width: 24px; background: #111; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 800; }
        .sb-brand { font-size: 13px; font-weight: 700; color: #111; margin-left: 10px; letter-spacing: -0.3px; opacity: 0; transition: opacity 0.1s 0.07s; white-space: nowrap; }
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
        .nav-item.active .nav-lbl { color: #fff; }
        .trade-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 10px; overflow: visible; transition: box-shadow 0.2s, transform 0.2s; position: relative; }
        .trade-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .stat-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 10px; padding: 1rem 1.25rem; }
        .btn-primary { background: #111; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer; transition: opacity 0.15s; font-family: inherit; }
        .btn-primary:hover { opacity: 0.85; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-secondary { background: transparent; color: #666; border: 0.5px solid #e0e0e0; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .btn-secondary:hover { background: #f5f5f5; }
        .btn-danger { background: #fff5f5; color: #dc2626; border: 0.5px solid #fca5a5; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .btn-danger:hover { background: #fee2e2; }
        .form-input:focus { border-color: #111 !important; }
        .menu-btn { background: none; border: none; color: #bbb; font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; line-height: 1; }
        .menu-btn:hover { background: #f5f5f5; color: #666; }
        .menu-dropdown { position: absolute; top: 38px; right: 12px; background: #fff; border: 0.5px solid #e8e8e8; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); z-index: 50; min-width: 140px; overflow: hidden; }
        .menu-item { display: block; width: 100%; text-align: left; padding: 9px 14px; font-size: 13px; color: #333; background: none; border: none; cursor: pointer; font-family: inherit; }
        .menu-item:hover { background: #f5f5f5; }
        .menu-item.danger { color: #dc2626; }
        .menu-item.danger:hover { background: #fff5f5; }
        .confirm-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 300; }
        .confirm-box { background: #fff; border-radius: 14px; padding: 1.5rem; width: 360px; max-width: 90vw; }
      `}</style>

      {deleteConfirmId && (
        <div className="confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Supprimer ce trade ?</div>
            <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '1.25rem' }}>Cette action est définitive et ne peut pas être annulée.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-danger" onClick={() => deleteTrade(deleteConfirmId)} disabled={deleting}>
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
              <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

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
          <a href="/dashboard" className="nav-item"><span className="nav-icon">▦</span><span className="nav-lbl">Dashboard</span></a>
          <a href="/plan" className="nav-item"><span className="nav-icon">☀</span><span className="nav-lbl">Plan du matin</span></a>
          <a href="/debrief" className="nav-item"><span className="nav-icon">◈</span><span className="nav-lbl">Débrief Macro IA</span></a>
          <a href="/journal" className="nav-item active"><span className="nav-icon" style={{ fontSize: '13px', fontWeight: 700 }}>▤</span><span className="nav-lbl">Journal</span></a>
        </nav>
        <div className="sb-divider"></div>
        <div className="sb-section">Compte</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/account" className="nav-item"><span className="nav-icon">⚙</span><span className="nav-lbl">Mon compte</span></a>
        </nav>
      </div>

      <main style={{ marginLeft: sidebarW, flex: 1, minWidth: 0, position: 'relative', transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)', padding: '0 2rem 3rem' }}>
        <AppBackground />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>

          <div className="journal-anim" style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
            <span style={{ fontSize: '20px', fontWeight: 600, color: '#111', letterSpacing: '-0.5px', fontFamily: 'var(--font-serif)' }}>Journal de trades</span>
            <button
              className="btn-primary"
              onClick={() => { if (!tradeLimitReached) { setShowForm(!showForm); if (!showForm) startNewTrade() } }}
              disabled={tradeLimitReached && !editingId}
            >
              + Nouveau trade
            </button>
          </div>

          {tradeLimitReached && !isPro && (
            <div className="journal-anim" style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', marginBottom: '2px' }}>Limite atteinte — 5 trades / mois</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Vous avez utilisé vos 5 trades gratuits ce mois-ci. Passez au Pro pour des trades illimités.</div>
              </div>
              <a href="/account" style={{ background: '#111', color: '#fff', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: '1rem' }}>Passer au Pro</a>
            </div>
          )}

          {!tradeLimitReached && !isPro && (
            <div className="journal-anim" style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '10px 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: '#888', fontFamily: 'var(--font-mono)' }}>{tradesThisMonth} / 5 trades utilisés ce mois-ci</div>
              <a href="/account" style={{ fontSize: '12px', color: '#2a78d6', textDecoration: 'none', fontWeight: 500 }}>Passer au Pro pour des trades illimités</a>
            </div>
          )}

          <div className="journal-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Trades journalisés</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{trades.length}</div>
            </div>
            <div className="stat-card">
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Discipline (plan suivi)</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: disciplineRate >= 70 ? '#16a34a' : '#d97706', fontFamily: 'var(--font-mono)' }}>{trades.length === 0 ? '—' : `${disciplineRate}%`}</div>
            </div>
          </div>

          {showForm && !tradeLimitReached && (
            <div className="journal-anim" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>{editingId ? 'Modifier le trade' : 'Nouveau trade'}</div>
                {!editingId && form.trade_date && (
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: '#f0fdf4', color: '#16a34a', border: '0.5px solid #bbf7d0', fontFamily: 'var(--font-mono)' }}>
                    {new Date(form.trade_date + 'T12:00:00').toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={labelStyle}>Instrument</div>
                  <input className="form-input" placeholder="Instrument" value={form.instrument} onChange={e => setForm({ ...form, instrument: e.target.value })} style={inputStyle}/>
                </div>
                <div>
                  <div style={labelStyle}>Direction</div>
                  <select className="form-input" value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })} style={inputStyle}>
                    <option value="long">Long</option>
                    <option value="short">Short</option>
                  </select>
                </div>
                <div>
                  <div style={labelStyle}>Type de setup</div>
                  <select className="form-input" value={form.setup_type} onChange={e => setForm({ ...form, setup_type: e.target.value })} style={inputStyle}>
                    <option value="">Sélectionne...</option>
                    <option value="Break & retest">Break & retest</option>
                    <option value="Continuation">Continuation</option>
                    <option value="Mean reversion">Mean reversion</option>
                    <option value="Reversal">Reversal</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={labelStyle}>Contexte</div>
                <textarea className="form-input" placeholder="Décris le contexte de marché..." value={form.contexte} onChange={e => setForm({ ...form, contexte: e.target.value })} rows={2} style={inputStyle}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={labelStyle}>Zone</div>
                  <textarea className="form-input" placeholder="Zone d'entrée..." value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} rows={2} style={inputStyle}/>
                </div>
                <div>
                  <div style={labelStyle}>Cible</div>
                  <textarea className="form-input" placeholder="Cible visée..." value={form.cible} onChange={e => setForm({ ...form, cible: e.target.value })} rows={2} style={inputStyle}/>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={labelStyle}>Confirmation</div>
                <textarea className="form-input" placeholder="Tes critères de confirmation..." value={form.confirmation} onChange={e => setForm({ ...form, confirmation: e.target.value })} rows={3} style={inputStyle}/>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={labelStyle}>Notes / état mental</div>
                <textarea className="form-input" placeholder="Notes et état mental..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={inputStyle}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <input type="checkbox" id="followedPlan" checked={form.followed_plan} onChange={e => setForm({ ...form, followed_plan: e.target.checked })}/>
                <label htmlFor="followedPlan" style={{ color: '#555', fontSize: '13px', cursor: 'pointer' }}>J'ai suivi mon plan</label>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary" onClick={saveTrade} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Sauvegarde...' : editingId ? 'Mettre à jour' : 'Sauvegarder'}
                </button>
                <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); resetForm() }}>Annuler</button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa', fontSize: '14px' }}>Chargement...</div>
          ) : trades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa', fontSize: '14px' }}>Aucun trade encore. Clique sur "+ Nouveau trade" pour commencer.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trades.map(trade => (
                <div key={trade.id} className="trade-card">
                  <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '90px 70px 80px 130px 1fr 110px 36px', alignItems: 'center', gap: '12px' }}>
                    <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ color: '#aaa', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>{new Date(trade.created_at).toLocaleDateString('fr-FR')}</div>
                    <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ color: '#111', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>{trade.instrument}</div>
                    <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: trade.direction === 'long' ? '#dcfce7' : '#fee2e2', color: trade.direction === 'long' ? '#16a34a' : '#dc2626', fontWeight: 600, textAlign: 'center', cursor: 'pointer', fontFamily: 'var(--font-mono)', letterSpacing: '1.5px' }}>
                      {trade.direction.toUpperCase()}
                    </div>
                    <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ fontSize: '12px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>{trade.setup_type || '—'}</div>
                    <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ color: '#666', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>{trade.contexte}</div>
                    <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ fontSize: '12px', color: trade.followed_plan ? '#16a34a' : '#d97706', cursor: 'pointer', textAlign: 'right' }}>{trade.followed_plan ? '✓ Plan suivi' : '⚠ Hors plan'}</div>
                    <div style={{ position: 'relative', textAlign: 'right' }}>
                      <button className="menu-btn" onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === trade.id ? null : trade.id) }}>⋯</button>
                      {menuOpenId === trade.id && (
                        <div className="menu-dropdown" onClick={e => e.stopPropagation()}>
                          <button className="menu-item" onClick={() => startEditTrade(trade)}>Modifier</button>
                          <button className="menu-item danger" onClick={() => { setDeleteConfirmId(trade.id); setMenuOpenId(null) }}>Supprimer</button>
                        </div>
                      )}
                    </div>
                  </div>
                  {expanded === trade.id && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '0.5px solid #f5f5f5' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '1rem' }}>
                        {trade.zone && <div><div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Zone</div><div style={{ fontSize: '13px', color: '#333' }}>{trade.zone}</div></div>}
                        {trade.cible && <div><div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Cible</div><div style={{ fontSize: '13px', color: '#333' }}>{trade.cible}</div></div>}
                        {trade.confirmation && <div><div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Confirmation</div><div style={{ fontSize: '13px', color: '#333' }}>{trade.confirmation}</div></div>}
                        {trade.contexte && <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Contexte</div><div style={{ fontSize: '13px', color: '#333' }}>{trade.contexte}</div></div>}
                        {trade.notes && <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Notes</div><div style={{ fontSize: '13px', color: '#333' }}>{trade.notes}</div></div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}