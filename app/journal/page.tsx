'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Papa from 'papaparse'

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
  result_r: number
  followed_plan: boolean
  notes: string
  is_imported?: boolean
}

type ParsedRow = Record<string, string>

const FIELD_DEFS = [
  { key: 'instrument', label: 'Instrument', required: true, aliases: ['instrument', 'symbol', 'ticker', 'contract', 'pair'] },
  { key: 'direction', label: 'Direction', required: true, aliases: ['direction', 'side', 'type', 'b/s', 'action'] },
  { key: 'result_r', label: 'Résultat (R ou PnL)', required: true, aliases: ['result_r', 'pnl', 'p&l', 'p/l', 'profit', 'résultat', 'net pnl', 'realized pnl'] },
  { key: 'created_at', label: 'Date / Entry', required: false, aliases: ['date', 'time', 'datetime', 'entry date', 'open time', 'entry time'] },
]

function normalize(s: string) {
  return s.toLowerCase().trim().replace(/[_\-\s]+/g, ' ')
}

function autoDetectColumn(headers: string[], aliases: string[]): string {
  const normalizedHeaders = headers.map(h => ({ raw: h, norm: normalize(h) }))
  for (const alias of aliases) {
    const exact = normalizedHeaders.find(h => h.norm === alias)
    if (exact) return exact.raw
  }
  for (const alias of aliases) {
    const partial = normalizedHeaders.find(h => h.norm.includes(alias))
    if (partial) return partial.raw
  }
  return ''
}

function normalizeDirection(val: string): string {
  const v = val.toLowerCase().trim()
  if (['long', 'buy', 'b', '1', 'achat'].includes(v)) return 'long'
  if (['short', 'sell', 's', '-1', 'vente'].includes(v)) return 'short'
  return v || 'long'
}

function parseResultR(val: string): number {
  const cleaned = val.replace(/[^0-9.,\-]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function parseDateLoose(val: string): number {
  if (!val) return 0
  const cleaned = val.replace(' @ ', ' ')
  const t = Date.parse(cleaned)
  return isNaN(t) ? 0 : t
}

type RawFill = {
  instrument: string
  direction: string
  result_r: number
  created_at: string
  sortKey: number
}

function mergeFills(fills: RawFill[]): RawFill[] {
  const grouped: Record<string, RawFill[]> = {}
  for (const fill of fills) {
    const key = fill.instrument
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(fill)
  }

  const merged: RawFill[] = []

  for (const instrument of Object.keys(grouped)) {
    const sorted = [...grouped[instrument]].sort((a, b) => a.sortKey - b.sortKey)
    let current: RawFill | null = null

    for (const fill of sorted) {
      if (current && current.direction === fill.direction) {
        current.result_r = parseFloat((current.result_r + fill.result_r).toFixed(2))
        if (fill.sortKey > current.sortKey) {
          current.sortKey = fill.sortKey
        }
      } else {
        if (current) merged.push(current)
        current = { ...fill }
      }
    }
    if (current) merged.push(current)
  }

  return merged.sort((a, b) => b.sortKey - a.sortKey)
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({
    instrument: '',
    direction: 'long',
    setup_type: '',
    contexte: '',
    zone: '',
    cible: '',
    confirmation: '',
    result_r: '',
    followed_plan: true,
    notes: '',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStep, setImportStep] = useState<'closed' | 'drop' | 'mapping' | 'preview' | 'importing'>('closed')
  const [isDragging, setIsDragging] = useState(false)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [importError, setImportError] = useState('')

  useEffect(() => {
    loadTrades()
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
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
    setForm({ instrument: '', direction: 'long', setup_type: '', contexte: '', zone: '', cible: '', confirmation: '', result_r: '', followed_plan: true, notes: '' })
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
      result_r: trade.result_r?.toString() || '',
      followed_plan: trade.followed_plan,
      notes: trade.notes || '',
    })
    setEditingId(trade.id)
    setShowForm(true)
    setExpanded(null)
  }

  async function saveTrade() {
    if (!form.instrument || !form.result_r) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      instrument: form.instrument,
      direction: form.direction,
      setup_type: form.setup_type,
      contexte: form.contexte,
      zone: form.zone,
      cible: form.cible,
      confirmation: form.confirmation,
      result_r: parseFloat(form.result_r),
      followed_plan: form.followed_plan,
      notes: form.notes,
    }

    if (editingId) {
      const isComplete = form.setup_type && form.contexte
      await supabase.from('trades').update({ ...payload, is_imported: !isComplete }).eq('id', editingId)
    } else {
      await supabase.from('trades').insert({ user_id: user?.id, ...payload })
    }

    resetForm()
    setShowForm(false)
    setEditingId(null)
    loadTrades()
    setSaving(false)
  }

  function openImportModal() {
    setImportStep('drop')
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function processFile(file: File) {
    setImportError('')
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setImportError('Le fichier doit être au format .csv')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const rows = results.data as ParsedRow[]
        if (headers.length === 0 || rows.length === 0) {
          setImportError('Le fichier CSV est vide ou illisible.')
          return
        }
        const autoMapping: Record<string, string> = {}
        for (const field of FIELD_DEFS) {
          autoMapping[field.key] = autoDetectColumn(headers, field.aliases)
        }
        setCsvHeaders(headers)
        setCsvRows(rows)
        setMapping(autoMapping)
        setImportStep('mapping')
      },
      error: () => {
        setImportError('Impossible de lire ce fichier. Vérifie le format CSV.')
      }
    })
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function buildRawFills(): RawFill[] {
    return csvRows.map(row => {
      const instrument = mapping.instrument ? row[mapping.instrument] || '' : ''
      const directionRaw = mapping.direction ? row[mapping.direction] || '' : ''
      const resultRaw = mapping.result_r ? row[mapping.result_r] || '0' : '0'
      const dateRaw = mapping.created_at ? row[mapping.created_at] || '' : ''
      return {
        instrument: instrument.trim(),
        direction: normalizeDirection(directionRaw),
        result_r: parseResultR(resultRaw),
        created_at: dateRaw,
        sortKey: parseDateLoose(dateRaw),
      }
    }).filter(t => t.instrument)
  }

  function buildPreviewTrades() {
    const rawFills = buildRawFills()
    return mergeFills(rawFills)
  }

  async function confirmImport() {
    setImportStep('importing')
    const { data: { user } } = await supabase.auth.getUser()
    const preview = buildPreviewTrades()

    const rowsToInsert = preview.map(t => ({
      user_id: user?.id,
      instrument: t.instrument,
      direction: t.direction,
      result_r: t.result_r,
      setup_type: '',
      contexte: '',
      zone: '',
      cible: '',
      confirmation: '',
      followed_plan: false,
      notes: '',
      is_imported: true,
    }))

    const { error } = await supabase.from('trades').insert(rowsToInsert)
    if (error) {
      setImportError("Erreur lors de l'import. Vérifie le mapping des colonnes.")
      setImportStep('preview')
      return
    }

    closeImport()
    loadTrades()
  }

  function closeImport() {
    setImportStep('closed')
    setIsDragging(false)
    setCsvHeaders([])
    setCsvRows([])
    setMapping({})
    setImportError('')
  }

  const rawFillsCount = importStep === 'mapping' ? buildRawFills().length : 0
  const previewTrades = importStep === 'preview' || importStep === 'importing' ? buildPreviewTrades() : []
  const fillsMergedCount = rawFillsCount - previewTrades.length
  const missingRequired = FIELD_DEFS.filter(f => f.required && !mapping[f.key])

  const totalR = trades.reduce((sum, t) => sum + t.result_r, 0)
  const wins = trades.filter(t => t.result_r > 0)
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0
  const toCompleteCount = trades.filter(t => t.is_imported).length

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

        .trade-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 10px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; }
        .trade-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .trade-card.incomplete { border-color: #fde68a; }
        .stat-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 10px; padding: 1rem 1.25rem; }
        .btn-primary { background: #111; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer; transition: opacity 0.15s; font-family: inherit; }
        .btn-primary:hover { opacity: 0.85; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-secondary { background: transparent; color: #666; border: 0.5px solid #e0e0e0; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .btn-secondary:hover { background: #f5f5f5; }
        .form-input:focus { border-color: #111 !important; }
        .badge-incomplete { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: #fffbeb; color: #d97706; border: 0.5px solid #fde68a; white-space: nowrap; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 2rem; }
        .modal-box { background: #fff; border-radius: 16px; padding: 1.75rem; width: 640px; max-width: 95vw; max-height: 88vh; overflow-y: auto; }
        .modal-box-sm { background: #fff; border-radius: 16px; padding: 1.75rem; width: 520px; max-width: 95vw; }
        .map-row { display: grid; grid-template-columns: 160px 1fr; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 0.5px solid #f2f2f2; }
        .map-row:last-child { border-bottom: none; }
        .map-select { width: 100%; background: #fff; border: 0.5px solid #e0e0e0; border-radius: 6px; padding: 7px 10px; color: #111; font-size: 13px; font-family: inherit; }
        .dropzone { border: 1.5px dashed #d0d0d0; border-radius: 12px; padding: 2.5rem 1.5rem; text-align: center; background: #fafafa; transition: border-color 0.15s, background 0.15s; cursor: pointer; }
        .dropzone.dragging { border-color: #111; background: #f5f5f5; }
        .dropzone-icon { width: 44px; height: 44px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 20px; transition: background 0.15s; }
        .dropzone.dragging .dropzone-icon { background: #111; color: #fff; }
      `}</style>

      <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileSelected} />

      {importStep === 'drop' && (
        <div className="modal-overlay" onClick={closeImport}>
          <div className="modal-box-sm" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Importer un CSV</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Export de ta plateforme broker</div>
              </div>
              <button onClick={closeImport} style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>✕</button>
            </div>

            <div
              className={`dropzone${isDragging ? ' dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
            >
              <div className="dropzone-icon">{isDragging ? '⬇' : '↑'}</div>
              {isDragging ? (
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>Relâche pour importer</div>
              ) : (
                <>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Glisse ton fichier CSV ici</div>
                  <div style={{ fontSize: '12.5px', color: '#aaa', marginBottom: '1.25rem' }}>ou clique pour parcourir tes fichiers</div>
                  <button className="btn-primary" onClick={(e) => { e.stopPropagation(); openFilePicker() }}>Choisir un fichier</button>
                </>
              )}
            </div>

            {importError && (
              <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginTop: '1rem' }}>
                {importError}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#aaa', marginTop: '1rem' }}>
              Format accepté : .csv, exporté depuis ta plateforme de trading
            </div>
          </div>
        </div>
      )}

      {importStep === 'mapping' && (
        <div className="modal-overlay" onClick={closeImport}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#111' }}>Importer un CSV</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{csvRows.length} ligne{csvRows.length > 1 ? 's' : ''} détectée{csvRows.length > 1 ? 's' : ''}</div>
              </div>
              <button onClick={closeImport} style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ fontSize: '12.5px', color: '#888', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Associe les colonnes de ton fichier aux champs MyTradePlan. Les lignes du même contrat et de la même direction seront automatiquement fusionnées en un seul trade.
              Les champs d'analyse (setup, contexte, zone...) seront à compléter manuellement après l'import.
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              {FIELD_DEFS.map(field => (
                <div key={field.key} className="map-row">
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>
                    {field.label}{field.required && <span style={{ color: '#dc2626' }}> *</span>}
                  </div>
                  <select
                    className="map-select"
                    value={mapping[field.key] || ''}
                    onChange={e => setMapping({ ...mapping, [field.key]: e.target.value })}
                  >
                    <option value="">— Aucune colonne —</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {missingRequired.length > 0 && (
              <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem' }}>
                Champs obligatoires manquants : {missingRequired.map(f => f.label).join(', ')}
              </div>
            )}
            {importError && (
              <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem' }}>
                {importError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" disabled={missingRequired.length > 0} onClick={() => setImportStep('preview')}>
                Voir l'aperçu →
              </button>
              <button className="btn-secondary" onClick={() => setImportStep('drop')}>← Retour</button>
            </div>
          </div>
        </div>
      )}

      {(importStep === 'preview' || importStep === 'importing') && (
        <div className="modal-overlay" onClick={() => importStep === 'preview' && closeImport()}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: '#111' }}>Aperçu de l'import</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                  {previewTrades.length} trade{previewTrades.length > 1 ? 's' : ''} prêt{previewTrades.length > 1 ? 's' : ''} à importer
                  {fillsMergedCount > 0 && ` · ${rawFillsCount} fills fusionnés`}
                </div>
              </div>
              {importStep === 'preview' && (
                <button onClick={() => setImportStep('mapping')} style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>← Mapping</button>
              )}
            </div>

            <div style={{ border: '0.5px solid #e8e8e8', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 1fr', background: '#f9f9f9', padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                <div>Instrument</div><div>Direction</div><div>Résultat</div><div>Date</div>
              </div>
              {previewTrades.slice(0, 6).map((t, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 1fr', padding: '8px 12px', fontSize: '13px', borderTop: '0.5px solid #f2f2f2' }}>
                  <div style={{ color: '#111', fontWeight: 500 }}>{t.instrument}</div>
                  <div style={{ color: t.direction === 'long' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{t.direction}</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: t.result_r >= 0 ? '#16a34a' : '#dc2626' }}>{t.result_r >= 0 ? '+' : ''}{t.result_r}</div>
                  <div style={{ color: '#888' }}>{t.created_at || '—'}</div>
                </div>
              ))}
              {previewTrades.length > 6 && (
                <div style={{ padding: '8px 12px', fontSize: '12px', color: '#aaa', borderTop: '0.5px solid #f2f2f2' }}>
                  + {previewTrades.length - 6} autres trades...
                </div>
              )}
            </div>

            <div style={{ background: '#fffbeb', border: '0.5px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#92400e', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Ces trades seront marqués "À compléter" — tu pourras ajouter le setup, le contexte et tes notes ensuite directement dans le journal.
            </div>

            {importError && (
              <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem' }}>
                {importError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" onClick={confirmImport} disabled={importStep === 'importing'}>
                {importStep === 'importing' ? 'Import en cours...' : `Importer ${previewTrades.length} trade${previewTrades.length > 1 ? 's' : ''}`}
              </button>
              <button className="btn-secondary" onClick={closeImport} disabled={importStep === 'importing'}>Annuler</button>
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
        <a href="/settings" className="profile-btn">
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
          <a href="/journal" className="nav-item active">
            <span className="nav-icon" style={{ fontSize: '13px', fontWeight: 700 }}>▤</span>
            <span className="nav-lbl">Journal</span>
          </a>
        </nav>
        <div className="sb-divider"></div>
        <div className="sb-section">Compte</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/settings" className="nav-item">
            <span className="nav-icon">⚙</span>
            <span className="nav-lbl">Paramètres</span>
          </a>
        </nav>
      </div>

      <main style={{ marginLeft: sidebarW, flex: 1, minWidth: 0, transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)', padding: '0 2rem 3rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          <div className="journal-anim" style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#111', letterSpacing: '-0.5px' }}>Journal de trades</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" onClick={openImportModal}>↑ Importer CSV</button>
              <button className="btn-primary" onClick={() => { setShowForm(!showForm); if (!showForm) startNewTrade() }}>+ Nouveau trade</button>
            </div>
          </div>

          <div className="journal-anim" style={{ display: 'grid', gridTemplateColumns: toCompleteCount > 0 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Total R</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: totalR >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>{totalR >= 0 ? '+' : ''}{totalR.toFixed(2)}R</div>
            </div>
            <div className="stat-card">
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Win Rate</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>{winRate}%</div>
            </div>
            <div className="stat-card">
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Trades</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>{trades.length}</div>
            </div>
            {toCompleteCount > 0 && (
              <div className="stat-card" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
                <div style={{ color: '#d97706', fontSize: '12px', marginBottom: '4px' }}>À compléter</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#d97706', fontFamily: 'monospace' }}>{toCompleteCount}</div>
              </div>
            )}
          </div>

          {showForm && (
            <div className="journal-anim" style={{ background: '#fff', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{editingId ? 'Modifier le trade' : 'Nouveau trade'}</div>
                {editingId && trades.find(t => t.id === editingId)?.is_imported && (
                  <span className="badge-incomplete">Importé du broker</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                <div>
                  <div style={labelStyle}>Résultat (R)</div>
                  <input className="form-input" type="number" step="0.1" placeholder="0" value={form.result_r} onChange={e => setForm({ ...form, result_r: e.target.value })} style={{ ...inputStyle, color: parseFloat(form.result_r) >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}/>
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
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa', fontSize: '14px' }}>Aucun trade encore. Clique sur "+ Nouveau trade" ou importe ton historique en CSV.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trades.map(trade => (
                <div key={trade.id} className={`trade-card${trade.is_imported ? ' incomplete' : ''}`}>
                  <div onClick={() => setExpanded(expanded === trade.id ? null : trade.id)} style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '90px 70px 80px 110px 1fr 110px 80px', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{new Date(trade.created_at).toLocaleDateString('fr-FR')}</div>
                    <div style={{ color: '#111', fontWeight: 600, fontSize: '14px' }}>{trade.instrument}</div>
                    <div style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: trade.direction === 'long' ? '#dcfce7' : '#fee2e2', color: trade.direction === 'long' ? '#16a34a' : '#dc2626', fontWeight: 600, textAlign: 'center' }}>
                      {trade.direction.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {trade.is_imported ? <span className="badge-incomplete">À compléter</span> : <span style={{ color: '#555' }}>{trade.setup_type || '—'}</span>}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trade.contexte}</div>
                    <div style={{ fontSize: '12px', color: trade.followed_plan ? '#16a34a' : '#d97706' }}>{trade.followed_plan ? '✓ Plan suivi' : '⚠ Hors plan'}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: '16px', color: trade.result_r >= 0 ? '#16a34a' : '#dc2626' }}>
                      {trade.result_r >= 0 ? '+' : ''}{trade.result_r}R
                    </div>
                  </div>

                  {expanded === trade.id && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '0.5px solid #f0f0f0', marginTop: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', marginBottom: '1rem' }}>
                        <div><div style={labelStyle}>Setup</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.setup_type || '—'}</div></div>
                        <div><div style={labelStyle}>Contexte</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.contexte || '—'}</div></div>
                        <div><div style={labelStyle}>Zone</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.zone || '—'}</div></div>
                        <div><div style={labelStyle}>Cible</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.cible || '—'}</div></div>
                        <div><div style={labelStyle}>Confirmation</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.confirmation || '—'}</div></div>
                        {trade.notes && <div><div style={labelStyle}>Notes</div><div style={{ color: '#444', fontSize: '13px', lineHeight: 1.6 }}>{trade.notes}</div></div>}
                      </div>
                      <button className="btn-primary" onClick={() => startEditTrade(trade)}>
                        {trade.is_imported ? 'Compléter ce trade' : 'Modifier'}
                      </button>
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