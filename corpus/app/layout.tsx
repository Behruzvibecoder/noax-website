import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Preloader } from "@/components/layout/Preloader";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CORPUS — learn anatomy, structure by structure",
    template: "%s · CORPUS",
  },
  description:
    "A structured anatomy curriculum with an interactive atlas and an AI tutor that retrieves from your textbook before it answers.",
  openGraph: {
    title: "CORPUS — learn anatomy, structure by structure",
    description:
      "Structured lessons, an interactive atlas and a tutor that cites its sources.",
    url: siteUrl,
    siteName: "CORPUS",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1d2440",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * Root layout.
 *
 * Fonts are loaded with a stylesheet link rather than next/font/google so the
 * build does not require network access to fonts.googleapis.com — the
 * --font-display / --font-sans stacks in styles/tokens.css degrade to system
 * grotesques when offline.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Blocking is acceptable here: if the network is unavailable the
            request fails fast and the stacks in styles/tokens.css take over. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Familjen+Grotesk:wght@400..700&display=swap"
        />
      </head>
      <body className="bg-[var(--cx-canvas)] text-[var(--cx-foreground)] antialiased">
        <Preloader />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
