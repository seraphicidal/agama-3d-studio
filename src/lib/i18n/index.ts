import sk from "./dictionaries/sk"
import en from "./dictionaries/en"
import type { Dictionary } from "./dictionaries/sk"

export const locales = ["sk", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "sk"

const dictionaries: Record<Locale, Dictionary> = { sk, en }

// Only "sk" is wired into the UI today. Swapping the active locale later is
// a matter of routing `locale` here from params/cookies instead of hardcoding it.
export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale]
}

export const dict = getDictionary(defaultLocale)
