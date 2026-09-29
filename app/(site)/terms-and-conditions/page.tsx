import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import SiteSettings from "@/models/SiteSettings";

import TermsAndConditionsPage from "@/components/legal/terms/TermsAndConditionsPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/terms-and-conditions`;

const SEO_TITLE =
  "Terms & Conditions | Car Battery Services";

const SEO_DESCRIPTION =
  "Read the Terms & Conditions that apply when using the Car Battery Services website or requesting mobile car battery services in Melbourne West.";

const OG_IMAGE =
  "/images/seo/og-image.jpg";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Services";

const DEFAULT_REGION =
  "Melbourne West";

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

  const settings =
    await SiteSettings.findOne()
      .select(
        "businessName tagline description phone primaryCallNumber whatsapp email primaryServiceRegion",
      )
      .lean();

  return {
    businessName:
      settings?.businessName ||
      DEFAULT_BUSINESS_NAME,

    tagline:
      settings?.tagline ||
      "",

    description:
      settings?.description ||
      "",

    phone:
      settings?.phone ||
      "",

    primaryCallNumber:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    whatsapp:
      settings?.whatsapp ||
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    email:
      settings?.email ||
      "",

    primaryServiceRegion:
      settings?.primaryServiceRegion ||
      DEFAULT_REGION,
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      absolute:
        SEO_TITLE,
    },

    description:
      SEO_DESCRIPTION,

    alternates: {
      canonical:
        PAGE_URL,
    },

    openGraph: {
      type:
        "website",

      locale:
        "en_AU",

      url:
        PAGE_URL,

      siteName:
        "Car Battery Services",

      title:
        SEO_TITLE,

      description:
        SEO_DESCRIPTION,

      images: [
        {
          url:
            OG_IMAGE,

          width:
            1200,

          height:
            630,

          alt:
            "Car Battery Services - Terms & Conditions",
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        SEO_TITLE,

      description:
        SEO_DESCRIPTION,

      images: [
        OG_IMAGE,
      ],
    },

    robots: {
      index:
        true,

      follow:
        true,

      googleBot: {
        index:
          true,

        follow:
          true,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,

        "max-video-preview":
          -1,
      },
    },
  };
}

/* ============================================================
   STRUCTURED DATA
============================================================ */

function getTermsStructuredData() {
  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "WebPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          SEO_TITLE,

        description:
          SEO_DESCRIPTION,

        isPartOf: {
          "@id":
            `${SITE_URL}/#website`,
        },

        about: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        publisher: {
          "@id":
            `${SITE_URL}/#organization`,
        },

        primaryImageOfPage: {
          "@type":
            "ImageObject",

          url:
            `${SITE_URL}${OG_IMAGE}`,

          width:
            1200,

          height:
            630,

          caption:
            "Car Battery Services - Terms & Conditions",
        },

        breadcrumb: {
          "@id":
            `${PAGE_URL}#breadcrumb`,
        },

        inLanguage:
          "en-AU",
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${PAGE_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "Home",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Terms & Conditions",

            item:
              PAGE_URL,
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
  const business =
    await getBusinessSettings();

  const structuredData =
    getTermsStructuredData();

  return (
    <>
      <main>
        <TermsAndConditionsPage
          business={
            business
          }
        />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData,
            ),
        }}
      />
    </>
  );
}