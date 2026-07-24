import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseConfig } from "./config"

// Refreshes the Supabase auth session cookie on each request — the standard
// @supabase/ssr middleware pattern. Only invoked from proxy.ts when Supabase is
// configured, so it never runs (or throws) on an unconfigured build.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, anonKey } = getSupabaseConfig()

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Touching getUser() refreshes an expiring session and rewrites the cookies.
  await supabase.auth.getUser()
  return response
}
