import { Search } from "lucide-react"
import { Container } from "@/components/container"
import { LinkButton } from "@/components/ui/link-button"
import { LogoMark } from "@/components/logo"

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-3xl bg-brand-primary text-brand-primary-foreground">
        <LogoMark className="size-9" />
      </span>
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Chyba 404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Stránka sa nenašla</h1>
        <p className="max-w-md text-muted-foreground">
          Model alebo stránka, ktorú hľadáš, tu nie je. Možno bol presunutý alebo už nie je
          dostupný.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LinkButton
          href="/"
          className="rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
        >
          Späť na domov
        </LinkButton>
        <LinkButton href="/modely" variant="outline" className="rounded-full">
          <Search className="size-4" />
          Prehliadať modely
        </LinkButton>
      </div>
    </Container>
  )
}
