import type { BlogPost } from "@/lib/types"
import { blogImage } from "./images"

export const blogPosts: BlogPost[] = [
  {
    id: "vyber-spravneho-materialu",
    slug: "ako-vybrat-spravny-material-pre-3d-tlac",
    title: "Ako vybrať správny materiál pre 3D tlač",
    excerpt:
      "PLA, PETG, ABS alebo živica? Rozoberáme, kedy použiť ktorý materiál a na čo si dať pozor.",
    content: [
      "Výber materiálu je jedno z najdôležitejších rozhodnutí pri objednávaní 3D tlače. Každý materiál má iné vlastnosti a hodí sa na iný účel.",
      "PLA je najuniverzálnejšia voľba pre dekoratívne predmety a figúrky vďaka svojej presnosti a širokej palete farieb. Pre funkčné diely, ktoré musia odolávať záťaži alebo teplu, odporúčame PETG alebo ABS.",
      "Ak potrebuješ maximálny detail, napríklad pri miniatúrach do stolových hier, živica (resin) ponúka neporovnateľné rozlíšenie povrchu.",
      "V našej sekcii Materiály nájdeš podrobné porovnanie všetkých materiálov, ktoré ponúkame, vrátane ich výhod, nevýhod a odporúčaného použitia.",
    ],
    coverImage: blogImage("materials"),
    author: "Martin Kováč",
    date: "2026-06-02",
    readMinutes: 6,
    tags: ["Materiály", "Návod"],
  },
  {
    id: "starostlivost-o-modely",
    slug: "starostlivost-o-3d-tlacene-modely",
    title: "Starostlivosť o 3D tlačené modely",
    excerpt:
      "Ako čistiť, skladovať a chrániť svoje modely, aby vydržali čo najdlhšie v perfektnom stave.",
    content: [
      "3D tlačené modely, najmä tie z PLA, sú citlivé na priame slnečné žiarenie a vysoké teploty. Odporúčame ich vystavovať mimo dosahu radiátorov a okien s priamym slnkom.",
      "Na čistenie stačí mäkká handrička a jemný roztok mydlovej vody. Vyhýbaj sa agresívnym chemikáliám a rozpúšťadlám, ktoré môžu poškodiť povrch.",
      "Pri articulated modeloch odporúčame občas premazať kĺby silikónovým sprejom pre zachovanie plynulého pohybu.",
    ],
    coverImage: blogImage("care"),
    author: "Eva Straková",
    date: "2026-05-18",
    readMinutes: 4,
    tags: ["Údržba", "Tipy"],
  },
  {
    id: "od-navrhu-po-vyrobok",
    slug: "od-navrhu-po-hotovy-vyrobok",
    title: "Od návrhu po hotový výrobok — ako vyzerá naša výroba",
    excerpt:
      "Nahliadni do procesu, ktorým prejde každý model od nahratia súboru až po tvoje dvere.",
    content: [
      "Každá zákazková objednávka začína kontrolou súboru — overíme geometriu, hrúbku stien a tlačiteľnosť modelu.",
      "Po schválení nastavíme optimálne parametre tlače podľa zvoleného materiálu a farby. Naše tlačiarne bežia pod dohľadom skúseného tímu 24/7.",
      "Po dotlačení nasleduje starostlivé odstránenie podpôr, brúsenie a v prípade potreby aj lakovanie či farbenie.",
      "Na záver model dôkladne skontrolujeme a zabalíme do vlastného obalu navrhnutého tak, aby výtlačok prežil cestu k tebe bez poškodenia.",
    ],
    coverImage: blogImage("process"),
    author: "Tomáš Baran",
    date: "2026-04-27",
    readMinutes: 5,
    tags: ["Výroba", "Zákulisie"],
  },
  {
    id: "cosplay-3d-tlac-navod",
    slug: "ako-si-vytlacit-cosplay-doplnky",
    title: "Ako si vytlačiť cosplay doplnky, ktoré vydržia celý con",
    excerpt:
      "Praktické rady pre výber materiálu, veľkosti a povrchovej úpravy cosplay doplnkov.",
    content: [
      "Cosplay doplnky musia byť ľahké, ale zároveň dostatočne odolné na celodenné nosenie. ABS a PETG sú preto najčastejšou voľbou.",
      "Pri veľkých kusoch, ako sú prilby alebo brnenia, odporúčame rozdeliť model na menšie diely pre jednoduchšiu tlač aj prepravu.",
      "Naši dizajnéri radi poradia s výberom hrúbky steny a vnútornej výplne tak, aby bol výsledný kus pohodlný na nosenie.",
    ],
    coverImage: blogImage("cosplay"),
    author: "Peter Vranka",
    date: "2026-03-14",
    readMinutes: 7,
    tags: ["Cosplay", "Návod"],
  },
  {
    id: "miniatury-pre-zaciatocnikov",
    slug: "svet-miniatur-pre-zaciatocnikov",
    title: "Svet miniatúr pre začiatočníkov",
    excerpt:
      "Kam začať, ak sa chceš pustiť do zbierania a maľovania 3D tlačených miniatúr.",
    content: [
      "Miniatúry v mierke 28-32mm sú ideálnym vstupným bodom do sveta stolových hier a maľovania. Živicové modely ponúkajú najlepší detail za rozumnú cenu.",
      "Pred prvým maľovaním odporúčame model dôkladne umyť v izopropylalkohole, aby sa odstránili zvyšky separátora.",
      "V našej ponuke nájdeš širokú škálu fantasy postáv, terénnych prvkov aj celé warband sady pripravené na maľovanie.",
    ],
    coverImage: blogImage("minis"),
    author: "Zuzana Molnárová",
    date: "2026-02-09",
    readMinutes: 5,
    tags: ["Miniatúry", "Návod"],
  },
]

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}
