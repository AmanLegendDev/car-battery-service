import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

import PrivacyPolicyPage from "@/components/legal/privacy/PrivacyPolicyPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/privacy-policy`;

const SEO_TITLE =
  "Privacy Policy | Car Battery Services";

const SEO_DESCRIPTION =
  "Read the Privacy Policy for Car Battery Services, including how information is collected, used and handled when using our website or requesting mobile car battery services.";

const OG_IMAGE =
  "/images/seo/og-image.jpg";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Services";

const DEFAULT_REGION =
  "Melbourne West";

/* ============================================================
   BUSINESS TYPE
============================================================ */

interface PrivacyBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

/* ============================================================
   GET BUSINESS SETTINGS
============================================================ */

async function getBusinessSettings(): Promise<PrivacyBusiness> {
  await connectDB();

  const business =
    await SiteSettings.findOne()
      .select(
        "businessName tagline description phone primaryCallNumber whatsapp email primaryServiceRegion",
      )
      .lean();

  const businessName =
    typeof business?.businessName ===
      "string" &&
    business.businessName.trim()
      ? business.businessName.trim()
      : DEFAULT_BUSINESS_NAME;

  return {
    businessName,

    tagline:
      typeof business?.tagline ===
        "string"
        ? business.tagline
        : "",

    description:
      typeof business?.description ===
        "string"
        ? business.description
        : "",

    phone:
      typeof business?.phone ===
        "string"
        ? business.phone
        : "",

    primaryCallNumber:
      typeof business?.primaryCallNumber ===
        "string" &&
      business.primaryCallNumber.trim()
        ? business.primaryCallNumber
        : typeof business?.phone ===
            "string"
          ? business.phone
          : "",

    whatsapp:
      typeof business?.whatsapp ===
        "string" &&
      business.whatsapp.trim()
        ? business.whatsapp
        : typeof business?.primaryCallNumber ===
              "string" &&
            business.primaryCallNumber.trim()
          ? business.primaryCallNumber
          : typeof business?.phone ===
              "string"
            ? business.phone
            : "",

    email:
      typeof business?.email ===
        "string"
        ? business.email
        : "",

    primaryServiceRegion:
      typeof business?.primaryServiceRegion ===
        "string" &&
      business.primaryServiceRegion.trim()
        ? business.primaryServiceRegion
        : DEFAULT_REGION,
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
            "Car Battery Services - Privacy Policy",
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

function getPrivacyStructuredData() {
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

        breadcrumb: {
          "@id":
            `${PAGE_URL}#breadcrumb`,
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
            "Car Battery Services - Privacy Policy",
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
              "Privacy Policy",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };
}

/* ============================================================
   PRIVACY POLICY ROUTE
============================================================ */

export default async function PrivacyPolicyRoute() {
  const business =
    await getBusinessSettings();

  const structuredData =
    getPrivacyStructuredData();

  return (
    <>
      <main>
        <PrivacyPolicyPage
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