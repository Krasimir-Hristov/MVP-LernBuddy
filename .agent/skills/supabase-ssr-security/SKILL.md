---
name: Supabase SSR & Security
description: Secure implementation of Supabase with Next.js App Router using @supabase/ssr.
---

# Supabase SSR & Security Best Practices

## Overview

This skill defines the secure integration of Supabase with Next.js App Router using the `@supabase/ssr` package. It strictly enforces the separation of Client (Anon) and Server (Service Role) contexts.

## Architecture

### 1. Client-Side (Browser)

- **Package:** `@supabase/ssr` -> `createBrowserClient`
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Usage:** basic read operations (respecting RLS), subscribing to realtime events.
- **Restriction:** NEVER use the Service Role key here.

### 2. Server-Side (Server Components / Server Actions)

- **Package:** `@supabase/ssr` -> `createServerClient`
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Usage:** Fetching data for rendering, validating sessions.
- **Context:** Cookies must be handled to persist the session.

### 3. Admin / Proxy (Route Handlers) - THE "SECRET" ZONE

- **Package:** `@supabase/supabase-js` (or `createServerClient` with service key override)
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Usecase:** Admin tasks, bypassing RLS for specific logic, logging analytics securely.
- **Location:** ONLY in `app/api/.../route.ts` or Server Actions.

## Implementation Example: Service Role Client

Create `lib/supabase/server-admin.ts` for privileged operations:

```typescript
import { createClient } from '@supabase/supabase-js';

// process.env.SUPABASE_SERVICE_ROLE_KEY is ONLY available on the server
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
```

## Security Rules

1. **RLS (Row Level Security):** ALWAYS enable RLS on all tables.
2. **Environment Variables:**
   - `NEXT_PUBLIC_...` are exposed to the browser.
   - Variables without `NEXT_PUBLIC_` are server-only.
3. **Validation:** Always validate user input in the proxy before sending to Supabase or AI models.
