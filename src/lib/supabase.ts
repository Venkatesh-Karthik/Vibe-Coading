/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for the application.
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 * 
 * To set up:
 * 1. Copy .env.example to .env.local
 * 2. Fill in your Supabase credentials from https://supabase.com
 * 3. Run the database schema from supabase/schema.sql in your Supabase SQL Editor
 * 
 * If environment variables are not set, the client will use placeholder values
 * and the application will not be able to connect to Supabase.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Warn if using placeholder values (development only)
if (typeof window !== 'undefined' && supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn(
    '⚠️ Supabase environment variables not configured. ' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
