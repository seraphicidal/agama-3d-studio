import { NextResponse, type NextRequest } from "next/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next()
  const { updateSession } = await import("@/lib/supabase/proxy-session")
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
