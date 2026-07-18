"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAccountStore } from "@/store/account-store"

const loginSchema = z.object({
  email: z.string().email("Zadaj platný e-mail"),
  password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
})

const registerSchema = z.object({
  name: z.string().min(2, "Zadaj svoje meno"),
  email: z.string().email("Zadaj platný e-mail"),
  password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
})

function LoginForm() {
  const login = useAccountStore((s) => s.login)
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login(values.email)
    toast.success("Prihlásenie úspešné")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ty@email.sk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heslo</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
        >
          Prihlásiť sa
        </Button>
      </form>
    </Form>
  )
}

function RegisterForm() {
  const login = useAccountStore((s) => s.login)
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  function onSubmit(values: z.infer<typeof registerSchema>) {
    login(values.email, values.name)
    toast.success("Účet vytvorený")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meno</FormLabel>
              <FormControl>
                <Input placeholder="Tvoje meno" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ty@email.sk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heslo</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
        >
          Vytvoriť účet
        </Button>
      </form>
    </Form>
  )
}

export function AuthPanel() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="mx-auto max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8">
          <h1 className="mb-1 text-2xl font-semibold">Môj účet</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Prihlás sa alebo si vytvor účet pre sledovanie objednávok a obľúbených modelov.
          </p>
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
        </div>
      </Container>
    </div>
  )
}
