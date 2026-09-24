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

  title: {
    default: "Car Battery Service | Melbourne West",
    template: "%s | Car Battery Service",
  },

  description:
    "Mobile car battery service in Melbourne West including battery replacement, battery testing, jump start assistance, starter motor replacement and alternator replacement at your vehicle's location.",

  applicationName: "Car Battery Service",

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
      name: "Car Battery Service",
    },
  ],

  creator: "Car Battery Service",

  publisher: "Car Battery Service",

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

  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Car Battery Service",

    title: "Car Battery Service | Melbourne West",

    description:
      "Mobile car battery and vehicle starting assistance across Melbourne West. Battery replacement, testing, jump starts, starter motor replacement and alternator replacement.",

    images: [
      {
        url: "/images/seo/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Car Battery Service - Mobile Car Battery Service in Melbourne West",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Car Battery Service | Melbourne West",

    description:
      "Mobile car battery and vehicle starting assistance across Melbourne West.",

    images: [
      {
        url: "/images/seo/og-image.jpg",
        alt: "Car Battery Service - Melbourne West",
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