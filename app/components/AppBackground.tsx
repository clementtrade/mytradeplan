const CIRCLES: { top?: string; left?: string; right?: string; bottom?: string; size: number; color: string; anim: string; duration: string; delay: string }[] = [
  { top: '8%', left: '6%', size: 130, color: 'rgba(34,197,94,.28)', anim: 'app-bg-circle-1', duration: '16s', delay: '0s' },
  { top: '42%', right: '8%', size: 180, color: 'rgba(22,163,74,.20)', anim: 'app-bg-circle-2', duration: '20s', delay: '-4s' },
  { bottom: '10%', left: '12%', size: 60, color: 'rgba(74,222,128,.26)', anim: 'app-bg-circle-3', duration: '14s', delay: '-7s' },
  { top: '4%', left: '46%', size: 100, color: 'rgba(34,197,94,.24)', anim: 'app-bg-circle-4', duration: '18s', delay: '-2s' },
]

const PARTICLES = [
  { top: '12%', left: '15%', size: 6, color: '#16a34a', opacity: 0.24, anim: 'app-bg-particle-1', duration: '10s' },
  { top: '25%', left: '68%', size: 9, color: '#22c55e', opacity: 0.30, anim: 'app-bg-particle-2', duration: '11s' },
  { top: '38%', left: '8%', size: 5, color: '#4ade80', opacity: 0.22, anim: 'app-bg-particle-3', duration: '12s' },
  { top: '50%', left: '50%', size: 8, color: '#16a34a', opacity: 0.34, anim: 'app-bg-particle-4', duration: '13s' },
  { top: '62%', left: '28%', size: 10, color: '#22c55e', opacity: 0.26, anim: 'app-bg-particle-5', duration: '14s' },
  { top: '74%', left: '82%', size: 6, color: '#4ade80', opacity: 0.32, anim: 'app-bg-particle-6', duration: '15s' },
  { top: '85%', left: '18%', size: 7, color: '#16a34a', opacity: 0.28, anim: 'app-bg-particle-7', duration: '16s' },
  { top: '92%', left: '60%', size: 9, color: '#22c55e', opacity: 0.24, anim: 'app-bg-particle-8', duration: '10.5s' },
]

export default function AppBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#f1f8f4',
      }}
    >
      <style>{`
        @keyframes app-bg-circle-1 { 0%,100% { transform: translate(0,0) scale(1); opacity: 1; } 50% { transform: translate(16px,-12px) scale(1.06); opacity: 0.65; } }
        @keyframes app-bg-circle-2 { 0%,100% { transform: translate(0,0) scale(1); opacity: 1; } 50% { transform: translate(-18px,14px) scale(1.1); opacity: 0.6; } }
        @keyframes app-bg-circle-3 { 0%,100% { transform: translate(0,0) scale(1); opacity: 1; } 50% { transform: translate(10px,10px) scale(1.05); opacity: 0.7; } }
        @keyframes app-bg-circle-4 { 0%,100% { transform: translate(0,0) scale(1); opacity: 1; } 50% { transform: translate(-12px,-16px) scale(1.08); opacity: 0.65; } }
        @keyframes app-bg-particle-1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(15px,-18px); } }
        @keyframes app-bg-particle-2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,12px); } }
        @keyframes app-bg-particle-3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-16px,20px); } }
        @keyframes app-bg-particle-4 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(22px,-15px); } }
        @keyframes app-bg-particle-5 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-18px,-22px); } }
        @keyframes app-bg-particle-6 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(17px,19px); } }
        @keyframes app-bg-particle-7 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-22px,14px); } }
        @keyframes app-bg-particle-8 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(19px,-20px); } }
        .app-bg-circle { position: absolute; border-radius: 50%; border-style: solid; border-width: 1.5px; background: transparent; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .app-bg-particle { position: absolute; border-radius: 50%; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) {
          .app-bg-circle, .app-bg-particle { animation: none !important; }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {CIRCLES.map((c, i) => (
          <div
            key={i}
            className="app-bg-circle"
            style={{
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              width: c.size,
              height: c.size,
              borderColor: c.color,
              animationName: c.anim,
              animationDuration: c.duration,
              animationDelay: c.delay,
            }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="app-bg-particle"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: p.opacity,
              animationName: p.anim,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
    </div>
  )
}
