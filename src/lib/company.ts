import { SITE_NAME } from "@/lib/site"

export const BRAND_NAME = SITE_NAME

export const COMPANY = {
  legalName: "",
  ico: "",
  dic: "",
  vatId: "",
  street: "Zámocká 65/1",
  city: "Malacky",
  postalCode: "901 01",
  country: "Slovensko",
  contactEmail: "agamaprint3d@gmail.com",
  phone: "+421 944 771 325",
}

export const legalIdentityComplete = Boolean(
  COMPANY.legalName && COMPANY.ico && COMPANY.dic && COMPANY.street
)
