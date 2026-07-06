'use client'

const BROKERS = [
  'Interactive Brokers',
  'TopstepX',
  'Tradovate',
  'NinjaTrader',
  'MetaTrader',
  'Rithmic',
  'TradeStation',
  'Sierra Chart',
]

export default function BrokerMarquee() {
  const track = [...BROKERS, ...BROKERS]

  return (
    <div style={{ width: '100%', minWidth: 0, overflow: 'hidden', marginTop: '1.5rem', borderTop: '0.5px solid #eceef0', paddingTop: '1.25rem' }}>
      <style>{`
        @keyframes broker-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .broker-marquee-track {
          animation: broker-marquee-scroll 24s linear infinite;
        }
        .broker-marquee-viewport:hover .broker-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ color: '#16a34a', fontSize: '12px', lineHeight: 1 }}>✓</span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Compatible avec n'importe quel broker au format CSV</span>
      </div>

      <div
        className="broker-marquee-viewport"
        style={{
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)',
        }}
      >
        <div className="broker-marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
          {track.map((name, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500, marginRight: '10px' }}>{name}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#22c55e', marginRight: '10px', flexShrink: 0 }}></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
