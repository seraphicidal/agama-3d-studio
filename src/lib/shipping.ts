// Shipping options for cart, checkout and Stripe `shipping_options`.
//
// ⚠️ TODO_REPLACE: every `price` below is a PLACEHOLDER based on typical Slovak
// e-shop rates. Confirm/replace with your negotiated carrier prices before
// launch (see SETUP.md → Shipping). Prices are VAT-inclusive EUR.

export interface ShippingMethod {
  id: string
  /** SK-facing label. */
  label: string
  description: string
  carrier: string
  /** VAT-inclusive EUR. PLACEHOLDER — replace with a real negotiated rate. */
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
    label: "Osobný odber – Bratislava",
    description: "Osobné vyzdvihnutie na predajni, Zlatnícka 12",
    carrier: "Osobný odber",
    price: 0,
    estimatedDaysMin: 0,
    estimatedDaysMax: 0,
  },
]

export const DEFAULT_SHIPPING_METHOD_ID = "courier"

// Free shipping over this POST-discount subtotal (EUR). PLACEHOLDER — confirm.
export const FREE_SHIPPING_THRESHOLD = 60

// Which amount qualifies for free shipping. "post-discount" fixes the audit bug
// where a coupon could still earn free shipping after dropping below threshold.
export const FREE_SHIPPING_BASIS: "pre-discount" | "post-discount" = "post-discount"

export function getShippingMethod(id: string | undefined): ShippingMethod {
  return (
    SHIPPING_METHODS.find((m) => m.id === id) ??
    SHIPPING_METHODS.find((m) => m.id === DEFAULT_SHIPPING_METHOD_ID)!
  )
}
