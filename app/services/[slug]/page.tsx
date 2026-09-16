import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import ServiceDetailPage from "@/components/services/detail/ServiceDetailPage";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getServiceBySlug(slug: string) {
  await connectDB();

  const service = await Service.findOne({
    slug,
    status: "active",
  })
    .select(
      [
        "title",
        "slug",
        "shortDescription",
        "description",
        "heroImage",
        "processSteps",
        "benefits",
        "included",
        "suitableFor",
        "estimatedTime",
        "emergencyService",
        "onSiteService",
        "ctaText",
        "featured",
        "displayOrder",
        "seoTitle",
        "seoDescription",
      ].join(" "),
    )
    .lean();

  return service;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Car Battery Service",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    service.seoTitle?.trim() ||
    `${service.title} | Car Battery Service`;

  const description =
    service.seoDescription?.trim() ||
    service.shortDescription?.trim() ||
    "Mobile car battery assistance from Car Battery Service.";

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      ...(service.heroImage?.secureUrl
        ? {
            images: [
              {
                url: service.heroImage.secureUrl,
                width: service.heroImage.width,
                height: service.heroImage.height,
                alt:
                  service.heroImage.alt?.trim() ||
                  service.title,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailPage service={service} />;
}