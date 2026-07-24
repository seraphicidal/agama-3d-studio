// Reads Supabase configuration from the environment. The URL and anon key are
// public (browser-safe; access is guarded by Row Level Security). Throwing here
// keeps failures loud and legible instead of surfacing as opaque client errors.
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example)."
    )
  }
  return { url, anonKey }
}

// Non-throwing check for code paths that must degrade gracefully when Supabase
// isn't wired yet (e.g. a proxy/middleware session refresh that should no-op).
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
