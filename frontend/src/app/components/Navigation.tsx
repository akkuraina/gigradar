'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="backdrop-blur-md bg-white/70 dark:bg-[#18181b]/80 border-b border-transparent sticky top-0 z-50 transition-all duration-300 shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <h1 className="text-xl font-bold tracking-tight gradient-text select-none transition-transform duration-200">
              <span className="align-middle">🎵</span> <span className="ml-1">GigRadar</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/gigs">Gigs</NavLink>
            <NavLink href="/artists">Artists</NavLink>
            <NavLink href="/venues">Venues</NavLink>
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="text-gray-500 text-sm">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium px-3 py-1 rounded-lg bg-white/60 dark:bg-[#232946]/60">
                  👋 {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium px-4 py-1 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-sm font-bold px-5 py-1 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
              >
                ✨ Login
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-[#232946]/60 transition-colors"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-[#18181b]/95 border-t border-transparent animate-slideDown">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <NavLink href="/gigs" mobile>Gigs</NavLink>
            <NavLink href="/artists" mobile>Artists</NavLink>
            <NavLink href="/venues" mobile>Venues</NavLink>
            {status === 'loading' ? (
              <div className="flex items-center space-x-2 px-4 py-3">
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="text-gray-500 text-sm">Loading...</span>
              </div>
            ) : session ? (
              <div className="px-4 py-3 space-y-3">
                <span className="text-sm text-gray-700 dark:text-gray-200 font-medium px-3 py-1 rounded-lg bg-white/60 dark:bg-[#232946]/60 block">
                  👋 {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="w-full text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="block w-full text-sm font-bold px-4 py-2 rounded-lg bg-primary text-white hover:bg-secondary text-center transition-colors"
              >
                ✨ Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children, mobile }: { href: string, children: React.ReactNode, mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-1 rounded-lg font-medium text-gray-700 dark:text-gray-200 transition-colors duration-150
        ${mobile ? 'block w-full text-left hover:bg-gray-200/60 dark:hover:bg-[#232946]/60' : 'hover:underline underline-offset-4 hover:text-primary'}`}
    >
      {children}
    </Link>
  )
} 