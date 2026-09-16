import ServiceAreaHero from "./hero/ServiceAreaHero";
import ServiceAreaCoverage from "./coverage/ServiceAreaCoverage";
import ServiceAreaServices from "./services/ServiceAreaServices";
import ServiceAreaMap from "./map/ServiceAreaMap";
import RelatedServiceAreas from "./related/RelatedServiceAreas";
import ServiceAreaFinalCTA from "./cta/ServiceAreaFinalCTA";

export interface ServiceAreaDetailData {
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
  seoTitle: string;
  seoDescription: string;
}

export interface ServiceAreaDetailService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
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

export interface RelatedServiceAreaData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
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
  suburbs: string[];
  postcodes: string[];
  featured: boolean;
  displayOrder: number;
}

interface ServiceAreaDetailPageProps {
  serviceArea: ServiceAreaDetailData;
  services: ServiceAreaDetailService[];
  relatedAreas: RelatedServiceAreaData[];
  businessName: string;
  phone: string;
  whatsapp: string;
  primaryServiceRegion: string;
}

export default function ServiceAreaDetailPage({
  serviceArea,
  services,
  relatedAreas,
  businessName,
  phone,
  whatsapp,
  primaryServiceRegion,
}: ServiceAreaDetailPageProps) {
  return (
    <>
      <ServiceAreaHero serviceArea={serviceArea} />

      <ServiceAreaCoverage serviceArea={serviceArea} />

      <ServiceAreaServices
        serviceAreaName={serviceArea.name}
        services={services}
      />

      <ServiceAreaMap
        serviceAreaName={serviceArea.name}
        mapUrl={serviceArea.mapUrl}
      />

      <RelatedServiceAreas
        currentAreaName={serviceArea.name}
        areas={relatedAreas}
      />

      <ServiceAreaFinalCTA
        businessName={businessName}
        areaName={serviceArea.name}
        phone={phone}
        whatsapp={whatsapp}
        primaryServiceRegion={primaryServiceRegion}
      />
    </>
  );
}