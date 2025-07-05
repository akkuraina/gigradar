import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 animate-gradient"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300/20 rounded-full blur-md animate-pulse delay-500"></div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center px-6">
        <div className="glass rounded-3xl p-12 mb-8 hover-lift">
          <h1 className="text-5xl md:text-7xl font-extrabold gradient-text mb-6">
            Discover Local Music Gigs
          </h1>
          <p className="mb-8 text-xl md:text-2xl text-white/90 font-medium">
            Find underground artists, indie concerts, and college band shows near you. 
            <br className="hidden md:block" />
            Check in at gigs, rate the vibe, and discover your next favorite artist.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <Link 
              href="/gigs" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🎵 Explore Gigs
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-xl glass text-white text-lg font-bold text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ✨ Join GigRadar
            </Link>
          </div>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="text-3xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-white mb-2">Live Events</h3>
            <p className="text-white/80">Discover upcoming concerts and gigs in your area</p>
          </div>
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-white mb-2">Artist Discovery</h3>
            <p className="text-white/80">Find new artists and explore different genres</p>
          </div>
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="text-3xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-white mb-2">Venue Guide</h3>
            <p className="text-white/80">Explore local venues and their upcoming events</p>
          </div>
        </div>
      </div>
    </div>
  )
}
