import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";

import ServiceArea from "@/models/ServiceArea";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";



import ServiceAreaDetailPage from "@/components/service-areas/detail/ServiceAreaDetailPage";

interface ServiceAreaPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getServiceArea(slug: string) {
  await connectDB();

  const serviceArea = await ServiceArea.findOne({
    slug: slug.toLowerCase(),
    status: "active",
  })
    .select(
      [
        "name",
        "slug",
        "shortDescription",
        "description",
        "suburbs",
        "postcodes",
        "heroImage",
        "mapUrl",
        "serviceAvailability",
        "featured",
        "displayOrder",
        "seoTitle",
        "seoDescription",
      ].join(" "),
    )
    .lean();

  if (!serviceArea) {
    return null;
  }

  return {
    id: String(serviceArea._id),

    name: serviceArea.name,
    slug: serviceArea.slug,

    shortDescription: serviceArea.shortDescription || "",
    description: serviceArea.description || "",

    suburbs: Array.isArray(serviceArea.suburbs)
      ? serviceArea.suburbs
      : [],

    postcodes: Array.isArray(serviceArea.postcodes)
      ? serviceArea.postcodes
      : [],

    heroImage: serviceArea.heroImage
      ? {
          publicId: serviceArea.heroImage.publicId,
          secureUrl: serviceArea.heroImage.secureUrl,
          width: serviceArea.heroImage.width,
          height: serviceArea.heroImage.height,
          format: serviceArea.heroImage.format,
          bytes: serviceArea.heroImage.bytes,
          resourceType: serviceArea.heroImage.resourceType,
          alt: serviceArea.heroImage.alt,
        }
      : null,

    mapUrl: serviceArea.mapUrl || "",

    serviceAvailability: serviceArea.serviceAvailability || "",

    featured: Boolean(serviceArea.featured),

    displayOrder: serviceArea.displayOrder ?? 0,

    seoTitle: serviceArea.seoTitle || "",

    seoDescription: serviceArea.seoDescription || "",
  };
}

async function getRelatedServices() {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select(
      [
        "title",
        "slug",
        "shortDescription",
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
    .limit(6)
    .lean();

  return services.map((service) => ({
    id: String(service._id),

    title: service.title,

    slug: service.slug,

    shortDescription: service.shortDescription || "",

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

async function getRelatedServiceAreas(currentSlug: string) {
  await connectDB();

  const areas = await ServiceArea.find({
    status: "active",
    slug: {
      $ne: currentSlug.toLowerCase(),
    },
  })
    .select(
      [
        "name",
        "slug",
        "shortDescription",
        "heroImage",
        "suburbs",
        "postcodes",
        "featured",
        "displayOrder",
      ].join(" "),
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      name: 1,
    })
    .limit(4)
    .lean();

  return areas.map((area) => ({
    id: String(area._id),

    name: area.name,

    slug: area.slug,

    shortDescription: area.shortDescription || "",

    heroImage: area.heroImage
      ? {
          publicId: area.heroImage.publicId,
          secureUrl: area.heroImage.secureUrl,
          width: area.heroImage.width,
          height: area.heroImage.height,
          format: area.heroImage.format,
          bytes: area.heroImage.bytes,
          resourceType: area.heroImage.resourceType,
          alt: area.heroImage.alt,
        }
      : null,

    suburbs: Array.isArray(area.suburbs)
      ? area.suburbs
      : [],

    postcodes: Array.isArray(area.postcodes)
      ? area.postcodes
      : [],

    featured: Boolean(area.featured),

    displayOrder: area.displayOrder ?? 0,
  }));
}

async function getSiteSettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName phone primaryCallNumber whatsapp primaryServiceRegion",
    )
    .lean();

  return {
    businessName:
      settings?.businessName || "Car Battery Service",

    phone:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    whatsapp:
      settings?.whatsapp ||
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    primaryServiceRegion:
      settings?.primaryServiceRegion || "",
  };
}

export async function generateMetadata({
  params,
}: ServiceAreaPageProps): Promise<Metadata> {
  const { slug } = await params;

  const serviceArea = await getServiceArea(slug);

  if (!serviceArea) {
    return {
      title: "Service Area Not Found | Car Battery Service",
      description:
        "The requested service area could not be found.",
    };
  }

  const title =
    serviceArea.seoTitle ||
    `${serviceArea.name} | Car Battery Service`;

  const description =
    serviceArea.seoDescription ||
    serviceArea.shortDescription ||
    `Mobile car battery assistance information for ${serviceArea.name}.`;

  const canonicalPath =
    `/service-areas/${serviceArea.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",

      ...(serviceArea.heroImage?.secureUrl
        ? {
            images: [
              {
                url: serviceArea.heroImage.secureUrl,
                width: serviceArea.heroImage.width,
                height: serviceArea.heroImage.height,
                alt:
                  serviceArea.heroImage.alt ||
                  `${serviceArea.name} service area`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      ...(serviceArea.heroImage?.secureUrl
        ? {
            images: [serviceArea.heroImage.secureUrl],
          }
        : {}),
    },
  };
}

export default async function ServiceAreaPage({
  params,
}: ServiceAreaPageProps) {
  const { slug } = await params;

  const [
    serviceArea,
    services,
    relatedAreas,
    siteSettings,
  ] = await Promise.all([
    getServiceArea(slug),
    getRelatedServices(),
    getRelatedServiceAreas(slug),
    getSiteSettings(),
  ]);

  if (!serviceArea) {
    notFound();
  }

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
      

        <ServiceAreaDetailPage
          serviceArea={serviceArea}
          services={services}
          relatedAreas={relatedAreas}
          businessName={siteSettings.businessName}
          phone={siteSettings.phone}
          whatsapp={siteSettings.whatsapp}
          primaryServiceRegion={
            siteSettings.primaryServiceRegion
          }
        />
      </main>

      
    </>
  );
}