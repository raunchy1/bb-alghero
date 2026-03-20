'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, BedDouble, Image, Calendar, CreditCard, FileText, Settings, LogOut } from 'lucide-react'
import { ReactNode } from 'react'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: BedDouble, label: 'Le Suite', href: '/admin/suite' },
  { icon: Image, label: 'Galleria', href: '/admin/galleria' },
  { icon: Calendar, label: 'Calendario', href: '/admin/calendario' },
  { icon: CreditCard, label: 'Pagamenti', href: '/admin/pagamenti' },
  { icon: FileText, label: 'Contenuti', href: '/admin/contenuti' },
  { icon: Settings, label: 'Impostazioni', href: '/admin/impostazioni' },
]

const bottomTabs = [
  { icon: Home, label: 'Home', href: '/admin/dashboard' },
  { icon: BedDouble, label: 'Suite', href: '/admin/suite' },
  { icon: Image, label: 'Foto', href: '/admin/galleria' },
  { icon: CreditCard, label: 'Stripe', href: '/admin/pagamenti' },
  { icon: Settings, label: 'Config', href: '/admin/impostazioni' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin') {
    return <>{children}</>
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', maxWidth: '100vw', overflow: 'hidden' }}>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 260, minWidth: 260, backgroundColor: '#1A2B3C',
        display: 'flex', flexDirection: 'column', padding: '32px 0',
      }}>
        <div style={{ padding: '0 28px', marginBottom: 48 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: 22, color: '#C4935A', fontWeight: 500, margin: 0,
          }}>
            La Suite N4
          </h1>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', borderRadius: 6, textDecoration: 'none',
                fontFamily: "'Jost', sans-serif", fontSize: 14,
                color: isActive ? '#C4935A' : 'rgba(255,255,255,0.5)',
                backgroundColor: isActive ? 'rgba(196,147,90,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={18} strokeWidth={1.5} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0 12px' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 6, border: 'none',
            background: 'transparent', fontFamily: "'Jost', sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', width: '100%',
          }}>
            <LogOut size={18} strokeWidth={1.5} />
            Esci
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content" style={{ flex: 1, backgroundColor: '#FAF8F4', minWidth: 0 }}>
        <div style={{ padding: '24px 20px 0' }} className="md:!px-8">
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#1A2B3C', margin: 0, marginBottom: 8 }}>
            Benvenuto, Admin
          </p>
          <div style={{ width: 40, height: 2, backgroundColor: '#C4935A', marginBottom: 24 }} />
        </div>
        <div style={{ padding: '0 20px 32px' }} className="md:!px-8">{children}</div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="admin-bottom-nav safe-bottom">
        {bottomTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + '/')
          const Icon = tab.icon
          return (
            <Link key={tab.href} href={tab.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, textDecoration: 'none', minWidth: 44, minHeight: 44,
              justifyContent: 'center',
            }}>
              <Icon size={20} strokeWidth={1.5} color={isActive ? '#C4935A' : 'rgba(255,255,255,0.4)'} />
              <span style={{
                fontFamily: "'Jost', sans-serif", fontSize: 10,
                color: isActive ? '#C4935A' : 'rgba(255,255,255,0.4)',
                fontWeight: isActive ? 500 : 400,
              }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
