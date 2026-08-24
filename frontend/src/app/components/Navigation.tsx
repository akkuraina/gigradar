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
    <nav className="bg-white/80 dark:bg-[#0b0f19]/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl">🎵</span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              GigRadar
            </span>
          </Link>

          {/* Desktop Navigation Cluster — Pushed to Extreme Right */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/gigs">Gigs</NavLink>
            <NavLink href="/artists">Artists</NavLink>
            <NavLink href="/venues">Venues</NavLink>
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="text-slate-500 dark:text-slate-400 text-sm">Loading...</span>
              </div>
            ) : session ? (
              <>
                <NavLink href="/profile">Profile</NavLink>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
        <div className="md:hidden bg-white/95 dark:bg-[#0b0f19]/95 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <NavLink href="/gigs" mobile>Gigs</NavLink>
          <NavLink href="/artists" mobile>Artists</NavLink>
          <NavLink href="/venues" mobile>Venues</NavLink>
          {status === 'loading' ? (
            <div className="flex items-center space-x-2 py-2 px-3">
              <div className="w-4 h-4 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              <span className="text-slate-500 dark:text-slate-400 text-sm">Loading...</span>
            </div>
          ) : session ? (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <NavLink href="/profile" mobile>Profile</NavLink>
              <button
                onClick={handleSignOut}
                className="w-full text-left text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-1.5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="block w-full text-center text-sm font-semibold px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children, mobile }: { href: string, children: React.ReactNode, mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors
        ${mobile ? 'block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800' : 'hover:underline underline-offset-4'}`}
    >
      {children}
    </Link>
  )
}