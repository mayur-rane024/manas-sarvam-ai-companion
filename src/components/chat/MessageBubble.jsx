import React from 'react'

export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '0.75rem',
      animation: 'fadeInUp 0.3s ease both',
    }}>
      {/* AI avatar */}
      {!isUser && (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          flexShrink: 0,
          marginRight: '0.5rem',
          marginTop: '0.1rem',
          boxShadow: '0 2px 8px rgba(14,165,233,0.2)',
        }}>
          🌿
        </div>
      )}

      <div style={{ maxWidth: '75%' }}>
        <div
          className={isUser ? 'bubble-user' : 'bubble-ai'}
          style={{ padding: '0.7rem 1rem', fontSize: '0.95rem', lineHeight: 1.55 }}
        >
          {content}
        </div>
        {timestamp && (
          <p style={{
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            marginTop: '0.25rem',
            textAlign: isUser ? 'right' : 'left',
            paddingLeft: isUser ? 0 : '0.25rem',
            paddingRight: isUser ? '0.25rem' : 0,
          }}>
            {new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38BDF8, #2563EB)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          color: 'white',
          fontWeight: 700,
          flexShrink: 0,
          marginLeft: '0.5rem',
          marginTop: '0.1rem',
          boxShadow: '0 2px 8px rgba(59,130,246,0.2)',
        }}>
          You
        </div>
      )}
    </div>
  )
}
