'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  const userName = session?.user?.name ? session.user.name.split(' ')[0] : 'Akanksha'

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden py-16 md:py-24">
      {/* Subtle ambient glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center">
        {/* Hero Section — Unboxed and Breathing */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex flex-col items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider border border-purple-500/20">
              <span>🎤</span> LOCAL MUSIC & CONCERT RADAR
            </div>
            {session && (
              <p className="text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400 mt-2">
                Welcome to your one and only gig finder app in the city, {userName}
              </p>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15] mb-6">
            Discover Local Music & <span className="gradient-text">Underground Gigs</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Find local concerts, indie band shows, and secret gig venues near you. Check in at events, discover trending local artists, and feel the vibe.
          </p>
          
          {/* Single Centered Primary CTA */}
          <div className="flex justify-center items-center">
            <Link 
              href="/gigs" 
              className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-semibold text-base transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2"
            >
              <span>🎵</span> <span>Explore Live Gigs</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards — Borderless/Subtle 1px Borders with Theme Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="glass rounded-2xl p-6 hover-lift flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-2xl mb-4">
              🎤
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Live Events</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore real-time upcoming gig schedules and underground venue lineups.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-2xl mb-4">
              🎨
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Artist Discovery</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Discover local independent artists, explore Spotify profiles, and check out genres.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-2xl mb-4">
              📍
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Venue Radar</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive venue map and local spot guides tailored to your city.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
