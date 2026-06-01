import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase.js'
import OnboardingPage from './pages/OnboardingPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import LoadingSpinner from './components/ui/LoadingSpinner.jsx'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    // Get current session or sign in anonymously
    const initAuth = async () => {
      const { data: { session: existingSession } } = await supabase.auth.getSession()
      if (existingSession) {
        setSession(existingSession)
      } else {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {          // Still allow app to run without auth (graceful degradation)
          setSession(null)
        } else {
          setSession(data.session)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show spinner while auth initializes
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Starting your session...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<OnboardingPage session={session} />} />
      <Route path="/chat" element={<ChatPage session={session} />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
