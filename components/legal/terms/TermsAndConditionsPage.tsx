import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
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
      "These Terms and Conditions set out the general terms that apply when you use this website or request products or services from Car Battery Service.",
      "By using this website, submitting a booking request or engaging the business for a service, you acknowledge that you have had an opportunity to review these terms.",
    ],
  },
  {
    id: "services",
    number: "02",
    title: "Our Services",
    paragraphs: [
      "Car Battery Service provides mobile assistance relating to vehicle batteries.",
      "Depending on the services available at the time of your request, this may include battery replacement, battery testing and jump start assistance.",
      "The appropriate service may depend on the condition of the vehicle, battery, information provided by you and the circumstances identified during assessment.",
    ],
  },
  {
    id: "bookings",
    number: "03",
    title: "Bookings and Service Requests",
    paragraphs: [
      "Service requests should be submitted through the designated booking process on this website.",
      "Submitting a booking request does not automatically guarantee a particular appointment time, battery, product or service outcome. Availability and service arrangements may need to be confirmed by the business.",
      "The information submitted during a booking should be accurate and complete to the best of your knowledge.",
    ],
  },
  {
    id: "customer-information",
    number: "04",
    title: "Customer Information",
    paragraphs: [
      "You are responsible for providing accurate information relevant to your service request.",
      "This may include information about your vehicle, vehicle location, battery symptoms, vehicle type and other details reasonably required to assess your request.",
      "If information provided is inaccurate, incomplete or materially changes, the service requirements or available options may also change.",
    ],
  },
  {
    id: "service-assessment",
    number: "05",
    title: "Assessment and Service Outcome",
    paragraphs: [
      "A battery-related problem cannot always be diagnosed solely from information provided through a booking form or telephone conversation.",
      "Where an assessment is required, the recommended service may depend on the actual condition of the battery, vehicle and relevant components.",
      "A battery replacement, testing service or jump start may not resolve an underlying vehicle fault that is unrelated to the battery itself.",
    ],
  },
  {
    id: "vehicle-access",
    number: "06",
    title: "Vehicle Access and Site Conditions",
    paragraphs: [
      "You are responsible for providing reasonable access to the vehicle for the requested service.",
      "You should inform the business of any circumstances that may affect access, safety or the ability to carry out the requested work.",
      "If circumstances at the vehicle location make the requested work unsafe or impractical, the service may need to be modified, delayed or declined.",
    ],
  },
  {
    id: "pricing",
    number: "07",
    title: "Pricing and Charges",
    paragraphs: [
      "Applicable prices or charges will be communicated as part of the relevant service arrangement.",
      "The price may depend on factors including the service required, vehicle or battery requirements, products or parts supplied and other circumstances relevant to the request.",
      "Information on this website should not be treated as a fixed quotation unless the business has expressly provided a quotation.",
    ],
  },
  {
    id: "payment",
    number: "08",
    title: "Payment",
    paragraphs: [
      "Where payment is required, the applicable payment method and payment requirements will be communicated as part of the relevant transaction.",
      "You agree to pay any amount properly due for the products or services supplied, subject to your rights under applicable consumer law.",
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
      "Nothing in this section limits any cancellation or remedy rights that may apply under Australian law.",
    ],
  },
  {
    id: "products-and-batteries",
    number: "10",
    title: "Batteries and Products Supplied",
    paragraphs: [
      "Where a battery or other product is supplied as part of a service, the product supplied should correspond with the service arrangement and information provided at the time of the transaction.",
      "Product availability may depend on the vehicle and battery requirements identified for the service.",
      "Any applicable consumer guarantees relating to goods continue to apply and cannot be excluded by these terms.",
    ],
  },
  {
    id: "consumer-guarantees",
    number: "11",
    title: "Australian Consumer Law",
    paragraphs: [
      "Nothing in these Terms and Conditions excludes, restricts or modifies any consumer guarantee, right or remedy that cannot legally be excluded, restricted or modified under applicable law.",
      "Where Australian Consumer Law applies, consumers have rights relating to goods and services supplied by the business.",
      "For services, applicable consumer guarantees include that services are provided with due care and skill, are reasonably fit for a purpose made known to the business where the relevant guarantee applies, and are supplied within a reasonable time where no timeframe has been agreed.",
    ],
  },
  {
    id: "consumer-remedies",
    number: "12",
    title: "Consumer Remedies",
    paragraphs: [
      "If a product or service does not meet an applicable consumer guarantee, you may have rights to a remedy depending on the nature and circumstances of the problem.",
      "Depending on the circumstances, available remedies can include having a problem rectified, a refund, cancellation, replacement or compensation for reasonably foreseeable loss or damage.",
      "The applicable remedy depends on the circumstances and the requirements of Australian Consumer Law.",
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
      "Service descriptions, availability, contact information and other website content may be updated when required.",
      "Information on this website should be considered together with the specific information communicated to you for your service request.",
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
      "Please review the Privacy Policy for information about how personal information is collected, used and handled.",
    ],
  },
  {
    id: "changes",
    number: "18",
    title: "Changes to These Terms",
    paragraphs: [
      "These Terms and Conditions may be updated from time to time to reflect changes to the business, services, website or applicable legal requirements.",
      "The version published on this website will apply from the date it is made available, subject to any rights that apply under law.",
    ],
  },
  {
    id: "contact",
    number: "19",
    title: "Contact Us",
    paragraphs: [
      "If you have a question about these Terms and Conditions, a service request or a consumer guarantee issue, you should contact the business using the contact details provided on this website.",
    ],
  },
] as const;

export default function TermsAndConditionsPage({
  business,
}: TermsAndConditionsPageProps) {
  const phone =
    business.primaryCallNumber ||
    business.phone;

  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, "")}`
    : "";

  const emailHref = business.email
    ? `mailto:${business.email}`
    : "";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TermsHero business={business} />

      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[270px_1fr] lg:gap-16">
          <TermsContents
            sections={TERMS_SECTIONS}
          />

          <article className="min-w-0">
            <div className="rounded-[2rem] border border-[#08263D]/10 bg-white p-6 shadow-[0_12px_40px_rgba(6,26,43,0.04)] sm:p-8 lg:p-12">
              <div className="mb-10 flex items-start gap-4 rounded-[1.5rem] border border-[#0D6E91]/10 bg-[#F8FAFC] p-5 sm:p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                  <BookOpen size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#061A2B]">
                    Please read these terms before booking.
                  </p>

                  <p className="mt-1 text-xs leading-6 text-[#5F7482]">
                    These terms explain the general conditions
                    that apply to website use, service requests
                    and services supplied by the business.
                  </p>
                </div>
              </div>

              <div className="space-y-12">
                {TERMS_SECTIONS.map(
                  (section) => {
                    if (
                      section.id ===
                      "consumer-guarantee-notice"
                    ) {
                      return (
                        <TermsSection
                          key={section.id}
                          id={section.id}
                          number={section.number}
                          title={section.title}
                          paragraphs={
                            section.paragraphs
                          }
                          notice={
                            <div className="mt-6 rounded-[1.5rem] border border-[#0D6E91]/15 bg-[#F8FAFC] p-6 sm:p-7">
                              <p className="text-sm font-semibold leading-7 text-[#061A2B]">
                                Services come with guarantees
                                that cannot be excluded under
                                the Australian Consumer Law.
                              </p>

                              <p className="mt-4 text-sm leading-7 text-[#5F7482]">
                                For a major failure with a
                                service, you are entitled to
                                cancel your service contract
                                with us and are entitled to a
                                refund for the unused portion,
                                or to compensation for its
                                reduced value.
                              </p>

                              <p className="mt-4 text-sm leading-7 text-[#5F7482]">
                                You are also entitled to be
                                compensated for any other
                                reasonably foreseeable loss
                                or damage.
                              </p>

                              <p className="mt-4 text-sm leading-7 text-[#5F7482]">
                                If the failure does not amount
                                to a major failure, you are
                                entitled to have problems with
                                the service rectified in a
                                reasonable time and, if this is
                                not done, to cancel your
                                service contract and obtain a
                                refund for the unused portion.
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
                        paragraphs={
                          section.paragraphs
                        }
                      />
                    );
                  },
                )}
              </div>

              {/* Contact block */}
              <div className="mt-14 border-t border-[#08263D]/10 pt-10">
                <div className="rounded-[1.75rem] bg-[#061A2B] p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                      Questions About These Terms?
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#F8FAFC] sm:text-3xl">
                      Contact {business.businessName}.
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[#A8BBC8]">
                      If you need clarification about these
                      terms or a service request, use the
                      available contact options.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    {phone && phoneHref ? (
                      <a
                        href={phoneHref}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
                      >
                        <Phone size={16} />
                        Call Us
                      </a>
                    ) : null}

                    {business.email &&
                    emailHref ? (
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

              {/* Bottom legal navigation */}
              <div className="mt-8 flex flex-col gap-4 border-t border-[#08263D]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs leading-6 text-[#A8BBC8]">
                    Business:{" "}
                    <span className="font-semibold text-[#5F7482]">
                      {business.businessName}
                    </span>
                  </p>

                  {business.primaryServiceRegion ? (
                    <p className="mt-1 text-xs leading-6 text-[#A8BBC8]">
                      Primary service region:{" "}
                      <span className="font-semibold text-[#5F7482]">
                        {
                          business.primaryServiceRegion
                        }
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

              <div className="mt-5 rounded-xl bg-[#FFF7CC] px-4 py-3">
                <p className="text-[11px] leading-5 text-[#705D00]">
                  These terms are general business terms and
                  should be reviewed for the business's specific
                  circumstances before publication. They are
                  not a substitute for legal advice.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Final booking CTA */}
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
              Continue to the dedicated booking page.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#A8BBC8]">
              Service requests are handled through the
              dedicated booking flow.
            </p>
          </div>

          <Link
            href="/book-service"
            className="group inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
          >
            Book a Battery Service
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