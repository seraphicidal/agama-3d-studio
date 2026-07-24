// Renders a schema.org JSON-LD block. Server-component friendly.
//
// A bare <script type="application/ld+json"> is the Next.js-recommended pattern
// and is intentionally NOT the source of React 19's "Encountered a script tag"
// dev warning: React's isScriptDataBlock() exempts non-executable script types
// (ld+json included), so this renders quietly. (That warning in dev comes from
// Next's own injected refresh/HMR scripts and is absent from production builds.)
//
// JSON.stringify is XSS-hardened per the Next.js JSON-LD guide by escaping "<"
// to its unicode form, so a malicious "</script>" in the data can't break out.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
