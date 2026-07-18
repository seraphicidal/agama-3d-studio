"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { ModelViewerProps } from "./model-viewer"

function ViewerSkeleton() {
  return (
    <div className="flex size-full items-center justify-center bg-secondary">
      <Loader2 className="size-6 animate-spin text-brand-primary" />
    </div>
  )
}

// three.js stays out of the main bundle — loaded only when a viewer mounts.
export const ModelViewerLazy = dynamic<ModelViewerProps>(
  () => import("./model-viewer"),
  { ssr: false, loading: ViewerSkeleton }
)
