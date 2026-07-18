"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Upload } from "lucide-react"
import { Container } from "@/components/container"
import { LinkButton } from "@/components/ui/link-button"
import { ModelViewerLazy } from "@/components/three/model-viewer-lazy"
import { heroImage } from "@/lib/data/images"
import { dict } from "@/lib/i18n"

const SLIDES = Array.from({ length: 6 }, (_, i) => heroImage(i))

export function Hero() {
  const [index, setIndex] = React.useState(0)
  // Mount the 3D canvas only on desktop — `hidden lg:block` alone would still
  // load three.js and render offscreen on phones.
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[index]}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/40 to-transparent" />
      </div>

      <Container className="relative">
        <div className="grid min-h-[620px] items-center gap-10 py-24 sm:min-h-[680px] lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-brand-accent" />
              {dict.home.heroBadge}
            </span>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-accent">
                {dict.home.heroEyebrow}
              </p>
              <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {dict.home.heroHeadline}
              </h1>
            </div>
            <p className="max-w-lg text-balance text-lg text-white/75 sm:text-xl">
              {dict.home.heroSubheadline}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <LinkButton
                href="/modely"
                size="lg"
                className="h-12 rounded-full bg-brand-primary px-7 text-base text-brand-primary-foreground hover:bg-brand-accent"
              >
                {dict.home.heroCtaShop}
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton
                href="/zakazkova-vyroba"
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-white/25 bg-white/5 px-7 text-base text-white backdrop-blur-sm hover:bg-white/15"
              >
                <Upload className="size-4" />
                {dict.home.heroCtaUpload}
              </LinkButton>
              <a
                href="#preco-my"
                className="px-3 text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                {dict.home.heroCtaLearnMore}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm lg:block"
          >
            {isDesktop && (
              <ModelViewerLazy variant="knot" note={false} className="bg-transparent" />
            )}
          </motion.div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Zobraziť snímku ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
