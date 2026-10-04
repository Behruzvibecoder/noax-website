import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Safe to import from client components.
 * Never uses the service-role key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
