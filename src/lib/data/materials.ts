import type { MaterialInfo } from "@/lib/types"
import { materialImage } from "./images"

export const materials: MaterialInfo[] = [
  {
    id: "pla",
    name: "PLA",
    shortDescription: "Najuniverzálnejší materiál — jednoduchý, presný a ekologický.",
    pros: ["Biologicky odbúrateľný", "Vysoká presnosť detailu", "Široká škála farieb", "Nízky zápach pri tlači"],
    cons: ["Menšia teplotná odolnosť", "Krehkejší pri náraze", "Nevhodný na vonkajšie použitie"],
    recommendedUse: ["Figúrky a busty", "Dekorácie", "Prototypy", "Darčeky"],
    image: materialImage("pla"),
    color: "#7fb239",
  },
  {
    id: "petg",
    name: "PETG",
    shortDescription: "Odolnejšia alternatíva k PLA s dobrou húževnatosťou.",
    pros: ["Vyššia odolnosť voči nárazu", "Odolnosť voči vlhkosti", "Bezpečný pre styk s potravinami", "Dobrá teplotná odolnosť"],
    cons: ["Náchylnejší na stringing", "Menej matný povrch", "Ťažšie sa brúsi"],
    recommendedUse: ["Náhradné diely", "Funkčné prototypy", "Doplnky do kuchyne", "Nádoby"],
    image: materialImage("petg"),
    color: "#3b6fc4",
  },
  {
    id: "abs",
    name: "ABS",
    shortDescription: "Priemyselný štandard s vysokou teplotnou odolnosťou.",
    pros: ["Vysoká teplotná odolnosť", "Húževnatý a pevný", "Dobre sa brúsi a leští", "Vhodný na acetónové vyhladenie"],
    cons: ["Zápach pri tlači", "Náchylný na warping", "Potrebuje uzavretú tlačiareň"],
    recommendedUse: ["Automotive diely", "Prilby a cosplay", "Funkčné mechanizmy", "Prototypy"],
    image: materialImage("abs"),
    color: "#d8893a",
  },
  {
    id: "asa",
    name: "ASA",
    shortDescription: "UV odolná náhrada ABS pre vonkajšie použitie.",
    pros: ["Odolný voči UV žiareniu", "Vysoká teplotná odolnosť", "Menší warping ako ABS", "Poveternostná odolnosť"],
    cons: ["Vyššia cena", "Zápach pri tlači", "Potrebuje vyššiu teplotu tlače"],
    recommendedUse: ["Vonkajšie diely", "Držiaky a konzoly", "Záhradné doplnky", "Náhradné diely áut"],
    image: materialImage("asa"),
    color: "#c94b3f",
  },
  {
    id: "tpu",
    name: "TPU",
    shortDescription: "Flexibilný a pružný materiál pre pohyblivé diely.",
    pros: ["Vysoká pružnosť", "Odolný voči oderu", "Tlmí nárazy a vibrácie", "Odolný voči oleju"],
    cons: ["Pomalšia tlač", "Náročnejšia kalibrácia", "Nižšia presnosť detailu"],
    recommendedUse: ["Ochranné puzdrá", "Tesnenia", "Podrážky", "Flexibilné klipy"],
    image: materialImage("tpu"),
    color: "#7a4fc7",
  },
  {
    id: "resin",
    name: "Živica (Resin)",
    shortDescription: "Ultra vysoké rozlíšenie pre najnáročnejšie detaily.",
    pros: ["Extrémne jemný detail", "Hladký povrch bez vrstiev", "Ideálne pre malé miniatúry", "Presné hrany a textúry"],
    cons: ["Krehkejší materiál", "Potrebuje post-processing", "Citlivý na UV svetlo", "Vyššia cena"],
    recommendedUse: ["Zberateľské figúrky", "Miniatúry do stolových hier", "Šperky a formy", "Detailné busty"],
    image: materialImage("resin"),
    color: "#8c6b3f",
  },
  {
    id: "carbon-fiber",
    name: "Carbon Fiber",
    shortDescription: "Kompozitný materiál pre maximálnu pevnosť pri nízkej hmotnosti.",
    pros: ["Vynikajúci pomer pevnosť/hmotnosť", "Vysoká tuhosť", "Odolný voči deformácii", "Prémiový matný vzhľad"],
    cons: ["Najvyššia cena", "Opotrebúva trysky tlačiarne", "Krehkejší pri ohybe"],
    recommendedUse: ["Dronové rámy a diely", "Fotografické doplnky", "Športové vybavenie", "Inžinierske prototypy"],
    image: materialImage("carbon"),
    color: "#2b2b2b",
  },
]

export function getMaterialById(id: string) {
  return materials.find((m) => m.id === id)
}
