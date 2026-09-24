import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";

import Service from "@/models/Service";

import ServiceDetailPage from "@/components/services/detail/ServiceDetailPage";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL =
  "https://carbatteryservices.com.au";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Service";

const DEFAULT_DESCRIPTION =
  "Mobile car battery assistance from Car Battery Service.";

const DEFAULT_OG_IMAGE =
  "/images/seo/service-og.jpg";

/* ============================================================
   GET SERVICE
============================================================ */

async function getServiceBySlug(
  slug: string,
) {
  await connectDB();

  const service =
    await Service.findOne({
      slug:
        slug.toLowerCase(),

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
   SEO METADATA
============================================================ */

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const service =
    await getServiceBySlug(
      slug,
    );

  if (!service) {
    return {
      title:
        "Service Not Found | Car Battery Service",

      description:
        "The requested service could not be found.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    typeof service.seoTitle ===
      "string" &&
    service.seoTitle.trim()
      ? service.seoTitle.trim()
      : `${service.title} | ${DEFAULT_BUSINESS_NAME}`;

  const description =
    typeof service.seoDescription ===
      "string" &&
    service.seoDescription.trim()
      ? service.seoDescription.trim()
      : typeof service.shortDescription ===
          "string" &&
        service.shortDescription.trim()
      ? service.shortDescription.trim()
      : DEFAULT_DESCRIPTION;

  const canonicalPath =
    `/services/${service.slug}`;

  const heroImage =
    service.heroImage;

  const ogImage =
    service.ogImage ||
    heroImage;

  return {
    title,

    description,

    alternates: {
      canonical:
        canonicalPath,
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url:
        `${SITE_URL}${canonicalPath}`,

      siteName:
        DEFAULT_BUSINESS_NAME,

      title,

      description,

      images: [
        ogImage?.secureUrl
          ? {
              url:
                ogImage.secureUrl,

              width:
                ogImage.width,

              height:
                ogImage.height,

              alt:
                ogImage.alt?.trim() ||
                service.title,
            }
          : {
              url:
                `${SITE_URL}${DEFAULT_OG_IMAGE}`,

              width: 1200,

              height: 630,

              alt:
                `${service.title} | ${DEFAULT_BUSINESS_NAME}`,
            },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: [
        ogImage?.secureUrl ||
          `${SITE_URL}${DEFAULT_OG_IMAGE}`,
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
   SERVICE STRUCTURED DATA
============================================================ */

function getServiceStructuredData(
  service: NonNullable<
    Awaited<
      ReturnType<
        typeof getServiceBySlug
      >
    >
  >,
) {
  const canonicalUrl =
    `${SITE_URL}/services/${service.slug}`;

  const title =
    typeof service.seoTitle ===
      "string" &&
    service.seoTitle.trim()
      ? service.seoTitle.trim()
      : `${service.title} | ${DEFAULT_BUSINESS_NAME}`;

  const description =
    typeof service.seoDescription ===
      "string" &&
    service.seoDescription.trim()
      ? service.seoDescription.trim()
      : typeof service.shortDescription ===
          "string" &&
        service.shortDescription.trim()
      ? service.shortDescription.trim()
      : DEFAULT_DESCRIPTION;

  const ogImage =
    service.ogImage ||
    service.heroImage;

  const graph: Record<
    string,
    unknown
  >[] = [];

  /* ----------------------------------------------------------
     PRIMARY IMAGE
  ---------------------------------------------------------- */

  if (
    ogImage?.secureUrl
  ) {
    graph.push({
      "@type":
        "ImageObject",

      "@id":
        `${canonicalUrl}#primaryimage`,

      url:
        ogImage.secureUrl,

      contentUrl:
        ogImage.secureUrl,

      width:
        ogImage.width,

      height:
        ogImage.height,

      caption:
        ogImage.alt?.trim() ||
        service.title,
    });
  }

  /* ----------------------------------------------------------
     SERVICE
  ---------------------------------------------------------- */

  graph.push({
    "@type":
      "Service",

    "@id":
      `${canonicalUrl}#service`,

    name:
      service.title,

    description,

    serviceType:
      service.title,

    provider: {
      "@id":
        `${SITE_URL}/#organization`,
    },

    url:
      canonicalUrl,

    ...(ogImage?.secureUrl
      ? {
          image: {
            "@id":
              `${canonicalUrl}#primaryimage`,
          },
        }
      : {}),

    areaServed: {
      "@type":
        "Place",

      name:
        "Melbourne West",
    },
  });

  /* ----------------------------------------------------------
     WEB PAGE
  ---------------------------------------------------------- */

  graph.push({
    "@type":
      "WebPage",

    "@id":
      `${canonicalUrl}#webpage`,

    url:
      canonicalUrl,

    name:
      title,

    description,

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    about: {
      "@id":
        `${canonicalUrl}#service`,
    },

    mainEntity: {
      "@id":
        `${canonicalUrl}#service`,
    },

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },

    ...(ogImage?.secureUrl
      ? {
          primaryImageOfPage: {
            "@id":
              `${canonicalUrl}#primaryimage`,
          },
        }
      : {}),

    breadcrumb: {
      "@id":
        `${canonicalUrl}#breadcrumb`,
    },

    inLanguage:
      "en-AU",
  });

  /* ----------------------------------------------------------
     BREADCRUMB
  ---------------------------------------------------------- */

  graph.push({
    "@type":
      "BreadcrumbList",

    "@id":
      `${canonicalUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          "Home",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position: 2,

        name:
          "Services",

        item:
          `${SITE_URL}/services`,
      },

      {
        "@type":
          "ListItem",

        position: 3,

        name:
          service.title,

        item:
          canonicalUrl,
      },
    ],
  });

  return {
    "@context":
      "https://schema.org",

    "@graph":
      graph,
  };
}

/* ============================================================
   SERVICE PAGE
============================================================ */

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } =
    await params;

  const service =
    await getServiceBySlug(
      slug,
    );

  if (!service) {
    notFound();
  }

  const structuredData =
    getServiceStructuredData(
      service,
    );

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
          __html:
            JSON.stringify(
              structuredData,
            ),
        }}
      />
    </>
  );
}