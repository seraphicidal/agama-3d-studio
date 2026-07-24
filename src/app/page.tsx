import { Hero } from "@/components/home/hero"
import { CategoriesSection } from "@/components/home/categories-section"
import { TrendingSection } from "@/components/home/trending-section"
import { CreatorsSection } from "@/components/home/creators-section"
import { NewArrivalsSection } from "@/components/home/new-arrivals-section"
import { getNewArrivals } from "@/lib/data/products"
import { CustomPrintingSection } from "@/components/home/custom-printing-section"
import { WhyUsSection } from "@/components/home/why-us-section"
import { ReviewsSection } from "@/components/home/reviews-section"
import { InstagramSection } from "@/components/home/instagram-section"
import { NewsletterSection } from "@/components/home/newsletter-section"

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <TrendingSection />
      <CreatorsSection />
      <NewArrivalsSection products={getNewArrivals()} />
      <CustomPrintingSection />
      <WhyUsSection />
      <ReviewsSection />
      <InstagramSection />
      <NewsletterSection />
    </>
  )
}
