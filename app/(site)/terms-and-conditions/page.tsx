
import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import SiteSettings from "@/models/SiteSettings";

import TermsAndConditionsPage from "@/components/legal/terms/TermsAndConditionsPage";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.mobilecarservices.com.au";

const PAGE_URL = `${SITE_URL}/terms-and-conditions`;

const SEO_TITLE =
  "Terms & Conditions | Mobile Car Services";

const SEO_DESCRIPTION =
  "Read the terms and conditions governing your use of the Mobile Car Services website, service enquiries, booking requests and mobile automotive services across Melbourne West.";

const OG_IMAGE = `${SITE_URL}/images/seo/og-image.jpg`;

const DEFAULT_BUSINESS_NAME = "Mobile Car Services";

const DEFAULT_REGION = "Melbourne West";

/* ============================================================
   BUSINESS SETTINGS
============================================================ */

export interface TermsBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

async function getBusinessSettings(): Promise<TermsBusiness> {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName tagline description phone primaryCallNumber whatsapp email primaryServiceRegion",
    )
    .lean();

  return {
    businessName:
      settings?.businessName?.trim() ||
      DEFAULT_BUSINESS_NAME,

    tagline:
      settings?.tagline?.trim() ||
      "",

    description:
      settings?.description?.trim() ||
      "",

    phone:
      settings?.phone?.trim() ||
      "",

    primaryCallNumber:
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      "",

    whatsapp:
      settings?.whatsapp?.trim() ||
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      "",

    email:
      settings?.email?.trim() ||
      "",

    primaryServiceRegion:
      settings?.primaryServiceRegion?.trim() ||
      DEFAULT_REGION,
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export const metadata: Metadata = {
  title: {
    absolute: SEO_TITLE,
  },

  description: SEO_DESCRIPTION,

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: "website",

    locale: "en_AU",

    url: PAGE_URL,

    siteName: DEFAULT_BUSINESS_NAME,

    title: SEO_TITLE,

    description: SEO_DESCRIPTION,

    images: [
      {
        url: OG_IMAGE,

        width: 1200,

        height: 630,

        alt: "Terms and Conditions - Mobile Car Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: SEO_TITLE,

    description: SEO_DESCRIPTION,

    images: [OG_IMAGE],
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
};

/* ============================================================
   STRUCTURED DATA
============================================================ */

function getTermsStructuredData() {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebPage",

        "@id": `${PAGE_URL}#webpage`,

        url: PAGE_URL,

        name: SEO_TITLE,

        description: SEO_DESCRIPTION,

        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },

        about: {
          "@id": `${SITE_URL}/#organization`,
        },

        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },

        primaryImageOfPage: {
          "@type": "ImageObject",

          "@id": `${PAGE_URL}#primaryimage`,

          url: OG_IMAGE,

          width: 1200,

          height: 630,

          caption: "Mobile Car Services - Terms and Conditions",
        },

        breadcrumb: {
          "@id": `${PAGE_URL}#breadcrumb`,
        },

        inLanguage: "en-AU",
      },

      {
        "@type": "BreadcrumbList",

        "@id": `${PAGE_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",

            position: 1,

            name: "Home",

            item: SITE_URL,
          },

          {
            "@type": "ListItem",

            position: 2,

            name: "Terms & Conditions",

            item: PAGE_URL,
          },
        ],
      },
    ],
  };
}

/* ============================================================
   TERMS & CONDITIONS ROUTE
============================================================ */

export default async function TermsAndConditionsRoute() {
  const business = await getBusinessSettings();

  const structuredData = getTermsStructuredData();

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
        <TermsAndConditionsPage
          business={business}
        />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStructuredData,
        }}
      />
    </>
  );
}
