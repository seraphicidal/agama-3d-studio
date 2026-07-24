import { SITE_NAME } from "@/lib/site"

// Brand / trading name — safe to display everywhere (already used across the app).
export const BRAND_NAME = SITE_NAME

// Contact details below are OWNER-PROVIDED (real). The registered legal identifiers
// (legalName / IČO / DIČ / IČ DPH) are still BLANK — NEVER commit guessed values:
// operating a live Slovak e-shop with an incorrect IČO/DIČ is illegal.
// `legalIdentityComplete` gates the merchant-identity / legal blocks (invoices,
// order emails) so they stay hidden until the legal identifiers are filled.
// See SETUP.md → Legal identity.
export const COMPANY = {
  legalName: "", // TODO_REPLACE: registered company name
  ico: "", // TODO_REPLACE: IČO
  dic: "", // TODO_REPLACE: DIČ
  vatId: "", // TODO_REPLACE: IČ DPH (VAT number), if VAT-registered
  street: "Zámocká 65/1",
  city: "Malacky",
  postalCode: "", // TODO_REPLACE: PSČ (not provided; Malacky is 901 01 — confirm)
  country: "Slovensko",
  contactEmail: "agamaprint3d@gmail.com",
  phone: "+421 944 771 325",
}

// True only once the essential legal identifiers are filled. Render legal blocks
// conditionally on this so placeholders never surface on a live site.
export const legalIdentityComplete = Boolean(
  COMPANY.legalName && COMPANY.ico && COMPANY.dic && COMPANY.street
)
