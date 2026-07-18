"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { Category } from "@/lib/types"

export function CategoryCard({
  category,
  size = "default",
}: {
  category: Category
  size?: "default" | "large"
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
      <Link
        href={`/modely?kategoria=${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl bg-secondary"
      >
        <div className={size === "large" ? "aspect-[3/4]" : "aspect-square"}>
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-base font-semibold text-white sm:text-lg">{category.name}</h3>
          <p className="text-xs text-white/70">{category.productCount} modelov</p>
        </div>
      </Link>
    </motion.div>
  )
}
