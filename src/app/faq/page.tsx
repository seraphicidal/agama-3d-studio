import { Container } from "@/components/container"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LinkButton } from "@/components/ui/link-button"

export const metadata = {
  title: "Časté otázky",
  description:
    "Odpovede na najčastejšie otázky o doprave, platbe, vrátení tovaru, záruke a materiáloch v Agama 3D Studio.",
}

const sections = [
  {
    id: "doprava",
    title: "Doprava a platba",
    items: [
      {
        q: "Aké sú možnosti dopravy a koľko stojí?",
        a: "Zásielky doručujeme kuriérom po celom Slovensku za 4,90 €. Pri objednávke nad 60 € je doprava zadarmo. V Bratislave je možný aj osobný odber na Zlatníckej 12 — zadarmo.",
      },
      {
        q: "Ako dlho trvá doručenie?",
        a: "Väčšinu skladových modelov expedujeme do 2-4 pracovných dní od objednávky (každý kus tlačíme na objednávku). Kuriér následne doručuje do 1-2 pracovných dní. Presný odhad vidíš pri každom produkte.",
      },
      {
        q: "Aké platobné metódy prijímate?",
        a: "Prijímame platby kartou (Visa, Mastercard), Apple Pay a GoPay. Platba prebieha bezpečne online pri dokončení objednávky.",
      },
    ],
  },
  {
    id: "vratenie",
    title: "Vrátenie tovaru",
    items: [
      {
        q: "Môžem tovar vrátiť?",
        a: "Áno, skladové modely môžeš vrátiť do 14 dní od doručenia bez udania dôvodu. Tovar musí byť nepoškodený a v pôvodnom balení. Zákazkové výtlačky vyrobené podľa tvojho zadania sú z vrátenia vyňaté v súlade so zákonom.",
      },
      {
        q: "Ako prebieha vrátenie peňazí?",
        a: "Po prijatí a kontrole vráteného tovaru ti peniaze vrátime rovnakou platobnou metódou do 14 dní.",
      },
    ],
  },
  {
    id: "zaruka",
    title: "Záruka a reklamácie",
    items: [
      {
        q: "Aká záruka sa vzťahuje na výtlačky?",
        a: "Na všetky produkty poskytujeme zákonnú záruku 24 mesiacov. Ak model dorazí poškodený alebo má výrobnú vadu, pošli nám fotky na info@agama3dstudio.sk a obratom to vyriešime — najčastejšie novou tlačou zadarmo.",
      },
      {
        q: "Model mi prišiel poškodený prepravou. Čo teraz?",
        a: "Kontaktuj nás do 48 hodín od doručenia s fotografiami balíka a poškodenia. Nový kus vytlačíme a pošleme na naše náklady.",
      },
    ],
  },
  {
    id: "materialy",
    title: "Materiály a starostlivosť",
    items: [
      {
        q: "Ktorý materiál si mám vybrať?",
        a: "Pre dekoratívne figúrky odporúčame PLA alebo živicu (najjemnejší detail), pre funkčné a namáhané diely PETG či ABS, pre pružné diely TPU. Podrobné porovnanie nájdeš na stránke Materiály.",
      },
      {
        q: "Ako sa mám o vytlačený model starať?",
        a: "Modely drž mimo priameho slnka a zdrojov tepla (najmä PLA). Na čistenie stačí mäkká handrička a mydlová voda — žiadne rozpúšťadlá.",
      },
      {
        q: "Sú vaše materiály ekologické?",
        a: "Preferujeme biologicky odbúrateľné PLA filamenty a odpad z tlače recyklujeme. Balíme do kartónu a papierovej výplne bez plastov.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Podpora
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Časté otázky</h1>
          <p className="text-lg text-muted-foreground">
            Všetko o doprave, vrátení, záruke a materiáloch na jednom mieste.
          </p>
        </div>

        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 space-y-3">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <Accordion>
              {section.items.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}

        <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary p-8 text-center">
          <p className="font-medium">Nenašiel si odpoveď?</p>
          <p className="text-sm text-muted-foreground">
            Napíš nám a ozveme sa do 24 hodín.
          </p>
          <LinkButton
            href="/kontakt"
            className="mt-1 rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
          >
            Kontaktovať podporu
          </LinkButton>
        </div>
      </Container>
    </div>
  )
}
