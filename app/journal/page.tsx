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

  useEffect(() => {
    loadTrades()
  }, [])

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
    background: '#0A0E1A',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none' as const,
  }

  const labelStyle = {
    color: 'rgba(229,231,235,0.4)',
    fontSize: '11px',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A0E1A', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 600, marginBottom: '4px' }}>Journal</h1>
            <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '13px', fontFamily: 'monospace' }}>
              {trades.length} trades · Win rate {winRate}% · Total {totalR >= 0 ? '+' : ''}{totalR.toFixed(2)}R
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: '#10B981', color: 'black', border: 'none', borderRadius: '8px', padding: '10px 20px', fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            + Nouveau trade
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ color: '#10B981', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1px', marginBottom: '1.25rem' }}>NOUVEAU TRADE</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={labelStyle}>Instrument</div>
                <input placeholder="ES, NQ, MES..." value={form.instrument} onChange={e => setForm({ ...form, instrument: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Direction</div>
                <select value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })} style={inputStyle}>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                </select>
              </div>
              <div>
                <div style={labelStyle}>Résultat (R)</div>
                <input type="number" step="0.1" placeholder="+2.8" value={form.result_r} onChange={e => setForm({ ...form, result_r: e.target.value })} style={{ ...inputStyle, color: parseFloat(form.result_r) >= 0 ? '#10B981' : '#EF4444', fontWeight: 700, fontFamily: 'monospace' }} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={labelStyle}>Contexte</div>
              <textarea placeholder="Gamma+ / Vanna+ / VIX down / tendance haussière..." value={form.contexte} onChange={e => setForm({ ...form, contexte: e.target.value })} rows={2} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={labelStyle}>Zone</div>
                <textarea placeholder="RTH LVN + RTH VAL..." value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} rows={2} style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Cible</div>
                <textarea placeholder="Call wall à fort vanna + PDH..." value={form.cible} onChange={e => setForm({ ...form, cible: e.target.value })} rows={2} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={labelStyle}>Confirmation</div>
              <textarea placeholder="1) Profil développé 2) Vendeurs échoués 2x 3) CVD +4000..." value={form.confirmation} onChange={e => setForm({ ...form, confirmation: e.target.value })} rows={3} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={labelStyle}>Notes / état mental</div>
              <textarea placeholder="Ce que tu aurais pu mieux faire..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <input type="checkbox" id="followedPlan" checked={form.followed_plan} onChange={e => setForm({ ...form, followed_plan: e.target.checked })} />
              <label htmlFor="followedPlan" style={{ color: 'rgba(229,231,235,0.6)', fontSize: '13px', cursor: 'pointer' }}>J'ai suivi mon plan</label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={saveTrade} disabled={saving} style={{ background: '#10B981', color: 'black', border: 'none', borderRadius: '6px', padding: '10px 20px', fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', color: 'rgba(229,231,235,0.5)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer' }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(229,231,235,0.3)', fontSize: '14px' }}>Chargement...</div>
        ) : trades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'rgba(229,231,235,0.3)', fontSize: '14px' }}>Aucun trade encore. Clique sur "+ Nouveau trade" pour commencer.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {trades.map(trade => (
              <div key={trade.id} style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
                <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '80px 80px 1fr 1fr 100px 80px', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <div style={{ color: 'rgba(229,231,235,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>
                    {new Date(trade.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{trade.instrument}</div>
                  <div style={{ color: 'rgba(229,231,235,0.6)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.contexte}</div>
                  <div style={{ color: 'rgba(229,231,235,0.6)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.zone}</div>
                  <div style={{ fontSize: '12px', color: trade.followed_plan ? '#10B981' : '#F59E0B' }}>
                    {trade.followed_plan ? '✓ Plan suivi' : '⚠ Hors plan'}
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: '16px', color: trade.result_r >= 0 ? '#10B981' : '#EF4444' }}>
                    {trade.result_r >= 0 ? '+' : ''}{trade.result_r}R
                  </div>
                </div>

                {expanded === trade.id && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div><div style={labelStyle}>Contexte</div><div style={{ color: 'rgba(229,231,235,0.7)', fontSize: '13px', lineHeight: 1.6 }}>{trade.contexte || '—'}</div></div>
                    <div><div style={labelStyle}>Zone</div><div style={{ color: 'rgba(229,231,235,0.7)', fontSize: '13px', lineHeight: 1.6 }}>{trade.zone || '—'}</div></div>
                    <div><div style={labelStyle}>Cible</div><div style={{ color: 'rgba(229,231,235,0.7)', fontSize: '13px', lineHeight: 1.6 }}>{trade.cible || '—'}</div></div>
                    <div><div style={labelStyle}>Confirmation</div><div style={{ color: 'rgba(229,231,235,0.7)', fontSize: '13px', lineHeight: 1.6 }}>{trade.confirmation || '—'}</div></div>
                    {trade.notes && <div style={{ gridColumn: '1 / -1' }}><div style={labelStyle}>Notes</div><div style={{ color: 'rgba(229,231,235,0.7)', fontSize: '13px', lineHeight: 1.6 }}>{trade.notes}</div></div>}
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