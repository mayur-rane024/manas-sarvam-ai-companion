import React from 'react'
import { useTranslation } from 'react-i18next'

const AGE_GROUPS = [
  { key: 'under_18', value: 'Under 18' },
  { key: '18_25',    value: '18–25'    },
  { key: '26_35',    value: '26–35'    },
  { key: '36_50',    value: '36–50'    },
  { key: '50_plus',  value: '50+'      },
]

export default function AgeQuestion({ value, onChange }) {
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
          {t('onboarding.questions.age.title')}
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {t('onboarding.questions.age.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {AGE_GROUPS.map(({ key, value: groupValue }) => (
          <button
            key={key}
            id={`age-btn-${key}`}
            className={`option-btn ${value === groupValue ? 'selected' : ''}`}
            onClick={() => onChange(groupValue)}
            aria-pressed={value === groupValue}
          >
            {t(`age_groups.${key}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
