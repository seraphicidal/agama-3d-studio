import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/search/search-dialog";
import { dict } from "@/lib/i18n";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: dict.meta.defaultTitle,
    template: `%s — ${dict.meta.siteName}`,
  },
  description: dict.meta.defaultDescription,
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
      className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Header />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
          <SearchDialog />
        </Providers>
      </body>
    </html>
  );
}
