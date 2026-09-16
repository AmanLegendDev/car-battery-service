import type { Metadata } from "next";

import {connectDB} from "@/lib/db";
import FAQ from "@/models/FAQ";
import Service from "@/models/Service";
import ServiceArea from "@/models/ServiceArea";
import SiteSettings from "@/models/SiteSettings";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import FloatingCallButton from "@/components/layout/floating-call/FloatingCallButton";

import FAQsListingPage from "@/components/faqs/listing/FAQsListingPage";

export const dynamic = "force-dynamic";

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
    id: faq._id.toString(),

    question: faq.question,

    answer: faq.answer,

    category: faq.category,

    relatedServices: Array.isArray(
      faq.relatedServices,
    )
      ? faq.relatedServices.map((id) =>
          id.toString(),
        )
      : [],

    relatedServiceAreas: Array.isArray(
      faq.relatedServiceAreas,
    )
      ? faq.relatedServiceAreas.map((id) =>
          id.toString(),
        )
      : [],

    featured: Boolean(faq.featured),

    displayOrder:
      typeof faq.displayOrder === "number"
        ? faq.displayOrder
        : 0,
  }));
}

/* ============================================================
   GET BUSINESS SETTINGS
============================================================ */

async function getBusinessSettings(): Promise<FAQsBusiness> {
  await connectDB();

  const settings = await SiteSettings.findOne()
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
      "Car Battery Service",

    primaryServiceRegion:
      settings?.primaryServiceRegion ||
      "",

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

  /*
   * Collect unique related service IDs.
   */
  const serviceIds = Array.from(
    new Set(
      faqs.flatMap(
        (faq) => faq.relatedServices,
      ),
    ),
  );

  /*
   * Collect unique related service-area IDs.
   */
  const serviceAreaIds = Array.from(
    new Set(
      faqs.flatMap(
        (faq) => faq.relatedServiceAreas,
      ),
    ),
  );

  /*
   * Fetch only active related content.
   */
  const [services, serviceAreas] =
    await Promise.all([
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
    services: services.map((service) => ({
      id: service._id.toString(),

      title: service.title,

      slug: service.slug,

      shortDescription:
        service.shortDescription || "",

      heroImage: service.heroImage
        ? {
            secureUrl:
              service.heroImage.secureUrl,

            alt:
              service.heroImage.alt ||
              service.title,
          }
        : null,
    })),

    serviceAreas: serviceAreas.map(
      (area) => ({
        id: area._id.toString(),

        name: area.name,

        slug: area.slug,

        shortDescription:
          area.shortDescription || "",

        heroImage: area.heroImage
          ? {
              secureUrl:
                area.heroImage.secureUrl,

              alt:
                area.heroImage.alt ||
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
  const business = await getBusinessSettings();

  const title = `FAQs | ${business.businessName}`;

  const description = business.primaryServiceRegion
    ? `Frequently asked questions about mobile car battery service in ${business.primaryServiceRegion}, including battery replacement, battery testing and jump start assistance.`
    : "Frequently asked questions about mobile car battery replacement, battery testing and jump start assistance.";

  return {
    title,

    description,

    alternates: {
      canonical: "/faqs",
    },

    openGraph: {
      title,
      description,
      url: "/faqs",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ============================================================
   FAQ PAGE
============================================================ */

export default async function FAQsPage() {
  const [faqs, business] = await Promise.all([
    getFAQs(),
    getBusinessSettings(),
  ]);

  const relatedContent =
    await getRelatedContent(faqs);

  return (
    <>
      <Navbar />

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

      <Footer />

      <FloatingCallButton />
    </>
  );
}