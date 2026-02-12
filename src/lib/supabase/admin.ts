import { createClient } from '@supabase/supabase-js';

// Modern Admin Client bypassing RLS via SB_SECRET
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SB_URL!,
  process.env.SB_SECRET!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
