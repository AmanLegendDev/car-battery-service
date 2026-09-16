import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import type { IService } from "@/models/Service";

import ServiceHeroContent from "./ServiceHeroContent";
import ServiceHeroVisual from "./ServiceHeroVisual";

interface ServiceHeroProps {
  service: IService;
}

async function getServiceHeroRegion() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select("primaryServiceRegion phone primaryCallNumber")
    .lean();

  return {
    region: settings?.primaryServiceRegion || "",
    phone:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",
  };
}

export default async function ServiceHero({
  service,
}: ServiceHeroProps) {
  const settings = await getServiceHeroRegion();

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B]">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-[#0D6E91]/10 blur-[120px]" />

        <div className="absolute right-[-180px] top-[15%] h-[620px] w-[620px] rounded-full bg-[#0D6E91]/[0.08] blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:px-8 lg:pb-32 lg:pt-16">
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 sm:mb-16">
          <span>Services</span>

          <span className="text-white/20">/</span>

          <span className="max-w-[220px] truncate text-white/60">
            {service.title}
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-16 xl:gap-24">
          <ServiceHeroContent
            title={service.title}
            description={
              service.description?.trim() ||
              service.shortDescription?.trim()
            }
            ctaText={service.ctaText}
            phone={settings.phone}
          />

          <ServiceHeroVisual
            title={service.title}
            image={service.heroImage}
            region={settings.region}
          />
        </div>
      </div>
    </section>
  );
}