"use client"

import * as React from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, ContactShadows, Float } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { Maximize2, Minimize2, RotateCcw } from "lucide-react"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type ModelVariant = "knot" | "vase" | "gem"

export interface ModelViewerProps {
  variant?: ModelVariant
  color?: string
  className?: string
  /** Show the "sample model" disclaimer badge (on by default). */
  note?: boolean
}

// Procedural stand-ins until real product scans exist. Swapping in a GLB later:
// add `src?: string`, and when set render drei's `useGLTF(src)` scene instead of
// these meshes (self-host any Draco decoder — no runtime CDN fetches).
function useVariantGeometry(variant: ModelVariant) {
  return React.useMemo(() => {
    switch (variant) {
      case "vase": {
        // Lathe profile with a slight ripple — evokes vase-mode print layers.
        const points: THREE.Vector2[] = []
        const STEPS = 120
        for (let i = 0; i <= STEPS; i++) {
          const t = i / STEPS
          const y = t * 2.3
          const base =
            0.42 + 0.5 * Math.sin(t * Math.PI * 0.92) - 0.28 * t * t
          const ripple = 0.012 * Math.sin(t * 90)
          points.push(new THREE.Vector2(Math.max(0.12, base + ripple), y))
        }
        return { geometry: new THREE.LatheGeometry(points, 160), flat: false, yOffset: -1.15 }
      }
      case "gem":
        return { geometry: new THREE.IcosahedronGeometry(1.15, 0), flat: true, yOffset: 0 }
      default:
        return {
          geometry: new THREE.TorusKnotGeometry(0.85, 0.26, 256, 32),
          flat: false,
          yOffset: 0,
        }
    }
  }, [variant])
}

function Scene({
  variant,
  color,
  autoRotate,
  onInteract,
  controlsRef,
}: {
  variant: ModelVariant
  color: string
  autoRotate: boolean
  onInteract: () => void
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}) {
  const { geometry, flat, yOffset } = useVariantGeometry(variant)

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#a5cf4c" />
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh geometry={geometry} position={[0, yOffset, 0]} castShadow>
          <meshStandardMaterial
            color={color}
            roughness={0.38}
            metalness={0.12}
            flatShading={flat}
          />
        </mesh>
      </Float>
      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.4}
        scale={8}
        blur={2.6}
        far={3.2}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={2.4}
        maxDistance={7}
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        onStart={onInteract}
      />
    </>
  )
}

export default function ModelViewer({
  variant = "knot",
  color = "#7fb239",
  className,
  note = true,
}: ModelViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const controlsRef = React.useRef<OrbitControlsImpl | null>(null)
  const [autoRotate, setAutoRotate] = React.useState(true)
  const [fullscreen, setFullscreen] = React.useState(false)

  React.useEffect(() => {
    function onChange() {
      setFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  React.useEffect(() => {
    // The first ResizeObserver measurement can land before this lazy-mounted
    // canvas has final layout, leaving the 300×150 default buffer. A few
    // spaced resize nudges make R3F re-measure; harmless where not needed
    // (an immediate next-frame nudge proved too early in testing).
    const timers = [100, 400, 1200].map((ms) =>
      window.setTimeout(() => window.dispatchEvent(new Event("resize")), ms)
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen?.()
    }
  }

  function resetView() {
    controlsRef.current?.reset()
    setAutoRotate(true)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative size-full overflow-hidden bg-secondary",
        fullscreen && "bg-brand-dark",
        className
      )}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.6, 1.6, 3.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          variant={variant}
          color={color}
          autoRotate={autoRotate}
          onInteract={() => setAutoRotate(false)}
          controlsRef={controlsRef}
        />
      </Canvas>

      {note && (
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
          {dict.viewer.placeholderNote}
        </span>
      )}

      <span className="pointer-events-none absolute bottom-3 left-3 hidden text-[11px] text-muted-foreground sm:block">
        {dict.viewer.hint}
      </span>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <button
          onClick={resetView}
          aria-label={dict.viewer.reset}
          className="flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-transform hover:scale-110"
        >
          <RotateCcw className="size-3.5" />
        </button>
        <button
          onClick={toggleFullscreen}
          aria-label={fullscreen ? dict.viewer.exitFullscreen : dict.viewer.fullscreen}
          className="flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-transform hover:scale-110"
        >
          {fullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
        </button>
      </div>
    </div>
  )
}
