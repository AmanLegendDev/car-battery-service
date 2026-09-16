import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import ContactInfoCard from "./ContactInfoCard";

interface ContactInformationProps {
  business: {
    businessName: string;
    tagline: string;
    description: string;
    phone: string;
    primaryCallNumber: string;
    whatsapp: string;
    email: string;
    primaryServiceRegion: string;
  };
}

export default function ContactInformation({
  business,
}: ContactInformationProps) {
  const phone =
    business.primaryCallNumber ||
    business.phone;

  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : undefined;

  const whatsappHref = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(
        /\D/g,
        "",
      )}`
    : undefined;

  const emailHref = business.email
    ? `mailto:${business.email}`
    : undefined;

  const hasContactOptions =
    Boolean(phone) ||
    Boolean(business.whatsapp) ||
    Boolean(business.email) ||
    Boolean(business.primaryServiceRegion);

  if (!hasContactOptions) {
    return null;
  }

  return (
    <section className="relative bg-[#F8FAFC] px-5 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          {/* Intro */}
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
              Contact Details
            </span>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#061A2B] sm:text-4xl">
              Choose the easiest way to reach us.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#5F7482]">
              {business.businessName} is available through
              the contact options configured for the business.
              When you need to arrange a service, you can use
              the dedicated booking page.
            </p>

            {business.primaryServiceRegion ? (
              <div className="mt-7 flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                  <MapPin size={17} />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#A8BBC8]">
                    Service Region
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#061A2B]">
                    {business.primaryServiceRegion}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {phone ? (
              <ContactInfoCard
                icon={Phone}
                eyebrow="Phone"
                title="Call directly"
                value={phone}
                href={phoneHref}
                accent="yellow"
              />
            ) : null}

            {business.whatsapp ? (
              <ContactInfoCard
                icon={MessageCircle}
                eyebrow="WhatsApp"
                title="Message us"
                value={business.whatsapp}
                href={whatsappHref}
                accent="blue"
              />
            ) : null}

            {business.email ? (
              <ContactInfoCard
                icon={Mail}
                eyebrow="Email"
                title="Send an email"
                value={business.email}
                href={emailHref}
                accent="blue"
              />
            ) : null}

            {business.primaryServiceRegion ? (
              <ContactInfoCard
                icon={MapPin}
                eyebrow="Location"
                title="Service region"
                value={
                  business.primaryServiceRegion
                }
                accent="yellow"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}