import React from 'react'
import { useTranslation } from 'react-i18next'

const REASONS = [
  { key: 'anxiety',      value: 'Anxiety'            },
  { key: 'loneliness',   value: 'Loneliness'         },
  { key: 'stress',       value: 'Stress'             },
  { key: 'grief',        value: 'Grief'              },
  { key: 'relationship', value: 'Relationship issues' },
  { key: 'sleep',        value: 'Sleep problems'      },
  { key: 'exploring',    value: 'Just exploring'      },
]

export default function ReasonsQuestion({ value = [], onChange }) {
  const { t } = useTranslation()

  const toggle = (reasonValue) => {
    if (value.includes(reasonValue)) {
      onChange(value.filter(v => v !== reasonValue))
    } else {
      onChange([...value, reasonValue])
    }
  }

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
          {t('onboarding.questions.reasons.title')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {t('onboarding.questions.reasons.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {REASONS.map(({ key, value: reasonValue }) => (
          <button
            key={key}
            id={`reason-btn-${key}`}
            className={`option-btn ${value.includes(reasonValue) ? 'selected' : ''}`}
            onClick={() => toggle(reasonValue)}
            aria-pressed={value.includes(reasonValue)}
          >
            {t(`onboarding.questions.reasons.options.${key}`)}
          </button>
        ))}
      </div>

      {value.length > 0 && (
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-primary)',
          fontWeight: 500,
          animation: 'fadeInUp 0.3s ease both',
        }}>
          ✓ {value.length} selected
        </p>
      )}
    </div>
  )
}
