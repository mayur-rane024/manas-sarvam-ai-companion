import React from 'react'
import { useTranslation } from 'react-i18next'

const EMOJIS = [
  { score: 1, emoji: '😔', color: '#94A3B8' },
  { score: 2, emoji: '😟', color: '#6BA3BE' },
  { score: 3, emoji: '😐', color: '#7DD3A8' },
  { score: 4, emoji: '🙂', color: '#5BAD8F' },
  { score: 5, emoji: '😄', color: '#3B82F6' },
]

export default function MoodQuestion({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          marginBottom: '0.4rem',
          lineHeight: 1.3,
        }}>
          {t('onboarding.questions.mood.title')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {t('onboarding.questions.mood.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {EMOJIS.map(({ score, emoji, color }) => (
          <button
            key={score}
            id={`mood-btn-${score}`}
            className={`emoji-btn ${value === score ? 'selected' : ''}`}
            onClick={() => onChange(score)}
            aria-pressed={value === score}
            aria-label={`Mood ${score}: ${t(`onboarding.questions.mood.labels.${score}`)}`}
            style={value === score ? { borderColor: color } : {}}
          >
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>{emoji}</span>
            <span style={{
              fontSize: '0.7rem',
              color: value === score ? color : 'var(--color-text-muted)',
              fontWeight: value === score ? 600 : 400,
              transition: 'color 0.2s',
            }}>
              {t(`onboarding.questions.mood.labels.${score}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
