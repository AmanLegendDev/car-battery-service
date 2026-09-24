import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

import ServicesListingPage from "@/components/services/listing/ServicesListingPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/services`;

const OG_IMAGE =
  "/images/seo/service-og.jpg";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Service";

const DEFAULT_REGION =
  "Melbourne West";

const DEFAULT_DESCRIPTION =
  "Explore mobile car battery services from Car Battery Service, including battery replacement, battery testing and jump start assistance.";

/* ============================================================
   GET BUSINESS SETTINGS
============================================================ */

async function getBusinessSettings() {
  await connectDB();

  const settings =
    await SiteSettings.findOne()
      .select(
        "businessName primaryServiceRegion",
      )
      .lean();

  return {
    businessName:
      typeof settings?.businessName ===
        "string" &&
      settings.businessName.trim()
        ? settings.businessName.trim()
        : DEFAULT_BUSINESS_NAME,

    primaryServiceRegion:
      typeof settings?.primaryServiceRegion ===
        "string" &&
      settings.primaryServiceRegion.trim()
        ? settings.primaryServiceRegion.trim()
        : DEFAULT_REGION,
  };
}

/* ============================================================
   GET ACTIVE SERVICES
============================================================ */

async function getServices() {
  await connectDB();

  const services =
    await Service.find({
      status: "active",
    })
      .select(
        [
          "title",
          "slug",
          "shortDescription",
          "description",
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
      .lean();

  return services.map(
    (service) => ({
      id:
        String(
          service._id,
        ),

      title:
        service.title,

      slug:
        service.slug,

      shortDescription:
        service.shortDescription ||
        "",

      description:
        service.description ||
        "",

      heroImage:
        service.heroImage
          ? {
              publicId:
                service.heroImage
                  .publicId,

              secureUrl:
                service.heroImage
                  .secureUrl,

              width:
                service.heroImage
                  .width,

              height:
                service.heroImage
                  .height,

              format:
                service.heroImage
                  .format,

              bytes:
                service.heroImage
                  .bytes,

              resourceType:
                service.heroImage
                  .resourceType,

              alt:
                service.heroImage
                  .alt,
            }
          : null,

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

      ctaText:
        service.ctaText ||
        "",

      featured:
        Boolean(
          service.featured,
        ),

      displayOrder:
        service.displayOrder ??
        0,
    }),
  );
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata(): Promise<Metadata> {
  const business =
    await getBusinessSettings();

  const title =
    `Services | ${business.businessName}`;

  const description =
    business.primaryServiceRegion
      ? `Explore mobile car battery services from ${business.businessName} in ${business.primaryServiceRegion}, including battery replacement, battery testing, jump start assistance, starter motor replacement and alternator replacement.`
      : DEFAULT_DESCRIPTION;

  return {
    title,

    description,

    alternates: {
      canonical:
        "/services",
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url:
        PAGE_URL,

      siteName:
        business.businessName,

      title,

      description,

      images: [
        {
          url:
            OG_IMAGE,

          width: 1200,

          height: 630,

          alt:
            `${business.businessName} - Mobile Car Battery Services`,
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
   SERVICES STRUCTURED DATA
============================================================ */

function getServicesStructuredData(
  services: Awaited<
    ReturnType<typeof getServices>
  >,
  businessName: string,
  region: string,
) {
  const serviceItems =
    services.map(
      (service, index) => ({
        "@type":
          "ListItem",

        position:
          index + 1,

        name:
          service.title,

        url:
          `${SITE_URL}/services/${service.slug}`,
      }),
    );

  const graph = [
    /* --------------------------------------------------------
       COLLECTION PAGE
    -------------------------------------------------------- */

    {
      "@type":
        "CollectionPage",

      "@id":
        `${PAGE_URL}#collection`,

      url:
        PAGE_URL,

      name:
        `Services | ${businessName}`,

      description:
        region
          ? `Explore mobile car battery services from ${businessName} in ${region}.`
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

      mainEntity: {
        "@id":
          `${PAGE_URL}#itemlist`,
      },

      breadcrumb: {
        "@id":
          `${PAGE_URL}#breadcrumb`,
      },

      inLanguage:
        "en-AU",
    },

    /* --------------------------------------------------------
       ITEM LIST
    -------------------------------------------------------- */

    {
      "@type":
        "ItemList",

      "@id":
        `${PAGE_URL}#itemlist`,

      name:
        "Car Battery Services",

      numberOfItems:
        services.length,

      itemListOrder:
        "https://schema.org/ItemListOrderAscending",

      itemListElement:
        serviceItems,
    },

    /* --------------------------------------------------------
       BREADCRUMBS
    -------------------------------------------------------- */

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
            PAGE_URL,
        },
      ],
    },
  ];

  return {
    "@context":
      "https://schema.org",

    "@graph":
      graph,
  };
}

/* ============================================================
   SERVICES PAGE
============================================================ */

export default async function ServicesPage() {
  const [
    services,
    business,
  ] = await Promise.all([
    getServices(),

    getBusinessSettings(),
  ]);

  const structuredData =
    getServicesStructuredData(
      services,
      business.businessName,
      business.primaryServiceRegion,
    );

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
        <ServicesListingPage
          services={
            services
          }
          region={
            business.primaryServiceRegion
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