import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";

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

interface HomepageTestimonial {
  _id: string;
  name: string;
  businessName?: string;
  role?: string;
  photo?: TestimonialPhoto;
  testimonial: string;
  rating?: number;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

async function getTestimonials(): Promise<HomepageTestimonial[]> {
  await connectDB();

  const testimonials = await Testimonial.find({
    published: true,
  })
    .select(
      "name businessName role photo testimonial rating featured published displayOrder",
    )
    .sort({
      featured: -1,
      displayOrder: 1,
      createdAt: -1,
    })
    .limit(6)
    .lean();

  return testimonials.map((testimonial) => ({
    _id: String(testimonial._id),
    name: testimonial.name,
    businessName: testimonial.businessName,
    role: testimonial.role,
    photo: testimonial.photo
      ? {
          publicId: testimonial.photo.publicId,
          secureUrl: testimonial.photo.secureUrl,
          width: testimonial.photo.width,
          height: testimonial.photo.height,
          format: testimonial.photo.format,
          bytes: testimonial.photo.bytes,
          resourceType: "image",
          alt: testimonial.photo.alt,
        }
      : undefined,
    testimonial: testimonial.testimonial,
    rating: testimonial.rating,
    featured: testimonial.featured,
    published: testimonial.published,
    displayOrder: testimonial.displayOrder,
  }));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getIdentityLine(testimonial: HomepageTestimonial) {
  return [testimonial.businessName, testimonial.role]
    .filter(Boolean)
    .join(" · ");
}

function Rating({ rating }: { rating?: number }) {
  const safeRating = Math.min(
    5,
    Math.max(0, Math.round(rating ?? 0)),
  );

  if (!safeRating) return null;

  return (
    <div
      aria-label={`${safeRating} out of 5 stars`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < safeRating
              ? "fill-[#FFD400] text-[#FFD400]"
              : "text-white/15"
          }`}
        />
      ))}
    </div>
  );
}

function CustomerIdentity({
  testimonial,
}: {
  testimonial: HomepageTestimonial;
}) {
  const identityLine = getIdentityLine(testimonial);

  return (
    <div className="flex items-center gap-3">
      {testimonial.photo?.secureUrl ? (
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10">
          <Image
            src={testimonial.photo.secureUrl}
            alt={
              testimonial.photo.alt ||
              `${testimonial.name} testimonial`
            }
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#0D6E91]/20 text-xs font-bold text-[#FFD400]">
          {getInitials(testimonial.name)}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#F8FAFC]">
          {testimonial.name}
        </p>

        {identityLine && (
          <p className="mt-0.5 truncate text-xs text-[#A8BBC8]">
            {identityLine}
          </p>
        )}
      </div>
    </div>
  );
}

function FeaturedTestimonial({
  testimonial,
}: {
  testimonial: HomepageTestimonial;
}) {
  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#061A2B]">
      {/* Yellow edge */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-1 bg-[#FFD400]"
      />

      <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
        {/* Quote content */}
        <div className="p-7 sm:p-9 lg:p-11">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#A8BBC8]/50">
              01
            </span>

            {testimonial.featured && (
              <span className="rounded-full border border-[#FFD400]/20 bg-[#FFD400]/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                Featured
              </span>
            )}
          </div>

          <div className="mt-8 flex h-10 w-10 items-center justify-center rounded-full border border-[#FFD400]/20 bg-[#FFD400]/[0.05]">
            <Quote className="h-4 w-4 text-[#FFD400]" />
          </div>

          <blockquote className="mt-6 max-w-4xl text-[clamp(1.35rem,2.5vw,2.25rem)] font-medium leading-[1.35] tracking-[-0.03em] text-[#F8FAFC]">
            “{testimonial.testimonial}”
          </blockquote>
        </div>

        {/* Customer panel */}
        <div className="border-t border-white/10 bg-white/[0.025] p-7 sm:p-9 lg:min-w-[270px] lg:border-l lg:border-t-0 lg:p-9">
          <div className="flex flex-col gap-6">
            <Rating rating={testimonial.rating} />

            <CustomerIdentity testimonial={testimonial} />
          </div>
        </div>
      </div>
    </article>
  );
}

function SmallTestimonial({
  testimonial,
  index,
}: {
  testimonial: HomepageTestimonial;
  index: number;
}) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-[#061A2B] p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[#A8BBC8]/50">
          {String(index + 1).padStart(2, "0")}
        </span>

        <Rating rating={testimonial.rating} />
      </div>

      <blockquote className="mt-6 text-lg font-medium leading-7 tracking-[-0.02em] text-[#F8FAFC]">
        “{testimonial.testimonial}”
      </blockquote>

      <div className="mt-7 border-t border-white/10 pt-5">
        <CustomerIdentity testimonial={testimonial} />
      </div>
    </article>
  );
}

export default async function TestimonialsOverview() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  const featured =
    testimonials.find((testimonial) => testimonial.featured) ??
    testimonials[0];

  const remaining = testimonials.filter(
    (testimonial) => testimonial._id !== featured._id,
  );

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#08263D] text-[#F8FAFC]"
    >
      {/* Technical background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#0D6E91] opacity-[0.1] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* Header */}
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.65fr_1.35fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#FFD400]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A8BBC8]">
                Customer Experiences
              </span>
            </div>

            <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-[#A8BBC8]/50">
              REAL WORDS / REAL EXPERIENCES
            </p>
          </div>

          <h2 className="max-w-4xl text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
            What customers
            <span className="block text-[#FFD400]">
              have to say.
            </span>
          </h2>
        </div>

        {/* Featured testimonial */}
        <FeaturedTestimonial testimonial={featured} />

        {/* Additional testimonials */}
        {remaining.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {remaining.map((testimonial, index) => (
              <SmallTestimonial
                key={testimonial._id}
                testimonial={testimonial}
                index={index + 1}
              />
            ))}
          </div>
        )}

        {/* Bottom strip */}
        <div className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#F8FAFC]">
              See more customer experiences.
            </p>

            <p className="mt-1 text-xs text-[#A8BBC8]">
              Explore the full testimonial collection.
            </p>
          </div>

          <Link
            href="/testimonials"
            className="group inline-flex min-h-12 items-center justify-between gap-4 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:border-[#FFD400]/50 hover:bg-white/[0.04]"
          >
            View All Testimonials

            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}