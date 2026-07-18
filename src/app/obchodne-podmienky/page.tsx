import { Container } from "@/components/container"

export const metadata = {
  title: "Obchodné podmienky",
  description: "Všeobecné obchodné podmienky Agama 3D Studio.",
}

const sections = [
  {
    title: "1. Úvodné ustanovenia",
    body: "Tieto všeobecné obchodné podmienky upravujú vzťah medzi Agama 3D Studio, Zlatnícka 12, 811 04 Bratislava (ďalej len „predávajúci“) a zákazníkom pri nákupe cez internetový obchod agama3dstudio.sk.",
  },
  {
    title: "2. Objednávka a uzavretie zmluvy",
    body: "Kúpna zmluva vzniká potvrdením objednávky predávajúcim. Každý model tlačíme na objednávku — uvedený čas výroby je orientačný a začína plynúť dňom pripísania platby.",
  },
  {
    title: "3. Ceny a platba",
    body: "Všetky ceny sú uvedené v EUR vrátane DPH. Platba prebieha online kartou, Apple Pay alebo cez GoPay. Tovar zostáva majetkom predávajúceho do úplného zaplatenia.",
  },
  {
    title: "4. Zákazková výroba",
    body: "Pri zákazkovej tlači z nahratého súboru zodpovedá zákazník za to, že disponuje právami k tlačenému modelu. Cenová ponuka vygenerovaná systémom je predbežná a môže byť upravená po technickej kontrole modelu; finálnu cenu zákazník potvrdzuje pred spustením výroby.",
  },
  {
    title: "5. Dodanie",
    body: "Tovar doručujeme kuriérom v rámci SR, prípadne osobným odberom v Bratislave. Odhadované lehoty sú uvedené pri produkte; o expedícii informujeme e-mailom.",
  },
  {
    title: "6. Odstúpenie od zmluvy",
    body: "Zákazník má právo odstúpiť od zmluvy do 14 dní od prevzatia tovaru. Toto právo sa nevzťahuje na tovar zhotovený podľa osobitných požiadaviek zákazníka (zákazkové výtlačky, personalizované modely).",
  },
  {
    title: "7. Reklamácie",
    body: "Na tovar sa vzťahuje zákonná záruka 24 mesiacov. Reklamácie vybavujeme do 30 dní; kontaktuj nás na info@agama3dstudio.sk s popisom vady a fotografiami.",
  },
  {
    title: "8. Záverečné ustanovenia",
    body: "Vzťahy neupravené týmito podmienkami sa riadia právnym poriadkom Slovenskej republiky, najmä Občianskym zákonníkom a zákonom o ochrane spotrebiteľa. Podmienky sú platné od 18. júla 2026.",
  },
]

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Obchodné podmienky</h1>
          <p className="text-muted-foreground">Platné od 18. júla 2026</p>
        </div>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} className="space-y-2">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </div>
  )
}
