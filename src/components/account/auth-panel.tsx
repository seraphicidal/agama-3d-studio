"use client"

import { useActionState } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signInAction, signUpAction } from "@/lib/auth/actions"
import type { AuthActionState } from "@/lib/auth/types"

const initial: AuthActionState = {}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}

function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, initial)
  return (
    <form action={action} className="space-y-4">
      <Field id="login-email" name="email" type="email" label="E-mail" placeholder="ty@email.sk" required autoComplete="email" />
      <Field id="login-password" name="password" type="password" label="Heslo" placeholder="••••••••" required autoComplete="current-password" />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
      >
        {pending ? "Prihlasujem…" : "Prihlásiť sa"}
      </Button>
    </form>
  )
}

function RegisterForm() {
  const [state, action, pending] = useActionState(signUpAction, initial)
  return (
    <form action={action} className="space-y-4">
      <Field id="reg-name" name="name" label="Meno" placeholder="Tvoje meno" required autoComplete="name" />
      <Field id="reg-email" name="email" type="email" label="E-mail" placeholder="ty@email.sk" required autoComplete="email" />
      <Field id="reg-password" name="password" type="password" label="Heslo" placeholder="••••••••" required minLength={6} autoComplete="new-password" />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.message && <p className="text-sm text-brand-primary">{state.message}</p>}
      <Button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
      >
        {pending ? "Vytváram účet…" : "Vytvoriť účet"}
      </Button>
    </form>
  )
}

export function AuthPanel({ notConfigured = false }: { notConfigured?: boolean }) {
  return (
    <div className="py-16 sm:py-24">
      <Container className="mx-auto max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8">
          <h1 className="mb-1 text-2xl font-semibold">Môj účet</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Prihlás sa alebo si vytvor účet pre sledovanie objednávok a obľúbených modelov.
          </p>

          {notConfigured ? (
            <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
              Prihlásenie ešte nie je nakonfigurované. Po pripojení Supabase (viď
              <span className="font-medium text-foreground"> SETUP.md</span>) bude
              registrácia a prihlásenie plne funkčné.
            </div>
          ) : (
            <Tabs defaultValue="login">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">
                  Prihlásenie
                </TabsTrigger>
                <TabsTrigger value="register" className="flex-1">
                  Registrácia
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-6">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register" className="pt-6">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Container>
    </div>
  )
}
