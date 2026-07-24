"use server"

import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { SITE_URL } from "@/lib/site"
import type { AuthActionState } from "./types"

function toSkError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Nesprávny e-mail alebo heslo."
  if (/already registered|already exists/i.test(message)) return "Tento e-mail je už zaregistrovaný."
  if (/email not confirmed/i.test(message)) return "E-mail ešte nie je potvrdený — skontroluj si schránku."
  if (/password/i.test(message)) return "Heslo musí mať aspoň 6 znakov."
  return "Nastala chyba. Skús to znova."
}

const NOT_CONFIGURED = "Prihlásenie zatiaľ nie je nakonfigurované."

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED }
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!email || !password) return { error: "Vyplň e-mail aj heslo." }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: toSkError(error.message) }
  redirect("/ucet")
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED }
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  if (!email || password.length < 6) {
    return { error: "Zadaj platný e-mail a heslo (min. 6 znakov)." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: `${SITE_URL}/ucet` },
  })
  if (error) return { error: toSkError(error.message) }
  return { message: "Účet vytvorený. Skontroluj si e-mail a potvrď registráciu." }
}

export async function signOutAction() {
  if (!isSupabaseConfigured()) return
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/ucet")
}
