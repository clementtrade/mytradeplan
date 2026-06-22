export default function Home() {
  return (
    <main style={{minHeight: '100vh', background: '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace'}}>
          MyTradePlan
        </h1>
        <p style={{color: '#9CA3AF', marginTop: '1rem', fontSize: '1.1rem'}}>
          Ton journal de trading personnel
        </p>
        <button style={{marginTop: '2rem', background: '#10B981', color: 'black', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1rem'}}>
          Commencer →
        </button>
      </div>
    </main>
  )
}