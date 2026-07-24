// Pluggable transactional email. Default is a no-op console logger so order
// flows work locally and in CI without an email account; set RESEND_API_KEY +
// EMAIL_FROM to send for real. Swap providers by implementing EmailProvider.

export interface EmailMessage {
  to: string
  subject: string
  html: string
  text: string
}

export interface EmailProvider {
  readonly name: string
  send(message: EmailMessage): Promise<void>
}

// Safe default: logs instead of sending.
const consoleProvider: EmailProvider = {
  name: "console",
  async send(message) {
    console.info(
      `[email:console] would send → ${message.to}\n  subject: ${message.subject}\n` +
        `  (set RESEND_API_KEY + EMAIL_FROM to send for real)`
    )
  },
}

// Resend chosen for GDPR: it offers EU data residency (create the API key in an
// EU region). REST call (no SDK dependency) keeps this swappable and light.
function resendProvider(apiKey: string): EmailProvider {
  return {
    name: "resend",
    async send(message) {
      const from = process.env.EMAIL_FROM
      if (!from) {
        throw new Error(
          'EMAIL_FROM is not set (e.g. "Agama 3D Studio <objednavky@vasa-domena.sk>").'
        )
      }
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
        }),
      })
      if (!res.ok) {
        throw new Error(`Resend send failed: ${res.status} ${await res.text()}`)
      }
    },
  }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export function getEmailProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? resendProvider(apiKey) : consoleProvider
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  await getEmailProvider().send(message)
}
