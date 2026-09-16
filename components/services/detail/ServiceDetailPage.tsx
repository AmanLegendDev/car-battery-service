import type { IService } from "@/models/Service";

import ServiceHero from "./hero/ServiceHero";

import ServiceIntro from "./intro/ServiceIntro";
import ServiceSnapshot from "./snapshot/ServiceSnapshot";
import ServiceIncluded from "./included/ServiceIncluded";
import ServiceProcess from "./process/ServiceProcess";

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
          06 — BENEFITS
      ───────────────────────────────────────── */}
      <ServiceBenefits items={service.benefits} />

      {/* ─────────────────────────────────────────
          07 — SUITABLE FOR
      ───────────────────────────────────────── */}
      <ServiceSuitableFor items={service.suitableFor} />

      {/* ─────────────────────────────────────────
          08 — DETAILS
      ───────────────────────────────────────── */}
      <ServiceDetails
        estimatedTime={service.estimatedTime}
        onSiteService={service.onSiteService}
        emergencyService={service.emergencyService}
      />

      {/* ─────────────────────────────────────────
          09 — RELATED SERVICES
      ───────────────────────────────────────── */}
      <RelatedServices currentServiceId={serviceId} />

      {/* ─────────────────────────────────────────
          10 — FAQ
      ───────────────────────────────────────── */}
      <ServiceFAQ
        serviceId={serviceId}
        serviceTitle={service.title}
      />

      {/* ─────────────────────────────────────────
          11 — FINAL CTA
      ───────────────────────────────────────── */}
      <ServiceFinalCTA
        serviceTitle={service.title}
        ctaText={service.ctaText}
      />
    </main>
  );
}