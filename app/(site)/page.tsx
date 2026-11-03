
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

const SITE_URL = "https://www.mobilecarservices.com.au";

const HOME_TITLE =
  "Mobile Mechanic Melbourne West | Mobile Car Services";

const HOME_DESCRIPTION =
  "Need a mobile mechanic in Melbourne's west? Explore mobile car servicing, repairs, battery replacement and roadside assistance. Contact Mobile Car Services to arrange an appointment.";

const HOME_OG_IMAGE = "/images/seo/og-image.jpg";

/**
 * Site settings are used for website content and dynamic business information.
 * Homepage SEO metadata remains intentionally controlled in this file.
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
 * Homepage metadata.
 *
 * Absolute title prevents the global layout title template
 * from appending another brand name.
 */
export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = `${SITE_URL}/`;

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
      siteName: "Mobile Car Services",
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,

      images: [
        {
          url: HOME_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Mobile mechanic and automotive services in Melbourne West",
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
          alt: "Mobile mechanic and automotive services in Melbourne West",
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
 * Defines the website, organisation and homepage entities
 * so their @id references resolve consistently.
 *
 * Does not invent a physical business address or opening hours.
 */
function getHomepageStructuredData(
  phone: string,
  businessName: string,
  logoUrl?: string
) {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: businessName,
    url: `${SITE_URL}/`,
    contactPoint: {
      "@id": `${SITE_URL}/#contact-point`,
    },
  };

  if (logoUrl) {
    organization.logo = {
      "@type": "ImageObject",
      url: logoUrl,
    };
  }

  return {
    "@context": "https://schema.org",

    "@graph": [
      organization,

      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: businessName,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: "en-AU",
      },

      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
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
        areaServed: {
          "@type": "Place",
          name: "Melbourne West",
        },
        availableLanguage: ["English"],
      },
    ],
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();

  /*
   * Dynamic CMS information for website UI.
   * SEO metadata remains independent from CMS descriptions.
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

  const businessName =
    settings?.businessName ||
    "Mobile Car Services";

  const logoUrl = settings?.logo?.secureUrl
    ? settings.logo.secureUrl
    : undefined;

  const homepageStructuredData =
    getHomepageStructuredData(
      phone,
      businessName,
      logoUrl
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

        <PaymentOptions />

        <FAQOverview />

        <BlogPreview />

        <FinalCTA />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            homepageStructuredData
          ).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
