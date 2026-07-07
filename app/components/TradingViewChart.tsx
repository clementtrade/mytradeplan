'use client'
import { useEffect, useRef, memo } from 'react'

function TradingViewChart() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = container.current
    if (!el) return
    el.innerHTML = '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>'
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'CME_MINI:ES1!',
      interval: '30',
      timezone: 'Europe/Paris',
      theme: 'dark',
      style: '1',
      locale: 'fr',
      allow_symbol_change: true,
      hide_side_toolbar: false,
      backgroundColor: '#131722',
      support_host: 'https://www.tradingview.com',
    })
    el.appendChild(script)
    return () => { el.innerHTML = '' }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ flex: 1, width: '100%', minHeight: 440, borderRadius: 10, overflow: 'hidden' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11, color: '#9598a1' }}>
        <span>Données futures différées. Connecte-toi à ton compte TradingView pour le temps réel et tes indicateurs.</span>
        <a href="https://www.tradingview.com/#signin" target="_blank" rel="noopener" style={{ color: '#16a34a', fontWeight: 500 }}>
          Se connecter à TradingView
        </a>
      </div>
    </div>
  )
}

export default memo(TradingViewChart)
