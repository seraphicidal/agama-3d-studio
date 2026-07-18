import { Container } from "@/components/container"
import { CheckoutFlow } from "@/components/checkout/checkout-flow"

export const metadata = { title: "Pokladňa" }

export default function CheckoutPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container className="max-w-5xl">
        <CheckoutFlow />
      </Container>
    </div>
  )
}
