"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Mail, Send, CheckCircle2 } from "lucide-react"
import { FacebookIcon, InstagramIcon } from "@/components/icons/social"
import { Logo } from "@/components/logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { dict } from "@/lib/i18n"

const columns = [
  {
    title: dict.footer.company,
    links: [
      { href: "/o-nas", label: dict.footer.aboutUs },
      { href: "/blog", label: dict.footer.blog },
      { href: "/kontakt", label: dict.footer.contact },
    ],
  },
  {
    title: dict.footer.support,
    links: [
      { href: "/faq", label: dict.footer.faq },
      { href: "/faq#doprava", label: dict.footer.shipping },
      { href: "/faq#vratenie", label: dict.footer.returns },
      { href: "/faq#zaruka", label: dict.footer.warranty },
    ],
  },
  {
    title: dict.footer.information,
    links: [
      { href: "/materialy", label: "Materiály" },
      { href: "/zakazkova-vyroba", label: dict.nav.customOrder },
      { href: "/ochrana-sukromia", label: dict.footer.privacy },
      { href: "/obchodne-podmienky", label: dict.footer.terms },
    ],
  },
]

export function Footer() {
  const [subscribed, setSubscribed] = React.useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setSubscribed(true)
    toast.success(dict.home.newsletterThanks)
  }

  return (
    <footer className="mt-24 bg-brand-dark text-brand-light dark:border-t dark:border-white/10 dark:bg-[#0e0e0e]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="space-y-4">
            <Logo className="text-brand-light [&_span]:text-brand-light" />
            <p className="max-w-xs text-sm text-white/60">
              Prémiové slovenské štúdio pre 3D tlač figúrok, kolekcií a zákazkových výtlačkov.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {[
                { icon: FacebookIcon, href: "https://facebook.com/agama3dstudio", label: "Facebook" },
                { icon: InstagramIcon, href: "https://instagram.com/agama3dstudio", label: "Instagram" },
                { icon: Mail, href: "mailto:info@agama3dstudio.sk", label: "E-mail" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-primary hover:text-brand-primary-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-brand-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              {dict.footer.newsletterTitle}
            </h4>
            {subscribed ? (
              <p className="flex items-center gap-2 text-sm text-brand-accent">
                <CheckCircle2 className="size-4" />
                {dict.home.newsletterThanks}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <Input
                  type="email"
                  required
                  aria-label={dict.home.newsletterPlaceholder}
                  placeholder={dict.home.newsletterPlaceholder}
                  className="border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
                <Button
                  type="submit"
                  size="icon"
                  aria-label={dict.home.newsletterCta}
                  className="shrink-0 bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Agama 3D Studio. {dict.footer.rights}</p>
          <div className="flex items-center gap-4">
            <span className="rounded-md bg-white/10 px-2 py-1">Visa</span>
            <span className="rounded-md bg-white/10 px-2 py-1">Mastercard</span>
            <span className="rounded-md bg-white/10 px-2 py-1">Apple Pay</span>
            <span className="rounded-md bg-white/10 px-2 py-1">GoPay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
