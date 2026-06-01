import React from 'react'
import { useTranslation } from 'react-i18next'

const OPTIONS = [
  { key: 'yes',   value: 'Yes'                         },
  { key: 'no',    value: 'No'                          },
  { key: 'tried', value: 'I tried but couldn\'t continue' },
]

export default function TherapistQuestion({ value, onChange }) {
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
          {t('onboarding.questions.therapist.title')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {t('onboarding.questions.therapist.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map(({ key, value: optValue }) => (
          <button
            key={key}
            id={`therapist-btn-${key}`}
            className={`option-btn ${value === optValue ? 'selected' : ''}`}
            onClick={() => onChange(optValue)}
            aria-pressed={value === optValue}
            style={{ justifyContent: 'flex-start', padding: '0.85rem 1.4rem', borderRadius: '14px', textAlign: 'left' }}
          >
            {t(`onboarding.questions.therapist.options.${key}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
