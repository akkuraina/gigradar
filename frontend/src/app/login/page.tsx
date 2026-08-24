'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // Redirect if already logged in
  if (session) {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Email/password login will be connected to backend soon!')
    }, 1000)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.error('Google sign in error:', error)
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent premium-space">
      <div className="glass rounded-2xl p-10 w-full max-w-md flex flex-col gap-8 items-center text-center shadow-none">
        <Link href="/" className="flex justify-center mb-2">
          <h1 className="text-4xl font-bold gradient-text select-none">🎵 GigRadar</h1>
        </Link>
        <h2 className="text-2xl font-extrabold mb-2 text-gray-800 dark:text-gray-100">Sign in to your account</h2>
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-primary text-white font-medium shadow-none hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </span>
          )}
        </button>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-md border border-primary/10 bg-white/80 dark:bg-[#232946]/80 px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-md border border-primary/10 bg-white/80 dark:bg-[#232946]/80 px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-md bg-primary text-white font-semibold shadow-none hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in with Email'
            )}
          </button>
        </form>
        <div className="flex flex-col gap-2 w-full mt-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 border-primary/10 rounded"
              />
              Remember me
            </label>
            <a href="#" className="text-sm underline text-gray-400 dark:text-gray-500 hover:opacity-80">Forgot your password?</a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline hover:opacity-80">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  )
} 