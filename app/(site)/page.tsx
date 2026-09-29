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
import PaymentOptions from "@/components/home/payment-options/PaymentOptions";

export const dynamic = "force-dynamic";

const SITE_URL = "https://carbatteryservices.com.au";

const HOME_TITLE =
  "Mobile Car Battery Replacement Melbourne West | 7 Days";

const HOME_DESCRIPTION =
  "Flat battery? Mobile car battery replacement, testing & jump starts at your home, work or roadside across Melbourne's west. Open 7 days. Call 0467 037 886.";

const HOME_OG_IMAGE =
  "/images/seo/og-image.jpg";

/**
 * Site settings are used for website content/UI.
 * Page SEO metadata is intentionally controlled here
 * so the exact SEO values from the SEO sheet cannot be
 * accidentally overridden by CMS business description data.
 */
async function getSiteSettings() {
  await connectDB();

  return SiteSettings.findOne()
    .select(
      "businessName tagline description phone primaryCallNumber primaryServiceRegion bookingCta quoteCta logo"
    )
    .lean();
}

/**
 * Homepage SEO metadata.
 *
 * IMPORTANT:
 * `absolute` prevents the global layout title template
 * from appending "| Car Battery Services" to this exact
 * homepage SEO title.
 */
export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = SITE_URL;

  return {
    title: {
      absolute: HOME_TITLE,
    },

    description: HOME_DESCRIPTION,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_AU",
      url: canonicalUrl,
      siteName: "Car Battery Services",

      title: HOME_TITLE,
      description: HOME_DESCRIPTION,

      images: [
        {
          url: HOME_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Mobile Car Battery Replacement Melbourne West",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: HOME_TITLE,
      description: HOME_DESCRIPTION,

      images: [
        {
          url: HOME_OG_IMAGE,
          alt: "Mobile Car Battery Replacement Melbourne West",
        },
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

/**
 * Homepage structured data.
 *
 * The WebPage name and description are aligned with the
 * exact homepage SEO metadata.
 *
 * Phone remains dynamic because it comes from SiteSettings.
 */
function getHomepageStructuredData(phone: string) {
  return {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "WebPage",

        "@id": `${SITE_URL}/#webpage`,

        url: SITE_URL,

        name: HOME_TITLE,

        description: HOME_DESCRIPTION,

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

          url: `${SITE_URL}${HOME_OG_IMAGE}`,

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

        availableLanguage: ["English"],
      },
    ],
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  /*
   * Dynamic CMS/business information for the actual website UI.
   * This is intentionally separate from homepage SEO metadata.
   */
  const heroSettings = settings
    ? {
        businessName: settings.businessName,

        tagline: settings.tagline ?? "",

        description: settings.description ?? "",

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

  const phone =
    settings?.primaryCallNumber ||
    settings?.phone ||
    "+61 467 037 886";

  const homepageStructuredData =
    getHomepageStructuredData(phone);

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

        <PaymentOptions />

        <FAQOverview />

        <BlogPreview />

        <FinalCTA />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            homepageStructuredData,
          ),
        }}
      />
    </>
  );
}