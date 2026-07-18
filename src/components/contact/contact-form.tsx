"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  name: z.string().min(2, "Zadaj svoje meno"),
  email: z.string().email("Zadaj platný e-mail"),
  subject: z.string().min(2, "Zadaj predmet správy"),
  message: z.string().min(10, "Správa musí mať aspoň 10 znakov"),
})

type ContactValues = z.infer<typeof schema>

export function ContactForm() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  function onSubmit(values: ContactValues) {
    console.log("contact form submitted", values)
    toast.success("Správa odoslaná, ozveme sa čo najskôr!")
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Predmet</FormLabel>
              <FormControl>
                <Input placeholder="Ako ti môžeme pomôcť?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Správa</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Napíš nám..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent sm:w-auto"
        >
          Odoslať správu
        </Button>
      </form>
    </Form>
  )
}
