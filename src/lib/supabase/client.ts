import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client for client-side usage (analytics only)
// This uses the anon key, which is safe for public exposure if RLS policies are set correctly.
const supabaseUrl = process.env.NEXT_PUBLIC_SB_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SB_PUBLISHABLE;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Analytics will not work.');
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
