import Link from "next/link";
import PrivacySection from "../sections/PrivacySection";

interface PrivacyBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

interface PrivacyContentsProps {
  business: PrivacyBusiness;
}

const sections = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
  },
  {
    id: "information-we-collect",
    number: "02",
    title: "Information We Collect",
  },
  {
    id: "how-we-use-information",
    number: "03",
    title: "How We Use Information",
  },
  {
    id: "sharing-information",
    number: "04",
    title: "Sharing Information",
  },
  {
    id: "data-storage-security",
    number: "05",
    title: "Data Storage & Security",
  },
  {
    id: "cookies",
    number: "06",
    title: "Cookies & Similar Technologies",
  },
  {
    id: "third-party-services",
    number: "07",
    title: "Third-Party Services",
  },
  {
    id: "your-rights",
    number: "08",
    title: "Your Rights & Choices",
  },
  {
    id: "children",
    number: "09",
    title: "Children's Privacy",
  },
  {
    id: "policy-changes",
    number: "10",
    title: "Changes to This Policy",
  },
  {
    id: "contact",
    number: "11",
    title: "Contact Us",
  },
];

export default function PrivacyContents({
  business,
}: PrivacyContentsProps) {
  const hasContactEmail = Boolean(business.email.trim());
  const hasPhone = Boolean(
    business.primaryCallNumber.trim() || business.phone.trim()
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        {/* Navigation */}
        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-[#08263D]/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0D6E91]">
              On this page
            </p>

            <nav className="mt-5 space-y-1" aria-label="Privacy Policy sections">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#061A2B]/65 transition hover:bg-[#F8FAFC] hover:text-[#061A2B]"
                >
                  <span className="font-mono text-[11px] text-[#0D6E91]">
                    {section.number}
                  </span>

                  <span>{section.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="min-w-0">
          <div className="mb-10 rounded-3xl border border-[#08263D]/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-7 text-[#061A2B]/70">
              This Privacy Policy explains how{" "}
              <strong className="font-semibold text-[#061A2B]">
                {business.businessName}
              </strong>{" "}
              handles personal information in connection with this website,
              enquiries, bookings and the mobile car battery services we
              provide.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#061A2B]/70">
              We aim to collect only information that is reasonably necessary
              for operating our website, responding to customers and providing
              requested services.
            </p>
          </div>

          <PrivacySection
            id="introduction"
            number="01"
            title="Introduction"
          >
            <p>
              This Privacy Policy applies to the Car Battery Service website
              and to personal information handled by the business in connection
              with its services.
            </p>

            <p>
              In this policy, references to <strong>“we”</strong>,{" "}
              <strong>“us”</strong> or <strong>“our”</strong> mean{" "}
              <strong>{business.businessName}</strong>.
            </p>

            <p>
              We respect the privacy of individuals and take reasonable steps
              to handle personal information appropriately and transparently.
            </p>

            <p>
              By using this website or providing information to us, you
              acknowledge that your information may be handled as described in
              this Privacy Policy.
            </p>
          </PrivacySection>

          <PrivacySection
            id="information-we-collect"
            number="02"
            title="Information We Collect"
          >
            <p>
              The information we collect depends on how you interact with the
              website and whether you request our services.
            </p>

            <h3>Information you provide</h3>

            <p>
              When you contact us, request a service, make a booking or
              otherwise communicate with us, you may provide information such
              as:
            </p>

            <ul>
              <li>Your name or other identifying details.</li>
              <li>Phone number and contact details.</li>
              <li>Email address, where provided.</li>
              <li>Vehicle-related information relevant to the requested service.</li>
              <li>Your vehicle location or service location.</li>
              <li>Details about the battery problem or assistance required.</li>
              <li>Information contained in messages or other communications you send us.</li>
            </ul>

            <p>
              You should avoid providing sensitive personal information unless
              it is genuinely necessary for your interaction with us.
            </p>

            <h3>Information collected through website use</h3>

            <p>
              Our website may also receive technical information associated
              with your visit, depending on the website configuration and
              services enabled at the time. This may include information such
              as your IP address, browser type, device information and basic
              interaction or diagnostic information.
            </p>

            <p>
              We do not state that every category of technical information is
              collected on every visit. Collection depends on the technologies
              actually enabled on the website.
            </p>
          </PrivacySection>

          <PrivacySection
            id="how-we-use-information"
            number="03"
            title="How We Use Information"
          >
            <p>
              Personal information may be used for purposes connected with
              operating the website and providing our services, including:
            </p>

            <ul>
              <li>Responding to enquiries and service requests.</li>
              <li>Arranging or managing requested bookings and services.</li>
              <li>Contacting you about a requested service.</li>
              <li>Understanding the vehicle or battery issue you have described.</li>
              <li>Providing mobile battery assistance at the requested location.</li>
              <li>Maintaining business and service records.</li>
              <li>Improving the website, services and customer experience.</li>
              <li>Protecting the website and business against misuse, fraud or security incidents.</li>
              <li>Complying with applicable legal or regulatory obligations.</li>
            </ul>

            <p>
              We will not use personal information for a purpose that is
              unrelated to the reason it was collected unless permitted or
              required by applicable law, or where appropriate consent has been
              obtained.
            </p>
          </PrivacySection>

          <PrivacySection
            id="sharing-information"
            number="04"
            title="Sharing Information"
          >
            <p>
              We do not treat customer personal information as information that
              is freely available for sale or public distribution.
            </p>

            <p>
              Where reasonably necessary to operate the business, provide
              requested services or comply with legal obligations, information
              may be disclosed to appropriate third parties.
            </p>

            <p>Depending on the circumstances, these may include:</p>

            <ul>
              <li>Technology and hosting providers.</li>
              <li>Website or software service providers.</li>
              <li>Communication providers used to respond to customers.</li>
              <li>Professional advisers where reasonably necessary.</li>
              <li>Government bodies, regulators or law-enforcement authorities where required or authorised by law.</li>
            </ul>

            <p>
              We aim to limit disclosures to information reasonably necessary
              for the relevant purpose.
            </p>

            <p>
              We do not currently describe any specific third-party customer
              data-sharing arrangement in this policy unless that service is
              actually used by the website or business.
            </p>
          </PrivacySection>

          <PrivacySection
            id="data-storage-security"
            number="05"
            title="Data Storage & Security"
          >
            <p>
              Personal information may be stored electronically using systems
              operated by us or by service providers supporting our business.
            </p>

            <p>
              We take reasonable steps appropriate to the circumstances to
              protect personal information from misuse, interference, loss and
              unauthorised access, modification or disclosure.
            </p>

            <p>
              Security measures may include access controls, authentication,
              restricted administrative access and appropriate technical
              safeguards.
            </p>

            <p>
              No method of transmission or electronic storage can be guaranteed
              to be completely secure. Accordingly, we cannot guarantee
              absolute security of information transmitted to or through the
              website.
            </p>

            <h3>Retention</h3>

            <p>
              We retain personal information only for as long as reasonably
              necessary for the purpose for which it was collected, for
              legitimate business purposes, or where retention is required or
              permitted by law.
            </p>

            <p>
              When information is no longer required, reasonable steps may be
              taken to securely delete, destroy or de-identify it, subject to
              applicable legal and operational requirements.
            </p>
          </PrivacySection>

          <PrivacySection
            id="cookies"
            number="06"
            title="Cookies & Similar Technologies"
          >
            <p>
              Cookies and similar technologies may be used by websites to
              support functionality, security, preferences, performance
              measurement or other technical purposes.
            </p>

            <p>
              The specific cookies or technologies used on this website depend
              on the website configuration and any third-party services
              enabled.
            </p>

            <p>
              Where browser controls allow it, you may be able to restrict or
              delete cookies through your browser settings. Doing so may affect
              some website functionality.
            </p>

            <p>
              We will not describe specific analytics, advertising or tracking
              cookies as being active unless those technologies are actually
              implemented on the website.
            </p>
          </PrivacySection>

          <PrivacySection
            id="third-party-services"
            number="07"
            title="Third-Party Services"
          >
            <p>
              The website may rely on third-party technology providers for
              hosting, infrastructure, media handling, communications, security
              or other technical functions.
            </p>

            <p>
              Where a third-party provider processes information on our behalf,
              we expect that provider to handle information in accordance with
              its own applicable terms, privacy documentation and legal
              obligations.
            </p>

            <p>
              Some third-party services may process information outside
              Australia. Where applicable, cross-border handling of personal
              information will be subject to the requirements of relevant
              Australian privacy law.
            </p>

            <p>
              This website may also contain links or communication options that
              take you to third-party services. Once you leave our website,
              those services are governed by their own privacy practices.
            </p>
          </PrivacySection>

          <PrivacySection
            id="your-rights"
            number="08"
            title="Your Rights & Choices"
          >
            <p>
              Depending on the circumstances and applicable law, you may have
              rights or choices concerning personal information we hold about
              you.
            </p>

            <p>These may include requesting:</p>

            <ul>
              <li>Access to personal information we hold about you.</li>
              <li>Correction of information that is inaccurate or incomplete.</li>
              <li>Information about how your personal information is handled.</li>
              <li>Action concerning personal information where you believe it has been handled unlawfully.</li>
            </ul>

            <p>
              Requests should provide enough information for us to identify the
              relevant records and understand what you are asking us to do.
            </p>

            <p>
              We may need to verify your identity before responding to a
              request. Some requests may be subject to legal exceptions or
              other limitations.
            </p>
          </PrivacySection>

          <PrivacySection
            id="children"
            number="09"
            title="Children's Privacy"
          >
            <p>
              Our services are intended for customers seeking vehicle and
              battery-related assistance. We do not knowingly seek to collect
              personal information from children through the website.
            </p>

            <p>
              If you believe a child has provided personal information to us
              unnecessarily, you may contact us so that we can consider the
              appropriate action.
            </p>
          </PrivacySection>

          <PrivacySection
            id="policy-changes"
            number="10"
            title="Changes to This Policy"
          >
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes to our business, website, technology, services or legal
              obligations.
            </p>

            <p>
              When changes are made, the updated version will be published on
              this page with an updated effective or revision date where
              appropriate.
            </p>

            <p>
              You should review this page periodically if you want to remain
              informed about how information is handled.
            </p>
          </PrivacySection>

          <PrivacySection
            id="contact"
            number="11"
            title="Contact Us"
          >
            <p>
              If you have a question about this Privacy Policy or want to make
              a privacy-related enquiry, you can contact us using the details
              available below.
            </p>

            <div className="mt-6 rounded-2xl border border-[#08263D]/10 bg-[#F8FAFC] p-5 sm:p-6">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-[#061A2B]">
                    {business.businessName}
                  </p>

                  {business.primaryServiceRegion && (
                    <p className="mt-1 text-[#061A2B]/60">
                      {business.primaryServiceRegion}
                    </p>
                  )}
                </div>

                {hasPhone && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0D6E91]">
                      Phone
                    </p>

                    <a
                      href={`tel:${
                        business.primaryCallNumber || business.phone
                      }`}
                      className="mt-1 inline-block text-[#061A2B] transition hover:text-[#0D6E91]"
                    >
                      {business.primaryCallNumber || business.phone}
                    </a>
                  </div>
                )}

                {hasContactEmail && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0D6E91]">
                      Email
                    </p>

                    <a
                      href={`mailto:${business.email}`}
                      className="mt-1 inline-block break-all text-[#061A2B] transition hover:text-[#0D6E91]"
                    >
                      {business.email}
                    </a>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#061A2B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#08263D]"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </PrivacySection>

          {/* Legal note */}
          <div className="mt-10 rounded-3xl border border-[#FFD400]/30 bg-[#FFD400]/10 p-6 sm:p-8">
            <p className="text-sm leading-7 text-[#061A2B]/75">
              <strong className="font-semibold text-[#061A2B]">
                Important:
              </strong>{" "}
              This Privacy Policy is intended to describe the website and
              business&apos;s general information-handling practices. It should
              be reviewed and adapted by the business or an appropriately
              qualified Australian legal/privacy professional before
              publication, particularly if the website introduces additional
              analytics, advertising, payment, booking, messaging or other
              third-party services.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}