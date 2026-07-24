import { NextResponse, type NextRequest } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

// Next 16 proxy (formerly middleware). Refreshes the Supabase auth session on
// each request — but NO-OPS until Supabase is configured, so the app runs
// normally without keys.
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next()
  const { updateSession } = await import("@/lib/supabase/proxy-session")
  return updateSession(request)
}

export const config = {
  matcher: [
    // Everything except Next internals and static image assets.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
