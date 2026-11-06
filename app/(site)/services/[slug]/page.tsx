
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";

import Service from "@/models/Service";

import ServiceDetailPage from "@/components/services/detail/ServiceDetailPage";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = "https://www.mobilecarservices.com.au";

const DEFAULT_BUSINESS_NAME = "Mobile Car Services";

const DEFAULT_DESCRIPTION =
  "Mobile automotive assistance from Mobile Car Services across Melbourne West.";

const DEFAULT_OG_IMAGE =
  `${SITE_URL}/images/seo/service-og.jpg`;

/* ============================================================
   GET SERVICE
============================================================ */

async function getServiceBySlug(slug: string) {
  await connectDB();

  const normalizedSlug = slug.trim().toLowerCase();

const service = await Service.findOne({
  slug: normalizedSlug,
  status: "active",
})
    .select(
      [
        "title",
        "slug",
        "shortDescription",
        "description",
        "heroImage",
        "gallery",
        "processSteps",
        "benefits",
        "included",
        "suitableFor",
        "estimatedTime",
        "pricing",
        "emergencyService",
        "onSiteService",
        "ctaText",
        "ctaLink",
        "featured",
        "displayOrder",
        "seoTitle",
        "seoDescription",
        "ogImage",
      ].join(" "),
    )
    .lean();

  return service;
}

/* ============================================================
   GET SEO VALUES
============================================================ */

function getServiceSEO(service: NonNullable<
  Awaited<ReturnType<typeof getServiceBySlug>>
>) {
  const title =
    typeof service.seoTitle === "string" &&
    service.seoTitle.trim()
      ? service.seoTitle.trim()
      : `${service.title} | ${DEFAULT_BUSINESS_NAME}`;

  const description =
    typeof service.seoDescription === "string" &&
    service.seoDescription.trim()
      ? service.seoDescription.trim()
      : typeof service.shortDescription === "string" &&
          service.shortDescription.trim()
        ? service.shortDescription.trim()
        : DEFAULT_DESCRIPTION;

  const canonicalUrl =
    `${SITE_URL}/services/${service.slug}`;

  const ogImage =
    service.ogImage?.secureUrl
      ? service.ogImage
      : service.heroImage?.secureUrl
        ? service.heroImage
        : null;

  const imageUrl =
    ogImage?.secureUrl || DEFAULT_OG_IMAGE;

  const imageAlt =
    ogImage?.alt?.trim() ||
    `${service.title} - ${DEFAULT_BUSINESS_NAME}`;

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    imageAlt,
    ogImage,
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Mobile Car Services",

      description:
        "The requested service could not be found.",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const seo = getServiceSEO(service);

  return {
    title: seo.title,

    description: seo.description,

    alternates: {
      canonical: seo.canonicalUrl,
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url: seo.canonicalUrl,

      siteName: DEFAULT_BUSINESS_NAME,

      title: seo.title,

      description: seo.description,

      images: [
        {
          url: seo.imageUrl,

          ...(seo.ogImage?.width
            ? {
                width: seo.ogImage.width,
              }
            : {}),

          ...(seo.ogImage?.height
            ? {
                height: seo.ogImage.height,
              }
            : {}),

          alt: seo.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: seo.title,

      description: seo.description,

      images: [seo.imageUrl],
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
   SERVICE STRUCTURED DATA
============================================================ */

function getServiceStructuredData(
  service: NonNullable<
    Awaited<ReturnType<typeof getServiceBySlug>>
  >,
) {
  const seo = getServiceSEO(service);

  const graph: Record<string, unknown>[] = [];

  /* ----------------------------------------------------------
     PRIMARY IMAGE
  ---------------------------------------------------------- */

  if (seo.ogImage?.secureUrl) {
    graph.push({
      "@type": "ImageObject",

      "@id": `${seo.canonicalUrl}#primaryimage`,

      url: seo.imageUrl,

      contentUrl: seo.imageUrl,

      ...(seo.ogImage.width
        ? {
            width: seo.ogImage.width,
          }
        : {}),

      ...(seo.ogImage.height
        ? {
            height: seo.ogImage.height,
          }
        : {}),

      caption: seo.imageAlt,
    });
  }

  /* ----------------------------------------------------------
     SERVICE
  ---------------------------------------------------------- */

  graph.push({
    "@type": "Service",

    "@id": `${seo.canonicalUrl}#service`,

    name: service.title,

    description: seo.description,

    serviceType: service.title,

    provider: {
      "@id": `${SITE_URL}/#organization`,
    },

    url: seo.canonicalUrl,

    ...(seo.ogImage?.secureUrl
      ? {
          image: {
            "@id": `${seo.canonicalUrl}#primaryimage`,
          },
        }
      : {}),

    areaServed: {
      "@type": "Place",

      name: "Melbourne West",
    },
  });

  /* ----------------------------------------------------------
     WEB PAGE
  ---------------------------------------------------------- */

  graph.push({
    "@type": "WebPage",

    "@id": `${seo.canonicalUrl}#webpage`,

    url: seo.canonicalUrl,

    name: seo.title,

    description: seo.description,

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },

    about: {
      "@id": `${seo.canonicalUrl}#service`,
    },

    mainEntity: {
      "@id": `${seo.canonicalUrl}#service`,
    },

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    ...(seo.ogImage?.secureUrl
      ? {
          primaryImageOfPage: {
            "@id": `${seo.canonicalUrl}#primaryimage`,
          },
        }
      : {}),

    breadcrumb: {
      "@id": `${seo.canonicalUrl}#breadcrumb`,
    },

    inLanguage: "en-AU",
  });

  /* ----------------------------------------------------------
     BREADCRUMB
  ---------------------------------------------------------- */

  graph.push({
    "@type": "BreadcrumbList",

    "@id": `${seo.canonicalUrl}#breadcrumb`,

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

        name: "Services",

        item: `${SITE_URL}/services`,
      },

      {
        "@type": "ListItem",

        position: 3,

        name: service.title,

        item: seo.canonicalUrl,
      },
    ],
  });

  return {
    "@context": "https://schema.org",

    "@graph": graph,
  };
}

/* ============================================================
   SERVICE PAGE
============================================================ */

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const structuredData =
    getServiceStructuredData(service);

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
        <ServiceDetailPage
          service={service}
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
