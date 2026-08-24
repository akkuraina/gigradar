'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserProfile {
  name: string
  email: string
  location: string
  bio: string
  avatar: string
  favoriteGenres: string
}

const PRESET_AVATARS = [
  '⚡', '🎸', '🎷', '🎤', '🥁', '🎧', '🎹', '🎺', '🎶'
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    location: 'Mumbai, India',
    bio: 'Music enthusiast & underground gig hunter 🎧',
    avatar: '🎸',
    favoriteGenres: 'Indie Rock, Hip Hop, Electronic'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [customAvatarUrl, setCustomAvatarUrl] = useState('')

  // Load profile from localStorage or Session on mount
  useEffect(() => {
    if (session?.user) {
      const savedProfile = localStorage.getItem(`gigradar_profile_${session.user.email}`)
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile))
        } catch (e) {
          console.error('Failed to parse profile:', e)
        }
      } else {
        setProfile((prev) => ({
          ...prev,
          name: session.user?.name || 'Music Fan',
          email: session.user?.email || '',
          avatar: session.user?.image || '🎸',
        }))
      }
    }
  }, [session])

  // Redirect if not logged in
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-800">
          <span className="text-4xl mb-3 block">🔒</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Please sign in to view and manage your profile.</p>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all inline-block shadow-sm"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center space-x-3 px-4 py-2 rounded-xl glass">
          <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Loading profile...</span>
        </div>
      </div>
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (session?.user?.email) {
      localStorage.setItem(`gigradar_profile_${session.user.email}`, JSON.stringify(profile))
    }
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleDeleteAccount = async () => {
    if (session?.user?.email) {
      localStorage.removeItem(`gigradar_profile_${session.user.email}`)
    }
    setShowDeleteModal(false)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-1">
          Your <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Manage your account details, bio, and preferences.
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-between">
          <span>✨ Profile updated successfully!</span>
          <button onClick={() => setSaveSuccess(false)} className="text-xs font-bold">&times;</button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="glass rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl mb-8">
        {!isEditing ? (
          /* View Mode */
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-purple-500/10 dark:bg-purple-400/10 border-2 border-purple-500/20 flex items-center justify-center text-5xl overflow-hidden shadow-md">
                {profile.avatar.startsWith('http') ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.avatar}</span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{profile.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm self-center sm:self-auto"
                >
                  ✏️ Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">📍 Location</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.location}</span>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">🎧 Favorite Genres</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.favoriteGenres}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">💬 Bio</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">
              Edit Profile Details
            </h3>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Profile Avatar</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setProfile({ ...profile, avatar: emoji })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      profile.avatar === emoji 
                        ? 'bg-purple-600 text-white ring-2 ring-purple-500' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value)
                  if (e.target.value.trim()) setProfile({ ...profile, avatar: e.target.value.trim() })
                }}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Favorite Genres</label>
              <input
                type="text"
                value={profile.favoriteGenres}
                onChange={(e) => setProfile({ ...profile, favoriteGenres: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Settings & Danger Zone */}
      <div className="glass rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Account Actions</h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Sign Out</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Log out of your active GigRadar session</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
          >
            Sign Out
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div>
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account Permanently</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Permanently delete your profile data and sign out</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="glass rounded-2xl max-w-md w-full p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <span className="text-4xl mb-3 block">⚠️</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Delete Account?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              This action cannot be undone. All your saved preferences and profile settings will be permanently erased.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-sm"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
