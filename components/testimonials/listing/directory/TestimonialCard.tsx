import Image from "next/image";
import { Quote, Star } from "lucide-react";

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

export interface TestimonialCardData {
  id: string;
  name: string;
  businessName: string;
  role: string;
  photo: TestimonialPhoto | null;
  testimonial: string;
  rating: number | null;
}

interface TestimonialCardProps {
  testimonial: TestimonialCardData;
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

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function getValidRating(
  rating: number | null,
) {
  if (
    typeof rating !== "number" ||
    !Number.isFinite(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return null;
  }

  return Math.round(rating);
}

export default function TestimonialCard({
  testimonial,
}: TestimonialCardProps) {
  const initials = getInitials(
    testimonial.name,
  );

  const rating = getValidRating(
    testimonial.rating,
  );

  const meta = [
    testimonial.businessName,
    testimonial.role,
  ].filter(Boolean);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#061A2B]/[0.08] bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#0D6E91]/20 hover:shadow-[0_20px_55px_rgba(6,26,43,0.09)] sm:p-7">
      {/* Top row */}
      <div className="flex items-start justify-between gap-5">
        {/* Customer identity */}
        <div className="flex min-w-0 items-center gap-3.5">
          {testimonial.photo?.secureUrl ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#061A2B]/5">
              <Image
                src={
                  testimonial.photo
                    .secureUrl
                }
                alt={
                  testimonial.photo.alt ||
                  testimonial.name
                }
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-xs font-bold text-[#FFD400]">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold tracking-[-0.01em] text-[#061A2B]">
              {testimonial.name}
            </h3>

            {meta.length > 0 ? (
              <p className="mt-0.5 truncate text-[11px] text-[#061A2B]/40">
                {meta.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Quote mark */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0D6E91]/[0.07] text-[#0D6E91]">
          <Quote
            size={15}
            strokeWidth={1.8}
          />
        </div>
      </div>

      {/* Rating */}
      {rating ? (
        <div className="mt-5 flex items-center gap-1">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              size={13}
              fill={
                index < rating
                  ? "currentColor"
                  : "none"
              }
              className={
                index < rating
                  ? "text-[#F5B800]"
                  : "text-[#061A2B]/10"
              }
            />
          ))}

          <span className="ml-1 text-[10px] font-semibold text-[#061A2B]/30">
            {rating}/5
          </span>
        </div>
      ) : null}

      {/* Testimonial */}
      <blockquote className="mt-6 flex-1 text-[15px] leading-7 text-[#061A2B]/65">
        “{testimonial.testimonial}”
      </blockquote>

      {/* Bottom accent */}
      <div className="mt-7 flex items-center gap-3 border-t border-[#061A2B]/[0.07] pt-5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

        <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#061A2B]/30">
          Customer experience
        </span>

        <span className="ml-auto h-px w-8 bg-[#061A2B]/10 transition-all duration-300 group-hover:w-12 group-hover:bg-[#0D6E91]/30" />
      </div>
    </article>
  );
}