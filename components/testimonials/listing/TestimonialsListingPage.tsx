import FeaturedTestimonial from "./featured/FeaturedTestimonial";
import TestimonialsDirectory from "./directory/TestimonialsDirectory";
import TestimonialsEmptyState from "./empty/TestimonialsEmptyState";
import TestimonialsListingCTA from "./cta/TestimonialsListingCTA";
import TestimonialsListingHero from "./hero/TestimonialsListingHero";

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

export interface PublicTestimonial {
  id: string;
  name: string;
  businessName: string;
  role: string;
  photo: TestimonialPhoto | null;
  testimonial: string;
  rating: number | null;
  featured: boolean;
  displayOrder: number;
}

export interface TestimonialsBusiness {
  businessName: string;
  primaryServiceRegion: string;
  phone: string;
  whatsapp: string;
}

interface TestimonialsListingPageProps {
  testimonials: PublicTestimonial[];
  business: TestimonialsBusiness;
}

export default function TestimonialsListingPage({
  testimonials,
  business,
}: TestimonialsListingPageProps) {
  const featuredTestimonials =
    testimonials.filter(
      (testimonial) =>
        testimonial.featured,
    );

  const featuredTestimonial =
    featuredTestimonials[0] ||
    testimonials[0] ||
    null;

  const remainingTestimonials =
    featuredTestimonial
      ? testimonials.filter(
          (testimonial) =>
            testimonial.id !==
            featuredTestimonial.id,
        )
      : testimonials;

  const hasTestimonials =
    testimonials.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <TestimonialsListingHero
        testimonialCount={testimonials.length}
        region={business.primaryServiceRegion}
        businessName={business.businessName}
      />

      {/* =====================================================
          FEATURED EXPERIENCE
      ====================================================== */}

      {hasTestimonials && featuredTestimonial ? (
        <FeaturedTestimonial
          testimonial={{
            id: featuredTestimonial.id,

            name: featuredTestimonial.name,

            businessName:
              featuredTestimonial.businessName ??
              "",

            role:
              featuredTestimonial.role ??
              "",

            photo:
              featuredTestimonial.photo ??
              null,

            testimonial:
              featuredTestimonial.testimonial,

            rating:
              featuredTestimonial.rating ??
              null,
          }}
        />
      ) : null}

      {/* =====================================================
          DIRECTORY
      ====================================================== */}

      {remainingTestimonials.length > 0 ? (
        <TestimonialsDirectory
          testimonials={remainingTestimonials}
        />
      ) : null}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!hasTestimonials ? (
        <TestimonialsEmptyState
          businessName={business.businessName}
        />
      ) : null}

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <TestimonialsListingCTA
        businessName={business.businessName}
        phone={business.phone}
      />
    </div>
  );
}