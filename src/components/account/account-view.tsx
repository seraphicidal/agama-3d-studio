"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Package, Heart, Download, MapPin, Bell, LogOut, Plus, Trash2 } from "lucide-react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product/product-card"
import { AuthPanel } from "@/components/account/auth-panel"
import { useAccountStore } from "@/store/account-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { products } from "@/lib/data/products"
import { mockOrders, orderStatusLabels } from "@/lib/data/orders"
import { formatPrice, formatDate } from "@/lib/format"
import type { Order } from "@/lib/types"

const STATUS_VARIANT: Record<Order["status"], string> = {
  delivered: "bg-brand-primary text-brand-primary-foreground",
  shipped: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  printing: "bg-brand-orange/15 text-brand-orange",
  processing: "bg-secondary text-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

export function AccountView({ initialTab }: { initialTab?: string }) {
  const user = useAccountStore((s) => s.user)
  if (!user) return <AuthPanel />
  return <Dashboard initialTab={initialTab} />
}

function Dashboard({ initialTab }: { initialTab?: string }) {
  const user = useAccountStore((s) => s.user)!
  const logout = useAccountStore((s) => s.logout)
  const wishlistIds = useWishlistStore((s) => s.productIds)
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id))

  const addresses = useAccountStore((s) => s.addresses)
  const addAddress = useAccountStore((s) => s.addAddress)
  const removeAddress = useAccountStore((s) => s.removeAddress)
  const [newAddress, setNewAddress] = React.useState({ label: "", street: "", city: "", postalCode: "" })

  const [notifications, setNotifications] = React.useState({
    orders: true,
    promotions: false,
    newsletter: true,
  })

  function handleAddAddress(e: React.FormEvent) {
    e.preventDefault()
    if (!newAddress.street || !newAddress.city) return
    addAddress({
      id: crypto.randomUUID(),
      label: newAddress.label || "Adresa",
      fullName: user.name,
      street: newAddress.street,
      city: newAddress.city,
      postalCode: newAddress.postalCode,
      country: "Slovensko",
      phone: "",
    })
    setNewAddress({ label: "", street: "", city: "", postalCode: "" })
    toast.success("Adresa pridaná")
  }

  return (
    <div className="py-10 sm:py-14">
      <Container className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Ahoj, {user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="size-4" />
            Odhlásiť sa
          </Button>
        </div>

        <Tabs defaultValue={initialTab ?? "orders"}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="orders">
              <Package className="size-4" /> Objednávky
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="size-4" /> Obľúbené
            </TabsTrigger>
            <TabsTrigger value="downloads">
              <Download className="size-4" /> Súbory
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="size-4" /> Adresy
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="size-4" /> Notifikácie
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 pt-6">
            {mockOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{order.number}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                  </div>
                  <Badge className={STATUS_VARIANT[order.status]}>
                    {orderStatusLabels[order.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="relative size-14 overflow-hidden rounded-lg bg-secondary">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                  ))}
                  <div className="ml-auto text-right">
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? "položka" : "položky"}
                    </p>
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="wishlist" className="pt-6">
            {wishlistProducts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
                <Heart className="size-8 text-muted-foreground" />
                <p className="font-medium">Zatiaľ nemáš obľúbené modely</p>
                <Button render={<Link href="/modely" />} nativeButton={false} variant="outline">
                  Preskúmať modely
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="downloads" className="space-y-3 pt-6">
            {mockOrders
              .filter((o) => o.status === "delivered")
              .map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-border p-4"
                >
                  <div>
                    <p className="font-medium">Faktúra {order.number}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.date)} · PDF</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast("Sťahovanie faktúry sa spustí čoskoro")}
                  >
                    <Download className="size-4" />
                    Stiahnuť
                  </Button>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((a) => (
                <div key={a.id} className="rounded-2xl border border-border p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-medium">{a.label}</p>
                    <button
                      onClick={() => removeAddress(a.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {a.street}, {a.city} {a.postalCode}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddAddress} className="space-y-3 rounded-2xl border border-dashed border-border p-5">
              <p className="text-sm font-medium">Pridať novú adresu</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Názov</Label>
                  <Input
                    value={newAddress.label}
                    onChange={(e) => setNewAddress((s) => ({ ...s, label: e.target.value }))}
                    placeholder="Domov"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Ulica</Label>
                  <Input
                    value={newAddress.street}
                    onChange={(e) => setNewAddress((s) => ({ ...s, street: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mesto</Label>
                  <Input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress((s) => ({ ...s, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>PSČ</Label>
                  <Input
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress((s) => ({ ...s, postalCode: e.target.value }))}
                  />
                </div>
              </div>
              <Button type="submit" variant="outline">
                <Plus className="size-4" />
                Pridať adresu
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="notifications" className="max-w-md space-y-5 pt-6">
            {[
              { key: "orders" as const, label: "Aktualizácie objednávok", desc: "Stav tvojich objednávok a doručenia" },
              { key: "promotions" as const, label: "Akcie a zľavy", desc: "Špeciálne ponuky a výpredaje" },
              { key: "newsletter" as const, label: "Newsletter", desc: "Novinky a nové modely raz týždenne" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch
                  checked={notifications[n.key]}
                  onCheckedChange={(v) => setNotifications((s) => ({ ...s, [n.key]: !!v }))}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  )
}
