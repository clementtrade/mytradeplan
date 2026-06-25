'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    section: 'Session',
    items: [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
      {
        href: '/plan',
        label: 'Plan du matin',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        ),
      },
      {
        href: '/debrief',
        label: 'Débrief Macro IA',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 10h16M4 14h10M4 18h7"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Compte',
    items: [
      {
        href: '/settings',
        label: 'Paramètres',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ),
      },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <style>{`
        .sidebar {
          width: 52px;
          min-height: 100vh;
          background: #fff;
          border-right: 0.5px solid #e8e8e8;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 0;
          gap: 4px;
          flex-shrink: 0;
          transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .sidebar:hover { width: 200px; }
        .sb-logo-wrap {
          width: 100%;
          padding: 0 14px 14px;
          border-bottom: 0.5px solid #e8e8e8;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .sb-logo-short { font-size: 11px; font-weight: 700; color: #111; letter-spacing: 1px; display: block; }
        .sb-logo-long  { font-size: 12px; font-weight: 700; color: #111; white-space: nowrap; display: none; }
        .sidebar:hover .sb-logo-short { display: none; }
        .sidebar:hover .sb-logo-long  { display: block; }

        .sb-section-label {
          font-size: 10px; color: #aaa; letter-spacing: 0.8px; text-transform: uppercase;
          padding: 8px 14px 4px; width: 100%; white-space: nowrap; overflow: hidden;
          opacity: 0; height: 0; transition: opacity 0.15s, height 0.22s;
        }
        .sidebar:hover .sb-section-label { opacity: 1; height: 28px; }

        .sb-link {
          display: flex; align-items: center; gap: 10px;
          width: calc(100% - 16px); margin: 0 8px; padding: 9px 10px;
          border-radius: 8px; text-decoration: none; color: #888;
          transition: background 0.15s, color 0.15s; white-space: nowrap; overflow: hidden;
        }
        .sb-link:hover { background: #f5f5f5; color: #111; }
        .sb-link.active { background: #f5f5f5; color: #111; }
        .sb-link svg { flex-shrink: 0; }
        .sb-link-label { font-size: 13px; font-weight: 500; opacity: 0; transition: opacity 0.12s 0.05s; }
        .sidebar:hover .sb-link-label { opacity: 1; }

        .sb-sep {
          width: 24px; height: 0.5px; background: #e8e8e8;
          margin: 6px 8px; transition: width 0.22s; flex-shrink: 0;
        }
        .sidebar:hover .sb-sep { width: calc(100% - 16px); }

        .sb-bottom { margin-top: auto; width: 100%; padding: 0 8px; }
        .sb-user {
          display: flex; align-items: center; gap: 10px; padding: 12px 10px 8px;
          border-top: 0.5px solid #e8e8e8; overflow: hidden;
        }
        .sb-avatar {
          width: 28px; height: 28px; border-radius: 50%; background: #f5f5f5;
          border: 0.5px solid #e8e8e8; display: flex; align-items: center;
          justify-content: center; font-size: 10px; font-weight: 600; color: #555; flex-shrink: 0;
        }
        .sb-user-info { opacity: 0; transition: opacity 0.12s 0.05s; white-space: nowrap; }
        .sidebar:hover .sb-user-info { opacity: 1; }
        .sb-user-name { font-size: 12px; font-weight: 600; color: #111; }
        .sb-user-plan { font-size: 10px; color: #aaa; }
      `}</style>

      <div className="sb-logo-wrap">
        <span className="sb-logo-short">MTP</span>
        <span className="sb-logo-long">MyTradePlan</span>
      </div>

      {navItems.map((group) => (
        <div key={group.section} style={{ width: '100%' }}>
          <div className="sb-section-label">{group.section}</div>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sb-link ${pathname === item.href ? 'active' : ''}`}
            >
              {item.icon}
              <span className="sb-link-label">{item.label}</span>
            </Link>
          ))}
          {group.section === 'Session' && <div className="sb-sep" />}
        </div>
      ))}

      <div className="sb-bottom">
        <div className="sb-user">
          <div className="sb-avatar">CL</div>
          <div className="sb-user-info">
            <div className="sb-user-name">Clément</div>
            <div className="sb-user-plan">Plan Pro</div>
          </div>
        </div>
      </div>
    </aside>
  )
}