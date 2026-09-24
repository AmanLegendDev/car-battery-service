import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

import PrivacyPolicyPage from "@/components/legal/privacy/PrivacyPolicyPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/privacy-policy`;

const OG_IMAGE =
  "/images/seo/og-image.jpg";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Service";

const DEFAULT_DESCRIPTION =
  "Privacy Policy for Car Battery Service.";

/* ============================================================
   GET BUSINESS SETTINGS
============================================================ */

async function getBusinessSettings() {
  await connectDB();

  const business =
    await SiteSettings.findOne()
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
        "string"
        ? business.primaryCallNumber
        : "",

    whatsapp:
      typeof business?.whatsapp ===
        "string"
        ? business.whatsapp
        : "",

    email:
      typeof business?.email ===
        "string"
        ? business.email
        : "",

    primaryServiceRegion:
      typeof business?.primaryServiceRegion ===
        "string"
        ? business.primaryServiceRegion
        : "",
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata(): Promise<Metadata> {
  const business =
    await getBusinessSettings();

  const title =
    `Privacy Policy | ${business.businessName}`;

  const description =
    `Privacy Policy for ${business.businessName}.`;

  return {
    title,

    description,

    alternates: {
      canonical: "/privacy-policy",
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url: PAGE_URL,

      siteName:
        business.businessName,

      title,

      description,

      images: [
        {
          url: OG_IMAGE,

          width: 1200,

          height: 630,

          alt:
            `${business.businessName} - Privacy Policy`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [
        OG_IMAGE,
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
  };
}

/* ============================================================
   STRUCTURED DATA
============================================================ */

function getPrivacyStructuredData(
  businessName: string,
) {
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
          `Privacy Policy | ${businessName}`,

        description:
          `Privacy Policy for ${businessName}.`,

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

          width: 1200,

          height: 630,
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

            position: 1,

            name: "Home",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position: 2,

            name: "Privacy Policy",

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
    getPrivacyStructuredData(
      business.businessName,
    );

  return (
    <>
      <main>
        <PrivacyPolicyPage
          business={business}
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