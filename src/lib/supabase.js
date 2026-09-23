// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE 101
//
// What is the Supabase client?
//   A thin JavaScript wrapper around Supabase's REST + Realtime APIs.
//   It handles HTTP auth headers, token refresh, and RLS enforcement for you.
//   Think of it as a typed fetch() that knows about your database schema.
//
// Where do VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY come from?
//   They live in `.env.local` (never committed to git).
//   Vite exposes only VITE_ prefixed variables to the browser bundle via
//   `import.meta.env`. Non-prefixed variables stay server-side only.
//
// Is the anon key safe to expose in client-side JS?
//   YES — the anon key is intentionally public. It identifies your project,
//   but grants ZERO access on its own. Access is controlled entirely by:
//   Row Level Security (RLS) policies on every table.
//
// How does RLS work at a high level?
//   Every Supabase auth session issues a JWT. The database decodes that JWT
//   and exposes auth.uid() — the UUID of the logged-in user. Your RLS policies
//   then enforce: `USING (auth.uid() = user_id)`.
//   This means even if someone hijacks the anon key, they can only read/write
//   rows where user_id matches their own auth.uid(). No cross-user data leakage.
//
// We export a single `supabase` instance (singleton pattern).
// Creating multiple clients wastes connections and breaks auth state sync.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    '[Skipense] Missing Supabase env vars. ' +
    'Copy .env.local.example → .env.local and fill in your project credentials.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnon)
