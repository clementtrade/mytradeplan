import type { Metadata } from 'next'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
  title: 'MyTradePlan',
  description: 'Ton journal de trading personnel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#0A0E1A', minHeight: '100vh' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}