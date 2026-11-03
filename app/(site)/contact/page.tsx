
import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

import ContactPage from "@/components/contact/listing/ContactPage";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.mobilecarservices.com.au";

const PAGE_URL = `${SITE_URL}/contact`;

const SEO_TITLE =
  "Contact Mobile Car Services | Melbourne West";

const SEO_DESCRIPTION =
  "Contact Mobile Car Services for mobile car servicing, battery replacement and automotive assistance in Melbourne West. Call, message us on WhatsApp or request a service online.";

const OG_IMAGE = `${SITE_URL}/images/seo/og-image.jpg`;

const DEFAULT_BUSINESS_NAME = "Mobile Car Services";

/* ============================================================
   BUSINESS SETTINGS
============================================================ */

export interface ContactBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

async function getBusinessSettings(): Promise<ContactBusiness> {
  await connectDB();

  const settings = await SiteSettings.findOne()
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
      "Melbourne West",
  };
}

/* ============================================================
   SERVICES
============================================================ */

export interface ContactService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

async function getServices(): Promise<ContactService[]> {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select(
      "title slug shortDescription estimatedTime emergencyService onSiteService featured displayOrder",
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      title: 1,
    })
    .lean();

  return services.map((service) => ({
    id: service._id.toString(),

    title: service.title,

    slug: service.slug,

    shortDescription:
      service.shortDescription || "",

    estimatedTime:
      service.estimatedTime || "",

    emergencyService:
      Boolean(service.emergencyService),

    onSiteService:
      Boolean(service.onSiteService),
  }));
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

    siteName: "Mobile Car Services",

    title: SEO_TITLE,

    description: SEO_DESCRIPTION,

    images: [
      {
        url: OG_IMAGE,

        width: 1200,

        height: 630,

        alt: "Contact Mobile Car Services in Melbourne West",
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
   CONTACT STRUCTURED DATA
============================================================ */

function getContactStructuredData() {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "ContactPage",

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

          url: OG_IMAGE,

          width: 1200,

          height: 630,
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

            name: "Contact",

            item: PAGE_URL,
          },
        ],
      },
    ],
  };
}

/* ============================================================
   CONTACT PAGE
============================================================ */

export default async function ContactRoute() {
  const [business, services] = await Promise.all([
    getBusinessSettings(),

    getServices(),
  ]);

  const structuredData = getContactStructuredData();

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <main>
        <ContactPage
          business={business}
          services={services}
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
