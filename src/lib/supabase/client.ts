import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client. Uses the public anon key only — safe to ship to
 * the client. Row Level Security in Postgres is what actually keeps data
 * scoped to its owner, not this file.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
