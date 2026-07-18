"use client"

import * as React from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Upload } from "lucide-react"
import { Container } from "@/components/container"
import { LinkButton } from "@/components/ui/link-button"
import { RatingStars } from "@/components/rating-stars"
import { heroImage } from "@/lib/data/images"
import { dict } from "@/lib/i18n"

const SLIDES = Array.from({ length: 6 }, (_, i) => heroImage(i))

export function Hero() {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDES[index]}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/20 to-transparent" />
      </div>

      <Container className="relative flex min-h-[640px] flex-col justify-center gap-8 py-28 sm:min-h-[720px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-brand-accent" />
            Slovenské štúdio prémiovej 3D tlače
          </span>
          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {dict.home.heroHeadline}
          </h1>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.4 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="glass absolute right-6 top-24 hidden w-56 rounded-2xl border border-white/15 p-3 shadow-xl lg:block xl:right-16"
        >
          <div className="flex items-center gap-2">
            <div className="relative size-11 overflow-hidden rounded-xl bg-white/10">
              <Image src={heroImage(1)} alt="" fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">Dragon Bust</p>
              <RatingStars rating={4.9} size={10} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, 12, 0] }}
          transition={{
            opacity: { duration: 0.8, delay: 0.7 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
          className="glass absolute bottom-16 right-16 hidden w-48 rounded-2xl border border-white/15 p-3 shadow-xl xl:block"
        >
          <div className="flex items-center gap-2">
            <div className="relative size-11 overflow-hidden rounded-xl bg-white/10">
              <Image src={heroImage(4)} alt="" fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">Skull Lamp</p>
              <p className="text-[11px] text-white/60">42 €</p>
            </div>
          </div>
        </motion.div>
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
