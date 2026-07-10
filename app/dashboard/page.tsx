'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Papa from 'papaparse'
import AppBackground from '../components/AppBackground'

type Trade = {
  id: string
  created_at: string
  instrument: string
  direction: string
  setup_type: string
  contexte: string
  followed_plan: boolean
  notes: string
  rr_initial: number | null
  rr_realise: number | null
}

type RRExitCategoryKey = 'sous' | 'tenue' | 'audela'

function getRRExitCategory(trade: Trade): { key: RRExitCategoryKey; label: string } {
  const { rr_initial, rr_realise } = trade
  // Un trade perdant tombe toujours "sous la cible", quel que soit le signe de rr_initial.
  if (rr_realise !== null && rr_realise < 0) return { key: 'sous', label: 'Sous la cible' }
  const ratio = (rr_realise as number) / (rr_initial as number)
  if (ratio < 0.9) return { key: 'sous', label: 'Sous la cible' }
  if (ratio <= 1.1) return { key: 'tenue', label: 'Cible tenue' }
  return { key: 'audela', label: 'Au-delà' }
}

const SETUP_FILTER_OPTIONS = ['Tous', 'Break & retest', 'Mean reversion', 'Reversal', 'Continuation', 'Autre']

// Stats RR (donut + courbe + repartition) calculees sur une liste de trades donnee.
// Reutilise pour la carte globale (tous les trades) et pour la section "Analyse par setup" (trades filtres).
function computeRRStats(list: Trade[]) {
  const rrTrades = list.filter(t => t.rr_initial != null && t.rr_realise != null && (t.rr_initial as number) > 0)
  const rrCount = rrTrades.length
  const avgRRInitial = rrCount > 0 ? rrTrades.reduce((s, t) => s + (t.rr_initial as number), 0) / rrCount : 0
  const avgRRRealise = rrCount > 0 ? rrTrades.reduce((s, t) => s + (t.rr_realise as number), 0) / rrCount : 0
  const capturedPct = avgRRInitial > 0 ? Math.min(100, Math.max(0, (avgRRRealise / avgRRInitial) * 100)) : 0
  const capturedCircumference = 2 * Math.PI * 22
  const capturedOffset = capturedCircumference - (capturedPct / 100) * capturedCircumference

  const chrono = [...rrTrades].sort((a, b) => a.created_at.localeCompare(b.created_at))
  let cumRealiseAcc = 0
  let cumInitialAcc = 0
  const realiseCurve: number[] = []
  const initialCurve: number[] = []
  chrono.forEach(t => {
    cumRealiseAcc += t.rr_realise as number
    cumInitialAcc += t.rr_initial as number
    realiseCurve.push(parseFloat(cumRealiseAcc.toFixed(2)))
    initialCurve.push(parseFloat(cumInitialAcc.toFixed(2)))
  })
  const cumulativeGap = parseFloat((cumInitialAcc - cumRealiseAcc).toFixed(1))

  const catCounts = { sous: 0, tenue: 0, audela: 0 }
  rrTrades.forEach(t => { catCounts[getRRExitCategory(t).key]++ })
  const majority: RRExitCategoryKey = catCounts.sous >= catCounts.tenue && catCounts.sous >= catCounts.audela
    ? 'sous'
    : catCounts.tenue >= catCounts.audela ? 'tenue' : 'audela'

  return { rrTrades, rrCount, avgRRInitial, avgRRRealise, capturedPct, capturedCircumference, capturedOffset, realiseCurve, initialCurve, cumulativeGap, catCounts, majority }
}

function getRRLecture(rrCount: number, majority: RRExitCategoryKey, cumulativeGap: number) {
  if (rrCount < 5) {
    return { bg: '#f9f9f9', border: '#e8e8e8', color: '#888', text: 'Renseigne le RR de tes trades pour débloquer cette analyse.' }
  }
  if (majority === 'sous') {
    return { bg: '#fffbeb', border: '#fde68a', color: '#d97706', text: `Tu coupes tes gains trop tôt. Tu as laissé ${cumulativeGap >= 0 ? '+' : ''}${cumulativeGap}R de potentiel sur la table au total.` }
  }
  if (majority === 'tenue') {
    return { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', text: 'Bonne discipline de sortie, tu tiens tes plans.' }
  }
  return { bg: '#eff6ff', border: '#bfdbfe', color: '#2a78d6', text: "Tu laisses courir tes trades — assure-toi que c'est sur raison structurelle, pas de la gourmandise." }
}

type DailyPnl = {
  date: string
  pnl: number
}

type DayModal = {
  day: number
  date: string
  dateKey: string
  trades: Trade[]
  pnl: number | null
  insight: string
  insightLoading: boolean
}

type ParsedRow = Record<string, string>

const FIELD_DEFS = [
  { key: 'date', label: 'les dates', hint: 'une ligne par transaction', required: true, aliases: ['date', 'time', 'datetime', 'entry date', 'open time', 'entry time'] },
  { key: 'pnl', label: 'les résultats', hint: 'profit ou perte', required: true, aliases: ['pnl', 'p&l', 'p/l', 'profit', 'résultat', 'net pnl', 'realized pnl'] },
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

function parsePnl(val: string): number {
  const cleaned = val.replace(/[^0-9.,\-]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function parseDateToKey(val: string): string {
  if (!val) return ''
  const cleaned = val.replace(' @ ', ' ')
  const d = new Date(cleaned)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [dailyPnl, setDailyPnl] = useState<DailyPnl[]>([])
  const [loading, setLoading] = useState(true)
  const [calMonth, setCalMonth] = useState(() => new Date())
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [planReady, setPlanReady] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [macroText, setMacroText] = useState('')
  const [macroLoading, setMacroLoading] = useState(false)
  const [macroLoaded, setMacroLoaded] = useState(false)
  const [dayModal, setDayModal] = useState<DayModal | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const rrChartRef = useRef<any>(null)
  const rrCanvasRef = useRef<HTMLCanvasElement>(null)
  const [setupFilter, setSetupFilter] = useState<string>('Tous')
  const setupEquityChartRef = useRef<any>(null)
  const setupEquityCanvasRef = useRef<HTMLCanvasElement>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStep, setImportStep] = useState<'closed' | 'drop' | 'mapping' | 'preview' | 'importing'>('closed')
  const [isDragging, setIsDragging] = useState(false)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvRows, setCsvRows] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [importError, setImportError] = useState('')
  const [importedCount, setImportedCount] = useState<number | null>(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: tradesData } = await supabase.from('trades').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (tradesData) setTrades(tradesData)
    const { data: pnlData } = await supabase.from('daily_pnl').select('*').eq('user_id', user.id)
    if (pnlData) setDailyPnl(pnlData)
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profileData) setProfile(profileData)
    const today = new Date().toISOString().split('T')[0]
    const { data: planData } = await supabase.from('morning_plans').select('id').eq('user_id', user.id).gte('created_at', today).limit(1)
    if (planData && planData.length > 0) setPlanReady(true)
    setLoading(false)
  }

  async function openDayModal(day: number, dayTrades: Trade[], dateKey: string, pnl: number | null) {
    const dateStr = `${day} ${monthNames[calMonthIdx]} ${calYear}`
    if (!profile?.is_pro) {
      setDayModal({ day, date: dateStr, dateKey, trades: dayTrades, pnl, insight: 'PRO_LOCKED', insightLoading: false })
      return
    }
    setDayModal({ day, date: dateStr, dateKey, trades: dayTrades, pnl, insight: '', insightLoading: dayTrades.length > 0 })
    if (dayTrades.length === 0) return
    try {
      const res = await fetch('/api/day-insight', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trades: dayTrades, profile, date: dateStr }) })
      const data = await res.json()
      setDayModal(prev => prev ? { ...prev, insight: data.insight, insightLoading: false } : null)
    } catch {
      setDayModal(prev => prev ? { ...prev, insight: 'Erreur de génération. Réessaie.', insightLoading: false } : null)
    }
  }

  async function deleteTrade(id: string) {
    setDeleting(true)
    await supabase.from('trades').delete().eq('id', id)
    setDeleteConfirmId(null)
    if (dayModal) setDayModal({ ...dayModal, trades: dayModal.trades.filter(t => t.id !== id) })
    loadAll()
    setDeleting(false)
  }

  async function getMacroBriefing() {
    setMacroLoading(true)
    setMacroText('')
    try {
      const res = await fetch('/api/macro-briefing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile }) })
      const data = await res.json()
      setMacroText(data.reply)
      setMacroLoaded(true)
    } catch {
      setMacroText('Erreur de connexion. Réessaie.')
      setMacroLoaded(true)
    }
    setMacroLoading(false)
  }

  function formatMacro(text: string) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n').map(line => `<div style="min-height:4px">${line || '&nbsp;'}</div>`).join('')
  }

  function openImportModal() { setImportedCount(null); setImportStep('drop') }
  function openFilePicker() { fileInputRef.current?.click() }

  function processFile(file: File) {
    setImportError('')
    if (!file.name.toLowerCase().endsWith('.csv')) { setImportError('Le fichier doit être au format .csv'); return }
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const rows = results.data as ParsedRow[]
        if (headers.length === 0 || rows.length === 0) { setImportError('Le fichier CSV est vide ou illisible.'); return }
        const autoMapping: Record<string, string> = {}
        for (const field of FIELD_DEFS) autoMapping[field.key] = autoDetectColumn(headers, field.aliases)
        setCsvHeaders(headers); setCsvRows(rows); setMapping(autoMapping)
        setImportStep(FIELD_DEFS.filter(f => f.required && !autoMapping[f.key]).length === 0 ? 'preview' : 'mapping')
      },
      error: () => setImportError('Impossible de lire ce fichier. Vérifie le format CSV.')
    })
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (file) processFile(file); e.target.value = '' }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); setIsDragging(true) }
  function handleDragLeave(e: React.DragEvent) { e.preventDefault(); setIsDragging(false) }
  function handleDrop(e: React.DragEvent) { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file) }

  function buildDailyTotals(): DailyPnl[] {
    const totals: Record<string, number> = {}
    for (const row of csvRows) {
      const dateRaw = mapping.date ? row[mapping.date] || '' : ''
      const pnlRaw = mapping.pnl ? row[mapping.pnl] || '0' : '0'
      const dateKey = parseDateToKey(dateRaw)
      if (!dateKey) continue
      const pnl = parsePnl(pnlRaw)
      totals[dateKey] = parseFloat(((totals[dateKey] || 0) + pnl).toFixed(2))
    }
    return Object.entries(totals).map(([date, pnl]) => ({ date, pnl })).sort((a, b) => b.date.localeCompare(a.date))
  }

  async function confirmImport() {
    setImportStep('importing')
    const { data: { user } } = await supabase.auth.getUser()
    const totals = buildDailyTotals()
    const rowsToUpsert = totals.map(t => ({ user_id: user?.id, date: t.date, pnl: t.pnl }))
    const { error } = await supabase.from('daily_pnl').upsert(rowsToUpsert, { onConflict: 'user_id,date' })
    if (error) { setImportError("Erreur lors de l'import. Vérifie le mapping des colonnes."); setImportStep('preview'); return }
    setImportedCount(rowsToUpsert.length); setImportStep('closed')
    setCsvHeaders([]); setCsvRows([]); setMapping({}); setImportError('')
    loadAll(); setTimeout(() => setImportedCount(null), 4000)
  }

  function closeImport() { setImportStep('closed'); setIsDragging(false); setCsvHeaders([]); setCsvRows([]); setMapping({}); setImportError('') }

  const previewTotals = (importStep === 'preview' || importStep === 'importing') ? buildDailyTotals() : []
  const missingRequired = FIELD_DEFS.filter(f => f.required && !mapping[f.key])
  const recentTrades = trades.slice(0, 4)

  const calYear = calMonth.getFullYear()
  const calMonthIdx = calMonth.getMonth()
  const firstDay = new Date(calYear, calMonthIdx, 1).getDay()
  const daysInMonth = new Date(calYear, calMonthIdx + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1

  const tradesByDay: Record<string, Trade[]> = {}
  trades.forEach(t => {
    const d = new Date(t.created_at)
    if (d.getFullYear() === calYear && d.getMonth() === calMonthIdx) {
      const key = d.getDate().toString()
      if (!tradesByDay[key]) tradesByDay[key] = []
      tradesByDay[key].push(t)
    }
  })

  const pnlByDay: Record<string, number> = {}
  dailyPnl.forEach(p => {
    const [y, m, d] = p.date.split('-').map(Number)
    if (y === calYear && (m - 1) === calMonthIdx) pnlByDay[d.toString()] = p.pnl
  })

  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const today = new Date()

  const allPnlValues = dailyPnl.map(p => p.pnl)
  const tradedDaysCount = allPnlValues.length
  const winningDays = allPnlValues.filter(p => p > 0)
  const losingDays = allPnlValues.filter(p => p < 0)
  const winRatePnl = tradedDaysCount > 0 ? Math.round((winningDays.length / tradedDaysCount) * 100) : 0
  const avgWinDay = winningDays.length > 0 ? parseFloat((winningDays.reduce((s, p) => s + p, 0) / winningDays.length).toFixed(2)) : 0
  const avgLossDay = losingDays.length > 0 ? parseFloat((losingDays.reduce((s, p) => s + p, 0) / losingDays.length).toFixed(2)) : 0
  const profitFactorPnl = losingDays.length > 0 ? parseFloat((Math.abs(winningDays.reduce((s, p) => s + p, 0)) / Math.abs(losingDays.reduce((s, p) => s + p, 0))).toFixed(1)) : 0

  const monthPnlValues = Object.values(pnlByDay)
  const calTotalPnl = parseFloat(monthPnlValues.reduce((s, p) => s + p, 0).toFixed(2))
  const calTradedDays = monthPnlValues.length
  const calWinRate = calTradedDays > 0 ? Math.round((monthPnlValues.filter(p => p > 0).length / calTradedDays) * 100) : 0

  const expectancy = tradedDaysCount > 0 ? parseFloat(((winRatePnl / 100 * avgWinDay) + ((1 - winRatePnl / 100) * avgLossDay)).toFixed(2)) : 0
  const avgPnl = tradedDaysCount > 0 ? allPnlValues.reduce((s, p) => s + p, 0) / tradedDaysCount : 0
  const variance = tradedDaysCount > 1 ? allPnlValues.reduce((s, p) => s + Math.pow(p - avgPnl, 2), 0) / (tradedDaysCount - 1) : 0
  const stdDev = Math.sqrt(variance)
  const sharpeRatio = stdDev > 0 ? parseFloat((avgPnl / stdDev).toFixed(2)) : 0
  const sharpeLabel = sharpeRatio >= 2 ? 'Excellent' : sharpeRatio >= 1 ? 'Bon' : sharpeRatio >= 0.5 ? 'Correct' : 'À améliorer'

  let maxDrawdown = 0
  let peak = 0
  let cumPnl = 0
  const sortedPnl = [...dailyPnl].sort((a, b) => a.date.localeCompare(b.date))
  sortedPnl.forEach(p => {
    cumPnl += p.pnl
    if (cumPnl > peak) peak = cumPnl
    const dd = peak - cumPnl
    if (dd > maxDrawdown) maxDrawdown = dd
  })
  maxDrawdown = parseFloat(maxDrawdown.toFixed(2))

  let streak = 0
  let streakType: 'win' | 'loss' | null = null
  const reversedPnl = [...sortedPnl].reverse()
  for (const p of reversedPnl) {
    if (streak === 0) { streakType = p.pnl > 0 ? 'win' : 'loss'; streak = 1 }
    else if ((streakType === 'win' && p.pnl > 0) || (streakType === 'loss' && p.pnl < 0)) streak++
    else break
  }
  const streakBoxes = Array(Math.min(streak, 5)).fill(streakType)
  if (streakBoxes.length < 5) streakBoxes.push(null)

  const bestDay = allPnlValues.length > 0 ? Math.max(...allPnlValues) : 0
  const worstDay = allPnlValues.length > 0 ? Math.min(...allPnlValues) : 0

  const totalTrades = trades.length
  const followedTrades = trades.filter(t => t.followed_plan).length
  const consistencyScore = totalTrades > 0 ? Math.round((followedTrades / totalTrades) * 100) : 0
  const consistencyOffset = 138 - (consistencyScore / 100) * 138

  const beAtCurrentRR = avgWinDay !== 0 && avgLossDay !== 0 ? parseFloat((Math.abs(avgLossDay) / (avgWinDay + Math.abs(avgLossDay)) * 100).toFixed(1)) : 47.7
  const currentRR = avgWinDay !== 0 && avgLossDay !== 0 ? parseFloat((avgWinDay / Math.abs(avgLossDay)).toFixed(2)) : 1.1
  const distanceBE = parseFloat((winRatePnl - beAtCurrentRR).toFixed(1))
  const distanceBEBarWidth = Math.min(Math.abs(distanceBE) / 30 * 50, 50)

  // Stats RR realise vs planifie (Pro), filtrees par setup via le filtre global du dashboard
  const setupFilteredTrades = setupFilter === 'Tous' ? trades : trades.filter(t => t.setup_type === setupFilter)
  const setupStats = computeRRStats(setupFilteredTrades)
  const setupLecture = getRRLecture(setupStats.rrCount, setupStats.majority, setupStats.cumulativeGap)
  const setupRealiseOnlyTrades = setupFilteredTrades.filter(t => t.rr_realise != null)
  const setupRealiseOnlyCount = setupRealiseOnlyTrades.length
  const setupExpectancyR = setupRealiseOnlyCount > 0 ? parseFloat((setupRealiseOnlyTrades.reduce((s, t) => s + (t.rr_realise as number), 0) / setupRealiseOnlyCount).toFixed(2)) : 0
  const setupWinRateR = setupRealiseOnlyCount > 0 ? Math.round((setupRealiseOnlyTrades.filter(t => (t.rr_realise as number) > 0).length / setupRealiseOnlyCount) * 100) : 0

  function getRRMessages(wr: number, rr: number, marge: number, be: number) {
    const msgs = []
    if (marge < 0) {
      msgs.push({ color: '#dc2626', bg: '#fff5f5', border: '#fca5a5', icon: '⚠', text: `Ton win rate (${wr}%) est sous le BE (${be}%) pour un RR de 1:${rr}. Tu perds de l'argent sur le long terme.` })
    } else if (marge < 10) {
      msgs.push({ color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⚡', text: `Ta marge est faible (${marge}%). Essaie de maintenir au moins 20% de marge au-dessus du BE.` })
    } else if (marge < 20) {
      msgs.push({ color: '#2a78d6', bg: '#eff6ff', border: '#bfdbfe', icon: '💡', text: `Marge correcte (${marge}%). Vise 20% de marge au-dessus du BE pour être plus résistant aux mauvaises séries.` })
    } else {
      msgs.push({ color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✓', text: `Excellente marge de ${marge}% au-dessus du BE. Continue à maintenir cette régularité.` })
    }
    if (rr >= 3) {
      msgs.push({ color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: '🏦', text: `Avec un RR de 1:${rr}, ton BE est très bas (${be}%) mais attention aux longues séries perdantes. En prop firm, risque seulement 0,5% par trade pour maximiser tes chances de payout.` })
    }
    if (rr <= 1.5) {
      msgs.push({ color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', icon: '🏦', text: `Avec un RR de 1:${rr}, ta forte win rate te protège des losing streaks. Stratégie idéale en prop firm — tu peux risquer 1% par trade en évaluation.` })
    }
    return msgs
  }

  useEffect(() => {
    if (loading || tradedDaysCount === 0 || !profile?.is_pro) return
    const initChart = () => {
      if (!rrCanvasRef.current) return
      if (rrChartRef.current) { rrChartRef.current.destroy(); rrChartRef.current = null }
      const rrs: number[] = []
      const beWR: number[] = []
      for (let r = 0.1; r <= 10; r += 0.1) {
        rrs.push(Math.round(r * 10) / 10)
        beWR.push(Math.round((1 / (1 + r)) * 10000) / 100)
      }
      const Chart = (window as any).Chart
      rrChartRef.current = new Chart(rrCanvasRef.current, {
        type: 'line',
        data: {
          labels: rrs,
          datasets: [
            { data: beWR, borderColor: '#2a78d6', borderWidth: 2, pointRadius: 0, fill: { target: 'origin', above: 'rgba(42,120,214,0.05)' }, tension: 0.4 },
            { data: rrs.map(r => Math.abs(r - currentRR) < 0.06 ? winRatePnl : null), borderColor: 'transparent', pointBackgroundColor: '#16a34a', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: rrs.map(r => Math.abs(r - currentRR) < 0.06 ? 9 : 0), fill: false }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (i: any) => `RR 1:${i[0].label}`,
                label: (i: any) => {
                  if (i.datasetIndex === 0) return `BE minimum : ${Number(i.raw).toFixed(1)}%`
                  if (i.datasetIndex === 1 && i.raw !== null) return `Ton win rate : ${i.raw}%`
                  return null
                }
              },
              backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', padding: 10, cornerRadius: 8,
              filter: (i: any) => i.raw !== null
            }
          },
          scales: {
            x: { title: { display: true, text: 'RR', color: '#888', font: { size: 11 } }, ticks: { color: '#888', font: { size: 11 }, maxTicksLimit: 11, callback: (_: any, i: number) => rrs[i] % 1 === 0 ? `1:${rrs[i]}` : '' }, grid: { color: 'rgba(0,0,0,0.04)' } },
            y: { title: { display: true, text: 'Win rate (%)', color: '#888', font: { size: 11 } }, min: 0, max: 100, ticks: { color: '#888', font: { size: 11 }, callback: (v: any) => `${v}%` }, grid: { color: 'rgba(0,0,0,0.04)' } }
          }
        }
      })
    }
    if (!(window as any).Chart) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      script.onload = initChart
      document.head.appendChild(script)
    } else {
      initChart()
    }
    return () => { if (rrChartRef.current) { rrChartRef.current.destroy(); rrChartRef.current = null } }
  }, [loading, tradedDaysCount, currentRR, winRatePnl, profile?.is_pro])

  useEffect(() => {
    if (loading || !profile?.is_pro || setupStats.rrCount < 5) return
    const initSetupEquityChart = () => {
      if (!setupEquityCanvasRef.current) return
      if (setupEquityChartRef.current) { setupEquityChartRef.current.destroy(); setupEquityChartRef.current = null }
      const Chart = (window as any).Chart
      setupEquityChartRef.current = new Chart(setupEquityCanvasRef.current, {
        type: 'line',
        data: {
          labels: setupStats.realiseCurve.map((_, i) => i + 1),
          datasets: [
            { label: 'Réalisé', data: setupStats.realiseCurve, borderColor: '#2563eb', borderWidth: 2, pointRadius: 0, tension: 0.3, fill: false },
            { label: 'Planifié', data: setupStats.initialCurve, borderColor: '#9ca3af', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0, tension: 0.3, fill: false },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index', intersect: false,
              callbacks: { label: (i: any) => `${i.dataset.label} : ${i.raw}R` },
              backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', padding: 10, cornerRadius: 8,
            }
          },
          scales: {
            x: { display: false },
            y: { ticks: { color: '#aaa', font: { size: 10 }, callback: (v: any) => `${v}R` }, grid: { color: 'rgba(0,0,0,0.04)' } }
          }
        }
      })
    }
    if ((window as any).Chart) {
      initSetupEquityChart()
    } else {
      const existing = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"]') as HTMLScriptElement | null
      if (existing) {
        existing.addEventListener('load', initSetupEquityChart)
      } else {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
        script.onload = initSetupEquityChart
        document.head.appendChild(script)
      }
    }
    return () => { if (setupEquityChartRef.current) { setupEquityChartRef.current.destroy(); setupEquityChartRef.current = null } }
  }, [loading, profile?.is_pro, setupFilter, setupStats.rrCount, trades])

  const profitFactorLabel = profitFactorPnl >= 2 ? 'Excellent' : profitFactorPnl >= 1.5 ? 'Bon' : profitFactorPnl >= 1 ? 'Correct' : 'À améliorer'
  const winRateCircumference = 2 * Math.PI * 22
  const profitFactorOffset = Math.max(0, winRateCircumference - (Math.min(profitFactorPnl / 5, 1) * winRateCircumference))
  const winGaugeOffset = 88 - (winRatePnl / 100) * 88

  const sidebarW = sidebarExpanded ? 200 : 52
  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'CL'
  const rrMessages = getRRMessages(winRatePnl, currentRR, distanceBE, beAtCurrentRR)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f8f4', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .sa { animation: fadeUp 0.4s ease both; }
        .sa1 { animation-delay: 0.04s; } .sa2 { animation-delay: 0.08s; }
        .sa3 { animation-delay: 0.12s; } .sa4 { animation-delay: 0.16s; }
        .sa5 { animation-delay: 0.20s; } .sa6 { animation-delay: 0.25s; }
        .sa7 { animation-delay: 0.30s; } .sa8 { animation-delay: 0.35s; }
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
        .kpi-card { background: #1a1a1a; border-radius: 14px; padding: 1.1rem; transition: transform 0.15s; }
        .kpi-card:hover { transform: translateY(-2px); }
        .mid-card { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 14px; padding: 1.25rem; }
        .adv-card { background: #f9f9f9; border: 0.5px solid #e8e8e8; border-radius: 10px; padding: 0.875rem; }
        .trade-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 0.5px solid #f2f2f2; }
        .trade-row:last-child { border-bottom: none; }
        .badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.4px; }
        .badge-long { background: #dcfce7; color: #16a34a; }
        .badge-short { background: #fee2e2; color: #dc2626; }
        .macro-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: #111; color: #fff; border: none; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; width: 100%; }
        .macro-btn:hover { background: #333; }
        .macro-btn:disabled { background: #555; cursor: wait; }
        .cal-day { aspect-ratio: 1; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; transition: all 0.15s; cursor: default; padding: 4px; }
        .cal-win { background: #c8f0d8; color: #15803d; cursor: pointer; }
        .cal-win:hover { transform: scale(1.06); box-shadow: 0 4px 12px rgba(22,163,74,0.2); }
        .cal-loss { background: #fdd0d0; color: #dc2626; cursor: pointer; }
        .cal-loss:hover { transform: scale(1.06); box-shadow: 0 4px 12px rgba(220,38,38,0.2); }
        .cal-neutral { background: #f5f5f5; color: #ccc; cursor: pointer; }
        .cal-neutral:hover { transform: scale(1.06); }
        .cal-empty { background: transparent; cursor: default; }
        .cal-future { background: #f5f5f5; color: #ddd; }
        .cal-today { outline: 2px solid #888; outline-offset: -2px; }
        .cal-pnl { font-size: 12px; margin-top: 3px; font-family: var(--font-mono); font-weight: 700; }
        .cal-weekend { opacity: 0.3; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 2rem; }
        .modal-box { background: #fff; border: 0.5px solid #e8e8e8; border-radius: 16px; padding: 1.5rem; width: 520px; max-width: 92vw; max-height: 85vh; overflow-y: auto; }
        .modal-box-sm { background: #fff; border-radius: 16px; padding: 1.75rem; width: 480px; max-width: 95vw; }
        .modal-trade-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 0.5px solid #f2f2f2; }
        .modal-trade-row:last-child { border-bottom: none; }
        .section-lbl { font-size: 10px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 8px; }
        .aidot { width: 6px; height: 6px; border-radius: 50%; background: #aaa; animation: dotPulse 1.2s ease-in-out infinite; display: inline-block; margin: 0 2px; }
        .aidot:nth-child(2) { animation-delay: 0.2s; }
        .aidot:nth-child(3) { animation-delay: 0.4s; }
        .btn-primary { background: #111; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer; transition: opacity 0.15s; font-family: inherit; }
        .btn-primary:hover { opacity: 0.85; }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-secondary { background: transparent; color: #666; border: 0.5px solid #e0e0e0; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .btn-secondary:hover { background: #f5f5f5; }
        .btn-danger { background: #fff5f5; color: #dc2626; border: 0.5px solid #fca5a5; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.15s; }
        .btn-danger:hover { background: #fee2e2; }
        .map-row { display: grid; grid-template-columns: 150px 1fr; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 0.5px solid #f2f2f2; }
        .map-row:last-child { border-bottom: none; }
        .map-select { width: 100%; background: #f0fdf4; border: 0.5px solid #bbf7d0; border-radius: 6px; padding: 7px 10px; color: #15803d; font-size: 13px; font-family: inherit; }
        .dropzone { border: 1.5px dashed #d0d0d0; border-radius: 12px; padding: 2.5rem 1.5rem; text-align: center; background: #fafafa; transition: border-color 0.15s, background 0.15s; cursor: pointer; }
        .dropzone.dragging { border-color: #111; background: #f5f5f5; }
        .dropzone-icon { width: 44px; height: 44px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 20px; transition: background 0.15s; }
        .dropzone.dragging .dropzone-icon { background: #111; color: #fff; }
        .delete-icon-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 15px; padding: 4px; line-height: 1; }
        .delete-icon-btn:hover { color: #dc2626; }
        .confirm-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 400; }
        .confirm-box { background: #fff; border-radius: 14px; padding: 1.5rem; width: 360px; max-width: 90vw; }
      `}</style>

      <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileSelected} />

      {deleteConfirmId && (
        <div className="confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Supprimer ce trade ?</div>
            <div style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '1.25rem' }}>Cette action est définitive et ne peut pas être annulée.</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-danger" onClick={() => deleteTrade(deleteConfirmId)} disabled={deleting}>{deleting ? 'Suppression...' : 'Supprimer'}</button>
              <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {importStep === 'drop' && (
        <div className="modal-overlay" onClick={closeImport}>
          <div className="modal-box-sm" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>Importer le PnL quotidien</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Export de ta plateforme broker</div>
              </div>
              <button onClick={closeImport} style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>✕</button>
            </div>
            <div className={`dropzone${isDragging ? ' dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={openFilePicker}>
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
            {importError && <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginTop: '1rem' }}>{importError}</div>}
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '1rem', lineHeight: 1.6 }}>On additionne automatiquement toutes les lignes de la même date pour calculer ton PnL du jour.</div>
          </div>
        </div>
      )}

      {importStep === 'mapping' && (
        <div className="modal-overlay" onClick={closeImport}>
          <div className="modal-box-sm" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Où se trouvent tes données ?</div>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '1.25rem' }}>{csvRows.length} lignes détectées</div>
            <div style={{ marginBottom: '1.25rem' }}>
              {FIELD_DEFS.map(field => (
                <div key={field.key} className="map-row">
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{field.label}{field.required && <span style={{ color: '#dc2626' }}> *</span>}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{field.hint}</div>
                  </div>
                  <select className="map-select" value={mapping[field.key] || ''} onChange={e => setMapping({ ...mapping, [field.key]: e.target.value })}>
                    <option value="">— Aucune colonne —</option>
                    {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {missingRequired.length > 0 && <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem' }}>Il manque encore : {missingRequired.map(f => f.label).join(', ')}</div>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-primary" disabled={missingRequired.length > 0} onClick={() => setImportStep('preview')}>C'est bon, continuer</button>
              <button className="btn-secondary" onClick={() => setImportStep('drop')}>Retour</button>
            </div>
          </div>
        </div>
      )}

      {(importStep === 'preview' || importStep === 'importing') && (
        <div className="modal-overlay" onClick={() => importStep === 'preview' && closeImport()}>
          <div className="modal-box-sm" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0fdf4', border: '0.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ color: '#16a34a', fontSize: '20px' }}>✓</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Ton fichier a bien été lu</div>
              <div style={{ fontSize: '13px', color: '#888' }}>{previewTotals.length} jour{previewTotals.length > 1 ? 's' : ''} de PnL trouvé{previewTotals.length > 1 ? 's' : ''}</div>
            </div>
            <div style={{ border: '0.5px solid #e8e8e8', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', background: '#f9f9f9', padding: '8px 12px', fontSize: '11px', fontWeight: 500, color: '#888' }}>
                <div>Date</div><div style={{ textAlign: 'right' }}>PnL</div>
              </div>
              {previewTotals.slice(0, 8).map((t, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', padding: '8px 12px', fontSize: '13px', borderTop: '0.5px solid #f2f2f2' }}>
                  <div style={{ color: '#111' }}>{new Date(t.date + 'T12:00:00').toLocaleDateString('fr-FR')}</div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: t.pnl >= 0 ? '#16a34a' : '#dc2626' }}>{t.pnl >= 0 ? '+' : ''}{t.pnl}$</div>
                </div>
              ))}
              {previewTotals.length > 8 && <div style={{ padding: '8px 12px', fontSize: '12px', color: '#aaa', borderTop: '0.5px solid #f2f2f2' }}>et {previewTotals.length - 8} autres jours...</div>}
            </div>
            {importError && <div style={{ background: '#fff5f5', border: '0.5px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem' }}>{importError}</div>}
            <button className="btn-primary" onClick={confirmImport} disabled={importStep === 'importing'} style={{ width: '100%' }}>
              {importStep === 'importing' ? 'Import en cours...' : `Importer ${previewTotals.length} jour${previewTotals.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {dayModal && (
        <div className="modal-overlay" onClick={() => setDayModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#111' }}>{dayModal.date}</div>
                <div style={{ fontSize: '12px', color: '#bbb', marginTop: '2px' }}>
                  {dayModal.trades.length} trade{dayModal.trades.length > 1 ? 's' : ''} journalisé{dayModal.trades.length > 1 ? 's' : ''}
                  {dayModal.pnl !== null && <> · PnL {dayModal.pnl >= 0 ? '+' : ''}{dayModal.pnl}$</>}
                </div>
              </div>
              <button onClick={() => setDayModal(null)} style={{ background: '#f5f5f5', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>✕ Fermer</button>
            </div>
            {dayModal.trades.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div className="section-lbl">Trades du jour</div>
                {dayModal.trades.map(t => (
                  <div key={t.id} className="modal-trade-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge badge-${t.direction === 'long' ? 'long' : 'short'}`}>{t.direction}</span>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#111' }}>{t.setup_type || t.instrument}</div>
                        <div style={{ fontSize: '10px', color: '#bbb' }}>{t.instrument}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '11px', color: t.followed_plan ? '#16a34a' : '#d97706' }}>{t.followed_plan ? '✓ plan' : '✗ plan'}</div>
                      <button className="delete-icon-btn" onClick={() => setDeleteConfirmId(t.id)} title="Supprimer ce trade">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {dayModal.trades.length === 0 ? (
              <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '13px', color: '#888' }}>Aucun trade journalisé ce jour-là{dayModal.pnl !== null && ', seul le PnL broker est connu'}.</div>
              </div>
            ) : dayModal.insight === 'PRO_LOCKED' ? (
              <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔒</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Fonctionnalité Pro</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>L'IA Insight est réservée aux membres Pro.</div>
                <a href="/pricing" style={{ background: '#111', color: '#fff', borderRadius: '8px', padding: '8px 18px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Passer au Pro</a>
              </div>
            ) : (
              <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="section-lbl" style={{ marginBottom: 0 }}>IA Insight</div>
                  <div style={{ fontSize: '10px', color: '#bbb' }}>{profile?.approach} · {profile?.market}</div>
                </div>
                {dayModal.insightLoading ? (
                  <div style={{ padding: '0.5rem 0' }}><span className="aidot"></span><span className="aidot"></span><span className="aidot"></span></div>
                ) : (
                  <>
                    <div style={{ fontSize: '12.5px', color: '#333', lineHeight: 1.7 }}>{dayModal.insight}</div>
                    <div style={{ borderTop: '0.5px solid #e8e8e8', marginTop: '10px', paddingTop: '10px' }}>
                      {(() => {
                        const disc = Math.round((dayModal.trades.filter(t => t.followed_plan).length / dayModal.trades.length) * 100)
                        return <div style={{ fontSize: '11.5px', fontWeight: 600, color: disc >= 80 ? '#16a34a' : '#d97706' }}>Discipline : {disc}% · {disc >= 80 ? 'Bonne session.' : 'À améliorer.'}</div>
                      })()}
                    </div>
                  </>
                )}
              </div>
            )}
            <a href={`/journal?date=${dayModal.dateKey}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>+ Ajouter un trade ce jour-là</a>
          </div>
        </div>
      )}

      <div className={`sidebar${sidebarExpanded ? ' exp' : ''}`} style={{ width: sidebarW }} onMouseEnter={() => setSidebarExpanded(true)} onMouseLeave={() => setSidebarExpanded(false)}>
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
          <a href="/dashboard" className="nav-item active"><span className="nav-icon">▦</span><span className="nav-lbl">Dashboard</span></a>
          <a href="/plan" className="nav-item"><span className="nav-icon">☀</span><span className="nav-lbl">Plan du matin</span></a>
          <a href="/debrief" className="nav-item"><span className="nav-icon">◈</span><span className="nav-lbl">Débrief Macro IA</span></a>
          <a href="/journal" className="nav-item"><span className="nav-icon" style={{ fontSize: '13px', fontWeight: 700 }}>▤</span><span className="nav-lbl">Journal</span></a>
        </nav>
        <div className="sb-divider"></div>
        <div className="sb-section">Compte</div>
        <nav style={{ paddingTop: '2px' }}>
          <a href="/account" className="nav-item"><span className="nav-icon">⚙</span><span className="nav-lbl">Mon compte</span></a>
        </nav>
      </div>

      <main style={{ marginLeft: sidebarW, flex: 1, minWidth: 0, position: 'relative', transition: 'margin-left 0.2s cubic-bezier(0.4,0,0.2,1)', padding: '0 2rem 3rem' }}>
        <AppBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#ccc', fontSize: '13px' }}>Chargement...</div>
        ) : (
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

            <div className="sa sa1" style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #e8e8e8', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#111', letterSpacing: '-0.5px', fontFamily: 'var(--font-serif)' }}>Dashboard</span>
                <span style={{ fontSize: '13px', color: '#aaa' }}>{dateFormatted}</span>
              </div>
              <a href="/plan" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: planReady ? '#f0fdf4' : '#fff', border: `0.5px solid ${planReady ? '#86efac' : '#e8e8e8'}`, color: planReady ? '#15803d' : '#888', padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: planReady ? '#22c55e' : '#d1d5db', display: 'inline-block', flexShrink: 0 }}></span>
                {planReady ? 'Plan prêt' : 'Plan du matin'}
              </a>
            </div>

            {profile?.is_pro && trades.length > 0 && (
              <div className="sa" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Setup</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SETUP_FILTER_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSetupFilter(opt)}
                      style={{
                        background: setupFilter === opt ? '#111' : '#f9f9f9',
                        color: setupFilter === opt ? '#fff' : '#666',
                        border: setupFilter === opt ? '0.5px solid #111' : '0.5px solid #e8e8e8',
                        borderRadius: '20px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', transition: 'background 0.15s, color 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {importedCount !== null && (
              <div className="sa" style={{ background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803d' }}>
                ✓ PnL importé pour {importedCount} jour{importedCount > 1 ? 's' : ''}
              </div>
            )}

            {/* 1. KPI CARDS */}
            <div className="sa sa2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '1.5rem' }}>
              <div className="kpi-card">
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Win rate</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="50" height="32" viewBox="0 0 64 40">
                    <path d="M 4 36 A 28 28 0 0 1 60 36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round"/>
                    <path d="M 4 36 A 28 28 0 0 1 60 36" fill="none" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeDasharray="88" strokeDashoffset={tradedDaysCount === 0 ? 88 : winGaugeOffset}/>
                  </svg>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount === 0 ? '—' : `${winRatePnl}%`}</div>
                </div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Gain moyen / jour</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#4ade80', fontFamily: 'var(--font-mono)' }}>{winningDays.length === 0 ? '—' : `+${avgWinDay}$`}</div>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>jours gagnants</div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Perte moyenne / jour</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#f87171', fontFamily: 'var(--font-mono)' }}>{losingDays.length === 0 ? '—' : `${avgLossDay}$`}</div>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>jours perdants</div>
              </div>
              <div className="kpi-card">
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Profit factor</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="42" height="42" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                    <circle cx="26" cy="26" r="22" fill="none" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeDasharray="138" strokeDashoffset={tradedDaysCount === 0 ? 138 : profitFactorOffset} transform="rotate(-90 26 26)"/>
                  </svg>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount === 0 ? '—' : profitFactorPnl}</div>
                    {tradedDaysCount > 0 && <div style={{ fontSize: '10px', color: '#4ade80' }}>{profitFactorLabel}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PNL TOTAL */}
            <div className="sa sa3 mid-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>PnL total · {monthNames[calMonthIdx]} {calYear}</div>
                  <div style={{ fontSize: '26px', fontWeight: 700, color: calTotalPnl >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>
                    {calTradedDays === 0 ? '—' : `${calTotalPnl >= 0 ? '+' : ''}${calTotalPnl}$`}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', fontFamily: 'var(--font-mono)' }}>
                  {calTradedDays > 0 ? `sur ${calTradedDays} jour${calTradedDays > 1 ? 's' : ''} tradé${calTradedDays > 1 ? 's' : ''}` : 'aucune donnée importée'}
                </div>
              </div>
            </div>

            {/* 3. CALENDRIER */}
            <div className="sa sa4 mid-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#111', letterSpacing: '-0.3px', fontFamily: 'var(--font-serif)' }}>Calendrier · {monthNames[calMonthIdx]} {calYear}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button className="btn-secondary" onClick={openImportModal} style={{ padding: '6px 14px', fontSize: '12px' }}>Importer CSV</button>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx - 1, 1))} style={{ background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>Préc.</button>
                    <button onClick={() => setCalMonth(new Date(calYear, calMonthIdx + 1, 1))} style={{ background: '#f5f5f5', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '12px', color: '#666', cursor: 'pointer' }}>Suiv.</button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px', marginBottom: '6px' }}>
                {['L','M','M','J','V','S','D'].map((d, i) => (
                  <div key={`${d}${i}`} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: i >= 5 ? '#ddd' : '#aaa', paddingBottom: '4px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{d}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px' }}>
                {Array(startOffset).fill(null).map((_, i) => <div key={`e${i}`} className="cal-day cal-empty"></div>)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1
                  const key = day.toString()
                  const dayTrades = tradesByDay[key] || []
                  const pnl = pnlByDay[key] !== undefined ? pnlByDay[key] : null
                  const isFuture = new Date(calYear, calMonthIdx, day) > today
                  const isToday = day === today.getDate() && calMonthIdx === today.getMonth() && calYear === today.getFullYear()
                  const isWeekend = (() => { const d = new Date(calYear, calMonthIdx, day).getDay(); return d === 0 || d === 6 })()
                  const hasData = pnl !== null
                  let cls = 'cal-day '
                  if (isFuture) cls += 'cal-future'
                  else if (hasData) cls += (pnl! > 0 ? 'cal-win' : pnl! < 0 ? 'cal-loss' : 'cal-neutral')
                  else cls += 'cal-neutral'
                  if (isToday) cls += ' cal-today'
                  if (isWeekend && !hasData) cls += ' cal-weekend'
                  return (
                    <div key={day} className={cls} onClick={() => !isFuture ? openDayModal(day, dayTrades, `${calYear}-${(calMonthIdx+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`, pnl) : undefined}>
                      {day}
                      {pnl !== null && <span className="cal-pnl">{pnl >= 0 ? '+' : ''}{pnl}$</span>}
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '0.5px solid #f0f0f0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: calTotalPnl >= 0 ? '#16a34a' : '#dc2626' }}>{calTradedDays === 0 ? '—' : `${calTotalPnl >= 0 ? '+' : ''}${calTotalPnl}$`}</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Total PnL</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#111' }}>{calTradedDays}</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Jours tradés</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: calWinRate >= 50 ? '#16a34a' : '#dc2626' }}>{calTradedDays === 0 ? '—' : `${calWinRate}%`}</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Win rate mensuel</div>
                </div>
              </div>
            </div>

            {/* 4. STATS AVANCEES */}
            <div className="sa sa5 mid-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>Stats avancées</span>
                <span style={{ fontSize: '11px', color: '#bbb' }}>toutes périodes confondues</span>
              </div>
              {!profile?.is_pro ? (
                <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔒</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Fonctionnalité Pro</div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>Les stats avancées sont réservées aux membres Pro — Expectancy, Sharpe ratio, Max drawdown, Streak, Consistency et graphique RR vs Win rate.</div>
                  <a href="/pricing" style={{ background: '#111', color: '#fff', borderRadius: '8px', padding: '8px 18px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Passer au Pro</a>
                </div>
              ) : tradedDaysCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#bbb', fontSize: '13px' }}>Importe des données CSV pour voir tes stats avancées.</div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '8px' }}>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Expectancy</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: expectancy >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>{expectancy >= 0 ? '+' : ''}{expectancy}$</div>
                      <div style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 7px', fontFamily: 'var(--font-mono)' }}>gain espéré / trade</div>
                      <div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}>
                        <div style={{ width: `${Math.min(Math.max((expectancy / 200) * 100, 0), 100)}%`, height: '100%', background: expectancy >= 0 ? '#16a34a' : '#dc2626', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Sharpe ratio</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount > 1 ? sharpeRatio : '—'}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 7px', fontFamily: 'var(--font-mono)' }}>rendement / risque</div>
                      {tradedDaysCount > 1 && (
                        <>
                          <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                            {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: '3px', background: sharpeRatio >= (i + 1) * 0.5 ? '#16a34a' : '#e8e8e8', borderRadius: '2px' }}></div>)}
                          </div>
                          <div style={{ fontSize: '10px', color: '#16a34a' }}>{sharpeLabel}</div>
                        </>
                      )}
                    </div>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Max drawdown</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-mono)' }}>{maxDrawdown > 0 ? `-${maxDrawdown}$` : '—'}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 7px', fontFamily: 'var(--font-mono)' }}>pire série de pertes</div>
                      <div style={{ height: '3px', background: '#e8e8e8', borderRadius: '2px' }}>
                        <div style={{ width: `${Math.min((maxDrawdown / (Math.abs(calTotalPnl) + maxDrawdown + 1)) * 100, 100)}%`, height: '100%', background: '#dc2626', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Streak actuel</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: streakType === 'win' ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>{streak > 0 ? (streakType === 'win' ? `+${streak}` : `-${streak}`) : '—'}</span>
                        {streak > 0 && <span style={{ fontSize: '11px', color: streakType === 'win' ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>{streakType === 'win' ? 'gagnants' : 'perdants'}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {streakBoxes.map((t, i) => (
                          <div key={i} style={{ width: '18px', height: '18px', borderRadius: '4px', background: t === 'win' ? '#dcfce7' : t === 'loss' ? '#fee2e2' : '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '9px', color: t === 'win' ? '#15803d' : t === 'loss' ? '#dc2626' : '#ccc', fontWeight: 600 }}>{t === 'win' ? 'W' : t === 'loss' ? 'L' : '?'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '8px' }}>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Meilleur / pire jour</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'var(--font-mono)' }}>Meilleur</span>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a', fontFamily: 'var(--font-mono)' }}>{bestDay > 0 ? `+${bestDay}$` : '—'}</span>
                      </div>
                      <div style={{ height: '0.5px', background: '#e8e8e8', marginBottom: '6px' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#aaa', fontFamily: 'var(--font-mono)' }}>Pire</span>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#dc2626', fontFamily: 'var(--font-mono)' }}>{worstDay < 0 ? `${worstDay}$` : '—'}</span>
                      </div>
                    </div>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Consistency score</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="48" height="48" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r="22" fill="none" stroke="#e8e8e8" strokeWidth="6"/>
                          <circle cx="26" cy="26" r="22" fill="none" stroke={consistencyScore >= 70 ? '#16a34a' : consistencyScore >= 50 ? '#d97706' : '#dc2626'} strokeWidth="6" strokeLinecap="round" strokeDasharray="138" strokeDashoffset={consistencyOffset} transform="rotate(-90 26 26)"/>
                        </svg>
                        <div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{totalTrades > 0 ? `${consistencyScore}%` : '—'}</div>
                          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>jours plan suivi</div>
                        </div>
                      </div>
                    </div>
                    <div className="adv-card">
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Distance au BE</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: distanceBE >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount > 0 ? `${distanceBE >= 0 ? '+' : ''}${distanceBE}%` : '—'}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', margin: '4px 0 7px', fontFamily: 'var(--font-mono)' }}>marge au-dessus du BE</div>
                      {tradedDaysCount > 0 && (
                        <div style={{ position: 'relative', height: '6px', background: '#e8e8e8', borderRadius: '3px' }}>
                          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1.5px', background: '#aaa' }}></div>
                          {distanceBE >= 0
                            ? <div style={{ position: 'absolute', left: '50%', width: `${distanceBEBarWidth}%`, height: '100%', background: '#16a34a', borderRadius: '0 3px 3px 0' }}></div>
                            : <div style={{ position: 'absolute', right: '50%', width: `${distanceBEBarWidth}%`, height: '100%', background: '#dc2626', borderRadius: '3px 0 0 3px' }}></div>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 5. GRAPHIQUE RR VS WIN RATE */}
            {profile?.is_pro && (
              <div className="sa sa6 mid-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>RR vs Win rate · Break even</div>
                    <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>Win rate minimum pour être rentable selon ton RR</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '20px', height: '2px', background: '#2a78d6' }}></div><span style={{ color: '#aaa' }}>Courbe BE</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div><span style={{ color: '#aaa' }}>Ta position</span></div>
                  </div>
                </div>
                <div style={{ position: 'relative', height: '220px' }}>
                  <canvas ref={rrCanvasRef}></canvas>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginTop: '1rem', paddingTop: '1rem', borderTop: '0.5px solid #f0f0f0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount > 0 ? `${winRatePnl}%` : '—'}</div>
                    <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Win rate actuel</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount > 0 ? `1:${currentRR}` : '—'}</div>
                    <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>RR moyen estimé</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: distanceBE >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>{tradedDaysCount > 0 ? `${distanceBE >= 0 ? '+' : ''}${distanceBE}%` : '—'}</div>
                    <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Marge au-dessus du BE</div>
                  </div>
                </div>
                {tradedDaysCount > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    {rrMessages.map((m, i) => (
                      <div key={i} style={{ background: m.bg, border: `0.5px solid ${m.border}`, borderRadius: '8px', padding: '8px 12px', marginBottom: '6px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>{m.icon}</span>
                        <span style={{ color: m.color, fontSize: '12px', lineHeight: 1.6 }}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5b. STATS TRADES JOURNALISES (filtrees par setup) */}
            {profile?.is_pro && trades.length > 0 && (
              <div className="sa sa6 mid-card" style={{ marginBottom: '1.5rem' }}>
                {setupFilteredTrades.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#bbb', fontSize: '13px' }}>
                    Aucun trade journalisé avec le setup "{setupFilter}".
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '0.5px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{setupFilteredTrades.length}</div>
                        <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Trades journalisés</div>
                      </div>
                      {setupRealiseOnlyCount > 0 && (
                        <>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: setupExpectancyR >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'var(--font-mono)' }}>{setupExpectancyR >= 0 ? '+' : ''}{setupExpectancyR}R</div>
                            <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Expectancy</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{setupWinRateR}%</div>
                            <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Win rate (RR)</div>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '12px', alignItems: 'stretch' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)', marginBottom: setupStats.rrCount < 5 ? 0 : '1.25rem' }}>RR réalisé vs planifié</div>
                        {setupStats.rrCount < 5 ? (
                          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#bbb', fontSize: '13px' }}>{setupLecture.text}</div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                              <svg width="88" height="88" viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
                                <circle cx="26" cy="26" r="22" fill="none" stroke="#e5e7eb" strokeWidth="7"/>
                                <circle cx="26" cy="26" r="22" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" strokeDasharray={setupStats.capturedCircumference} strokeDashoffset={setupStats.capturedOffset} transform="rotate(-90 26 26)"/>
                                <text x="26" y="30" textAnchor="middle" fontSize="12" fontWeight="700" fill="#111" style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(setupStats.capturedPct)}%</text>
                              </svg>
                              <div>
                                <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.6, marginBottom: '10px' }}>
                                  Tu captures <strong style={{ color: '#2563eb' }}>{Math.round(setupStats.capturedPct)}%</strong> de ton potentiel planifié
                                </div>
                                <div style={{ display: 'flex', gap: '18px' }}>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', fontFamily: 'var(--font-mono)' }}>{setupStats.avgRRRealise.toFixed(2)}R</div>
                                    <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>RR réalisé moy.</div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>{setupStats.avgRRInitial.toFixed(2)}R</div>
                                    <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>RR initial moy.</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                              <span style={{ fontSize: '10px', color: '#bbb', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>R cumulé — réalisé vs planifié</span>
                              <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: setupStats.cumulativeGap > 0 ? '#d97706' : setupStats.cumulativeGap < 0 ? '#2563eb' : '#888' }}>
                                Écart cumulé : {setupStats.cumulativeGap >= 0 ? '+' : ''}{setupStats.cumulativeGap}R
                              </span>
                            </div>
                            <div style={{ position: 'relative', height: '120px', marginBottom: '1rem' }}>
                              <canvas ref={setupEquityCanvasRef}></canvas>
                            </div>
                            <div style={{ background: setupLecture.bg, border: `0.5px solid ${setupLecture.border}`, borderRadius: '8px', padding: '10px 12px' }}>
                              <span style={{ color: setupLecture.color, fontSize: '12px', lineHeight: 1.6 }}>{setupLecture.text}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>Répartition des sorties</div>
                        <div style={{ fontSize: '11px', color: '#bbb', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                          {setupStats.rrCount > 0 ? `sur ${setupStats.rrCount} trade${setupStats.rrCount > 1 ? 's' : ''} avec RR renseigné` : 'aucun trade avec RR renseigné'}
                        </div>
                        {setupStats.rrCount === 0 ? (
                          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#bbb', fontSize: '13px' }}>Pas encore de données.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                              { label: 'Sous la cible', count: setupStats.catCounts.sous, color: '#f0b429' },
                              { label: 'Cible tenue', count: setupStats.catCounts.tenue, color: '#16a34a' },
                              { label: 'Au-delà', count: setupStats.catCounts.audela, color: '#2563eb' },
                            ].map(row => (
                              <div key={row.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '12px', color: '#555' }}>{row.label}</span>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111', fontFamily: 'var(--font-mono)' }}>{row.count}</span>
                                </div>
                                <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${(row.count / setupStats.rrCount) * 100}%`, height: '100%', background: row.color, borderRadius: '4px' }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 6. JOURNAL RECENT */}
            {trades.length > 0 && (
              <div className="sa sa7 mid-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#888', fontFamily: 'var(--font-serif)' }}>Journal récent</span>
                  <a href="/journal" style={{ fontSize: '12px', color: '#aaa', textDecoration: 'none', fontWeight: 500 }}>Voir tout</a>
                </div>
                {recentTrades.map(t => {
                  const d = new Date(t.created_at)
                  const ds = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
                  return (
                    <div key={t.id} className="trade-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <span className={`badge badge-${t.direction === 'long' ? 'long' : 'short'}`}>{t.direction}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{t.setup_type || t.instrument}</div>
                          <div style={{ fontSize: '11px', color: '#bbb', fontFamily: 'var(--font-mono)' }}>{ds}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: t.followed_plan ? '#16a34a' : '#d97706' }}>{t.followed_plan ? '✓ Plan suivi' : '⚠ Hors plan'}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 7. DEBRIEF MACRO IA */}
            <div className="sa sa8 mid-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: 'var(--font-serif)' }}>Débrief Macro IA</div>
                  <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>Briefing du jour généré par IA selon ton profil</div>
                </div>
                {macroLoaded && profile?.is_pro && (
                  <button onClick={getMacroBriefing} disabled={macroLoading} style={{ background: 'none', border: '0.5px solid #e8e8e8', borderRadius: '8px', padding: '5px 12px', fontSize: '11.5px', color: '#888', cursor: 'pointer' }}>Rafraîchir</button>
                )}
              </div>
              {!profile?.is_pro ? (
                <div style={{ background: '#f9f9f9', border: '0.5px solid #e8e8e8', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔒</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>Fonctionnalité Pro</div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>Le débrief macro IA est réservé aux membres Pro.</div>
                  <a href="/pricing" style={{ background: '#111', color: '#fff', borderRadius: '8px', padding: '8px 18px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Passer au Pro</a>
                </div>
              ) : !macroLoaded ? (
                <button className="macro-btn" onClick={getMacroBriefing} disabled={macroLoading}>
                  {macroLoading ? <>Génération en cours...</> : <>◈ Générer le débrief macro du jour</>}
                </button>
              ) : macroLoading ? (
                <div style={{ color: '#aaa', fontSize: '13px', padding: '1rem 0' }}>Génération en cours...</div>
              ) : (
                <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: formatMacro(macroText) }}/>
              )}
            </div>

          </div>
        )}
        </div>
      </main>
    </div>
  )
}