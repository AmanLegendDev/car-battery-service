import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import ServiceArea from "@/models/ServiceArea";
import SiteSettings from "@/models/SiteSettings";

import ServiceAreasListingPage from "@/components/service-areas/listing/ServiceAreasListingPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/service-areas`;

const OG_IMAGE =
  "/images/seo/og-image.jpg";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Service";

const DEFAULT_REGION =
  "Melbourne West";

const DEFAULT_DESCRIPTION =
  "Explore the locations currently listed for mobile car battery assistance from Car Battery Service.";

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
   GET ACTIVE SERVICE AREAS
============================================================ */

async function getServiceAreas() {
  await connectDB();

  const serviceAreas =
    await ServiceArea.find({
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
        ].join(" "),
      )
      .sort({
        featured: -1,
        displayOrder: 1,
        name: 1,
      })
      .lean();

  return serviceAreas.map(
    (area) => ({
      id:
        String(area._id),

      name:
        area.name,

      slug:
        area.slug,

      shortDescription:
        area.shortDescription ||
        "",

      description:
        area.description ||
        "",

      suburbs:
        Array.isArray(
          area.suburbs,
        )
          ? area.suburbs
          : [],

      postcodes:
        Array.isArray(
          area.postcodes,
        )
          ? area.postcodes
          : [],

      heroImage:
        area.heroImage
          ? {
              publicId:
                area.heroImage
                  .publicId,

              secureUrl:
                area.heroImage
                  .secureUrl,

              width:
                area.heroImage
                  .width,

              height:
                area.heroImage
                  .height,

              format:
                area.heroImage
                  .format,

              bytes:
                area.heroImage
                  .bytes,

              resourceType:
                area.heroImage
                  .resourceType,

              alt:
                area.heroImage
                  .alt,
            }
          : null,

      mapUrl:
        area.mapUrl ||
        "",

      serviceAvailability:
        area.serviceAvailability ||
        "",

      featured:
        Boolean(
          area.featured,
        ),

      displayOrder:
        area.displayOrder ??
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
    `Service Areas | ${business.businessName}`;

  const description =
    `Explore the locations currently listed for mobile car battery assistance from ${business.businessName}${business.primaryServiceRegion ? ` across ${business.primaryServiceRegion}` : ""}.`;

  return {
    title,

    description,

    alternates: {
      canonical:
        "/service-areas",
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
            `${business.businessName} - Service Areas`,
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
   SERVICE AREA STRUCTURED DATA
============================================================ */

function getServiceAreasStructuredData(
  serviceAreas: Awaited<
    ReturnType<typeof getServiceAreas>
  >,
  businessName: string,
  region: string,
) {
  const itemList =
    serviceAreas.map(
      (area, index) => ({
        "@type":
          "ListItem",

        position:
          index + 1,

        name:
          area.name,

        url:
          `${SITE_URL}/service-areas/${area.slug}`,
      }),
    );

  const graph = [
    {
      "@type":
        "CollectionPage",

      "@id":
        `${PAGE_URL}#collection`,

      url:
        PAGE_URL,

      name:
        `Service Areas | ${businessName}`,

      description:
        `Explore the locations currently listed for mobile car battery assistance from ${businessName}${region ? ` across ${region}` : ""}.`,

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

      mainEntity: {
        "@id":
          `${PAGE_URL}#itemlist`,
      },

      inLanguage:
        "en-AU",
    },

    {
      "@type":
        "ItemList",

      "@id":
        `${PAGE_URL}#itemlist`,

      name:
        "Service Areas",

      numberOfItems:
        serviceAreas.length,

      itemListOrder:
        "https://schema.org/ItemListOrderAscending",

      itemListElement:
        itemList,
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
            "Service Areas",

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
   SERVICE AREAS PAGE
============================================================ */

export default async function ServiceAreasPage() {
  const [
    serviceAreas,
    business,
  ] = await Promise.all([
    getServiceAreas(),

    getBusinessSettings(),
  ]);

  const structuredData =
    getServiceAreasStructuredData(
      serviceAreas,
      business.businessName,
      business.primaryServiceRegion,
    );

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
        <ServiceAreasListingPage
          serviceAreas={
            serviceAreas
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