# Agama 3D Studio — Launch Setup

Everything the code needs from you to go live, in one pass. The app **builds and
runs today with none of this** (every integration is env-gated); each item below
switches on a real capability. Secrets go in **`.env.local`** (git-ignored) using
the names in [`.env.example`](.env.example) — never commit them.

Ordered by how much each unblocks.

---

## 1. Supabase — unblocks auth, accounts, order history, order persistence

**Create:** a project at https://supabase.com (choose an **EU region** for GDPR).

**Copy** (Project Settings → API) into `.env.local`:

| Value | Env var |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` secret key | `SUPABASE_SERVICE_ROLE_KEY` (server-only) |

**Apply the schema + seed:**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push          # applies supabase/migrations/*
```

Seed the catalog (regenerate any time from the app data with `npm run db:seed:generate`):
run the contents of `supabase/seed.sql` in the Supabase SQL editor, or use
`supabase db reset` against a **local** stack (see §7).

**Configure auth** (Dashboard → Authentication):
- Enable **Email** provider; turn **Confirm email** on (the app expects verification).
- URL Configuration → Site URL = your domain; add `https://<domain>/ucet` as a redirect URL.

**Create a Storage bucket** named `custom-models` (for custom-order file uploads).

→ Retires the mock login; `/ucet` becomes real sign-up / login / account.

---

## 2. Stripe — unblocks card + Apple Pay payments and order creation

**Create:** account at https://stripe.com. Start in **test mode**.

**Copy** (Developers → API keys) into `.env.local`:

| Value | Env var |
|---|---|
| Secret key (`sk_test_…`) | `STRIPE_SECRET_KEY` (server-only) |
| Publishable key (`pk_test_…`) | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |

**Register the webhook** (Developers → Webhooks → Add endpoint):
- URL: `https://<your-domain>/api/webhooks/stripe`
- Event: `checkout.session.completed`
- Copy the **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`
- Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Enable Stripe Tax** (Dashboard → Tax) and register your SK origin — required for
the `automatic_tax` VAT-inclusive calculation on checkout. Without it, sessions
with `automatic_tax` will error.

→ `/checkout` redirects to Stripe; the webhook creates the order + sends the email.

---

## 3. Email (Resend) — unblocks order-confirmation emails

**Create:** account at https://resend.com. Generate an API key in an **EU region**.
Verify your sending domain.

**Copy** into `.env.local`:

| Value | Env var |
|---|---|
| API key (`re_…`) | `RESEND_API_KEY` |
| Verified sender | `EMAIL_FROM` e.g. `"Agama 3D Studio <objednavky@vasa-domena.sk>"` |

Without these, emails are logged to the server console (safe default). Swap
providers by implementing `EmailProvider` in `src/lib/email/index.ts`.

---

## 4. Legal identity — REQUIRED before a live SK sale (I could not invent these)

Fill the real registered details in **`src/lib/company.ts`** (all `TODO_REPLACE`):
`legalName`, `ico` (IČO), `dic` (DIČ), `vatId` (IČ DPH), `street`, `city`,
`postalCode`, `contactEmail`, `phone`.

The footer / invoices / order emails render the legal block **only once these are
filled** (`legalIdentityComplete`), so nothing fake ever shows. Operating a live
Slovak e-shop with incorrect IČO/DIČ/address is illegal — do not skip this.

---

## 5. Shipping rates — confirm before launch (placeholders in place)

Edit **`src/lib/shipping.ts`** — every `price` is a `TODO_REPLACE` placeholder
based on typical SK rates (Packeta 2.99, Slovenská pošta 3.90, GLS 4.90, pickup 0).
Confirm/replace with your negotiated carrier prices and adjust
`FREE_SHIPPING_THRESHOLD` (currently 60 €, applied **post-discount**). These feed
the cart, checkout and Stripe `shipping_options` automatically.

---

## 6. DPH / VAT — ⚠️ currently OFF; confirm your status before switching on

**The shop shows no DPH line by default. This is deliberate and important.**

Having a **DIČ does not make a company a VAT payer.** Only a separate registration
under §4 zákona o DPH does, and that issues an **IČ DPH** (`SK` + 10 digits).

> §69 ods. 5 zákona o DPH: *„Každá osoba, ktorá uvedie vo faktúre alebo v inom
> doklade o predaji daň, je povinná zaplatiť túto daň.“*

So if you are **not** registered and the shop prints "z toho DPH 23 %", you owe the
state that VAT — with no right to deduct input VAT. Pure loss. Conversely, if you
**are** registered, removing the line doesn't remove the liability (you'd still owe
≈23/123 of each sale) and the invoice becomes defective.

**Do this, in order:**
1. Verify the company's status in the Financial Administration's public register:
   https://www.financnasprava.sk/sk/elektronicke-sluzby/verejne-sluzby/overovanie-ic-dph
2. Have your **účtovník** confirm it and sign off on the invoice template.
3. Only then, if registered, set `NEXT_PUBLIC_IS_VAT_PAYER=true`
   (rate defaults to `NEXT_PUBLIC_VAT_RATE=0.23`, the SK standard).
   If **not** registered, leave it `false` and have the invoice state
   *„Nie sme platiteľmi DPH.“*

Registration thresholds to watch (per calendar year, resets 1 Jan): **€50,000**
→ register, payer from 1 Jan next year; **€62,500** → payer *immediately*, on the
supply that breaches it. The code stores `vat_rate` per order and per line, so
switching on later does not corrupt historical orders.

Ask your účtovník separately about **§7a**: buying EU-invoiced services (Google/Meta
ads, and arguably parts of this stack) can trigger a registration duty for a
non-payer *regardless of turnover*.

---

## 7. (Optional) Local dev with a full Supabase stack

Needs Docker. Then:

```bash
npx supabase init          # if supabase/config.toml doesn't exist yet
npx supabase start
npx supabase db reset      # runs migrations + supabase/seed.sql
```

Point `.env.local` at the local URL/keys `supabase start` prints.

---

## Verify after wiring

```bash
npm run test     # commerce logic (pricing/VAT/shipping/orders)
npm run build    # full type-check + build
```

Then, in test mode: register → confirm email → sign in (`/ucet`); add to cart →
checkout → pay with Stripe test card `4242 4242 4242 4242`; confirm the order
appears in `/ucet` and the confirmation email sends (or logs).

---

## What's already built (drop-in — no code needed from you)

- Server-authoritative pricing/discount/**VAT (23%, inclusive)**/shipping, tested.
- Stripe Checkout Session (catalog-priced line items, `automatic_tax`,
  `shipping_options`, coupon, metadata) + signature-verified, idempotent webhook
  that creates the order and sends the email.
- Orders schema (migrations, RLS, per-line + order VAT), user-scoped history.
- Supabase auth (sign-up/login/verify/session, `proxy.ts` refresh) — env-gated.
- Email abstraction (Resend, EU) with the SK confirmation template incl. VAT.
- Security headers + CSP, Zod-validated API routes.
