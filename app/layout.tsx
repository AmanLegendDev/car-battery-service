
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

const SITE_URL = "https://www.mobilecarservices.com.au";

const SITE_NAME = "Mobile Car Services";

const SITE_DESCRIPTION =
  "Mobile Car Services across Melbourne West, including battery replacement, battery testing, jump starts, starter motor replacement and alternator replacement.";

const OG_IMAGE = `${SITE_URL}/images/seo/og-image.jpg`;

/* ============================================================
   GLOBAL METADATA
============================================================ */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  keywords: [
    "car service Melbourne West",
    "mobile car service Melbourne",
    "car battery replacement Melbourne West",
    "car battery testing Melbourne West",
    "mobile battery replacement",
    "car jump start Melbourne West",
    "starter motor replacement Melbourne West",
    "alternator replacement Melbourne West",
  ],

  authors: [
    {
      name: SITE_NAME,
    },
  ],

  creator: SITE_NAME,

  publisher: SITE_NAME,

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "jV4EXGEJcQzKFC1hkGN9yy7tEL-oc5jYXlegXGp1KL4",

    other: {
      "msvalidate.01": "6C56034BC8A4093CC1774D376348B66E",
    },
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

  openGraph: {
    type: "website",

    locale: "en_AU",

    url: SITE_URL,

    siteName: SITE_NAME,

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    images: [
      {
        url: OG_IMAGE,

        width: 1200,

        height: 630,

        alt: "Mobile Car Services - Automotive Assistance in Melbourne West",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: SITE_NAME,

    description: SITE_DESCRIPTION,

    images: [
      {
        url: OG_IMAGE,

        alt: "Mobile Car Services - Melbourne West",
      },
    ],
  },

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

/* ============================================================
   VIEWPORT
============================================================ */

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  colorScheme: "dark",

  themeColor: "#061A2B",
};

/* ============================================================
   ROOT LAYOUT
============================================================ */

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  const globalStructuredData = getGlobalStructuredData();

  const safeStructuredData = JSON.stringify(
    globalStructuredData,
  ).replace(/</g, "\\u003c");

  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Cloudinary Connection Optimization */}

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

        {/* GLOBAL STRUCTURED DATA */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeStructuredData,
          }}
        />
      </body>
    </html>
  );
}
