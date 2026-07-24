import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { getSupabaseConfig } from "./config"

// Cookie-based Supabase client for Server Components, Route Handlers and Server
// Actions — reads/writes the auth session through Next's cookie store.
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseConfig()
  const cookieStore = await cookies()
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component (cookies are read-only there). The
          // session refresh belongs in proxy.ts (middleware); safe to ignore.
        }
      },
    },
  })
}

// The currently authenticated user, or null. Replaces the mock useAccountStore
// login once auth (Phase 1 item 3) is wired.
export async function getUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Privileged, server-only client that bypasses RLS — for order writes, inventory
// decrements and admin tasks. NEVER import this from client code. Throws if the
// service-role key isn't set.
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL " +
        "and SUPABASE_SERVICE_ROLE_KEY (server-only; see .env.example)."
    )
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
