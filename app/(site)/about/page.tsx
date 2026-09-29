import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

import AboutPage from "@/components/about/listing/AboutPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/about`;

const SEO_TITLE =
  "About Us | Local Mobile Car Battery Service Melbourne West";

const SEO_DESCRIPTION =
  "Learn about our local mobile car battery service in Melbourne West, providing battery replacement, battery testing and jump start assistance at your vehicle's location.";

const OG_IMAGE =
  "/images/seo/og-image.jpg";

export interface AboutBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

export interface AboutService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

async function getBusinessSettings(): Promise<AboutBusiness> {
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
      "Car Battery Service",

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
      "",
  };
}

async function getServices(): Promise<AboutService[]> {
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
            "About Car Battery Services - Local Mobile Car Battery Service Melbourne West",
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

function getAboutStructuredData() {
  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "AboutPage",

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
              "About Us",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };
}

export default async function AboutRoute() {
  const [
    business,
    services,
  ] = await Promise.all([
    getBusinessSettings(),
    getServices(),
  ]);

  const structuredData =
    getAboutStructuredData();

  return (
    <>
      <main>
        <AboutPage
          business={
            business
          }
          services={
            services
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