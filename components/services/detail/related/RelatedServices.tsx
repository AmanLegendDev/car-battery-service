import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

interface RelatedServicesProps {
  currentServiceId: string;
}

interface RelatedService {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  heroImage?: {
    secureUrl: string;
    alt?: string;
  } | null;
}

async function getRelatedServices(
  currentServiceId: string,
): Promise<RelatedService[]> {
  await connectDB();

  const services = await Service.find({
    status: "active",
    _id: {
      $ne: currentServiceId,
    },
  })
    .select("title slug shortDescription heroImage displayOrder featured")
    .sort({
      featured: -1,
      displayOrder: 1,
      title: 1,
    })
    .limit(3)
    .lean();

  return services.map((service) => ({
    _id: String(service._id),
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription,
    heroImage: service.heroImage
      ? {
          secureUrl: service.heroImage.secureUrl,
          alt: service.heroImage.alt,
        }
      : null,
  }));
}

export default async function RelatedServices({
  currentServiceId,
}: RelatedServicesProps) {
  const services = await getRelatedServices(currentServiceId);

  if (!services.length) {
    return null;
  }

  return (
    <section className="bg-[#061A2B] text-[#F8FAFC]">
      <div className="mx-auto max-w-[1420px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                Explore More
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Other services
            </h2>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-[#FFD400]"
          >
            View all services

            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
              strokeWidth={1.8}
            />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service._id}
              href={`/services/${service.slug}`}
              className="group relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#08263D] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-[0_25px_70px_rgba(0,0,0,0.25)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0D6E91]/10">
                {service.heroImage?.secureUrl ? (
                  <img
                    src={service.heroImage.secureUrl}
                    alt={service.heroImage.alt || service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(13,110,145,0.35),transparent_35%),linear-gradient(145deg,#08263D,#061A2B)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#061A2B] via-transparent to-transparent" />

                <span className="absolute left-5 top-5 text-[10px] font-bold tracking-[0.15em] text-white/45">
                  0{index + 1}
                </span>

                <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#061A2B]/60 text-[#FFD400] backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                  <ArrowUpRight
                    className="h-4 w-4"
                    strokeWidth={1.8}
                  />
                </span>
              </div>

              <div className="p-6 sm:p-7">
                <h3 className="text-xl font-semibold tracking-[-0.025em]">
                  {service.title}
                </h3>

                {service.shortDescription ? (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/45">
                    {service.shortDescription}
                  </p>
                ) : null}

                <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                  Explore service
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}