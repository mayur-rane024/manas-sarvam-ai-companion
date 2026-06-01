import React from 'react'
import { useTranslation } from 'react-i18next'

export default function OpenTextQuestion({ value, onChange, onSkip }) {
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
          {t('onboarding.questions.open_text.title')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {t('onboarding.questions.open_text.subtitle')}
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          id="open-text-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={t('onboarding.questions.open_text.placeholder')}
          rows={5}
          style={{
            width: '100%',
            border: '2px solid var(--color-border)',
            borderRadius: '16px',
            padding: '1rem 1.1rem',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            color: 'var(--color-text)',
            background: 'white',
            resize: 'none',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            lineHeight: 1.6,
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--color-primary)'
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--color-border)'
            e.target.style.boxShadow = 'none'
          }}
        />
        {value.length > 0 && (
          <span style={{
            position: 'absolute',
            bottom: '0.6rem',
            right: '1rem',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}>
            {value.length} chars
          </span>
        )}
      </div>

      <button
        id="open-text-skip-btn"
        onClick={onSkip}
        style={{
          alignSelf: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.9rem',
          textDecoration: 'underline',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          transition: 'color 0.2s',
        }}
        onMouseOver={e => e.target.style.color = 'var(--color-primary)'}
        onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}
      >
        {t('onboarding.questions.open_text.skip')}
      </button>
    </div>
  )
}
