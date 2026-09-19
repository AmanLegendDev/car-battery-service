import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import FloatingCallButton from "@/components/layout/floating-call/FloatingCallButton";

import ServicesListingPage from "@/components/services/listing/ServicesListingPage";

export const metadata: Metadata = {
  title: "Services | Car Battery Service",
  description:
    "Explore mobile car battery services from Car Battery Service, including battery replacement, battery testing and jump start assistance.",
  alternates: {
    canonical: "/services",
  },
};

async function getServices() {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select(
      [
        "title",
        "slug",
        "shortDescription",
        "description",
        "heroImage",
        "estimatedTime",
        "emergencyService",
        "onSiteService",
        "ctaText",
        "featured",
        "displayOrder",
      ].join(" "),
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      title: 1,
    })
    .lean();

  return services.map((service) => ({
    id: String(service._id),
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription || "",
    description: service.description || "",
    heroImage: service.heroImage
      ? {
          publicId: service.heroImage.publicId,
          secureUrl: service.heroImage.secureUrl,
          width: service.heroImage.width,
          height: service.heroImage.height,
          format: service.heroImage.format,
          bytes: service.heroImage.bytes,
          resourceType: service.heroImage.resourceType,
          alt: service.heroImage.alt,
        }
      : null,
    estimatedTime: service.estimatedTime || "",
    emergencyService: Boolean(service.emergencyService),
    onSiteService: Boolean(service.onSiteService),
    ctaText: service.ctaText || "",
    featured: Boolean(service.featured),
    displayOrder: service.displayOrder ?? 0,
  }));
}

async function getServiceRegion() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select("primaryServiceRegion")
    .lean();

  return settings?.primaryServiceRegion || "";
}

export default async function ServicesPage() {
  const [services, region] = await Promise.all([
    getServices(),
    getServiceRegion(),
  ]);

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
       

        <ServicesListingPage
          services={services}
          region={region}
        />
      </main>

      
    </>
  );
}