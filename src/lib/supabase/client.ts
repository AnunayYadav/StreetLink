import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use a valid placeholder URL to prevent the app from crashing during initialization
  // if environment variables are missing or incorrect.
  const isConfigured = supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your-supabase')

  const finalUrl = isConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co'
  const finalKey = (supabaseKey && !supabaseKey.includes('your-supabase')) ? supabaseKey : 'placeholder-key'

  if (!isConfigured) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Supabase URL is not configured. Authentication and database features will be disabled. Please check your .env.local file.')
    }
  }

  return createBrowserClient(finalUrl, finalKey)
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!(url && url.startsWith('http') && !url.includes('your-supabase'))
}

