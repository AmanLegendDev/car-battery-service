import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

import BookingPage from "@/components/booking/BookingPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  "https://carbatteryservices.com.au";

const PAGE_URL =
  `${SITE_URL}/book-service`;

const PAGE_TITLE =
  "Book a Battery Service | Car Battery Service";

const PAGE_DESCRIPTION =
  "Request a mobile car battery service in Melbourne West. Choose a service, provide your vehicle and location details, and select an available appointment.";

const OG_IMAGE =
  "/images/seo/og-image.jpg";

export const metadata: Metadata = {
  title: PAGE_TITLE,

  description:
    PAGE_DESCRIPTION,

  alternates: {
    canonical: "/book-service",
  },

  openGraph: {
    type: "website",

    locale: "en_AU",

    url: PAGE_URL,

    siteName:
      "Car Battery Service",

    title:
      PAGE_TITLE,

    description:
      PAGE_DESCRIPTION,

    images: [
      {
        url: OG_IMAGE,

        width: 1200,

        height: 630,

        alt:
          "Book a Mobile Car Battery Service in Melbourne West",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      PAGE_TITLE,

    description:
      PAGE_DESCRIPTION,

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

function getBookingStructuredData() {
  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "WebPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          PAGE_TITLE,

        description:
          PAGE_DESCRIPTION,

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

            name: "Book a Service",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };
}

export default async function BookServicePage() {
  await connectDB();

  const services =
    await Service.find({
      status: "active",
    })
      .select(
        "_id title shortDescription heroImage",
      )
      .sort({
        displayOrder: 1,
        createdAt: 1,
      })
      .lean();

  const publicServices =
    services.map(
      (service) => ({
        id:
          service._id.toString(),

        title:
          service.title,

        shortDescription:
          service.shortDescription ||
          "",
      }),
    );

  const structuredData =
    getBookingStructuredData();

  return (
    <>
      <main>
        <BookingPage
          services={
            publicServices
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