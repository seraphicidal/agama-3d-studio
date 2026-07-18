import Image from "next/image"
import { Check, X } from "lucide-react"
import { Container } from "@/components/container"
import { materials } from "@/lib/data/materials"

export const metadata = { title: "Materiály" }

export default function MaterialsPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-16">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Materiály
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Naše materiály</h1>
          <p className="text-lg text-muted-foreground">
            Pre každý model volíme materiál, ktorý najlepšie vyhovuje jeho účelu — od dekoratívnych
            figúrok až po funkčné náhradné diely.
          </p>
        </div>

        <div className="space-y-14">
          {materials.map((m, i) => (
            <div
              key={m.id}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <h2 className="text-2xl font-semibold">{m.name}</h2>
                </div>
                <p className="text-muted-foreground">{m.shortDescription}</p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-brand-primary">Výhody</p>
                    <ul className="space-y-1.5">
                      {m.pros.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-brand-primary" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-brand-orange">Nevýhody</p>
                    <ul className="space-y-1.5">
                      {m.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="mt-0.5 size-3.5 shrink-0 text-brand-orange" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {m.recommendedUse.map((u) => (
                    <span
                      key={u}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
