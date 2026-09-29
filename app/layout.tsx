import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { getGlobalStructuredData } from "@/lib/seo/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://carbatteryservices.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /*
   * Global fallback metadata.
   *
   * Individual pages will provide their own exact SEO titles
   * and descriptions from the SEO sheet.
   *
   * IMPORTANT:
   * Page-specific titles should use:
   *
   * title: {
   *   absolute: "Exact SEO Title",
   * }
   *
   * so the global template does not append the brand again.
   */
  title: {
    default: "Car Battery Services",
    template: "%s | Car Battery Services",
  },

  description:
    "Mobile car battery services across Melbourne West, including battery replacement, battery testing, jump starts, starter motor replacement and alternator replacement.",

  applicationName: "Car Battery Services",

  generator: "Next.js",

  keywords: [
    "car battery service Melbourne West",
    "mobile car battery service Melbourne",
    "car battery replacement Melbourne West",
    "car battery testing Melbourne West",
    "mobile battery replacement",
    "car jump start Melbourne West",
    "starter motor replacement Melbourne West",
    "alternator replacement Melbourne West",
  ],

  authors: [
    {
      name: "Car Battery Services",
    },
  ],

  creator: "Car Battery Services",

  publisher: "Car Battery Services",

  /*
   * Keep the current site-wide canonical here as the fallback.
   * Individual pages will define their own canonical URLs.
   */
  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icons/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icons/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  /*
   * Global Open Graph fallback.
   *
   * Individual pages will override title/description/url
   * with their page-specific SEO metadata.
   */
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Car Battery Services",

    title: "Car Battery Services",

    description:
      "Mobile car battery services across Melbourne West, including battery replacement, battery testing, jump starts, starter motor replacement and alternator replacement.",

    images: [
      {
        url: "/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Car Battery Services - Mobile Car Battery Service Melbourne West",
      },
    ],
  },

  /*
   * Global Twitter fallback.
   */
  twitter: {
    card: "summary_large_image",

    title: "Car Battery Services",

    description:
      "Mobile car battery services across Melbourne West, including battery replacement, testing, jump starts, starter motor replacement and alternator replacement.",

    images: [
      {
        url: "/images/seo/og-image.jpg",
        alt: "Car Battery Services - Melbourne West",
      },
    ],
  },

  /*
   * Site-wide crawl directives.
   *
   * Individual pages such as Privacy/Terms can override this
   * later if we decide to noindex them.
   */
  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "automotive",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#061A2B",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  const globalStructuredData = getGlobalStructuredData();

  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="diUTaZzt0mlFvO4CwYHMs7g2cbi4aNrPP6NlSOm89b0"
        />

        {/* Bing Webmaster Tools Verification */}
        <meta
          name="msvalidate.01"
          content="6C56034BC8A4093CC1774D376348B66E"
        />

        {/* Cloudinary connection optimization */}
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
        />

        <link
          rel="dns-prefetch"
          href="https://res.cloudinary.com"
        />
      </head>

      <body className="min-h-full bg-[#061A2B] text-[#F8FAFC]">
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData),
          }}
        />
      </body>
    </html>
  );
}