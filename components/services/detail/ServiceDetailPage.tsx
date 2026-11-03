
import type { IService } from "@/models/Service";

import ServiceHero from "./hero/ServiceHero";
import ServiceIntro from "./intro/ServiceIntro";
import ServiceSnapshot from "./snapshot/ServiceSnapshot";
import ServiceIncluded from "./included/ServiceIncluded";
import ServiceProcess from "./process/ServiceProcess";
import ServiceGallery from "./gallery/ServiceGallery";
import ServiceBenefits from "./benefits/ServiceBenefits";
import ServiceSuitableFor from "./suitable-for/ServiceSuitableFor";
import ServiceDetails from "./details/ServiceDetails";
import ServicePricing from "./pricing/ServicePricing";
import RelatedServices from "./related/RelatedServices";
import ServiceFAQ from "./faq/ServiceFAQ";
import ServiceFinalCTA from "./cta/ServiceFinalCTA";

interface ServiceDetailPageProps {
  service: IService;
}

export default function ServiceDetailPage({
  service,
}: ServiceDetailPageProps) {
  const serviceId = String(service._id);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* 01 — HERO */}
      <ServiceHero service={service} />

      {/* 02 — INTRO */}
      <ServiceIntro
        title={service.title}
        description={service.shortDescription}
      />

      {/* 03 — SNAPSHOT */}
      <ServiceSnapshot
        estimatedTime={service.estimatedTime}
        onSiteService={service.onSiteService}
        emergencyService={service.emergencyService}
      />

      {/* 04 — PRICING */}
      <ServicePricing
        pricing={service.pricing}
        serviceTitle={service.title}
      />

      {/* 05 — INCLUDED */}
      <ServiceIncluded items={service.included} />

      {/* 06 — PROCESS */}
      <ServiceProcess steps={service.processSteps} />

      {/* 07 — GALLERY */}
      <ServiceGallery
        images={service.gallery}
        serviceTitle={service.title}
      />

      {/* 08 — BENEFITS */}
      <ServiceBenefits items={service.benefits} />

      {/* 09 — SUITABLE FOR */}
      <ServiceSuitableFor items={service.suitableFor} />

      {/* 10 — DETAILS */}
      <ServiceDetails
        estimatedTime={service.estimatedTime}
        onSiteService={service.onSiteService}
        emergencyService={service.emergencyService}
      />

      {/* 11 — RELATED SERVICES */}
      <RelatedServices currentServiceId={serviceId} />

      {/* 12 — FAQ */}
      <ServiceFAQ
        serviceId={serviceId}
        serviceTitle={service.title}
      />

      {/* 13 — FINAL CTA */}
      <ServiceFinalCTA
        serviceTitle={service.title}
        ctaText={service.ctaText}
      />
    </main>
  );
}
