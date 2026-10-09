'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, Dumbbell, Video, MessageCircle, Calendar,
  BarChart2, Shield, Users, Settings, LogOut, LogIn
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/exercises', icon: Dumbbell, label: 'Exercises' },
  { href: '/mood', icon: BarChart2, label: 'Mood' },
  { href: '/videos', icon: Video, label: 'Videos' },
  { href: '/chatbot', icon: MessageCircle, label: 'Chat' },
  { href: '/booking', icon: Calendar, label: 'Book' },
  { href: '/safety-plan', icon: Shield, label: 'Safety' },
  { href: '/stories', icon: Users, label: 'Stories' },
]

export default function Navigation({ name }: { name?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/user/logout', { method: 'POST' })
    } catch (e) {
      console.error('Logout error', e)
    }
    // Delete document cookies on client as backup
    document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'userName=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'screenerDone=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/onboarding')
    router.refresh()
  }

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-bold text-gray-800 text-lg">ManoMitra</span>
          </div>

          <div className="flex items-center gap-3">
            {name ? (
              <span className="text-xs text-gray-500 hidden sm:inline">
                Hi, <strong className="text-teal-600">{name}</strong>
              </span>
            ) : null}

            <Link
              href="/admin"
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
              title="Admin view"
            >
              <Settings className="w-3.5 h-3.5" />
              Admin
            </Link>

            {name ? (
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-rose-200"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            ) : (
              <Link
                href="/onboarding"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-teal-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-2 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.label.toLowerCase()}`}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Spacers */}
      <div className="h-16" /> {/* top spacer */}
    </>
  )
}
