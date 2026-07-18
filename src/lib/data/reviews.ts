import type { Review } from "@/lib/types"
import { MOCK_NOW } from "./products"
import { reviewAvatar, testimonialPhoto } from "./images"

const names = [
  "Jana K.", "Michal S.", "Petra H.", "Roman T.", "Simona D.",
  "Andrej M.", "Veronika P.", "Filip R.", "Katarína B.", "Dušan L.",
  "Barbora Š.", "Marek V.",
]

const comments = [
  { title: "Presne podľa očakávaní", comment: "Detail modelu ma úplne nadchol, tlač bola čistá a bez akýchkoľvek chýb. Balenie prišlo perfektne zabezpečené." },
  { title: "Rýchle doručenie, skvelá kvalita", comment: "Objednal som vo štvrtok a v pondelok som mal balík doma. Model vyzerá ešte lepšie naživo ako na fotkách." },
  { title: "Budem objednávať znova", comment: "Toto je už moja tretia objednávka a kvalita je vždy konzistentná. Komunikácia s podporou bola tiež veľmi príjemná." },
  { title: "Perfektný darček", comment: "Kúpil som ako darček a obdarovaný bol nadšený. Povrch je hladký a farby presne také, ako som si vybral." },
  { title: "Skvelý pomer cena/kvalita", comment: "Za tú cenu naozaj nečakaná kvalita spracovania. Articulated kĺby sa hýbu úplne plynulo." },
  { title: "Profesionálny prístup", comment: "Mal som špeciálnu požiadavku na farbu a tím mi ochotne poradil najlepšie riešenie. Výsledok predčil očakávania." },
]

function buildReviews(productId: string, count: number): Review[] {
  return Array.from({ length: count }, (_, i) => {
    const c = comments[i % comments.length]
    const name = names[(i + productId.length) % names.length]
    return {
      id: `${productId}-review-${i}`,
      productId,
      author: name,
      avatar: reviewAvatar(`${productId}-${i}`),
      rating: i % 5 === 0 ? 4 : 5,
      date: new Date(MOCK_NOW - (i + 1) * 9 * 86400000).toISOString(),
      title: c.title,
      comment: c.comment,
      verified: true,
    }
  })
}

export function getReviewsForProduct(productId: string, count = 5): Review[] {
  return buildReviews(productId, count)
}

export const testimonials = [
  {
    id: "t1",
    author: "Jana K.",
    avatar: reviewAvatar("t1"),
    rating: 5,
    comment: "Agama 3D Studio je moja prvá voľba pre všetky zberateľské kúsky. Kvalita je vždy na najvyššej úrovni.",
    photo: testimonialPhoto("t1"),
  },
  {
    id: "t2",
    author: "Michal S.",
    avatar: reviewAvatar("t2"),
    rating: 5,
    comment: "Zákazková výroba prebehla hladko od nahratia STL súboru až po doručenie. Presne to, čo som potreboval.",
    photo: testimonialPhoto("t2"),
  },
  {
    id: "t3",
    author: "Petra H.",
    avatar: reviewAvatar("t3"),
    rating: 5,
    comment: "Balenie bolo nádherné, model prišiel bez jedinej škrabance. Určite budem objednávať znova.",
    photo: testimonialPhoto("t3"),
  },
  {
    id: "t4",
    author: "Roman T.",
    avatar: reviewAvatar("t4"),
    rating: 5,
    comment: "Náhradný diel sedel na prvý pokus. Ušetrili mi kúpu celého nového zariadenia.",
    photo: testimonialPhoto("t4"),
  },
]
