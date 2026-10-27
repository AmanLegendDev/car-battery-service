
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

  const description =
    service.description?.trim() ||
    service.shortDescription?.trim() ||
    "";

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#061A2B]">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#0D6E91]/10 blur-[120px]" />

        <div className="absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-[#0D6E91]/10 blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      {/* Full-width responsive page container */}
      <div className="relative w-full min-w-0 max-w-none px-4 pb-14 pt-7 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12 lg:pb-24 lg:pt-12 xl:px-16 2xl:px-20 mt-17">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:mb-8"
        >
          <span>Services</span>

          <span className="text-white/20">/</span>

          <span className="max-w-[240px] truncate text-white/75">
            {service.title}
          </span>
        </nav>

        {/* Wide service image with title overlay */}
        <ServiceHeroVisual
          title={service.title}
          image={service.heroImage}
          region={settings.region}
        />

        {/* Full-width description and CTA */}
        <div className="mt-8 w-full min-w-0 max-w-none sm:mt-10 lg:mt-12">
          <ServiceHeroContent
            title={service.title}
            description={description}
            ctaText={service.ctaText}
            phone={settings.phone}
          />
        </div>
      </div>
    </section>
  );
}
