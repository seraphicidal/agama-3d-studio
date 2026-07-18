"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  UploadCloud,
  FileBox,
  X,
  Minus,
  Plus,
  CheckCircle2,
  Truck,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Stepper } from "@/components/wizard/stepper"
import { materials } from "@/lib/data/materials"
import type { MaterialId } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

const STEPS = [
  "Nahratie súboru",
  "Materiál",
  "Farba",
  "Výška vrstvy",
  "Množstvo",
  "Doprava",
  "Súhrn",
]

const MATERIAL_BASE: Record<MaterialId, number> = {
  pla: 15,
  petg: 18,
  abs: 20,
  asa: 22,
  tpu: 25,
  resin: 28,
  "carbon-fiber": 35,
}

const LAYER_HEIGHTS = [
  { value: "0.28", label: "0.28 mm", desc: "Rýchla tlač, viditeľné vrstvy", multiplier: 0.85 },
  { value: "0.2", label: "0.2 mm", desc: "Odporúčaný pomer kvalita/rýchlosť", multiplier: 1 },
  { value: "0.16", label: "0.16 mm", desc: "Jemný detail", multiplier: 1.15 },
  { value: "0.1", label: "0.1 mm", desc: "Maximálny detail, pomalšia tlač", multiplier: 1.35 },
]

const COLORS = [
  { id: "black", name: "Čierna", hex: "#1a1a1a" },
  { id: "white", name: "Biela", hex: "#f5f5f5" },
  { id: "green", name: "Agama zelená", hex: "#7fb239" },
  { id: "orange", name: "Oranžová", hex: "#d8893a" },
  { id: "red", name: "Červená", hex: "#c94b3f" },
  { id: "blue", name: "Modrá", hex: "#3b6fc4" },
  { id: "silver", name: "Strieborná", hex: "#c7c7c7" },
  { id: "purple", name: "Fialová", hex: "#7a4fc7" },
]

const SHIPPING_METHODS = [
  { id: "courier", label: "Kuriér", desc: "Doručenie do 3-6 pracovných dní", price: 4.9, icon: Truck },
  { id: "pickup", label: "Osobný odber", desc: "Bratislava, Zlatnícka 12", price: 0, icon: Store },
]

interface WizardState {
  file: { name: string; size: number } | null
  material: MaterialId
  color: (typeof COLORS)[number]
  layerHeight: (typeof LAYER_HEIGHTS)[number]
  quantity: number
  shippingMethod: (typeof SHIPPING_METHODS)[number]
  name: string
  email: string
  address: string
  city: string
  postalCode: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function CustomOrderWizard() {
  const [step, setStep] = React.useState(0)
  const [dragActive, setDragActive] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [state, setState] = React.useState<WizardState>({
    file: null,
    material: "pla",
    color: COLORS[0],
    layerHeight: LAYER_HEIGHTS[1],
    quantity: 1,
    shippingMethod: SHIPPING_METHODS[0],
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const bulkDiscount = state.quantity >= 5 ? 0.9 : 1
  const productionCost =
    MATERIAL_BASE[state.material] * state.layerHeight.multiplier * state.quantity * bulkDiscount
  const total = productionCost + state.shippingMethod.price

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!["stl", "obj", "3mf"].includes(ext ?? "")) {
      toast.error("Podporované formáty: STL, OBJ, 3MF")
      return
    }
    update("file", { name: file.name, size: file.size })
    toast.success("Súbor nahraný")
  }

  const canContinue = step !== 0 || !!state.file

  function next() {
    if (step === STEPS.length - 1) {
      setSubmitted(true)
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card px-8 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-2xl font-semibold">Ďakujeme za objednávku!</h2>
        <p className="max-w-md text-muted-foreground">
          Tvoj model <strong>{state.file?.name}</strong> sme prijali. Cenovú ponuku a potvrdenie
          ti pošleme na e-mail do 24 hodín.
        </p>
        <p className="text-lg font-semibold">Odhadovaná cena: {formatPrice({ amount: Math.round(total * 100) / 100, currency: "EUR" })}</p>
        <Button
          className="mt-2 rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
          onClick={() => {
            setSubmitted(false)
            setStep(0)
            setState((s) => ({ ...s, file: null }))
          }}
        >
          Nahrať ďalší model
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <Stepper steps={STEPS} current={step} onStepClick={setStep} />

        <Separator className="my-6" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          <div className="min-h-[320px]">
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Nahraj svoj 3D model</h3>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragActive(false)
                    handleFiles(e.dataTransfer.files)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
                    dragActive ? "border-brand-primary bg-brand-primary/5" : "border-border hover:border-brand-primary/40"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".stl,.obj,.3mf"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <UploadCloud className="size-9 text-brand-primary" />
                  <p className="font-medium">Presuň súbor sem alebo klikni pre výber</p>
                  <p className="text-xs text-muted-foreground">Podporované formáty: STL, OBJ, 3MF · max. 100 MB</p>
                </div>

                {state.file && (
                  <div className="flex items-center gap-3 rounded-xl bg-secondary p-3.5">
                    <FileBox className="size-8 shrink-0 text-brand-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{state.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(state.file.size)}</p>
                    </div>
                    <button onClick={() => update("file", null)} className="text-muted-foreground hover:text-destructive">
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vyber materiál</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => update("material", m.id)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-colors",
                        state.material === m.id
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border hover:border-brand-primary/40"
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-sm text-muted-foreground">
                          od {formatPrice({ amount: MATERIAL_BASE[m.id], currency: "EUR" })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{m.shortDescription}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Vyber farbu <span className="font-normal text-muted-foreground">— {state.color.name}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => update("color", c)}
                      aria-label={c.name}
                      className={cn(
                        "size-11 rounded-full border-2 transition-transform hover:scale-110",
                        state.color.id === c.id ? "border-brand-primary" : "border-transparent"
                      )}
                      style={{ backgroundColor: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vyber výšku vrstvy</h3>
                <div className="space-y-3">
                  {LAYER_HEIGHTS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => update("layerHeight", l)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors",
                        state.layerHeight.value === l.value
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border hover:border-brand-primary/40"
                      )}
                    >
                      <div>
                        <p className="font-medium">{l.label}</p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                      {state.layerHeight.value === l.value && (
                        <CheckCircle2 className="size-5 text-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Množstvo</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      className="flex size-12 items-center justify-center hover:bg-secondary"
                      onClick={() => update("quantity", Math.max(1, state.quantity - 1))}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{state.quantity}</span>
                    <button
                      className="flex size-12 items-center justify-center hover:bg-secondary"
                      onClick={() => update("quantity", state.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  {state.quantity >= 5 && (
                    <span className="rounded-full bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary">
                      -10% množstevná zľava
                    </span>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Doprava a kontakt</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SHIPPING_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => update("shippingMethod", m)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                        state.shippingMethod.id === m.id
                          ? "border-brand-primary bg-brand-primary/5"
                          : "border-border hover:border-brand-primary/40"
                      )}
                    >
                      <m.icon className="mt-0.5 size-5 text-brand-primary" />
                      <div>
                        <p className="font-medium">
                          {m.label}{" "}
                          <span className="font-normal text-muted-foreground">
                            {m.price === 0 ? "Zadarmo" : formatPrice({ amount: m.price, currency: "EUR" })}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="wiz-name">Meno a priezvisko</Label>
                    <Input id="wiz-name" value={state.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wiz-email">E-mail</Label>
                    <Input id="wiz-email" type="email" value={state.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="wiz-address">Adresa</Label>
                    <Input id="wiz-address" value={state.address} onChange={(e) => update("address", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wiz-city">Mesto</Label>
                    <Input id="wiz-city" value={state.city} onChange={(e) => update("city", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wiz-zip">PSČ</Label>
                    <Input id="wiz-zip" value={state.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Súhrn objednávky</h3>
                <dl className="divide-y divide-border rounded-2xl border border-border">
                  {[
                    ["Súbor", state.file?.name ?? "—"],
                    ["Materiál", materials.find((m) => m.id === state.material)?.name ?? ""],
                    ["Farba", state.color.name],
                    ["Výška vrstvy", state.layerHeight.label],
                    ["Množstvo", String(state.quantity)],
                    ["Doprava", state.shippingMethod.label],
                    ["Meno", state.name || "—"],
                    ["E-mail", state.email || "—"],
                    ["Adresa", [state.address, state.city, state.postalCode].filter(Boolean).join(", ") || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between px-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Price summary sidebar */}
          <div className="space-y-4 rounded-2xl bg-secondary p-5">
            <p className="text-sm font-medium">Odhadovaná cena</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Výroba</span>
                <span>{formatPrice({ amount: Math.round(productionCost * 100) / 100, currency: "EUR" })}</span>
              </div>
              <div className="flex justify-between">
                <span>Doprava</span>
                <span>
                  {state.shippingMethod.price === 0
                    ? "Zadarmo"
                    : formatPrice({ amount: state.shippingMethod.price, currency: "EUR" })}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Spolu</span>
              <span className="text-2xl font-semibold">
                {formatPrice({ amount: Math.round(total * 100) / 100, currency: "EUR" })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Konečná cena môže byť upravená po kontrole modelu naším tímom.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Späť
        </Button>
        <Button
          onClick={next}
          disabled={!canContinue}
          className="rounded-full bg-brand-primary px-7 text-brand-primary-foreground hover:bg-brand-accent"
        >
          {step === STEPS.length - 1 ? "Odoslať objednávku" : "Pokračovať"}
        </Button>
      </div>
    </div>
  )
}
