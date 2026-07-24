import { SITE_NAME } from "@/lib/site"

// Brand / trading name — safe to display everywhere (already used across the app).
export const BRAND_NAME = SITE_NAME

// ⚠️ TODO_REPLACE — REAL registered legal identity. These are intentionally BLANK.
// NEVER commit guessed or plausible-looking values: operating a live Slovak e-shop
// with an incorrect IČO / DIČ / address is illegal. `legalIdentityComplete` gates
// every merchant-identity / legal block (footer, invoices, order emails) so nothing
// fake is shown until you fill these in. See SETUP.md → Legal identity.
export const COMPANY = {
  legalName: "", // TODO_REPLACE: registered company name
  ico: "", // TODO_REPLACE: IČO
  dic: "", // TODO_REPLACE: DIČ
  vatId: "", // TODO_REPLACE: IČ DPH (VAT number), if VAT-registered
  street: "", // TODO_REPLACE: registered street address
  city: "", // TODO_REPLACE
  postalCode: "", // TODO_REPLACE
  country: "Slovensko",
  contactEmail: "", // TODO_REPLACE
  phone: "", // TODO_REPLACE
}

// True only once the essential legal identifiers are filled. Render legal blocks
// conditionally on this so placeholders never surface on a live site.
export const legalIdentityComplete = Boolean(
  COMPANY.legalName && COMPANY.ico && COMPANY.dic && COMPANY.street
)
