import {
  Printer,
  Gem,
  Zap,
  Wrench,
  PackageCheck,
  MapPin,
  Leaf,
  Headset,
} from "lucide-react"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { dict } from "@/lib/i18n"

const items = [
  { icon: Printer, ...dict.whyUs.printers },
  { icon: Gem, ...dict.whyUs.materials },
  { icon: Zap, ...dict.whyUs.speed },
  { icon: Wrench, ...dict.whyUs.custom },
  { icon: PackageCheck, ...dict.whyUs.packaging },
  { icon: MapPin, ...dict.whyUs.slovak },
  { icon: Leaf, ...dict.whyUs.eco },
  { icon: Headset, ...dict.whyUs.support },
]

export function WhyUsSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="Prečo my"
          title={dict.home.whyTitle}
          subtitle={dict.home.whySubtitle}
          align="center"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-lg sm:p-6"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-brand-primary-foreground">
                <item.icon className="size-5" />
              </div>
              <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
