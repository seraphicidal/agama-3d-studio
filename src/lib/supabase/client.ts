import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseConfig } from "./config"

// Browser Supabase client for Client Components (auth, RLS-guarded reads).
// Call it from an effect/handler, not at module scope, so an unconfigured build
// still renders instead of throwing during import.
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseConfig()
  return createBrowserClient(url, anonKey)
}
