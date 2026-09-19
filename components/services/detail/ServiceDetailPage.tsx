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
      {/* ─────────────────────────────────────────
          01 — HERO
      ───────────────────────────────────────── */}
      <ServiceHero service={service} />

      {/* ─────────────────────────────────────────
          02 — INTRO
      ───────────────────────────────────────── */}
      <ServiceIntro
        title={service.title}
        description={service.shortDescription}
        
      />

      {/* ─────────────────────────────────────────
          03 — SNAPSHOT
      ───────────────────────────────────────── */}
      <ServiceSnapshot
        estimatedTime={service.estimatedTime}
        onSiteService={service.onSiteService}
        emergencyService={service.emergencyService}
      />

      {/* ─────────────────────────────────────────
          04 — INCLUDED
      ───────────────────────────────────────── */}
      <ServiceIncluded items={service.included} />

      {/* ─────────────────────────────────────────
          05 — PROCESS
      ───────────────────────────────────────── */}
      <ServiceProcess steps={service.processSteps} />

      {/* ─────────────────────────────────────────
          06 — GALLERY
      ───────────────────────────────────────── */}
      <ServiceGallery
        images={service.gallery}
        serviceTitle={service.title}
      />

      {/* ─────────────────────────────────────────
          07 — BENEFITS
      ───────────────────────────────────────── */}
      <ServiceBenefits items={service.benefits} />

      {/* ─────────────────────────────────────────
          08 — SUITABLE FOR
      ───────────────────────────────────────── */}
      <ServiceSuitableFor items={service.suitableFor} />

      {/* ─────────────────────────────────────────
          09 — DETAILS
      ───────────────────────────────────────── */}
      <ServiceDetails
        estimatedTime={service.estimatedTime}
        onSiteService={service.onSiteService}
        emergencyService={service.emergencyService}
      />

      {/* ─────────────────────────────────────────
          10 — RELATED SERVICES
      ───────────────────────────────────────── */}
      <RelatedServices currentServiceId={serviceId} />

      {/* ─────────────────────────────────────────
          11 — FAQ
      ───────────────────────────────────────── */}
      <ServiceFAQ
        serviceId={serviceId}
        serviceTitle={service.title}
      />

      {/* ─────────────────────────────────────────
          12 — FINAL CTA
      ───────────────────────────────────────── */}
      <ServiceFinalCTA
        serviceTitle={service.title}
        ctaText={service.ctaText}
      />
    </main>
  );
}