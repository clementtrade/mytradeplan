'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Trade = {
  id: string
  created_at: string
  instrument: string
  direction: string
  contexte: string
  zone: string
  cible: string
  confirmation: string
  result_r: number
  followed_plan: boolean
  notes: string
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    instrument: '',
    direction: 'long',
    contexte: '',
    zone: '',
    cible: '',
    confirmation: '',
    result_r: '',
    followed_plan: true,
    notes: '',
  })

  useEffect(() => { loadTrades() }, [])

  async function loadTrades() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setTrades(data)
    setLoading(false)
  }

  async function saveTrade() {
    if (!form.instrument || !form.result_r) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('trades').insert({
      user_id: user?.id,
      instrument: form.instrument,
      direction: form.direction,
      contexte: form.contexte,
      zone: form.zone,
      cible: form.cible,
      confirmation: form.confirmation,
      result_r: parseFloat(form.result_r),
      followed_plan: form.followed_plan,
      notes: form.notes,
    })
    if (!error) {
      setForm({ instrument: '', direction: 'long', contexte: '', zone: '', cible: '', confirmation: '', result_r: '', followed_plan: true, notes: '' })
      setShowForm(false)
      loadTrades()
    }
    setSaving(false)
  }

  const totalR = trades.reduce((sum, t) => sum + t.result_r, 0)
  const wins = trades.filter(t => t.result_r > 0)
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0

  const inputStyle = {
    width: '100%',
    background: '#fff',
    border: '0.5px solid #e0e0e0',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#111',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none' as const,
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
  }

  const labelStyle = {
    color: '#888',
    fontSize: '12px',
    fontWeight: 500,
    marginBottom: '5px',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .journal-anim { animation: fadeUp 0.6s ease both; }
        .trade-card {
          background: #fff;
          border: 0.5px solid #e8e8e8;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .trade-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .stat-card {
          background: #fff;
          border: 0.5px solid #e8e8e8;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .btn-primary {
          background: #111; color: #fff; border: none; border-radius: 8px;
          padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s, transform 0.2s;
          font-family: inherit;
        }
        .btn-primary:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.22); transform: translateY(-1px); }
        .btn-secondary {
          background: transparent; color: #666; border: 0.5px solid #e0e0e0;
          border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer;
          font-family: inherit; transition: background 0.15s;
        }
        .btn-secondary:hover { background: #f5f5f5; }
        .form-input:focus { border-color: #111 !important; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
        .nav-link { color: #666; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #111; }
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Navbar */}
        <div className="journal-anim" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '0.5px solid #e8e8e8' }}>
          <a href="/dashboard" style={{ fontWeight: 700, fontSize: '1rem', color: '#111', textDecoration: 'none', letterSpacing: '-0.3px' }}>MyTradePlan</a>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/plan" className="nav-link">Plan du matin</a>
            <a href="/journal" className="nav-link" style={{ color: '#111', fontWeight: 600 }}>Journal</a>
            <a href="/stats" className="nav-link">Stats</a>
          </div>
        </div>

        {/* Header */}
        <div className="journal-anim" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px', marginBottom: '4px' }}>Journal de trades</h1>
            <div style={{ color: '#888', fontSize: '13px' }}>{trades.length} trades enregistrés</div>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Nouveau trade
          </button>
        </div>

        {/* Stats cards */}
        <div className="journal-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Total R</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: totalR >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>
              {totalR >= 0 ? '+' : ''}{totalR.toFixed(2)}R
            </div>
          </div>
          <div className="stat-card">
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Win Rate</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>{winRate}%</div>
          </div>
          <div className="stat-card">
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Trades</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>{trades.length}</div>
          </div>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="journal-anim" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '1.25rem', letterSpacing: '-0.2px' }}>Nouveau trade</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={labelStyle}>Instrument</div>
                <input className="form-input" placeholder="Instrument" value={form.instrument} onChange={e => setForm({ ...form, instrument: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Direction</div>
                <select className="form-input" value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })} style={inputStyle}>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </div>
              <div>
                <div style={labelStyle}>Résultat (R)</div>
                <input className="form-input" type="number" step="0.1" placeholder="0" value={form.result_r} onChange={e => setForm({ ...form, result_r: e.target.value })} style={{ ...inputStyle, color: parseFloat(form.result_r) >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={labelStyle}>Contexte</div>
              <textarea className="form-input" placeholder="Décris le contexte de marché..." value={form.contexte} onChange={e => setForm({ ...form, contexte: e.target.value })} rows={2} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={labelStyle}>Zone</div>
                <textarea className="form-input" placeholder="Zone d'entrée..." value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} rows={2} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Cible</div>
                <textarea className="form-input" placeholder="Cible visée..." value={form.cible} onChange={e => setForm({ ...form, cible: e.target.value })} rows={2} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={labelStyle}>Confirmation</div>
              <textarea className="form-input" placeholder="Tes critères de confirmation..." value={form.confirmation} onChange={e => setForm({ ...form, confirmation: e.target.value })} rows={3} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={labelStyle}>Notes / état mental</div>
              <textarea className="form-input" placeholder="Notes et état mental..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <input type="checkbox" id="followedPlan" checked={form.followed_plan} onChange={e => setForm({ ...form, followed_plan: e.target.checked })} />
              <label htmlFor="followedPlan" style={{ color: '#555', fontSize: '13px', cursor: 'pointer' }}>J'ai suivi mon plan</label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" onClick={saveTrade} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </div>
        )}

        {/* Liste des trades */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa', fontSize: '14px' }}>Chargement...</div>
        ) : trades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa', fontSize: '14px' }}>Aucun trade encore. Clique sur "+ Nouveau trade" pour commencer.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {trades.map(trade => (
              <div key={trade.id} className="trade-card">
                <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '90px 80px 1fr 1fr 110px 80px', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ color: '#aaa', fontSize: '12px' }}>
                    {new Date(trade.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div style={{ color: '#111', fontWeight: 600, fontSize: '14px' }}>{trade.instrument}</div>
                  <div style={{ color: '#666', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.contexte}</div>
                  <div style={{ color: '#666', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.zone}</div>
                  <div style={{ fontSize: '12px', color: trade.followed_plan ? '#16a34a' : '#d97706' }}>
                    {trade.followed_plan ? '✓ Plan suivi' : '⚠ Hors plan'}
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: '16px', color: trade.result_r >= 0 ? '#16a34a' : '#dc2626' }}>
                    {trade.result_r >= 0 ? '+' : ''}{trade.result_r}R
                  </div>
                </div>

                {expanded === trade.id && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '0.5px solid #f0f0f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div><div style={labelStyle}>Contexte</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.contexte || '—'}</div></div>
                    <div><div style={labelStyle}>Zone</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.zone || '—'}</div></div>
                    <div><div style={labelStyle}>Cible</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.cible || '—'}</div></div>
                    <div><div style={labelStyle}>Confirmation</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.confirmation || '—'}</div></div>
                    {trade.notes && <div style={{ gridColumn: '1 / -1' }}><div style={labelStyle}>Notes</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.notes}</div></div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}