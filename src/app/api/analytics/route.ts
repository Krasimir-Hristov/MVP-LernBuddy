import { NextResponse } from 'next/server';
// We use the ADMIN client because the user is anonymous and we want to prevent any RLS issues
// for analytics and feedback data. This is a secure server-to-server operation.
import { createClient } from '@supabase/supabase-js';

// We need to re-initialize here because the admin export in lib/supabase/admin.ts was problematic
// or removed. Let's make sure we have a fresh, secure instance for this specific route.
const supabaseUrl = process.env.NEXT_PUBLIC_SB_URL!;
const supabaseServiceKey = process.env.SB_SECRET!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (type === 'register_user') {
      const { user_id, user_agent, locale } = data;

      // Upsert: Try to insert, if conflict on 'id', do nothing (or update timestamp)
      const { error } = await supabaseAdmin.from('unique_users').upsert(
        {
          id: user_id,
          last_seen: new Date().toISOString(),
          user_agent: user_agent,
          locale: locale,
        },
        { onConflict: 'id' },
      );

      if (error) {
        console.error('Supabase Analytics Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (type === 'feedback') {
      const { user_id, message, rating } = data;

      const { error } = await supabaseAdmin.from('feedback').insert({
        user_id: user_id,
        message: message,
        rating: rating,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase Feedback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
  } catch (err: any) {
    console.error('Analytics Route Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
