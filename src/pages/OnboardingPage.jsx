import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Leaf } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import AgeQuestion from '../components/onboarding/AgeQuestion.jsx'
import ReasonsQuestion from '../components/onboarding/ReasonsQuestion.jsx'
import MoodQuestion from '../components/onboarding/MoodQuestion.jsx'
import TherapistQuestion from '../components/onboarding/TherapistQuestion.jsx'
import LanguageQuestion from '../components/onboarding/LanguageQuestion.jsx'
import OpenTextQuestion from '../components/onboarding/OpenTextQuestion.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

const TOTAL_STEPS = 6

const initialFormData = {
  ageGroup: null,
  reasons: [],
  moodScore: null,
  therapistHistory: null,
  language: null,
  openText: '',
}

export default function OnboardingPage({ session }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [animKey, setAnimKey] = useState(0) // force re-mount for animation
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // If user already has a profile, redirect to chat
  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.id) return
      const { data } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle()
      if (data) navigate('/chat', { replace: true })
    }
    checkProfile()
  }, [session, navigate])

  const goNext = () => {
    setAnimKey(k => k + 1)
    setStep(s => s + 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.ageGroup
      case 2: return formData.reasons.length > 0
      case 3: return formData.moodScore !== null
      case 4: return !!formData.therapistHistory
      case 5: return !!formData.language
      case 6: return true // optional
      default: return false
    }
  }

  const handleSkip = () => {
    setFormData(d => ({ ...d, openText: '' }))
    handleSubmit()
  }

  const handleSubmit = async (overrideText) => {
    setSubmitting(true)
    setError(null)

    const finalData = {
      ...formData,
      openText: overrideText !== undefined ? overrideText : formData.openText,
    }

    try {
      const userId = session?.user?.id
      if (userId) {
        const { error: dbError } = await supabase.from('user_profiles').upsert({
          id: userId,
          age_group: finalData.ageGroup,
          reasons: finalData.reasons,
          mood_score: finalData.moodScore,
          therapist_history: finalData.therapistHistory,
          preferred_language: finalData.language,
          open_text: finalData.openText || null,
        })
        if (dbError) throw dbError
      }
    } catch {      // Continue anyway — don't block user
    } finally {
      setSubmitting(false)
      navigate('/chat')
    }
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      goNext()
    } else {
      handleSubmit()
    }
  }

  const progressPercent = (step / TOTAL_STEPS) * 100

  const renderQuestion = () => {
    switch (step) {
      case 1: return (
        <AgeQuestion
          value={formData.ageGroup}
          onChange={v => setFormData(d => ({ ...d, ageGroup: v }))}
        />
      )
      case 2: return (
        <ReasonsQuestion
          value={formData.reasons}
          onChange={v => setFormData(d => ({ ...d, reasons: v }))}
        />
      )
      case 3: return (
        <MoodQuestion
          value={formData.moodScore}
          onChange={v => setFormData(d => ({ ...d, moodScore: v }))}
        />
      )
      case 4: return (
        <TherapistQuestion
          value={formData.therapistHistory}
          onChange={v => setFormData(d => ({ ...d, therapistHistory: v }))}
        />
      )
      case 5: return (
        <LanguageQuestion
          value={formData.language}
          onChange={v => setFormData(d => ({ ...d, language: v }))}
        />
      )
      case 6: return (
        <OpenTextQuestion
          value={formData.openText}
          onChange={v => setFormData(d => ({ ...d, openText: v }))}
          onSkip={handleSkip}
        />
      )
      default: return null
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #F0F9FF 0%, #ECFDF5 50%, #F0F9FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Header */}
      <header style={{
        padding: '1.5rem 1.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Leaf size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text)' }}>
            {t('app.name')}
          </span>
        </div>
        <span style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
        }}>
          {t('onboarding.step_of', { current: step, total: TOTAL_STEPS })}
        </span>
      </header>

      {/* Progress bar */}
      <div style={{
        padding: '1rem 1.5rem 0',
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div
          key={animKey}
          className="slide-in card"
          style={{ padding: '2rem 1.75rem' }}
        >
          {renderQuestion()}
        </div>

        {/* Next / Submit button (not shown for step 6 which has its own submit) */}
        {step < 6 && (
          <button
            id="onboarding-next-btn"
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '0.9rem',
              borderRadius: '14px',
              background: canProceed()
                ? 'linear-gradient(135deg, #0EA5E9, #2563EB)'
                : '#E2E8F0',
              color: canProceed() ? 'white' : '#94A3B8',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.25s',
              boxShadow: canProceed() ? '0 4px 16px rgba(14,165,233,0.3)' : 'none',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
            }}
          >
            {t('onboarding.next')} →
          </button>
        )}

        {/* Submit button for step 6 */}
        {step === 6 && (
          <button
            id="onboarding-submit-btn"
            onClick={() => handleSubmit()}
            disabled={submitting}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '0.9rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.25s',
              boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {submitting ? (
              <>
                <LoadingSpinner size={20} />
                <span>{t('onboarding.submitting')}</span>
              </>
            ) : (
              <span>🌿 {t('onboarding.submit')}</span>
            )}
          </button>
        )}

        {error && (
          <p style={{
            marginTop: '0.75rem',
            textAlign: 'center',
            color: '#EF4444',
            fontSize: '0.85rem',
          }}>
            {error}
          </p>
        )}
      </main>

      {/* Anonymous note footer */}
      <footer style={{
        padding: '1rem 1.5rem 1.5rem',
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          padding: '0.7rem 1rem',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'blur(8px)',
        }}>
          <Lock size={13} color="#64748B" />
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            {t('app.anonymous_note')}
          </p>
        </div>
      </footer>
    </div>
  )
}
