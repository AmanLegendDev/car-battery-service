import ContactHero from "./hero/ContactHero";
import ContactInformation from "./information/ContactInformation";
import ContactBookingCTA from "./booking/ContactBookingCTA";
import ContactServices from "./services/ContactServices";
import ContactServiceArea from "./area/ContactServiceArea";

export interface ContactBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

export interface ContactService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;
}

interface ContactPageProps {
  business: ContactBusiness;
  services: ContactService[];
}

export default function ContactPage({
  business,
  services,
}: ContactPageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ContactHero business={business} />

      <ContactInformation
        business={business}
      />

      <ContactServices
        services={services}
      />

      <ContactBookingCTA
        businessName={business.businessName}
      />

      <ContactServiceArea
        business={business}
      />
    </div>
  );
}