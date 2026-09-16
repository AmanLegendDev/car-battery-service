import ServicesListingHero from "./hero/ServicesListingHero";
import ServicesDirectory from "./directory/ServicesDirectory";
import ServicesEmptyState from "./empty/ServicesEmptyState";
import ServicesListingCTA from "./cta/ServicesListingCTA";

interface ServiceListingItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
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
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
  ctaText: string;
  featured: boolean;
  displayOrder: number;
}

interface ServicesListingPageProps {
  services: ServiceListingItem[];
  region?: string;
}

export default function ServicesListingPage({
  services,
  region,
}: ServicesListingPageProps) {
  if (!services.length) {
    return <ServicesEmptyState />;
  }

  return (
    <>
      <ServicesListingHero
        serviceCount={services.length}
        region={region}
      />

      <ServicesDirectory services={services} />

      <ServicesListingCTA
        serviceCount={services.length}
      />
    </>
  );
}