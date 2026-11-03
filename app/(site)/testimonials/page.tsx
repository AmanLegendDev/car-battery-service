
import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Testimonial from "@/models/Testimonial";
import SiteSettings from "@/models/SiteSettings";

import TestimonialsListingPage, {
  type PublicTestimonial,
  type TestimonialsBusiness,
} from "@/components/testimonials/listing/TestimonialsListingPage";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.mobilecarservices.com.au";

const PAGE_URL = `${SITE_URL}/testimonials`;

const OG_IMAGE = `${SITE_URL}/images/seo/og-image.jpg`;

const DEFAULT_BUSINESS_NAME = "Mobile Car Services";

/* ============================================================
   GET TESTIMONIALS
============================================================ */

async function getTestimonials(): Promise<PublicTestimonial[]> {
  await connectDB();

  const testimonials = await Testimonial.find({
    published: true,
  })
    .select(
      [
        "name",
        "businessName",
        "role",
        "photo",
        "testimonial",
        "rating",
        "featured",
        "displayOrder",
      ].join(" "),
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    })
    .lean();

  return testimonials.map((testimonial) => ({
    id: String(testimonial._id),

    name: testimonial.name || "",

    businessName: testimonial.businessName || "",

    role: testimonial.role || "",

    photo: testimonial.photo
      ? {
          publicId: testimonial.photo.publicId,

          secureUrl: testimonial.photo.secureUrl,

          width: testimonial.photo.width,

          height: testimonial.photo.height,

          format: testimonial.photo.format,

          bytes: testimonial.photo.bytes,

          resourceType: testimonial.photo.resourceType,

          alt: testimonial.photo.alt || "",
        }
      : null,

    testimonial: testimonial.testimonial || "",

    rating:
      typeof testimonial.rating === "number"
        ? testimonial.rating
        : null,

    featured: Boolean(testimonial.featured),

    displayOrder: testimonial.displayOrder ?? 0,
  }));
}

/* ============================================================
   GET BUSINESS SETTINGS
============================================================ */

async function getBusinessSettings(): Promise<TestimonialsBusiness> {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      [
        "businessName",
        "primaryServiceRegion",
        "phone",
        "primaryCallNumber",
        "whatsapp",
      ].join(" "),
    )
    .lean();

  return {
    businessName:
      settings?.businessName?.trim() ||
      DEFAULT_BUSINESS_NAME,

    primaryServiceRegion:
      settings?.primaryServiceRegion?.trim() || "",

    phone:
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      "",

    whatsapp:
      settings?.whatsapp?.trim() ||
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      "",
  };
}

/* ============================================================
   SEO METADATA
============================================================ */

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();

  const region = business.primaryServiceRegion;

  const title = region
    ? `Customer Experiences | ${business.businessName} | ${region}`
    : `Customer Experiences | ${business.businessName}`;

  const description = region
    ? `Read customer feedback about ${business.businessName} and its mobile automotive services, including battery assistance in ${region}.`
    : `Read customer feedback about ${business.businessName} and its mobile automotive services.`;

  return {
    title: {
      absolute: title,
    },

    description,

    alternates: {
      canonical: PAGE_URL,
    },

    openGraph: {
      type: "website",

      locale: "en_AU",

      url: PAGE_URL,

      siteName: business.businessName,

      title,

      description,

      images: [
        {
          url: OG_IMAGE,

          width: 1200,

          height: 630,

          alt: `${business.businessName} - Customer Experiences`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

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
}

/* ============================================================
   TESTIMONIAL STRUCTURED DATA
============================================================ */

function getTestimonialsStructuredData(
  testimonials: PublicTestimonial[],
  business: TestimonialsBusiness,
) {
  const validTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.trim().length > 0 &&
      testimonial.testimonial.trim().length > 0,
  );

  const reviewItems = validTestimonials.map((testimonial) => {
    const review: Record<string, unknown> = {
      "@type": "Review",

      "@id": `${PAGE_URL}#review-${testimonial.id}`,

      author: {
        "@type": "Person",

        name: testimonial.name,
      },

      reviewBody: testimonial.testimonial,

      itemReviewed: {
        "@id": `${SITE_URL}/#organization`,
      },
    };

    if (
      typeof testimonial.rating === "number" &&
      Number.isFinite(testimonial.rating) &&
      testimonial.rating >= 1 &&
      testimonial.rating <= 5
    ) {
      review.reviewRating = {
        "@type": "Rating",

        ratingValue: testimonial.rating,

        bestRating: 5,

        worstRating: 1,
      };
    }

    return review;
  });

  const title = business.primaryServiceRegion
    ? `Customer Experiences | ${business.businessName} | ${business.primaryServiceRegion}`
    : `Customer Experiences | ${business.businessName}`;

  const description = business.primaryServiceRegion
    ? `Read customer feedback about ${business.businessName} and its mobile automotive services in ${business.primaryServiceRegion}.`
    : `Read customer feedback about ${business.businessName} and its mobile automotive services.`;

  return {
    "@context": "https://schema.org",

    "@graph": [
      /* --------------------------------------------------------
         COLLECTION PAGE
      -------------------------------------------------------- */

      {
        "@type": "CollectionPage",

        "@id": `${PAGE_URL}#collection`,

        url: PAGE_URL,

        name: title,

        description,

        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },

        about: {
          "@id": `${SITE_URL}/#organization`,
        },

        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },

        mainEntity: {
          "@id": `${PAGE_URL}#reviews`,
        },

        breadcrumb: {
          "@id": `${PAGE_URL}#breadcrumb`,
        },

        inLanguage: "en-AU",
      },

      /* --------------------------------------------------------
         CUSTOMER REVIEWS
      -------------------------------------------------------- */

      {
        "@type": "ItemList",

        "@id": `${PAGE_URL}#reviews`,

        name: "Customer Reviews",

        numberOfItems: reviewItems.length,

        itemListElement: reviewItems.map((review, index) => ({
          "@type": "ListItem",

          position: index + 1,

          item: review,
        })),
      },

      /* --------------------------------------------------------
         BREADCRUMBS
      -------------------------------------------------------- */

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

            name: "Customer Experiences",

            item: PAGE_URL,
          },
        ],
      },
    ],
  };
}

/* ============================================================
   TESTIMONIALS PAGE
============================================================ */

export default async function TestimonialsPage() {
  const [testimonials, business] = await Promise.all([
    getTestimonials(),

    getBusinessSettings(),
  ]);

  const structuredData = getTestimonialsStructuredData(
    testimonials,
    business,
  );

  const safeStructuredData = JSON.stringify(
    structuredData,
  ).replace(/</g, "\\u003c");

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
        <TestimonialsListingPage
          testimonials={testimonials}
          business={business}
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
