"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users } from "lucide-react"
import type { Creator, Product } from "@/lib/types"

export function CreatorCard({
  creator,
  featured,
}: {
  creator: Creator
  featured: Product[]
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <Link href={`/tvorcovia/${creator.slug}`} className="block">
        <div className="grid grid-cols-3 gap-0.5 bg-border">
          {featured.map((p) => (
            <div key={p.id} className="relative aspect-square overflow-hidden bg-secondary">
              <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-secondary">
            <Image src={creator.avatar} alt={creator.name} fill sizes="48px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold">{creator.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{creator.location}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {creator.followers.toLocaleString("sk-SK")}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
