import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Quote,
  Star,
} from "lucide-react";

interface TestimonialPhoto {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface FeaturedTestimonialData {
  id: string;
  name: string;
  businessName: string;
  role: string;
  photo: TestimonialPhoto | null;
  testimonial: string;
  rating: number | null;
}

interface FeaturedTestimonialProps {
  testimonial: FeaturedTestimonialData | null;
}

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "C";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`
    .toUpperCase();
}

export default function FeaturedTestimonial({
  testimonial,
}: FeaturedTestimonialProps) {
  if (!testimonial) {
    return null;
  }

  const initials = getInitials(
    testimonial.name,
  );

  return (
    <section
      aria-labelledby="featured-testimonial-heading"
      className="relative overflow-hidden bg-[#F8FAFC] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND DETAIL
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0D6E91]/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#FFD400]/[0.055] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================
            SECTION INTRO
        ================================================== */}

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D6E91]">
                Featured Experience
              </span>
            </div>

            <h2
              id="featured-testimonial-heading"
              className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-[#061A2B] sm:text-4xl lg:text-5xl"
            >
              One customer experience,
              <br className="hidden sm:block" />
              shared in their own words.
            </h2>
          </div>

          <div className="hidden text-right sm:block">
            <Quote
              aria-hidden="true"
              size={42}
              strokeWidth={1.3}
              className="ml-auto text-[#0D6E91]/20"
            />
          </div>
        </div>

        {/* =================================================
            FEATURED CARD
        ================================================== */}

        <article className="relative overflow-hidden rounded-[2rem] border border-[#DCE7ED] bg-white shadow-[0_24px_70px_rgba(6,26,43,0.08)]">
          <div className="grid lg:grid-cols-[0.38fr_0.62fr]">
            {/* =================================================
                CUSTOMER PANEL
            ================================================== */}

            <div className="relative overflow-hidden bg-[#061A2B] p-8 text-white sm:p-10 lg:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#0D6E91]/20"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#0D6E91]/10 blur-3xl"
              />

              <div className="relative flex h-full flex-col justify-between gap-12">
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                      Customer
                    </span>

                    <Quote
                      aria-hidden="true"
                      size={30}
                      strokeWidth={1.4}
                      className="text-white/15"
                    />
                  </div>

                  {/* Avatar */}

                  <div className="flex items-center gap-5">
                    {testimonial.photo ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <Image
                          src={
                            testimonial.photo
                              .secureUrl
                          }
                          alt={
                            testimonial.photo
                              .alt ||
                            `${testimonial.name} testimonial photo`
                          }
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-xl font-bold tracking-tight text-[#FFD400]"
                      >
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold tracking-[-0.02em]">
                        {testimonial.name}
                      </h3>

                      {testimonial.businessName && (
                        <p className="mt-1 truncate text-sm text-white/50">
                          {
                            testimonial.businessName
                          }
                        </p>
                      )}

                      {testimonial.role && (
                        <p className="mt-1 truncate text-xs text-white/35">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}

                {testimonial.rating !==
                  null && (
                  <div>
                    <div
                      className="flex items-center gap-1.5"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={15}
                            strokeWidth={1.5}
                            fill={
                              index <
                              testimonial.rating!
                                ? "#FFD400"
                                : "transparent"
                            }
                            className={
                              index <
                              testimonial.rating!
                                ? "text-[#FFD400]"
                                : "text-white/20"
                            }
                          />
                        ),
                      )}
                    </div>

                    <p className="mt-2 text-[11px] text-white/35">
                      Customer rating
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                TESTIMONIAL CONTENT
            ================================================== */}

            <div className="flex flex-col justify-between p-8 sm:p-10 lg:p-14">
              <div>
                <div
                  aria-hidden="true"
                  className="mb-7 text-5xl font-serif leading-none text-[#FFD400]"
                >
                  “
                </div>

                <blockquote className="max-w-3xl text-xl font-medium leading-9 tracking-[-0.018em] text-[#172F3D] sm:text-2xl sm:leading-10 lg:text-[2rem] lg:leading-[1.55]"
                >
                  {testimonial.testimonial}
                </blockquote>
              </div>

              <div className="mt-12 flex flex-col gap-5 border-t border-[#E5EDF1] pt-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#84939B]">
                    Genuine customer feedback
                  </p>

                  <p className="mt-1 text-sm text-[#607580]">
                    Shared with Car Battery Service
                  </p>
                </div>

                <Link
                  href="/services"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D6E2E8] px-5 text-sm font-semibold text-[#061A2B] transition hover:border-[#0D6E91] hover:bg-[#F4F9FB]"
                >
                  Explore services

                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}