import FAQsListingHero from "./hero/FAQsListingHero";

import FeaturedFAQ from "./featured/FeaturedFAQ";

import FAQsDirectory from "./directory/FAQsDirectory";

import RelatedFAQServices, {
  type RelatedFAQService,
} from "./related/RelatedFAQServices";

import RelatedFAQServiceAreas, {
  type RelatedFAQServiceArea,
} from "./related/RelatedFAQServiceAreas";

import FAQsEmptyState from "./empty/FAQsEmptyState";

import FAQsListingCTA from "./cta/FAQsListingCTA";

export interface PublicFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedServices: string[];
  relatedServiceAreas: string[];
  featured: boolean;
  displayOrder: number;
}

export interface FAQsBusiness {
  businessName: string;
  primaryServiceRegion: string;
  phone: string;
  whatsapp: string;
}

interface FAQsListingPageProps {
  faqs: PublicFAQ[];
  business: FAQsBusiness;
  relatedServices: RelatedFAQService[];
  relatedServiceAreas: RelatedFAQServiceArea[];
}

export default function FAQsListingPage({
  faqs,
  business,
  relatedServices,
  relatedServiceAreas,
}: FAQsListingPageProps) {
  const featuredFAQs = faqs.filter(
    (faq) => faq.featured,
  );

  const featuredFAQ =
    featuredFAQs[0] ||
    faqs[0] ||
    null;

  const remainingFAQs = featuredFAQ
    ? faqs.filter(
        (faq) => faq.id !== featuredFAQ.id,
      )
    : faqs;

  const hasFAQs = faqs.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <FAQsListingHero
        faqCount={faqs.length}
        region={business.primaryServiceRegion}
        businessName={business.businessName}
      />

      {/* =====================================================
          FEATURED FAQ
      ====================================================== */}

      {hasFAQs ? (
        <FeaturedFAQ faq={featuredFAQ} />
      ) : null}

      {/* =====================================================
          FAQ DIRECTORY
      ====================================================== */}

      {remainingFAQs.length > 0 ? (
        <FAQsDirectory
          faqs={remainingFAQs}
        />
      ) : null}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!hasFAQs ? (
        <FAQsEmptyState
          businessName={business.businessName}
        />
      ) : null}

      {/* =====================================================
          RELATED SERVICES
      ====================================================== */}

      {relatedServices.length > 0 ? (
        <RelatedFAQServices
          services={relatedServices}
        />
      ) : null}

      {/* =====================================================
          RELATED SERVICE AREAS
      ====================================================== */}

      {relatedServiceAreas.length > 0 ? (
        <RelatedFAQServiceAreas
          serviceAreas={relatedServiceAreas}
        />
      ) : null}

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <FAQsListingCTA
        businessName={business.businessName}
        phone={business.phone}
      />
    </div>
  );
}