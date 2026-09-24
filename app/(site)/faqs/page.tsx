import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import FAQ from "@/models/FAQ";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import SiteSettings from "@/models/SiteSettings";

import FAQsListingPage from "@/components/faqs/listing/FAQsListingPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/faqs`;

const DEFAULT_BUSINESS_NAME =
  "Car Battery Service";

const DEFAULT_DESCRIPTION =
  "Frequently asked questions about mobile car battery service in Melbourne West, including battery replacement, battery testing and jump start assistance.";

const OG_IMAGE =
  "/images/seo/og-image.jpg";

/* ============================================================
   PUBLIC FAQ
============================================================ */

export interface PublicFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedServices: string[];
  relatedServiceAreas: string[];
  featured: boolean;
  displayOrder: number;
}

/* ============================================================
   BUSINESS SETTINGS
============================================================ */

export interface FAQsBusiness {
  businessName: string;
  primaryServiceRegion: string;
  phone: string;
  whatsapp: string;
}

/* ============================================================
   RELATED SERVICE
============================================================ */

export interface RelatedFAQService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: {
    secureUrl: string;
    alt: string;
  } | null;
}

/* ============================================================
   RELATED SERVICE AREA
============================================================ */

export interface RelatedFAQServiceArea {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  heroImage: {
    secureUrl: string;
    alt: string;
  } | null;
}

/* ============================================================
   GET ACTIVE FAQs
============================================================ */

async function getFAQs(): Promise<PublicFAQ[]> {
  await connectDB();

  const faqs = await FAQ.find({
    status: "active",
  })
    .select(
      "question answer category relatedServices relatedServiceAreas featured displayOrder",
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    })
    .lean();

  return faqs.map((faq) => ({
    id:
      faq._id.toString(),

    question:
      faq.question,

    answer:
      faq.answer,

    category:
      faq.category,

    relatedServices:
      Array.isArray(
        faq.relatedServices,
      )
        ? faq.relatedServices.map(
            (id) => id.toString(),
          )
        : [],

    relatedServiceAreas:
      Array.isArray(
        faq.relatedServiceAreas,
      )
        ? faq.relatedServiceAreas.map(
            (id) => id.toString(),
          )
        : [],

    featured:
      Boolean(
        faq.featured,
      ),

    displayOrder:
      typeof faq.displayOrder ===
      "number"
        ? faq.displayOrder
        : 0,
  }));
}

/* ============================================================
   GET BUSINESS SETTINGS
============================================================ */

async function getBusinessSettings(): Promise<FAQsBusiness> {
  await connectDB();

  const settings =
    await SiteSettings.findOne()
      .select(
        "businessName primaryServiceRegion phone primaryCallNumber whatsapp",
      )
      .lean();

  const phone =
    settings?.primaryCallNumber ||
    settings?.phone ||
    "";

  const whatsapp =
    settings?.whatsapp ||
    settings?.primaryCallNumber ||
    settings?.phone ||
    "";

  return {
    businessName:
      settings?.businessName ||
      DEFAULT_BUSINESS_NAME,

    primaryServiceRegion:
      settings?.primaryServiceRegion ||
      "Melbourne West",

    phone,

    whatsapp,
  };
}

/* ============================================================
   GET RELATED SERVICES + SERVICE AREAS
============================================================ */

async function getRelatedContent(
  faqs: PublicFAQ[],
): Promise<{
  services: RelatedFAQService[];
  serviceAreas: RelatedFAQServiceArea[];
}> {
  await connectDB();

  const serviceIds =
    Array.from(
      new Set(
        faqs.flatMap(
          (faq) =>
            faq.relatedServices,
        ),
      ),
    );

  const serviceAreaIds =
    Array.from(
      new Set(
        faqs.flatMap(
          (faq) =>
            faq.relatedServiceAreas,
        ),
      ),
    );

  const [
    services,
    serviceAreas,
  ] = await Promise.all([
    serviceIds.length > 0
      ? Service.find({
          _id: {
            $in: serviceIds,
          },

          status: "active",
        })
          .select(
            "title slug shortDescription heroImage",
          )
          .lean()
      : [],

    serviceAreaIds.length > 0
      ? ServiceArea.find({
          _id: {
            $in: serviceAreaIds,
          },

          status: "active",
        })
          .select(
            "name slug shortDescription heroImage",
          )
          .lean()
      : [],
  ]);

  return {
    services:
      services.map(
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

          heroImage:
            service.heroImage
              ? {
                  secureUrl:
                    service.heroImage
                      .secureUrl,

                  alt:
                    service.heroImage
                      .alt ||
                    service.title,
                }
              : null,
        }),
      ),

    serviceAreas:
      serviceAreas.map(
        (area) => ({
          id:
            area._id.toString(),

          name:
            area.name,

          slug:
            area.slug,

          shortDescription:
            area.shortDescription ||
            "",

          heroImage:
            area.heroImage
              ? {
                  secureUrl:
                    area.heroImage
                      .secureUrl,

                  alt:
                    area.heroImage
                      .alt ||
                    area.name,
                }
              : null,
        }),
      ),
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata(): Promise<Metadata> {
  const business =
    await getBusinessSettings();

  const title =
    `FAQs | ${business.businessName}`;

  const description =
    business.primaryServiceRegion
      ? `Frequently asked questions about mobile car battery service in ${business.primaryServiceRegion}, including battery replacement, battery testing and jump start assistance.`
      : DEFAULT_DESCRIPTION;

  return {
    title,

    description,

    alternates: {
      canonical: "/faqs",
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
            `${business.businessName} - Frequently Asked Questions`,
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
   FAQ STRUCTURED DATA
============================================================ */

function getFAQStructuredData(
  faqs: PublicFAQ[],
  business: FAQsBusiness,
) {
  const validFAQs =
    faqs.filter(
      (faq) =>
        faq.question.trim().length >
          0 &&
        faq.answer.trim().length >
          0,
    );

  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "FAQPage",

        "@id":
          `${PAGE_URL}#faqpage`,

        url:
          PAGE_URL,

        name:
          `FAQs | ${business.businessName}`,

        description:
          business.primaryServiceRegion
            ? `Frequently asked questions about mobile car battery service in ${business.primaryServiceRegion}.`
            : DEFAULT_DESCRIPTION,

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

        mainEntity:
          validFAQs.map(
            (faq) => ({
              "@type":
                "Question",

              "@id":
                `${PAGE_URL}#faq-${faq.id}`,

              name:
                faq.question,

              acceptedAnswer: {
                "@type":
                  "Answer",

                text:
                  faq.answer,
              },
            }),
          ),

        inLanguage:
          "en-AU",
      },

      {
        "@type":
          "WebPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          `FAQs | ${business.businessName}`,

        description:
          business.primaryServiceRegion
            ? `Frequently asked questions about mobile car battery service in ${business.primaryServiceRegion}.`
            : DEFAULT_DESCRIPTION,

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

          width: 1200,

          height: 630,
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

            position: 1,

            name: "Home",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position: 2,

            name: "FAQs",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };
}

/* ============================================================
   FAQ PAGE
============================================================ */

export default async function FAQsPage() {
  const [
    faqs,
    business,
  ] = await Promise.all([
    getFAQs(),

    getBusinessSettings(),
  ]);

  const relatedContent =
    await getRelatedContent(
      faqs,
    );

  const structuredData =
    getFAQStructuredData(
      faqs,
      business,
    );

  return (
    <>
      <main>
        <FAQsListingPage
          faqs={faqs}
          business={business}
          relatedServices={
            relatedContent.services
          }
          relatedServiceAreas={
            relatedContent.serviceAreas
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