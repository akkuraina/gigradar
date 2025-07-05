'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  return (
    <button
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative inline-flex items-center h-10 rounded-xl w-20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 glass border border-white/20 hover:scale-105 group"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
      
      {/* Toggle handle */}
      <span
        className={`relative inline-block w-8 h-8 transform rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
          theme === 'dark' 
            ? 'translate-x-10 bg-gradient-to-r from-yellow-400 to-orange-500' 
            : 'translate-x-1 bg-gradient-to-r from-blue-400 to-purple-500'
        }`}
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5 mx-auto mt-1.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mx-auto mt-1.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        )}
      </span>
      
      {/* Icons on the sides */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      </div>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 