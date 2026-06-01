import React from 'react'

export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '0.75rem',
      animation: 'fadeInUp 0.3s ease both',
    }}>
      {/* AI avatar */}
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
        boxShadow: '0 2px 8px rgba(14,165,233,0.2)',
      }}>
        🌿
      </div>

      <div
        className="bubble-ai"
        style={{
          padding: '0.75rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  )
}
