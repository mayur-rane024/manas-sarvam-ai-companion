import React from 'react'
import { Phone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function CrisisBanner({ onClose }) {
  const { t } = useTranslation()

  return (
    <div
      id="crisis-banner"
      className="crisis-banner"
      role="alert"
      aria-live="assertive"
      style={{
        background: 'linear-gradient(135deg, #FEF2F2, #FFF1F2)',
        borderBottom: '2px solid #FECACA',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        zIndex: 50,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#FEE2E2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Phone size={16} color="#DC2626" />
      </div>

      {/* Text + Call button */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: '0.85rem',
          color: '#991B1B',
          fontWeight: 500,
          lineHeight: 1.45,
          marginBottom: '0.6rem',
        }}>
          {t('chat.crisis.banner')}
        </p>

        {/* iCall deeplink button */}
        
        <a href="tel:9152987821"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#DC2626',
            color: 'white',
            padding: '0.45rem 0.9rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Phone size={13} color="white" />
          Call iCall: 9152987821
        </a>

        <p style={{
          fontSize: '0.72rem',
          color: '#B91C1C',
          marginTop: '0.35rem',
        }}>
          Free • Confidential • Mon–Sat, 8am–10pm
        </p>
      </div>

      {/* Close button */}
      <button
        id="crisis-banner-close-btn"
        onClick={onClose}
        aria-label={t('chat.crisis.close')}
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = '#FECACA'}
        onMouseOut={e => e.currentTarget.style.background = '#FEE2E2'}
      >
        <X size={14} color="#DC2626" />
      </button>
    </div>
  )
}