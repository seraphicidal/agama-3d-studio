import Image from "next/image"
import { Upload, Layers, Palette, Sparkles, Printer, Truck } from "lucide-react"
import { Container } from "@/components/container"
import { LinkButton } from "@/components/ui/link-button"
import { workshopImage } from "@/lib/data/images"
import { dict } from "@/lib/i18n"

const steps = [
  { icon: Upload, label: "Nahraj STL" },
  { icon: Layers, label: "Vyber materiál" },
  { icon: Palette, label: "Vyber farbu" },
  { icon: Sparkles, label: "Okamžitá cenová ponuka" },
  { icon: Printer, label: "Výroba" },
  { icon: Truck, label: "Doručenie" },
]

export function CustomPrintingSection() {
  return (
    <section id="preco-my" className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 rounded-3xl bg-brand-dark p-8 text-white sm:p-12 lg:grid-cols-2 lg:p-16">
          <div className="space-y-7">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Zákazková výroba
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {dict.home.customTitle}
            </h2>
            <p className="max-w-md text-white/70 sm:text-lg">{dict.home.customSubtitle}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.label}
                  className="flex flex-col gap-2 rounded-2xl bg-white/5 p-3.5"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
                    <span className="flex size-4 items-center justify-center rounded-full bg-brand-primary text-[9px] font-bold text-brand-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <step.icon className="size-5 text-brand-accent" />
                  <span className="text-xs font-medium leading-tight">{step.label}</span>
                </div>
              ))}
            </div>

            <LinkButton
              href="/zakazkova-vyroba"
              size="lg"
              className="h-12 rounded-full bg-brand-primary px-7 text-base text-brand-primary-foreground hover:bg-brand-accent"
            >
              {dict.home.customCta}
            </LinkButton>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto lg:h-full lg:min-h-[420px]">
            <Image
              src={workshopImage(1)}
              alt="3D tlačiareň pri práci"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
