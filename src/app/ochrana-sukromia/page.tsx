import { Container } from "@/components/container"

export const metadata = {
  title: "Ochrana súkromia",
  description: "Zásady ochrany osobných údajov Agama 3D Studio.",
}

const sections = [
  {
    title: "1. Prevádzkovateľ",
    body: "Prevádzkovateľom osobných údajov je Agama 3D Studio, Zlatnícka 12, 811 04 Bratislava, Slovensko (ďalej len „prevádzkovateľ“). Kontakt: info@agama3dstudio.sk.",
  },
  {
    title: "2. Aké údaje spracúvame",
    body: "Pri objednávke spracúvame meno a priezvisko, doručovaciu adresu, e-mail a telefónne číslo. Pri zákazkovej výrobe aj nahraté 3D súbory. Pri prihlásení na newsletter iba e-mailovú adresu.",
  },
  {
    title: "3. Účel a právny základ",
    body: "Údaje spracúvame za účelom vybavenia objednávky (plnenie zmluvy), vedenia účtovníctva (zákonná povinnosť) a zasielania noviniek (súhlas, ktorý možno kedykoľvek odvolať).",
  },
  {
    title: "4. Doba uchovávania",
    body: "Objednávkové údaje uchovávame po dobu vyžadovanú účtovnými predpismi (10 rokov). Nahraté 3D súbory mažeme do 90 dní od dokončenia zákazky, ak sa nedohodneme inak. Newsletterové údaje do odvolania súhlasu.",
  },
  {
    title: "5. Príjemcovia údajov",
    body: "Údaje odovzdávame iba prepravcom za účelom doručenia a poskytovateľom platobných služieb za účelom spracovania platby. Údaje nepredávame tretím stranám.",
  },
  {
    title: "6. Tvoje práva",
    body: "Máš právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania, prenosnosť a právo namietať. So sťažnosťou sa môžeš obrátiť na Úrad na ochranu osobných údajov SR.",
  },
  {
    title: "7. Cookies",
    body: "Web používa iba technické cookies nevyhnutné pre fungovanie košíka a uložených preferencií (napr. tmavý režim). Analytické ani marketingové cookies bez tvojho súhlasu nepoužívame.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Ochrana súkromia</h1>
          <p className="text-muted-foreground">Posledná aktualizácia: 18. júla 2026</p>
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
