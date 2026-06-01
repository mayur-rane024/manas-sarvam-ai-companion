import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Lock, Leaf, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import i18n from '../lib/i18n.js'
import MessageBubble from '../components/chat/MessageBubble.jsx'
import CrisisBanner from '../components/chat/CrisisBanner.jsx'
import TypingIndicator from '../components/chat/TypingIndicator.jsx'
import ChatInput from '../components/chat/ChatInput.jsx'
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx'

// ─── Language mapping for Mayura translation ───────────────────────────────
const LANGUAGE_MAP = {
  'English': 'English',
  'Hindi': 'Hindi',
  'हिंदी': 'Hindi',
  'Tamil': 'Tamil',
  'தமிழ்': 'Tamil',
  'Telugu': 'Telugu',
  'తెలుగు': 'Telugu',
  'Marathi': 'Marathi',
  'मराठी': 'Marathi',
  'Kannada': 'Kannada',
  'ಕನ್ನಡ': 'Kannada',
  'Malayalam': 'Malayalam',
  'മലയാളം': 'Malayalam',
  'Bengali': 'Bengali',
  'বাংলা': 'Bengali',
  'Gujarati': 'Gujarati',
  'ગુજરાતી': 'Gujarati',
  'Punjabi': 'Punjabi',
  'ਪੰਜਾਬੀ': 'Punjabi',
}

const LANGUAGE_CODE_MAP = {
  'English': 'en-IN',
  'Hindi': 'hi-IN',
  'Tamil': 'ta-IN',
  'Telugu': 'te-IN',
  'Marathi': 'mr-IN',
  'Kannada': 'kn-IN',
  'Malayalam': 'ml-IN',
  'Bengali': 'bn-IN',
  'Gujarati': 'gu-IN',
  'Punjabi': 'pa-IN',
}

// ─── Mayura translation helper ──────────────────────────────────────────────
async function translateWithMayura(text, targetLanguage, apiKey) {
  if (!text || !targetLanguage || targetLanguage === 'English') {    return text
  }

  const mappedLanguage = LANGUAGE_MAP[targetLanguage] || targetLanguage
  
  if (mappedLanguage === 'English') {    return text
  }

  try {
    const apiUrl = 'https://api.sarvam.ai/translate'    
    const maxChars = 1000
    const trimmedText = text.length > maxChars ? text.slice(0, maxChars) : text

    const sourceLanguageCode = LANGUAGE_CODE_MAP.English
    const targetLanguageCode = LANGUAGE_CODE_MAP[mappedLanguage] || mappedLanguage

    const payload = {
      input: trimmedText,
      source_language_code: sourceLanguageCode,
      target_language_code: targetLanguageCode,
    }    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify(payload),
    })
    const responseText = await response.text()
    if (!response.ok) {      return text
    }

    const data = JSON.parse(responseText)
    return data.translated_text?.trim() || data.output?.trim() || text
  } catch {
    return text
  }
}

function extractFinalResponse(text) {
  if (!text) return text

  const markerIndex = text.toUpperCase().lastIndexOf('FINAL:')
  if (markerIndex !== -1) {
    return text.slice(markerIndex).replace(/^FINAL\s*:\s*/i, '').trim()
  }


  return text.trim()
}

function looksLikeReasoning(text) {
  if (!text) return false

  const lower = text.toLowerCase()
  return [
    'the user has sent',
    'analyze the user',
    'review the conversation',
    'identify the user',
    'apply the rules',
    'conversation history',
    'likely intent',
    'previous messages',
    'brainstorm potential responses',
    'select the best option',
    'recall my persona',
    'mental health support companion',
    'output only one line',
  ].some(signal => lower.includes(signal))
}

function matchesAny(text, keywords) {
  const lower = text.toLowerCase()
  return keywords.some(keyword => lower.includes(keyword))
}

function inferLanguageFromText(text) {
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'Tamil'
  }

  if (matchesAny(text, [
    'bhau', 'bhava', 'majha', 'majhi', 'majhe', 'tula', 'kay re',
    'doka', 'zala', 'zalaay', 'zaley', 'jamena', 'sang na',
    'gharach', 'gharat', 'mansa', 'kaam', 'man bhaari', 'kasa',
    'karu mi', 'aaj kay', 'shwas', 'shant',
  ])) {
    return 'Marathi'
  }

  if (matchesAny(text, [
    'anna', 'innikki', 'innikku', 'innaiku', 'romba', 'kashtama',
    'irukku', 'irukken', 'veetla', 'ellarum', 'pesina', 'kovam',
    'varudhu', 'velai', 'panna', 'concentration', 'manasu',
    'heavy ah', 'enna pannalam', 'sollunga', 'konjam', 'nimmadhi',
    'thookam', 'sapadu', 'bayama', 'tension aagudhu', 'mind set',
  ])) {
    return 'Tamil'
  }

  return null
}

function getResponseLanguage(profile, userText) {
  const profileLanguage = LANGUAGE_MAP[profile?.preferred_language] || profile?.preferred_language
  if (profileLanguage && profileLanguage !== 'English') return profileLanguage

  return inferLanguageFromText(userText) || profileLanguage || 'English'
}

function isGeneratedFallback(text) {
  if (!text) return false

  return [
    'I am here with you',
    'I am listening',
    'Nothing went wrong',
    'Since you mentioned suicide earlier',
    'Please reach out to iCall',
    'मी तुमच्यासोबत आहे',
    'मी ऐकत आहे',
    'आयकॉल',
  ].some(phrase => text.includes(phrase))
}

// ─── Crisis keyword detection ──────────────────────────────────────────────
async function saveChatMessage(userId, role, content) {
  if (!userId || !content) return

  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    role,
    content,
  })

  if (error) return
}


const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', "can't go on",
  'want to die', 'khatam karna', 'jeena nahi', 'mar jaana',
  'end it all', 'not worth living', 'no reason to live',
]

function hasCrisisKeyword(text) {
  const lower = text.toLowerCase()
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw))
}

// ─── Build system prompt ───────────────────────────────────────────────────
function buildSystemPrompt(profile) {
  const moodGuidance = profile?.mood_score <= 2
    ? 'The user may be feeling low, so be extra gentle.'
    : ''

  return `You are Manas, a warm mental health support companion for users in India.
Reply in English only. Keep it to 1-2 short sentences.
Users may write in Romanized Marathi, Hindi, slang, or local dialect. Understand the meaning and reply simply.
If the user mentions suicide or self-harm, include: Please reach out to iCall at 9152987821 - they are free and confidential.
Do not diagnose, prescribe medicine, or write analysis/options.
Output only the final user-facing reply. ${moodGuidance}`
}
// ─── Main component ────────────────────────────────────────────────────────
export default function ChatPage({ session }) {
  const { t } = useTranslation()

  const [profile, setProfile] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [stillThinking, setStillThinking] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [error, setError] = useState(null)
  const [msgCount, setMsgCount] = useState(0)

  const messagesEndRef = useRef(null)
  const stillThinkingTimerRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const addWelcomeMessage = useCallback(() => {
    const welcomeMsg = {
      role: 'assistant',
      content: t('chat.welcome'),
      timestamp: new Date().toISOString(),
    }
    setMessages([welcomeMsg])
  }, [t])

  useEffect(() => { scrollToBottom() }, [messages, isTyping, scrollToBottom])

  // ─── Init: load profile + chat history ─────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        const userId = session?.user?.id
        if (!userId) {
          // No session — allow guest usage without DB
          setIsLoading(false)
          addWelcomeMessage()
          return
        }

        // Load profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        setProfile(profileData)

        // Switch UI language if user chose Hindi
        if (profileData?.preferred_language === 'हिंदी') {
          i18n.changeLanguage('hi')
        }

        // Load existing chat messages
        const { data: chatData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })

        if (chatData && chatData.length > 0) {
          setMessages(chatData.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.created_at,
          })))
          setMsgCount(chatData.filter(m => m.role === 'assistant').length)
        } else {
          addWelcomeMessage()
        }
      } catch {
        addWelcomeMessage()
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [session, addWelcomeMessage])

  // Send message ───────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || isTyping) return

    // Crisis detection
    if (hasCrisisKeyword(text)) setShowCrisis(true)

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)
    setStillThinking(false)
    setError(null)

    // Save user message to Supabase
    const userId = session?.user?.id
    if (userId && profile) {
      saveChatMessage(userId, 'user', text)
    }

    // Still thinking timer (10s)
    stillThinkingTimerRef.current = setTimeout(() => {
      setStillThinking(true)
    }, 10000)

    try {
      // Build message history for Sarvam (exclude timestamps and bad fallback/debug text)
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      })).filter(m =>
        m.content &&
        m.content !== 'No response generated' &&
        !m.content.startsWith('Error:') &&
        !isGeneratedFallback(m.content) &&
        !looksLikeReasoning(m.content)
      )

      const newMsgCount = msgCount + 1
      const responseLanguage = getResponseLanguage(profile, text)
      const systemPrompt = buildSystemPrompt(profile)

      let aiContent = ''

      // ── Sarvam-30B API call ───────────────────────────────────────────
const sarvamKey = import.meta.env.VITE_SARVAM_API_KEY
const sarvamModel = import.meta.env.VITE_SARVAM_MODEL || 'sarvam-30b'

if (sarvamKey) {
  const sarvamMessages = [
    { role: 'system', content: systemPrompt },
    ...history,
  ]
    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': sarvamKey,
      },
      body: JSON.stringify({
        model: sarvamModel,
        messages: sarvamMessages,
        max_tokens: 2500,
        temperature: 0.3,
        reasoning_effort: 'low',
      }),
    })
    if (!response.ok) {
      const errText = await response.text()      throw new Error(`Sarvam API error: ${response.status} - ${errText}`)
    }

    const data = await response.json()    
    // Handle different response formats
    if (data.error) {
      throw new Error(`Sarvam Error: ${JSON.stringify(data.error)}`)
    }
    
    // Never show reasoning_content. Sarvam may put private analysis there while content is null.
    const choice = data.choices?.[0]
    if (choice?.finish_reason === 'length') {
      throw new Error('Sarvam response was incomplete')
    }
    const rawContent =
      choice?.message?.content?.trim() ||
      choice?.message?.text?.trim() ||
      choice?.text?.trim() ||
      choice?.content?.trim() ||
      ''
    aiContent = extractFinalResponse(rawContent)
    if (!aiContent || looksLikeReasoning(aiContent)) {
      throw new Error('Sarvam returned no displayable response')
    }
    // ── Translate response to user's preferred language using Mayura ────────
    if (responseLanguage && responseLanguage !== 'English') {      aiContent = await translateWithMayura(aiContent, responseLanguage, sarvamKey)    }
} else {
  throw new Error('Sarvam API key is not configured')
}
      clearTimeout(stillThinkingTimerRef.current)

      const aiMsg = {
        role: 'assistant',
        content: aiContent,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, aiMsg])
      setMsgCount(newMsgCount)

      // Save AI message to Supabase
      if (userId && profile) {
        saveChatMessage(userId, 'assistant', aiContent)
      }
    } catch {
      clearTimeout(stillThinkingTimerRef.current)
      setError(t('chat.error'))
    } finally {
      setIsTyping(false)
      setStillThinking(false)
    }
  }

  // Cleanup timers
  useEffect(() => {
    return () => {
      clearTimeout(stillThinkingTimerRef.current)
    }
  }, [])

  // ─── Loading state ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <LoadingSpinner />
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Loading your session...
        </p>
      </div>
    )
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(170deg, #F0F9FF 0%, #ECFDF5 100%)',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Crisis Banner — fixed at top */}
      {showCrisis && (
        <CrisisBanner onClose={() => setShowCrisis(false)} />
      )}

      {/* Header */}
      <header style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E0F2FE',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(14,165,233,0.3)',
          }}>
            <Leaf size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
              {t('app.name')}
            </h1>
            <p style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 500 }}>
              ● {t('chat.header.online')}
            </p>
          </div>
        </div>

        {/* Phone call toggle button in header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* <button
            id="call-toggle-btn"
            onClick={() => setShowCallCard(v => !v)}
            title="Talk to Manas on a phone call"
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: showCallCard
                ? 'linear-gradient(135deg, #0EA5E9, #10B981)'
                : '#F0F9FF',
              border: '1px solid #BAE6FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <Phone size={15} color={showCallCard ? 'white' : '#64748B'} />
          </button> */}

          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.4rem 0.75rem', borderRadius: '20px',
            background: '#F0F9FF', border: '1px solid #BAE6FD',
          }}>
            <Lock size={11} color="#64748B" />
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500 }}>
              {t('chat.header.anonymous')}
            </span>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div
        className="chat-messages-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1rem',
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {isTyping && (
          <div>
            <TypingIndicator />
            {stillThinking && (
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                paddingLeft: '2.5rem',
                marginTop: '-0.25rem',
                marginBottom: '0.5rem',
                animation: 'pulse-soft 2s infinite',
              }}>
                {t('chat.still_thinking')}
              </p>
            )}
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            margin: '0.75rem 0',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
          }}>
            <AlertTriangle size={14} color="#DC2626" />
            <p style={{ fontSize: '0.82rem', color: '#DC2626' }}>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ flexShrink: 0 }}>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isTyping}
        />
      </div>
    </div>
  )
}
