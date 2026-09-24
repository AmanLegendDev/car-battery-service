import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";



import AboutPage from "@/components/about/listing/AboutPage";

export const dynamic = "force-dynamic";

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

  const settings = await SiteSettings.findOne()
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

  const services = await Service.find({
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

  return services.map((service) => ({
    id: service._id.toString(),
    title: service.title,
    slug: service.slug,
    shortDescription:
      service.shortDescription || "",
    estimatedTime:
      service.estimatedTime || "",
    emergencyService:
      Boolean(service.emergencyService),
    onSiteService:
      Boolean(service.onSiteService),
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();

  const title = `About ${business.businessName}`;

  const description = business.primaryServiceRegion
    ? `Learn about ${business.businessName}, a mobile car battery service providing battery replacement, battery testing and jump start assistance in ${business.primaryServiceRegion}.`
    : `Learn about ${business.businessName} and its mobile car battery services including battery replacement, battery testing and jump start assistance.`;

  return {
    title,
    description,

    alternates: {
      canonical: "/about",
    },

    openGraph: {
      title,
      description,
      url: "/about",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AboutRoute() {
  const [business, services] =
    await Promise.all([
      getBusinessSettings(),
      getServices(),
    ]);

  return (
    <>
  

      <main>
        <AboutPage
          business={business}
          services={services}
        />
      </main>

   
    </>
  );
}