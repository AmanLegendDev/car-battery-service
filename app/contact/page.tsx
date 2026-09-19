import type { Metadata } from "next";

import {connectDB} from "@/lib/db";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";



import ContactPage from "@/components/contact/listing/ContactPage";

export const dynamic = "force-dynamic";

export interface ContactBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

export interface ContactService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

async function getBusinessSettings(): Promise<ContactBusiness> {
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

async function getServices(): Promise<ContactService[]> {
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

  const title = `Contact ${business.businessName}`;

  const description = business.primaryServiceRegion
    ? `Contact ${business.businessName} for mobile car battery assistance in ${business.primaryServiceRegion}. Call, message on WhatsApp or book a battery service online.`
    : `Contact ${business.businessName} for mobile car battery assistance. Call, message on WhatsApp or book a battery service online.`;

  return {
    title,
    description,

    alternates: {
      canonical: "/contact",
    },

    openGraph: {
      title,
      description,
      url: "/contact",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ContactRoute() {
  const [business, services] =
    await Promise.all([
      getBusinessSettings(),
      getServices(),
    ]);

  return (
    <>
    

      <main>
        <ContactPage
          business={business}
          services={services}
        />
      </main>

      
    </>
  );
}