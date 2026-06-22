'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/plan', label: 'Plan du matin' },
    { href: '/journal', label: 'Journal' },
    { href: '/stats', label: 'Stats' },
    { href: '/onboarding', label: 'Mon profil' },
  ]

  return (
    <nav style={{
      background: '#111827',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
    }}>
      <span style={{
        fontFamily: 'monospace',
        color: '#10B981',
        fontWeight: 700,
        fontSize: '15px',
      }}>
        MyTrade<span style={{ color: 'white' }}>Plan</span>
      </span>

      <div style={{ display: 'flex', gap: '8px' }}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              textDecoration: 'none',
              background: pathname === link.href ? 'rgba(16,185,129,0.1)' : 'transparent',
              color: pathname === link.href ? '#10B981' : 'rgba(229,231,235,0.6)',
              border: pathname === link.href ? '0.5px solid rgba(16,185,129,0.3)' : '0.5px solid transparent',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}