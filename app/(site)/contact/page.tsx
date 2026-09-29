import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

import ContactPage from "@/components/contact/listing/ContactPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/contact`;

const SEO_TITLE =
  "Contact Car Battery Services | Call 0467 037 886";

const SEO_DESCRIPTION =
  "Contact Car Battery Services for mobile car battery assistance in Melbourne West. Call, message on WhatsApp or book a battery service online.";

const OG_IMAGE =
  "/images/seo/og-image.jpg";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Services";

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

  const services =
    await Service.find({
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

  return services.map(
    (service) => ({
      id:
        service._id.toString(),

      title:
        service.title,

      slug:
        service.slug,

      shortDescription:
        service.shortDescription ||
        "",

      estimatedTime:
        service.estimatedTime ||
        "",

      emergencyService:
        Boolean(
          service.emergencyService,
        ),

      onSiteService:
        Boolean(
          service.onSiteService,
        ),
    }),
  );
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata(): Promise<Metadata> {
  return {
    /*
     * Use absolute so the global layout template does not
     * append "| Car Battery Services" again.
     */
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
      type: "website",

      locale: "en_AU",

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

          width: 1200,

          height: 630,

          alt:
            "Contact Car Battery Services - Mobile Car Battery Service Melbourne West",
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
      index: true,

      follow: true,

      googleBot: {
        index: true,

        follow: true,

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
   CONTACT STRUCTURED DATA
============================================================ */

function getContactStructuredData(
  business: ContactBusiness,
) {
  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "ContactPage",

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
              "Contact",

            item:
              PAGE_URL,
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
  const [
    business,
    services,
  ] = await Promise.all([
    getBusinessSettings(),
    getServices(),
  ]);

  const structuredData =
    getContactStructuredData(
      business,
    );

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
          __html:
            JSON.stringify(
              structuredData,
            ),
        }}
      />
    </>
  );
}