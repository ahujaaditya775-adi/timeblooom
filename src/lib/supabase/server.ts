import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server Supabase client for use in Server Components, Route Handlers, and
 * Server Actions. Reads the user's session from cookies and still respects
 * RLS — this is NOT the admin client.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Parameters<typeof cookieStore.set>[2];
          }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no writable cookie store.
            // Safe to ignore when middleware is refreshing sessions.
          }
        },
      },
    }
  );
}

/**
 * Service-role client. BYPASSES Row Level Security entirely. Import only
 * inside trusted server-only code (route handlers / cron jobs) that
 * performs its own explicit authorization checks — never expose this
 * client or its key to the browser.
 */
export function createServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          /* no-op: the service-role client is not session-bound */
        },
      },
    }
  );
}
