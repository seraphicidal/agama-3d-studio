import { Container } from "@/components/container"
import { ContactForm } from "@/components/contact/contact-form"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { FacebookIcon, InstagramIcon } from "@/components/icons/social"

export const metadata = { title: "Kontakt" }

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Kontakt
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Sme tu pre teba</h1>
          <p className="text-lg text-muted-foreground">
            Máš otázku k objednávke, zákazkovej výrobe alebo len chceš pozdraviť? Ozvi sa nám.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand-primary" />
                <div>
                  <p className="font-medium">Zámocká 65/1, Malacky</p>
                  <p className="text-sm text-muted-foreground">Slovensko</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-primary" />
                <a href="tel:+421944771325" className="font-medium hover:text-brand-primary">
                  +421 944 771 325
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand-primary" />
                <a href="mailto:agamaprint3d@gmail.com" className="font-medium hover:text-brand-primary">
                  agamaprint3d@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand-primary" />
                <div>
                  <p className="font-medium">Po – Pia: 9:00 – 17:00</p>
                  <p className="text-sm text-muted-foreground">Osobný odber po dohode</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex size-9 items-center justify-center rounded-full bg-secondary hover:bg-brand-primary hover:text-brand-primary-foreground">
                  <FacebookIcon className="size-4" />
                </a>
                <a href="https://instagram.com/agama3dstudio" target="_blank" rel="noreferrer" className="flex size-9 items-center justify-center rounded-full bg-secondary hover:bg-brand-primary hover:text-brand-primary-foreground">
                  <InstagramIcon className="size-4" />
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <MapPin className="size-8 text-brand-primary" />
                <p className="text-sm font-medium">Mapa bude čoskoro dostupná</p>
                <p className="text-xs text-muted-foreground">Zámocká 65/1, Malacky</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  )
}
