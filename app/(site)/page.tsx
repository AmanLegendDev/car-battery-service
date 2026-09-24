import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

import Hero from "@/components/home/hero/Hero";
import EmergencyAssistance from "@/components/home/emergency-assistance/EmergencyAssistance";
import ServicesOverview from "@/components/home/services/ServicesOverview";
import HowItWorks from "@/components/home/how-it-works/HowItWorks";
import WhyChooseUs from "@/components/home/why-choose-us/WhyChooseUs";
import ServiceAreasOverview from "@/components/home/service-areas/ServiceAreasOverview";
import VehicleBatteryInformation from "@/components/home/vehicle-battery/VehicleBatteryInformation";
import RequestAssistance from "@/components/home/request-assistance/RequestAssistance";
import TestimonialsOverview from "@/components/home/testimonials/TestimonialsOverview";
import FAQOverview from "@/components/home/faqs/FAQOverview";
import BlogPreview from "@/components/home/blog/BlogPreview";
import FinalCTA from "@/components/home/final-cta/FinalCTA";

export const dynamic = "force-dynamic";

const SITE_URL = "https://carbatteryservices.com.au";

const DEFAULT_TITLE =
  "Car Battery Service | Melbourne West";

const DEFAULT_DESCRIPTION =
  "Mobile car battery service in Melbourne West including battery replacement, battery testing, jump start assistance, starter motor replacement and alternator replacement at your vehicle's location.";

const DEFAULT_OG_IMAGE =
  "/images/seo/og-image.jpg";

async function getSiteSettings() {
  await connectDB();

  return SiteSettings.findOne()
    .select(
      "businessName tagline description phone primaryCallNumber primaryServiceRegion bookingCta quoteCta logo"
    )
    .lean();
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const businessName =
    settings?.businessName?.trim() ||
    "Car Battery Service";

  const description =
    settings?.description?.trim() ||
    DEFAULT_DESCRIPTION;

  const title =
    settings?.primaryServiceRegion?.trim()
      ? `${businessName} | ${settings.primaryServiceRegion.trim()}`
      : DEFAULT_TITLE;

  const canonicalUrl = SITE_URL;

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
      siteName: businessName,

      title,

      description,

      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${businessName} - Mobile Car Battery Service in Melbourne West`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: [
        DEFAULT_OG_IMAGE,
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
}

function getHomepageStructuredData(
  businessName: string,
  description: string,
  phone: string,
  serviceRegion: string,
) {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebPage",

        "@id": `${SITE_URL}/#webpage`,

        url: SITE_URL,

        name:
          `${businessName} | ${serviceRegion || "Melbourne West"}`,

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

        primaryImageOfPage: {
          "@type": "ImageObject",

          url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,

          width: 1200,

          height: 630,
        },

        inLanguage: "en-AU",
      },

      {
        "@type": "ContactPoint",

        "@id": `${SITE_URL}/#contact-point`,

        telephone: phone,

        contactType: "customer service",

        areaServed: "Melbourne West",

        availableLanguage: [
          "English",
        ],
      },
    ],
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  const heroSettings = settings
    ? {
        businessName: settings.businessName,

        tagline:
          settings.tagline ?? "",

        description:
          settings.description ?? "",

        phone:
          settings.primaryCallNumber ||
          settings.phone,

        serviceRegion:
          settings.primaryServiceRegion ?? "",

        bookingCta:
          settings.bookingCta ||
          "Book a Service",
      }
    : null;

  const businessName =
    settings?.businessName?.trim() ||
    "Car Battery Service";

  const description =
    settings?.description?.trim() ||
    DEFAULT_DESCRIPTION;

  const phone =
    settings?.primaryCallNumber ||
    settings?.phone ||
    "+61 467 037 886";

  const serviceRegion =
    settings?.primaryServiceRegion?.trim() ||
    "Melbourne West";

  const homepageStructuredData =
    getHomepageStructuredData(
      businessName,
      description,
      phone,
      serviceRegion,
    );

  return (
    <>
      <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
        <Hero settings={heroSettings} />

        <EmergencyAssistance />

        <ServicesOverview />

        <HowItWorks />

        <WhyChooseUs />

        <ServiceAreasOverview />

        <VehicleBatteryInformation />

        <RequestAssistance />

        <TestimonialsOverview />

        <FAQOverview />

        <BlogPreview />

        <FinalCTA />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              homepageStructuredData,
            ),
        }}
      />
    </>
  );
}