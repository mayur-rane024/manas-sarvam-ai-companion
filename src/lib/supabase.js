import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that the URL is a real HTTP/HTTPS URL (not a placeholder)
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const isConfigured = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 20


// Export real client if configured, otherwise a safe no-op mock
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInAnonymously: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ error: null }),
        upsert: async () => ({ error: null }),
      }),
    }

export const supabaseConfigured = isConfigured
