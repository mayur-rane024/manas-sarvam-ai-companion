import React from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { key: 'english', value: 'English' },
  { key: 'hindi', value: 'Hindi' },
  { key: 'marathi', value: 'Marathi' },
  { key: 'tamil', value: 'Tamil' },
  { key: 'telugu', value: 'Telugu' },
]

export default function LanguageQuestion({ value, onChange }) {
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
          {t('onboarding.questions.language.title')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {t('onboarding.questions.language.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {LANGUAGES.map(({ key, value: langValue }) => (
          <button
            key={key}
            id={`lang-btn-${key}`}
            className={`option-btn ${value === langValue ? 'selected' : ''}`}
            onClick={() => onChange(langValue)}
            aria-pressed={value === langValue}
            style={{
              justifyContent: 'flex-start',
              padding: '0.85rem 1.4rem',
              borderRadius: '14px',
              fontSize: '1rem',
              gap: '0.75rem',
            }}
          >
            <span>{langValue}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
