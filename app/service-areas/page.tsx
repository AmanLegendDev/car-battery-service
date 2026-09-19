import type { Metadata } from "next";

import { connectDB } from "@/lib/db";
import ServiceArea from "@/models/ServiceArea";



import ServiceAreasListingPage from "@/components/service-areas/listing/ServiceAreasListingPage";

export const metadata: Metadata = {
  title: "Service Areas | Car Battery Service",
  description:
    "Explore the locations currently listed for mobile car battery assistance from Car Battery Service.",
  alternates: {
    canonical: "/service-areas",
  },
};

async function getServiceAreas() {
  await connectDB();

  const serviceAreas = await ServiceArea.find({
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
      ].join(" "),
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      name: 1,
    })
    .lean();

  return serviceAreas.map((area) => ({
    id: String(area._id),

    name: area.name,

    slug: area.slug,

    shortDescription: area.shortDescription || "",

    description: area.description || "",

    suburbs: Array.isArray(area.suburbs) ? area.suburbs : [],

    postcodes: Array.isArray(area.postcodes) ? area.postcodes : [],

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

    mapUrl: area.mapUrl || "",

    serviceAvailability: area.serviceAvailability || "",

    featured: Boolean(area.featured),

    displayOrder: area.displayOrder ?? 0,
  }));
}

export default async function ServiceAreasPage() {
  const serviceAreas = await getServiceAreas();

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
    

        <ServiceAreasListingPage serviceAreas={serviceAreas} />
      </main>

     
    </>
  );
}