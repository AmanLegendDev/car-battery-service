import ServiceAreasEmptyState from "./empty/ServiceAreasEmptyState";
import ServiceAreasListingHero from "./hero/ServiceAreasListingHero";
import ServiceAreasDirectory from "./directory/ServiceAreasDirectory";
import ServiceAreasListingCTA from "./cta/ServiceAreasListingCTA";

export interface ServiceAreaListingItem {
  id: string;
  name: string;
  slug: string;

  shortDescription: string;
  description: string;

  suburbs: string[];
  postcodes: string[];

  heroImage: {
    publicId: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    resourceType: "image";
    alt: string;
  } | null;

  mapUrl: string;
  serviceAvailability: string;

  featured: boolean;
  displayOrder: number;
}

interface ServiceAreasListingPageProps {
  serviceAreas: ServiceAreaListingItem[];
}

export default function ServiceAreasListingPage({
  serviceAreas,
}: ServiceAreasListingPageProps) {
  if (!serviceAreas.length) {
    return <ServiceAreasEmptyState />;
  }

  return (
    <>
      <ServiceAreasListingHero
        serviceAreaCount={serviceAreas.length}
      />

      <ServiceAreasDirectory
        serviceAreas={serviceAreas}
      />

      <ServiceAreasListingCTA
        serviceAreaCount={serviceAreas.length}
      />
    </>
  );
}