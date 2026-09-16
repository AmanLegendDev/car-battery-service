import TestimonialCard from "./TestimonialCard";
import type { PublicTestimonial } from "../TestimonialsListingPage";

interface TestimonialsDirectoryProps {
  testimonials: PublicTestimonial[];
}

export default function TestimonialsDirectory({
  testimonials,
}: TestimonialsDirectoryProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#F8FAFC]"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#0D6E91]/[0.035] blur-[100px]" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#FFD400]/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Section header */}
        <div className="flex flex-col gap-8 border-b border-[#061A2B]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#0D6E91]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                More experiences
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B] sm:text-4xl lg:text-5xl">
              What customers
              <span className="text-[#061A2B]/30">
                {" "}
                shared.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#061A2B]/45 sm:text-base sm:leading-7">
              Read additional feedback shared by
              customers about their experience with
              Car Battery Service.
            </p>
          </div>

          {/* Count */}
          <div className="flex shrink-0 items-center gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[#061A2B]">
                {testimonials.length}
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#061A2B]/30">
                Experiences
              </p>
            </div>

            <span className="h-10 w-px bg-[#061A2B]/10" />

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#061A2B]/35">
              Published
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}