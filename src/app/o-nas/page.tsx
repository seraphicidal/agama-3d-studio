import Image from "next/image"
import { Container } from "@/components/container"
import { workshopImage } from "@/lib/data/images"

export const metadata = { title: "O nás" }

const timeline = [
  { year: "2018", title: "Prvá tlačiareň v garáži", desc: "Martin začína tlačiť prvé fantasy modely pre priateľov a lokálnu komunitu zberateľov." },
  { year: "2019", title: "Založenie Agama 3D Studio", desc: "Vzniká oficiálne štúdio a prvý malý tím troch ľudí v Bratislave." },
  { year: "2021", title: "Rozšírenie flotily tlačiarní", desc: "Investujeme do priemyselných FDM a resin tlačiarní, kapacita rastie desaťnásobne." },
  { year: "2023", title: "Spustenie zákazkovej výroby", desc: "Otvárame službu nahrávania vlastných modelov s okamžitou cenovou ponukou." },
  { year: "2026", title: "Nový showroom a dielňa", desc: "Presúvame sa do väčšej dielne so showroomom pre zákazníkov v centre Bratislavy." },
]

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
              Náš príbeh
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Vášeň pre detail, od prvej vrstvy
            </h1>
            <p className="text-lg text-muted-foreground">
              Agama 3D Studio vzniklo z jednoduchej myšlienky — priniesť na Slovensko 3D tlač,
              ktorá sa nebojí porovnania s tými najlepšími svetovými štúdiami. Meno sme si vybrali
              podľa bradatej agamy, symbolu trpezlivosti a precíznosti — presne toho, čo si
              vyžaduje kvalitná 3D tlač.
            </p>
            <p className="text-muted-foreground">
              Dnes tlačíme stovky modelov mesačne pre zberateľov, cosplayerov, dizajnérov aj firmy,
              ktoré potrebujú spoľahlivého partnera pre prototypy a náhradné diely.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-3xl">
            <Image src={workshopImage(0)} alt="Dielňa Agama 3D Studio" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-3xl bg-brand-dark p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Naša misia
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Robiť 3D tlač dostupnou bez kompromisov v kvalite
            </h2>
          </div>
          <p className="self-center text-white/70">
            Veríme, že prémiová kvalita a osobný prístup nemusia byť výsadou veľkých zahraničných
            platforiem. Každý model, ktorý opustí našu dielňu, prechádza rovnakou starostlivou
            kontrolou — bez ohľadu na to, či ide o darček za 15 € alebo zákazkový projekt za
            stovky eur.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={workshopImage(i)} alt="Dielňa a tlačiarne" fill sizes="300px" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
              Naša cesta
            </span>
            <h2 className="text-3xl font-semibold tracking-tight">Míľniky Agama 3D Studio</h2>
          </div>
          <div className="relative space-y-10 border-l border-border pl-8">
            {timeline.map((t) => (
              <div key={t.year} className="relative">
                <span className="absolute -left-[41px] flex size-4 items-center justify-center rounded-full border-4 border-background bg-brand-primary" />
                <p className="text-sm font-semibold text-brand-primary">{t.year}</p>
                <h3 className="text-lg font-semibold">{t.title}</h3>
                <p className="text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
