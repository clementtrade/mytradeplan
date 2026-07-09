import type { Metadata } from 'next'
import { Fraunces, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'

// Design tokens "noir chaud editorial" (fondations) : les polices sont
// chargees et exposees en variables CSS ici, mais pas encore appliquees
// a aucun element - aucun changement visuel pour l'instant.
const fontSerif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

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
    <html lang="fr" className={`${fontSerif.variable} ${fontMono.variable} ${fontSans.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}