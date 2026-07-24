import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/search/search-dialog";
import { JsonLd } from "@/components/json-ld";
import { dict } from "@/lib/i18n";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const fontDisplay = Sora({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: dict.meta.defaultTitle,
    template: `%s — ${SITE_NAME}`,
  },
  description: dict.meta.defaultDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    siteName: SITE_NAME,
    title: dict.meta.defaultTitle,
    description: dict.meta.defaultDescription,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: dict.meta.defaultTitle,
    description: dict.meta.defaultDescription,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  sameAs: [
    "https://instagram.com/agama3dstudio",
    "https://facebook.com/agama3dstudio",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zámocká 65/1",
    addressLocality: "Malacky",
    addressCountry: "SK",
  },
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "sk",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/modely?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sk"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={webSiteJsonLd} />
        <Providers>
          <a
            href="#obsah"
            className="sr-only z-50 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Preskočiť na obsah
          </a>
          <Header />
          <main id="obsah" className="flex-1 pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
          <SearchDialog />
        </Providers>
      </body>
    </html>
  );
}
