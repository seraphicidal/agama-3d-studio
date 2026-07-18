import { Search, ShoppingBag, CreditCard, Truck, Upload, Layers, Palette, Printer } from "lucide-react"
import { Container } from "@/components/container"
import { LinkButton } from "@/components/ui/link-button"

export const metadata = { title: "Ako to funguje" }

const shopSteps = [
  { icon: Search, title: "Nájdi model", desc: "Prehliadaj stovky modelov podľa kategórie, materiálu alebo dizajnéra." },
  { icon: ShoppingBag, title: "Pridaj do košíka", desc: "Vyber materiál, farbu a veľkosť a pridaj model do košíka." },
  { icon: CreditCard, title: "Zaplať", desc: "Rýchla a bezpečná platba kartou v niekoľkých krokoch." },
  { icon: Truck, title: "Doruč sa domov", desc: "Model starostlivo zabalíme a doručíme priamo k tebe." },
]

const customSteps = [
  { icon: Upload, title: "Nahraj model", desc: "Nahraj vlastný STL, OBJ alebo 3MF súbor." },
  { icon: Layers, title: "Nastav parametre", desc: "Zvoľ materiál, výšku vrstvy a množstvo kusov." },
  { icon: Palette, title: "Vyber farbu", desc: "Vyber si z palety farieb, ktoré ponúkame." },
  { icon: Printer, title: "Vytlačíme a doručíme", desc: "Model vytlačíme a doručíme podľa dohodnutého termínu." },
]

export default function HowItWorksPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-20">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Ako to funguje
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Od nápadu k hotovému modelu
          </h1>
          <p className="text-lg text-muted-foreground">
            Nakupuj hotové modely z našej ponuky alebo si nechaj vytlačiť vlastný návrh — obe cesty
            sú rovnako jednoduché.
          </p>
        </div>

        <section className="space-y-8">
          <h2 className="text-2xl font-semibold">Nákup hotových modelov</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shopSteps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-primary/10 text-sm font-bold text-brand-primary">
                  {i + 1}
                </span>
                <s.icon className="mb-3 size-6 text-brand-primary" />
                <h3 className="mb-1 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <LinkButton href="/modely" className="rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent">
            Prehliadať modely
          </LinkButton>
        </section>

        <section className="space-y-8 rounded-3xl bg-brand-dark p-8 text-white sm:p-12 dark:bg-card dark:ring-1 dark:ring-white/10">
          <h2 className="text-2xl font-semibold">Zákazková výroba</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {customSteps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white/5 p-6">
                <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-primary/20 text-sm font-bold text-brand-accent">
                  {i + 1}
                </span>
                <s.icon className="mb-3 size-6 text-brand-accent" />
                <h3 className="mb-1 font-semibold">{s.title}</h3>
                <p className="text-sm text-white/65">{s.desc}</p>
              </div>
            ))}
          </div>
          <LinkButton href="/zakazkova-vyroba" className="rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent">
            Nahrať model
          </LinkButton>
        </section>
      </Container>
    </div>
  )
}
