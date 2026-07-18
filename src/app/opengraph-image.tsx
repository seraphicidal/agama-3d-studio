import { ImageResponse } from "next/og"
import { dict } from "@/lib/i18n"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = dict.meta.defaultTitle

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          backgroundColor: "#121212",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 28,
              backgroundColor: "#7fb239",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#121212",
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>Agama</div>
            <div style={{ fontSize: 20, letterSpacing: 6, color: "#a3a3a3" }}>
              3D STUDIO
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {dict.home.heroHeadline}
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a3a3a3", maxWidth: 860 }}>
          {dict.home.heroSubheadline}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            backgroundColor: "#7fb239",
            display: "flex",
          }}
        />
      </div>
    ),
    size
  )
}
