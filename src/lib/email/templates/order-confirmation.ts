import type { OrderRecord } from "@/lib/orders/types"
import { getShippingMethod } from "@/lib/shipping"
import { formatPrice } from "@/lib/format"
import { BRAND_NAME, COMPANY, legalIdentityComplete } from "@/lib/company"

const eur = (n: number) => formatPrice({ amount: n, currency: "EUR" })

// SK-language order confirmation with the DPH (VAT) breakdown required for SK
// B2C. Prices are VAT-inclusive; the "z toho DPH" line shows the backed-out VAT.
export function renderOrderConfirmation(order: OrderRecord): {
  subject: string
  html: string
  text: string
} {
  const method = getShippingMethod(order.shippingMethodId)
  const subject = `Potvrdenie objednávky ${order.number} — ${BRAND_NAME}`

  const itemsText = order.items
    .map(
      (i) =>
        `- ${i.name} (${i.variant}) × ${i.quantity} — ${eur(i.lineTotal)}`
    )
    .join("\n")

  const vatLine =
    order.vatAmount != null && order.vatRate != null
      ? `z toho DPH (${Math.round(order.vatRate * 100)} %): ${eur(order.vatAmount)}`
      : ""

  const addr = order.shippingAddress
  const text = [
    `Ďakujeme za tvoju objednávku v ${BRAND_NAME}!`,
    ``,
    `Číslo objednávky: ${order.number}`,
    ``,
    `Položky:`,
    itemsText,
    ``,
    `Medzisúčet: ${eur(order.subtotal)}`,
    order.discountAmount > 0
      ? `Zľava${order.discountCode ? ` (${order.discountCode})` : ""}: −${eur(order.discountAmount)}`
      : ``,
    `Doprava (${method.label}): ${order.shipping === 0 ? "Zadarmo" : eur(order.shipping)}`,
    `Spolu: ${eur(order.total)}`,
    vatLine,
    ``,
    `Doručovacia adresa:`,
    `${addr.fullName}, ${addr.street}, ${addr.city} ${addr.postalCode}, ${addr.country}`,
    ``,
    `Ozveme sa ti, keď objednávku expedujeme.`,
    legalIdentityComplete
      ? `${COMPANY.legalName}, IČO: ${COMPANY.ico}, DIČ: ${COMPANY.dic}`
      : ``,
  ]
    .filter((l) => l !== "")
    .join("\n")

  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(i.name)}<br>
          <span style="color:#777;font-size:12px">${escapeHtml(i.variant)} × ${i.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${eur(i.lineTotal)}</td>
      </tr>`
    )
    .join("")

  const html = `<!doctype html><html lang="sk"><body style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
    <h1 style="font-size:20px;margin:0 0 4px">Ďakujeme za objednávku!</h1>
    <p style="color:#555;margin:0 0 16px">Objednávka <strong>${escapeHtml(order.number)}</strong></p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
      <tr><td style="padding:2px 0;color:#555">Medzisúčet</td><td style="padding:2px 0;text-align:right">${eur(order.subtotal)}</td></tr>
      ${
        order.discountAmount > 0
          ? `<tr><td style="padding:2px 0;color:#555">Zľava${order.discountCode ? ` (${escapeHtml(order.discountCode)})` : ""}</td><td style="padding:2px 0;text-align:right">−${eur(order.discountAmount)}</td></tr>`
          : ""
      }
      <tr><td style="padding:2px 0;color:#555">Doprava (${escapeHtml(method.label)})</td><td style="padding:2px 0;text-align:right">${order.shipping === 0 ? "Zadarmo" : eur(order.shipping)}</td></tr>
      <tr><td style="padding:8px 0 2px;font-weight:bold">Spolu</td><td style="padding:8px 0 2px;text-align:right;font-weight:bold">${eur(order.total)}</td></tr>
      ${vatLine ? `<tr><td style="padding:0;color:#888;font-size:12px">${escapeHtml(vatLine)}</td><td></td></tr>` : ""}
    </table>
    <p style="color:#555;font-size:13px;margin-top:16px">Doručovacia adresa:<br>
      ${escapeHtml(addr.fullName)}, ${escapeHtml(addr.street)}, ${escapeHtml(addr.city)} ${escapeHtml(addr.postalCode)}, ${escapeHtml(addr.country)}</p>
    <p style="color:#888;font-size:12px;margin-top:24px">${legalIdentityComplete ? `${escapeHtml(COMPANY.legalName)}, IČO: ${escapeHtml(COMPANY.ico)}, DIČ: ${escapeHtml(COMPANY.dic)}` : ""}</p>
  </body></html>`

  return { subject, html, text }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
