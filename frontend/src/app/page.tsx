import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent premium-space">
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center px-6">
        <div className="glass rounded-3xl p-12 mb-12 hover-lift shadow-none">
          <h1 className="text-5xl md:text-7xl font-extrabold gradient-text mb-6 leading-tight">
            Discover Local Music Gigs
          </h1>
          <p className="mb-10 text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
            Find underground artists, indie concerts, and college band shows near you.<br className="hidden md:block" />
            Check in at gigs, rate the vibe, and discover your next favorite artist.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <Link 
              href="/gigs" 
              className="px-8 py-4 rounded-xl bg-primary text-white text-lg font-bold text-center shadow-none hover:bg-secondary transition-colors"
            >
              🎵 Explore Gigs
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-xl bg-white/80 dark:bg-[#232946]/80 text-primary dark:text-white text-lg font-bold text-center border border-primary/10 hover:bg-white transition-colors"
            >
              ✨ Join GigRadar
            </Link>
          </div>
        </div>
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
          <div className="glass rounded-2xl p-7 hover-lift shadow-none flex flex-col items-center">
            <div className="text-3xl mb-3">🎤</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Live Events</h3>
            <p className="text-gray-500 dark:text-gray-300 text-base">Discover upcoming concerts and gigs in your area</p>
          </div>
          <div className="glass rounded-2xl p-7 hover-lift shadow-none flex flex-col items-center">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Artist Discovery</h3>
            <p className="text-gray-500 dark:text-gray-300 text-base">Find new artists and explore different genres</p>
          </div>
          <div className="glass rounded-2xl p-7 hover-lift shadow-none flex flex-col items-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Venue Guide</h3>
            <p className="text-gray-500 dark:text-gray-300 text-base">Explore local venues and their upcoming events</p>
          </div>
        </div>
      </div>
    </div>
  )
}
