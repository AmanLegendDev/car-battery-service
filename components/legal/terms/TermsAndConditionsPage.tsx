
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Mail,
  Phone,
} from "lucide-react";

import TermsHero from "./hero/TermsHero";
import TermsContents from "./navigation/TermsContents";
import TermsSection from "./sections/TermsSection";

export interface TermsBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

interface TermsAndConditionsPageProps {
  business: TermsBusiness;
}

const TERMS_SECTIONS = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    paragraphs: [
      "These Terms and Conditions set out the general terms that apply when you use this website or request products or services from Rapid Auto Services.",
      "By using this website, submitting a booking request or engaging the business for a service, you acknowledge that you have had an opportunity to review these terms.",
    ],
  },
  {
    id: "services",
    number: "02",
    title: "Our Services",
    paragraphs: [
      "Rapid Auto Services provides automotive services and assistance according to the services offered by the business at the time of your request.",
      "Available services may include vehicle maintenance, inspections, repairs, roadside assistance or other automotive work where offered. The services available to you depend on the business's actual service offering and your vehicle's requirements.",
      "The appropriate service may depend on the condition of the vehicle, the information you provide and the circumstances identified during assessment.",
    ],
  },
  {
    id: "bookings",
    number: "03",
    title: "Bookings and Service Requests",
    paragraphs: [
      "Service requests should be submitted through the designated booking process on this website or another booking method offered by the business.",
      "Submitting a booking request does not automatically guarantee a particular appointment time, product, service or outcome. Availability and service arrangements may need to be confirmed by the business.",
      "The information submitted during a booking should be accurate and complete to the best of your knowledge.",
    ],
  },
  {
    id: "customer-information",
    number: "04",
    title: "Customer Information",
    paragraphs: [
      "You are responsible for providing accurate information relevant to your service request.",
      "This may include your contact details, vehicle make and model, vehicle location, information about the issue and other details reasonably required to assess your request.",
      "If the information provided is inaccurate, incomplete or materially changes, the service requirements, quoted price or available options may also change.",
    ],
  },
  {
    id: "service-assessment",
    number: "05",
    title: "Assessment and Service Outcome",
    paragraphs: [
      "A vehicle problem cannot always be diagnosed solely from information provided through a booking form, email or telephone conversation.",
      "Where an assessment is required, the recommended service may depend on the actual condition of the vehicle and its relevant components.",
      "An inspection, repair or replacement of an individual component may not resolve an underlying fault elsewhere in the vehicle. Any recommendations will depend on the findings and circumstances of the assessment.",
    ],
  },
  {
    id: "vehicle-access",
    number: "06",
    title: "Vehicle Access and Site Conditions",
    paragraphs: [
      "You are responsible for providing reasonable access to the vehicle and the relevant work area for the requested service.",
      "You should inform the business of circumstances that may affect access, safety or the ability to carry out the requested work.",
      "If the location or circumstances make the requested work unsafe or impractical, the service may need to be modified, delayed or declined. Any applicable charges or alternative arrangements should be communicated to you, subject to applicable law.",
    ],
  },
  {
    id: "pricing",
    number: "07",
    title: "Pricing and Charges",
    paragraphs: [
      "Applicable prices and charges will be communicated as part of the relevant service arrangement.",
      "The price may depend on factors including the service required, vehicle requirements, products or parts supplied and other circumstances relevant to the request.",
      "Information on this website should not be treated as a fixed quotation unless the business has expressly provided a quotation. Any changes to an agreed price should be communicated appropriately and handled in accordance with applicable law.",
    ],
  },
  {
    id: "payment",
    number: "08",
    title: "Payment",
    paragraphs: [
      "Where payment is required, the applicable payment method and payment requirements will be communicated as part of the relevant transaction.",
      "You agree to pay amounts properly due for products or services supplied, subject to any rights and remedies available to you under applicable consumer law.",
      "Nothing in this section limits any right or remedy available to you under the Australian Consumer Law.",
    ],
  },
  {
    id: "cancellations",
    number: "09",
    title: "Cancellations and Changes",
    paragraphs: [
      "If you need to cancel or change a service request, you should contact the business as soon as reasonably possible.",
      "Any applicable cancellation or rescheduling arrangements will depend on the circumstances and any specific terms communicated to you when the booking is made.",
      "Nothing in this section excludes or limits cancellation, refund or other rights that apply under Australian law.",
    ],
  },
  {
    id: "products-and-parts",
    number: "10",
    title: "Products and Parts Supplied",
    paragraphs: [
      "Where a product, replacement part or other item is supplied as part of a service, it should correspond with the service arrangement and information provided at the time of the transaction.",
      "Product and parts availability may depend on the vehicle and the requirements identified for the service.",
      "Any applicable consumer guarantees relating to goods continue to apply and cannot be excluded by these terms.",
    ],
  },
  {
    id: "consumer-guarantees",
    number: "11",
    title: "Australian Consumer Law",
    paragraphs: [
      "Nothing in these Terms and Conditions excludes, restricts or modifies any consumer guarantee, right or remedy that cannot legally be excluded, restricted or modified under applicable law.",
      "Where the Australian Consumer Law applies, consumers have rights relating to goods and services supplied by the business.",
      "Applicable consumer guarantees for services include requirements concerning due care and skill, fitness for a purpose made known to the business where the relevant guarantee applies, and supply within a reasonable time where no timeframe has been agreed.",
    ],
  },
  {
    id: "consumer-remedies",
    number: "12",
    title: "Consumer Remedies",
    paragraphs: [
      "If a product or service does not meet an applicable consumer guarantee, you may have rights to a remedy depending on the nature and circumstances of the problem.",
      "Depending on the circumstances, available remedies may include having a problem rectified, a refund, cancellation, replacement or compensation for reasonably foreseeable loss or damage.",
      "The applicable remedy depends on the circumstances and the requirements of the Australian Consumer Law.",
    ],
  },
  {
    id: "consumer-guarantee-notice",
    number: "13",
    title: "Mandatory Consumer Guarantee Notice",
    paragraphs: [
      "The following notice applies to services supplied by the business where required under applicable Australian Consumer Law.",
    ],
  },
  {
    id: "website-use",
    number: "14",
    title: "Website Use",
    paragraphs: [
      "You must use this website lawfully and in a way that does not interfere with its operation or security.",
      "You must not knowingly attempt to gain unauthorised access, introduce malicious code, misuse website functionality or use the website for fraudulent or unlawful purposes.",
    ],
  },
  {
    id: "website-information",
    number: "15",
    title: "Website Information",
    paragraphs: [
      "The business aims to keep information on this website useful and accurate, but website information may change from time to time.",
      "Service descriptions, availability, pricing information, contact details and other website content may be updated when required.",
      "Website information should be considered together with the specific information and terms communicated to you for your service request.",
    ],
  },
  {
    id: "third-party-links",
    number: "16",
    title: "Third-Party Websites and Services",
    paragraphs: [
      "This website may contain links to third-party websites, platforms or services.",
      "Third-party websites are operated independently from this website. The business does not control their content, availability or policies.",
      "You should review the applicable terms and privacy policies of third-party services before using them.",
    ],
  },
  {
    id: "privacy",
    number: "17",
    title: "Privacy",
    paragraphs: [
      "Personal information submitted through this website or in connection with a service request may be handled in accordance with the business's Privacy Policy and applicable privacy laws.",
      "Please review the Privacy Policy for information about how personal information may be collected, used and handled.",
    ],
  },
  {
    id: "changes",
    number: "18",
    title: "Changes to These Terms",
    paragraphs: [
      "These Terms and Conditions may be updated from time to time to reflect changes to the business, services, website or applicable legal requirements.",
      "The updated version will be published on this website. Changes operate subject to applicable law and any rights that cannot legally be limited.",
      "Where relevant, specific terms agreed for an existing booking or transaction remain subject to the applicable agreement and legal requirements.",
    ],
  },
  {
    id: "contact",
    number: "19",
    title: "Contact Us",
    paragraphs: [
      "If you have a question about these Terms and Conditions, a service request or a consumer guarantee issue, contact the business using the contact details provided on this website.",
    ],
  },
] as const;

export default function TermsAndConditionsPage({
  business,
}: TermsAndConditionsPageProps) {
  const businessName =
    business.businessName?.trim() || "Rapid Auto Services";

  const phone =
    business.primaryCallNumber?.trim() ||
    business.phone?.trim() ||
    "";

  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : "";

  const email = business.email?.trim() || "";
  const emailHref = email ? `mailto:${email}` : "";
  const serviceRegion = business.primaryServiceRegion?.trim() || "";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TermsHero business={business} />

      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[270px_1fr] lg:gap-16">
          <TermsContents sections={TERMS_SECTIONS} />

          <article className="min-w-0">
            <div className="rounded-[2rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.04)] sm:p-8 lg:p-12">
              {/* Introduction Notice */}
              <div className="mb-10 flex items-start gap-4 rounded-[1.5rem] border border-[#0D6E91]/10 bg-[#F8FAFC] p-5 sm:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                  <BookOpen size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#061A2B]">
                    Please read these terms before booking.
                  </p>

                  <p className="mt-1 text-xs leading-6 text-[#5F7482]">
                    These terms explain the general conditions that apply
                    to website use, service requests and services supplied
                    by {businessName}.
                  </p>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="space-y-12">
                {TERMS_SECTIONS.map((section) => {
                  if (section.id === "consumer-guarantee-notice") {
                    return (
                      <TermsSection
                        key={section.id}
                        id={section.id}
                        number={section.number}
                        title={section.title}
                        paragraphs={section.paragraphs}
                        notice={
                          <div className="mt-6 rounded-[1.5rem] border border-[#0D6E91]/15 bg-[#F8FAFC] p-6 sm:p-7">
                            <p className="text-sm font-semibold leading-7 text-[#061A2B]">
                              Services come with guarantees that cannot be
                              excluded under the Australian Consumer Law.
                            </p>

                            <p className="mt-4 text-sm leading-7 text-[#5F7482]">
                              For a major failure with a service, you are
                              entitled to cancel your service contract with
                              us and are entitled to a refund for the unused
                              portion, or to compensation for its reduced
                              value.
                            </p>

                            <p className="mt-4 text-sm leading-7 text-[#5F7482]">
                              You are also entitled to be compensated for
                              any other reasonably foreseeable loss or damage.
                            </p>

                            <p className="mt-4 text-sm leading-7 text-[#5F7482]">
                              If the failure does not amount to a major
                              failure, you are entitled to have problems
                              with the service rectified in a reasonable
                              time and, if this is not done, to cancel your
                              service contract and obtain a refund for the
                              unused portion.
                            </p>
                          </div>
                        }
                      />
                    );
                  }

                  return (
                    <TermsSection
                      key={section.id}
                      id={section.id}
                      number={section.number}
                      title={section.title}
                      paragraphs={section.paragraphs}
                    />
                  );
                })}
              </div>

              {/* Contact Block */}
              <div className="mt-14 border-t border-[#08263D]/10 pt-10">
                <div className="rounded-[1.75rem] bg-[#061A2B] p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                      Questions About These Terms?
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#F8FAFC] sm:text-3xl">
                      Contact {businessName}.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[#A8BBC8]">
                      If you need clarification about these terms or a
                      service request, use the available contact options.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {phone && phoneHref ? (
                      <a
                        href={phoneHref}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
                      >
                        <Phone size={16} />
                        Call Us
                      </a>
                    ) : null}

                    {email && emailHref ? (
                      <a
                        href={emailHref}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/[0.09]"
                      >
                        <Mail size={16} />
                        Email Us
                      </a>
                    ) : null}

                    <Link
                      href="/contact"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/[0.09]"
                    >
                      Contact Page
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Legal Navigation */}
              <div className="mt-8 flex flex-col gap-4 border-t border-[#08263D]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs leading-6 text-[#A8BBC8]">
                    Business:{" "}
                    <span className="font-semibold text-[#5F7482]">
                      {businessName}
                    </span>
                  </p>

                  {serviceRegion ? (
                    <p className="mt-1 text-xs leading-6 text-[#A8BBC8]">
                      Primary service region:{" "}
                      <span className="font-semibold text-[#5F7482]">
                        {serviceRegion}
                      </span>
                    </p>
                  ) : null}
                </div>

                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#061A2B] transition hover:text-[#0D6E91]"
                >
                  Privacy Policy
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Legal Review Notice */}
              <div className="mt-5 rounded-xl bg-[#FFF7CC] px-4 py-3">
                <p className="text-[11px] leading-5 text-[#705D00]">
                  These terms are general business terms and should be
                  reviewed against the business's actual services, pricing,
                  booking arrangements and legal obligations before
                  publication. They are not a substitute for legal advice.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Final Booking CTA */}
      <section className="relative overflow-hidden bg-[#08263D] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#0D6E91]/20 blur-[100px]"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
              Ready to Book?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl">
              Need automotive assistance?
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#A8BBC8]">
              Explore the available services and submit your request
              through our dedicated booking page.
            </p>
          </div>

          <Link
            href="/book-service"
            className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
          >
            Book a Service
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
