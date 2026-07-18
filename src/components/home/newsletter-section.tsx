"use client"

import { useState } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import { Container } from "@/components/container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { dict } from "@/lib/i18n"

export function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="bg-brand-dark py-20 text-white sm:py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.home.newsletterTitle}
        </h2>
        <p className="max-w-md text-white/65">{dict.home.newsletterSubtitle}</p>

        {submitted ? (
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm">
            <CheckCircle2 className="size-4 text-brand-accent" />
            Ďakujeme za prihlásenie!
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder={dict.home.newsletterPlaceholder}
              className="h-12 rounded-full border-white/15 bg-white/5 px-5 text-white placeholder:text-white/40"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 shrink-0 rounded-full bg-brand-primary px-6 text-brand-primary-foreground hover:bg-brand-accent"
            >
              {dict.home.newsletterCta}
              <Send className="size-4" />
            </Button>
          </form>
        )}
        <p className="text-xs text-white/40">{dict.home.newsletterConsent}</p>
      </Container>
    </section>
  )
}
