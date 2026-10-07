export interface ShippingMethod {
  id: string
  label: string
  description: string
  carrier: string
  price: number
  estimatedDaysMin: number
  estimatedDaysMax: number
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "packeta",
    label: "Packeta – výdajné miesto",
    description: "Vyzdvihnutie na výdajnom mieste alebo Z-BOX",
    carrier: "Packeta",
    price: 2.99,
    estimatedDaysMin: 2,
    estimatedDaysMax: 4,
  },
  {
    id: "posta",
    label: "Slovenská pošta – na adresu",
    description: "Doručenie balíka na vašu adresu",
    carrier: "Slovenská pošta",
    price: 3.9,
    estimatedDaysMin: 2,
    estimatedDaysMax: 5,
  },
  {
    id: "courier",
    label: "Kuriér GLS – na adresu",
    description: "Rýchle doručenie kuriérom na adresu",
    carrier: "GLS",
    price: 4.9,
    estimatedDaysMin: 1,
    estimatedDaysMax: 3,
  },
  {
    id: "pickup",
    label: "Osobný odber – Malacky",
    description: "Osobné vyzdvihnutie na predajni, Zámocká 65/1, Malacky",
    carrier: "Osobný odber",
    price: 0,
    estimatedDaysMin: 0,
    estimatedDaysMax: 0,
  },
]

export const DEFAULT_SHIPPING_METHOD_ID = "courier"

export const FREE_SHIPPING_THRESHOLD = 60

export const FREE_SHIPPING_BASIS: "pre-discount" | "post-discount" = "post-discount"

export function getShippingMethod(id: string | undefined): ShippingMethod {
  return (
    SHIPPING_METHODS.find((m) => m.id === id) ??
    SHIPPING_METHODS.find((m) => m.id === DEFAULT_SHIPPING_METHOD_ID)!
  )
}
