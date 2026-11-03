
import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

import BookingPage from "@/components/booking/BookingPage";
import FAQOverview from "@/components/home/faqs/FAQOverview";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.mobilecarservices.com.au";

const PAGE_URL = `${SITE_URL}/book-service`;

const SEO_TITLE =
  "Book a Mobile Mechanic in Melbourne West | Mobile Car Services";

const SEO_DESCRIPTION =
  "Request a mobile car service appointment in Melbourne West. Choose your service, provide your vehicle and location details, and submit your booking request online.";

const OG_IMAGE = `${SITE_URL}/images/seo/og-image.jpg`;

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
        alt: "Book a Mobile Car Service in Melbourne West - Mobile Car Services",
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
   BOOKING PAGE STRUCTURED DATA
============================================================ */

function getBookingStructuredData() {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebPage",

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

            name: "Book a Service",

            item: PAGE_URL,
          },
        ],
      },
    ],
  };
}

/* ============================================================
   BOOK SERVICE PAGE
============================================================ */

export default async function BookServicePage() {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select("_id title shortDescription")
    .sort({
      displayOrder: 1,
      createdAt: 1,
    })
    .lean();

  const publicServices = services.map((service) => ({
    id: service._id.toString(),

    title: service.title,

    shortDescription: service.shortDescription || "",
  }));

  const structuredData = getBookingStructuredData();

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <BookingPage services={publicServices} />

      {/* Booking Page FAQs */}
      <FAQOverview pageUrl={PAGE_URL} />

      {/* Booking Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStructuredData,
        }}
      />
    </>
  );
}
