import AboutHero from "./hero/AboutHero";
import AboutStory from "./story/AboutStory";
import AboutValues from "./values/AboutValues";
import AboutServices from "./services/AboutServices";
import AboutServiceArea from "./area/AboutServiceArea";
import AboutFinalCTA from "./cta/AboutFinalCTA";

export interface AboutBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

export interface AboutService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

interface AboutPageProps {
  business: AboutBusiness;
  services: AboutService[];
}

export default function AboutPage({
  business,
  services,
}: AboutPageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AboutHero
        business={business}
      />

      <AboutStory
        business={business}
      />

      <AboutValues
        business={business}
      />

      <AboutServices
        services={services}
      />

      <AboutServiceArea
        region={
          business.primaryServiceRegion
        }
      />

      <AboutFinalCTA
        businessName={
          business.businessName
        }
        region={
          business.primaryServiceRegion
        }
      />
    </div>
  );
}