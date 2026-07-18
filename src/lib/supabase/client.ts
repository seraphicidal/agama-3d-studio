// Integration seam for Supabase auth/DB. No project URL/anon key exists yet.
// Account state currently lives in `useAccountStore` (localStorage). Swap
// these for real `createBrowserClient`/`createServerClient` calls from
// `@supabase/ssr` once a Supabase project is provisioned.

export interface SupabaseUser {
  id: string
  email: string
}

export async function getUser(): Promise<SupabaseUser | null> {
  throw new Error(
    "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY and implement getUser()."
  )
}

export async function signInWithPassword(
  _email: string,
  _password: string
): Promise<SupabaseUser> {
  throw new Error("Supabase is not configured yet. Implement signInWithPassword().")
}
