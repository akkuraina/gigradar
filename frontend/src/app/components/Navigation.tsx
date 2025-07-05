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
    <nav className="backdrop-blur-md bg-white/10 dark:bg-black/20 border-b border-white/20 dark:border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <h1 className="text-2xl font-extrabold gradient-text tracking-tight group-hover:scale-105 transition-transform duration-300">
                🎵 GigRadar
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/gigs" 
              className="relative px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 group"
            >
              <span className="relative z-10">🎤 Discover Gigs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            </Link>
            
            <Link 
              href="/artists" 
              className="relative px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 group"
            >
              <span className="relative z-10">🎨 Artists</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            </Link>
            
            <Link 
              href="/venues" 
              className="relative px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 group"
            >
              <span className="relative z-10">📍 Venues</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
            </Link>
            
            {status === 'loading' ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white/80 text-sm">Loading...</span>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="glass rounded-xl px-4 py-2">
                  <span className="text-sm text-white font-medium">
                    👋 {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                ✨ Login
              </Link>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass rounded-xl p-2 text-white hover:scale-105 transition-all duration-300"
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
        <div className="md:hidden glass border-t border-white/20 rounded-b-2xl animate-slideDown">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link 
              href="/gigs" 
              className="block px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              🎤 Discover Gigs
            </Link>
            
            <Link 
              href="/artists" 
              className="block px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              🎨 Artists
            </Link>
            
            <Link 
              href="/venues" 
              className="block px-4 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              📍 Venues
            </Link>
            
            {status === 'loading' ? (
              <div className="flex items-center space-x-2 px-4 py-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white/80 text-sm">Loading...</span>
              </div>
            ) : session ? (
              <div className="px-4 py-3 space-y-3">
                <div className="glass rounded-xl px-4 py-3">
                  <p className="text-sm text-white font-medium">
                    👋 {session.user?.name || session.user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl text-sm font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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