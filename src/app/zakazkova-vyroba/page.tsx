import { Container } from "@/components/container"
import { CustomOrderWizard } from "@/components/wizard/custom-order-wizard"

export const metadata = { title: "Zákazková výroba" }

export default function CustomOrderPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container className="max-w-4xl space-y-8">
        <div className="space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Zákazková 3D tlač
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Nahraj svoj model</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Nahraj STL, OBJ alebo 3MF súbor a v niekoľkých krokoch získaj okamžitú cenovú ponuku.
          </p>
        </div>
        <CustomOrderWizard />
      </Container>
    </div>
  )
}
