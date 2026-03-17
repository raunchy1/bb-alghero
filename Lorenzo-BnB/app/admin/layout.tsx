'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◻' },
  { href: '/admin/rooms', label: 'Camere', icon: '◻' },
  { href: '/admin/bookings', label: 'Prenotazioni', icon: '◻' },
  { href: '/admin/settings', label: 'Impostazioni', icon: '◻' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Login page — no sidebar
  if (pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-dark flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-cream text-sm font-semibold tracking-tight">Il B&B di Lorenzo</h1>
          <p className="text-grey text-xs mt-0.5">Pannello Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-cream font-medium'
                    : 'text-grey hover:text-cream hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-grey hover:text-cream hover:bg-white/5 transition-colors"
          >
            <span>←</span>
            <span>Torna al sito</span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-cream min-h-screen overflow-auto">
        <div className="p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
