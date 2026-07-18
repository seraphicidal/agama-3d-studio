"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Lock, CreditCard, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Stepper } from "@/components/wizard/stepper"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/format"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const STEPS = [
  dict.checkout.steps.shipping,
  dict.checkout.steps.payment,
  dict.checkout.steps.summary,
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ShippingInfo {
  name: string
  email: string
  address: string
  city: string
  postalCode: string
}

type ShippingErrors = Partial<Record<keyof ShippingInfo, string>>

function validateShipping(info: ShippingInfo): ShippingErrors {
  const errors: ShippingErrors = {}
  if (!info.name.trim()) errors.name = dict.validation.required
  if (!info.email.trim()) errors.email = dict.validation.required
  else if (!EMAIL_RE.test(info.email)) errors.email = dict.validation.invalidEmail
  if (!info.address.trim()) errors.address = dict.validation.required
  if (!info.city.trim()) errors.city = dict.validation.required
  if (!info.postalCode.trim()) errors.postalCode = dict.validation.required
  return errors
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function CheckoutFlow() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const couponCode = useCartStore((s) => s.couponCode)
  const discountAmount = useCartStore((s) => s.discountAmount())
  const clear = useCartStore((s) => s.clear)
  const [step, setStep] = React.useState(0)
  const [placed, setPlaced] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [confirmationEmail, setConfirmationEmail] = React.useState("")

  const shipping = subtotal >= 60 || subtotal === 0 ? 0 : 4.9
  const total = Math.max(0, subtotal - discountAmount) + shipping

  const [shippingInfo, setShippingInfo] = React.useState<ShippingInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  })
  const [errors, setErrors] = React.useState<ShippingErrors>({})

  function update(key: keyof ShippingInfo, value: string) {
    setShippingInfo((s) => ({ ...s, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function handleContinue() {
    if (step === 0) {
      const nextErrors = validateShipping(shippingInfo)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) return
    }
    setStep((s) => s + 1)
  }

  function placeOrder() {
    setProcessing(true)
    setConfirmationEmail(shippingInfo.email)
    // Real integration: call lib/payments createCheckoutSession() here and
    // redirect to the provider-hosted payment page once live keys exist.
    setTimeout(() => {
      setProcessing(false)
      setPlaced(true)
      clear()
    }, 1200)
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-24 text-center">
        <p className="text-lg font-medium">{dict.checkout.emptyCart}</p>
        <Button
          render={<Link href="/modely" />}
          nativeButton={false}
          className="rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
        >
          {dict.checkout.browseModels}
        </Button>
      </div>
    )
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-8 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="text-2xl font-semibold">{dict.checkout.orderReceivedTitle}</h1>
        <p className="max-w-md text-muted-foreground">
          {dict.checkout.orderReceivedBody}{" "}
          <strong>{confirmationEmail || dict.checkout.yourEmail}</strong>.
        </p>
        <Button
          render={<Link href="/modely" />}
          nativeButton={false}
          className="mt-2 rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
        >
          {dict.checkout.continueShopping}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Stepper steps={STEPS} current={step} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{dict.checkout.shippingTitle}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={dict.forms.name} error={errors.name}>
                  <Input
                    value={shippingInfo.name}
                    aria-invalid={!!errors.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </Field>
                <Field label={dict.forms.email} error={errors.email}>
                  <Input
                    type="email"
                    value={shippingInfo.email}
                    aria-invalid={!!errors.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </Field>
                <Field label={dict.forms.address} error={errors.address} className="sm:col-span-2">
                  <Input
                    value={shippingInfo.address}
                    aria-invalid={!!errors.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </Field>
                <Field label={dict.forms.city} error={errors.city}>
                  <Input
                    value={shippingInfo.city}
                    aria-invalid={!!errors.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </Field>
                <Field label={dict.forms.postalCode} error={errors.postalCode}>
                  <Input
                    value={shippingInfo.postalCode}
                    aria-invalid={!!errors.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="size-5 text-brand-primary" />
                {dict.checkout.paymentTitle}
              </h2>
              <div className="space-y-1.5">
                <Label>{dict.checkout.cardNumber}</Label>
                <Input placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="cc-number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{dict.checkout.expiry}</Label>
                  <Input placeholder="MM/RR" inputMode="numeric" autoComplete="cc-exp" />
                </div>
                <div className="space-y-1.5">
                  <Label>{dict.checkout.cvc}</Label>
                  <Input placeholder="123" inputMode="numeric" autoComplete="cc-csc" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                <Lock className="size-3.5" />
                {dict.checkout.securePayment}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">{dict.checkout.summaryTitle}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.material} · {item.color} · {dict.checkout.pcs}: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice({ amount: item.price.amount * item.quantity, currency: "EUR" })}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <p className="font-medium">{dict.checkout.deliverTo}</p>
                <p className="text-muted-foreground">
                  {shippingInfo.name}, {shippingInfo.address}, {shippingInfo.city}{" "}
                  {shippingInfo.postalCode}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              {dict.common.back}
            </Button>
            {step < 2 ? (
              <Button
                onClick={handleContinue}
                className="rounded-full bg-brand-primary px-7 text-brand-primary-foreground hover:bg-brand-accent"
              >
                {dict.common.continue}
              </Button>
            ) : (
              <Button
                onClick={placeOrder}
                disabled={processing}
                className="rounded-full bg-brand-primary px-7 text-brand-primary-foreground hover:bg-brand-accent"
              >
                {processing ? dict.checkout.processing : dict.checkout.payAndOrder}
              </Button>
            )}
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-2xl bg-secondary p-6">
          <p className="text-sm font-medium">{dict.checkout.summaryBox}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>{dict.cart.subtotal}</span>
              <span>{formatPrice({ amount: subtotal, currency: "EUR" })}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-brand-primary">
                <span className="flex items-center gap-1">
                  <TicketPercent className="size-3.5" />
                  {dict.cart.discount} ({couponCode})
                </span>
                <span>−{formatPrice({ amount: discountAmount, currency: "EUR" })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{dict.cart.shipping}</span>
              <span>
                {shipping === 0
                  ? dict.checkout.free
                  : formatPrice({ amount: shipping, currency: "EUR" })}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">{dict.cart.total}</span>
            <span className="text-2xl font-semibold">
              {formatPrice({ amount: total, currency: "EUR" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
