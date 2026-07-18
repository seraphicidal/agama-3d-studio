"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Lock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Stepper } from "@/components/wizard/stepper"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/format"

const STEPS = ["Doprava", "Platba", "Súhrn"]

export function CheckoutFlow() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const clear = useCartStore((s) => s.clear)
  const [step, setStep] = React.useState(0)
  const [placed, setPlaced] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)

  const shipping = subtotal >= 60 || subtotal === 0 ? 0 : 4.9
  const total = subtotal + shipping

  const [shippingInfo, setShippingInfo] = React.useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  })

  function placeOrder() {
    setProcessing(true)
    // Real integration: call createCheckoutSession() from lib/stripe/client.ts
    // here and redirect to the returned Stripe URL once a live key exists.
    setTimeout(() => {
      setProcessing(false)
      setPlaced(true)
      clear()
    }, 1200)
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border py-24 text-center">
        <p className="text-lg font-medium">Tvoj košík je prázdny</p>
        <Button render={<Link href="/modely" />} nativeButton={false} className="rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent">
          Prehliadať modely
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
        <h1 className="text-2xl font-semibold">Objednávka prijatá!</h1>
        <p className="max-w-md text-muted-foreground">
          Ďakujeme za tvoju objednávku. Potvrdenie sme poslali na {shippingInfo.email || "tvoj e-mail"}.
        </p>
        <Button render={<Link href="/modely" />} nativeButton={false} className="mt-2 rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent">
          Pokračovať v nákupe
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
              <h2 className="text-lg font-semibold">Doručovacie údaje</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Meno a priezvisko</Label>
                  <Input
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo((s) => ({ ...s, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Adresa</Label>
                  <Input
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo((s) => ({ ...s, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mesto</Label>
                  <Input
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo((s) => ({ ...s, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>PSČ</Label>
                  <Input
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo((s) => ({ ...s, postalCode: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="size-5 text-brand-primary" />
                Platobné údaje
              </h2>
              <div className="space-y-1.5">
                <Label>Číslo karty</Label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Platnosť</Label>
                  <Input placeholder="MM/RR" />
                </div>
                <div className="space-y-1.5">
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                <Lock className="size-3.5" />
                Platba je šifrovaná a spracovaná bezpečne.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Súhrn objednávky</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.material} · {item.color} · Ks: {item.quantity}
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
                <p className="font-medium">Doručenie na:</p>
                <p className="text-muted-foreground">
                  {shippingInfo.name || "—"}, {shippingInfo.address || "—"}, {shippingInfo.city || "—"}{" "}
                  {shippingInfo.postalCode || ""}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Späť
            </Button>
            {step < 2 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full bg-brand-primary px-7 text-brand-primary-foreground hover:bg-brand-accent"
              >
                Pokračovať
              </Button>
            ) : (
              <Button
                onClick={placeOrder}
                disabled={processing}
                className="rounded-full bg-brand-primary px-7 text-brand-primary-foreground hover:bg-brand-accent"
              >
                {processing ? "Spracúva sa..." : "Zaplatiť a objednať"}
              </Button>
            )}
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-2xl bg-secondary p-6">
          <p className="text-sm font-medium">Zhrnutie</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Medzisúčet</span>
              <span>{formatPrice({ amount: subtotal, currency: "EUR" })}</span>
            </div>
            <div className="flex justify-between">
              <span>Doprava</span>
              <span>{shipping === 0 ? "Zadarmo" : formatPrice({ amount: shipping, currency: "EUR" })}</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">Spolu</span>
            <span className="text-2xl font-semibold">{formatPrice({ amount: total, currency: "EUR" })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
