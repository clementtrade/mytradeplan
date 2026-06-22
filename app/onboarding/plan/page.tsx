export default function PlanPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          color: '#10B981',
          fontFamily: 'monospace',
          fontSize: '1.5rem',
          marginBottom: '0.5rem',
        }}>
          Plan du matin
        </h1>
        <p style={{ color: 'rgba(229,231,235,0.5)', fontSize: '14px' }}>
          Bientôt disponible
        </p>
      </div>
    </main>
  )
}