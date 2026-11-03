
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";

import ServiceArea from "@/models/ServiceArea";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

import ServiceAreaDetailPage from "@/components/service-areas/detail/ServiceAreaDetailPage";

interface ServiceAreaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = "https://www.mobilecarservices.com.au";

const DEFAULT_BUSINESS_NAME = "Mobile Car Services";

/* ============================================================
   GET SERVICE AREA
============================================================ */

async function getServiceArea(slug: string) {
  await connectDB();

  const serviceArea = await ServiceArea.findOne({
    slug: slug.toLowerCase(),
    status: "active",
  })
    .select(
      [
        "name",
        "slug",
        "shortDescription",
        "description",
        "suburbs",
        "postcodes",
        "heroImage",
        "mapUrl",
        "serviceAvailability",
        "featured",
        "displayOrder",
        "seoTitle",
        "seoDescription",
      ].join(" "),
    )
    .lean();

  if (!serviceArea) {
    return null;
  }

  return {
    id: String(serviceArea._id),

    name: serviceArea.name,

    slug: serviceArea.slug,

    shortDescription:
      serviceArea.shortDescription || "",

    description:
      serviceArea.description || "",

    suburbs: Array.isArray(serviceArea.suburbs)
      ? serviceArea.suburbs
      : [],

    postcodes: Array.isArray(serviceArea.postcodes)
      ? serviceArea.postcodes
      : [],

    heroImage: serviceArea.heroImage
      ? {
          publicId: serviceArea.heroImage.publicId,

          secureUrl: serviceArea.heroImage.secureUrl,

          width: serviceArea.heroImage.width,

          height: serviceArea.heroImage.height,

          format: serviceArea.heroImage.format,

          bytes: serviceArea.heroImage.bytes,

          resourceType: serviceArea.heroImage.resourceType,

          alt: serviceArea.heroImage.alt,
        }
      : null,

    mapUrl: serviceArea.mapUrl || "",

    serviceAvailability:
      serviceArea.serviceAvailability || "",

    featured: Boolean(serviceArea.featured),

    displayOrder: serviceArea.displayOrder ?? 0,

    seoTitle: serviceArea.seoTitle || "",

    seoDescription: serviceArea.seoDescription || "",
  };
}

/* ============================================================
   GET RELATED SERVICES
============================================================ */

async function getRelatedServices() {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select(
      [
        "title",
        "slug",
        "shortDescription",
        "heroImage",
        "estimatedTime",
        "emergencyService",
        "onSiteService",
        "ctaText",
        "featured",
        "displayOrder",
      ].join(" "),
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      title: 1,
    })
    .limit(6)
    .lean();

  return services.map((service) => ({
    id: String(service._id),

    title: service.title,

    slug: service.slug,

    shortDescription:
      service.shortDescription || "",

    heroImage: service.heroImage
      ? {
          publicId: service.heroImage.publicId,

          secureUrl: service.heroImage.secureUrl,

          width: service.heroImage.width,

          height: service.heroImage.height,

          format: service.heroImage.format,

          bytes: service.heroImage.bytes,

          resourceType: service.heroImage.resourceType,

          alt: service.heroImage.alt,
        }
      : null,

    estimatedTime: service.estimatedTime || "",

    emergencyService: Boolean(service.emergencyService),

    onSiteService: Boolean(service.onSiteService),

    ctaText: service.ctaText || "",

    featured: Boolean(service.featured),

    displayOrder: service.displayOrder ?? 0,
  }));
}

/* ============================================================
   GET RELATED SERVICE AREAS
============================================================ */

async function getRelatedServiceAreas(currentSlug: string) {
  await connectDB();

  const areas = await ServiceArea.find({
    status: "active",

    slug: {
      $ne: currentSlug.toLowerCase(),
    },
  })
    .select(
      [
        "name",
        "slug",
        "shortDescription",
        "heroImage",
        "suburbs",
        "postcodes",
        "featured",
        "displayOrder",
      ].join(" "),
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      name: 1,
    })
    .limit(4)
    .lean();

  return areas.map((area) => ({
    id: String(area._id),

    name: area.name,

    slug: area.slug,

    shortDescription:
      area.shortDescription || "",

    heroImage: area.heroImage
      ? {
          publicId: area.heroImage.publicId,

          secureUrl: area.heroImage.secureUrl,

          width: area.heroImage.width,

          height: area.heroImage.height,

          format: area.heroImage.format,

          bytes: area.heroImage.bytes,

          resourceType: area.heroImage.resourceType,

          alt: area.heroImage.alt,
        }
      : null,

    suburbs: Array.isArray(area.suburbs)
      ? area.suburbs
      : [],

    postcodes: Array.isArray(area.postcodes)
      ? area.postcodes
      : [],

    featured: Boolean(area.featured),

    displayOrder: area.displayOrder ?? 0,
  }));
}

/* ============================================================
   GET SITE SETTINGS
============================================================ */

async function getSiteSettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName phone primaryCallNumber whatsapp primaryServiceRegion",
    )
    .lean();

  return {
    businessName:
      settings?.businessName?.trim() ||
      DEFAULT_BUSINESS_NAME,

    phone:
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      "",

    whatsapp:
      settings?.whatsapp?.trim() ||
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      "",

    primaryServiceRegion:
      settings?.primaryServiceRegion?.trim() ||
      "",
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata({
  params,
}: ServiceAreaPageProps): Promise<Metadata> {
  const { slug } = await params;

  const serviceArea = await getServiceArea(slug);

  if (!serviceArea) {
    return {
      title: "Service Area Not Found | Mobile Car Services",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    serviceArea.seoTitle?.trim() ||
    `${serviceArea.name} | Mobile Car Services`;

  const description =
    serviceArea.seoDescription?.trim() ||
    serviceArea.shortDescription?.trim() ||
    `Find mobile car battery assistance and automotive services in ${serviceArea.name}. Check service availability with Mobile Car Services.`;

  const canonicalUrl =
    `${SITE_URL}/service-areas/${serviceArea.slug}`;

  const image = serviceArea.heroImage?.secureUrl;

  return {
    title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url: canonicalUrl,

      siteName: DEFAULT_BUSINESS_NAME,

      title,

      description,

      ...(image
        ? {
            images: [
              {
                url: image,

                ...(serviceArea.heroImage?.width
                  ? {
                      width: serviceArea.heroImage.width,
                    }
                  : {}),

                ...(serviceArea.heroImage?.height
                  ? {
                      height: serviceArea.heroImage.height,
                    }
                  : {}),

                alt:
                  serviceArea.heroImage?.alt?.trim() ||
                  `${serviceArea.name} mobile car services`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      ...(image
        ? {
            images: [image],
          }
        : {}),
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
   SERVICE AREA STRUCTURED DATA
============================================================ */

function getServiceAreaStructuredData(
  serviceArea: Awaited<
    ReturnType<typeof getServiceArea>
  >,
  businessName: string,
) {
  if (!serviceArea) {
    return null;
  }

  const pageUrl =
    `${SITE_URL}/service-areas/${serviceArea.slug}`;

  const graph = [
    {
      "@type": "WebPage",

      "@id": `${pageUrl}#webpage`,

      url: pageUrl,

      name:
        serviceArea.seoTitle ||
        `${serviceArea.name} | Mobile Car Services`,

      description:
        serviceArea.seoDescription ||
        serviceArea.shortDescription ||
        `Mobile car services in ${serviceArea.name}.`,

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      about: {
        "@id": `${SITE_URL}/#organization`,
      },

      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },

      mainEntity: {
        "@id": `${pageUrl}#service`,
      },

      inLanguage: "en-AU",
    },

    {
      "@type": "Service",

      "@id": `${pageUrl}#service`,

      name: `Mobile Car Services in ${serviceArea.name}`,

      serviceType:
        "Mobile car battery assistance and automotive services",

      description:
        serviceArea.seoDescription ||
        serviceArea.shortDescription ||
        `Mobile car service availability in ${serviceArea.name}.`,

      provider: {
        "@id": `${SITE_URL}/#organization`,
      },

      areaServed: {
        "@type": "Place",

        name: serviceArea.name,
      },

      url: pageUrl,

      ...(serviceArea.heroImage?.secureUrl
        ? {
            image: serviceArea.heroImage.secureUrl,
          }
        : {}),
    },

    {
      "@type": "BreadcrumbList",

      "@id": `${pageUrl}#breadcrumb`,

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

          name: "Service Areas",

          item: `${SITE_URL}/service-areas`,
        },

        {
          "@type": "ListItem",

          position: 3,

          name: serviceArea.name,

          item: pageUrl,
        },
      ],
    },
  ];

  return {
    "@context": "https://schema.org",

    "@graph": graph,
  };
}

/* ============================================================
   SERVICE AREA DETAIL PAGE
============================================================ */

export default async function ServiceAreaPage({
  params,
}: ServiceAreaPageProps) {
  const { slug } = await params;

  const serviceArea = await getServiceArea(slug);

  if (!serviceArea) {
    notFound();
  }

  const [
    services,
    relatedAreas,
    siteSettings,
  ] = await Promise.all([
    getRelatedServices(),

    getRelatedServiceAreas(serviceArea.slug),

    getSiteSettings(),
  ]);

  const structuredData =
    getServiceAreaStructuredData(
      serviceArea,
      siteSettings.businessName,
    );

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
        <ServiceAreaDetailPage
          serviceArea={serviceArea}
          services={services}
          relatedAreas={relatedAreas}
          businessName={siteSettings.businessName}
          phone={siteSettings.phone}
          whatsapp={siteSettings.whatsapp}
          primaryServiceRegion={
            siteSettings.primaryServiceRegion
          }
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
