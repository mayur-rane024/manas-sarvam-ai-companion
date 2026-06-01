import React, { useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const { t } = useTranslation()
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '0.65rem',
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid #E0F2FE',
    }}>
      <textarea
        id="chat-input"
        ref={textareaRef}
        className="chat-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chat.input_placeholder')}
        rows={1}
        disabled={disabled}
        aria-label="Message input"
        style={{ opacity: disabled ? 0.6 : 1 }}
      />
      <button
        id="chat-send-btn"
        className="send-btn"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label={t('chat.send')}
        title={t('chat.send')}
      >
        <Send size={18} />
      </button>
    </div>
  )
}
