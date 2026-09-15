import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

interface FooterMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface FooterBusinessHour {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  enabled: boolean;
  open?: string;
  close?: string;
}

interface FooterSocial {
  instagram?: string;
  facebook?: string;
  googleBusiness?: string;
  other?: string;
}

interface FooterSettings {
  businessName: string;
  tagline: string;
  description: string;
  logo: FooterMedia | null;

  phone: string;
  primaryCallNumber: string;
  email: string;

  primaryServiceRegion: string;

  businessHours: FooterBusinessHour[];

  social: FooterSocial;
}

async function getFooterSettings(): Promise<FooterSettings> {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName tagline description logo phone primaryCallNumber email primaryServiceRegion businessHours social",
    )
    .lean();

  return {
    businessName:
      settings?.businessName || "Car Battery Service",

    tagline: settings?.tagline || "",

    description: settings?.description || "",

    logo: settings?.logo
      ? {
          publicId: settings.logo.publicId,
          secureUrl: settings.logo.secureUrl,
          width: settings.logo.width,
          height: settings.logo.height,
          format: settings.logo.format,
          bytes: settings.logo.bytes,
          resourceType: "image",
          alt: settings.logo.alt,
        }
      : null,

    phone: settings?.phone || "",

    primaryCallNumber:
      settings?.primaryCallNumber || settings?.phone || "",

    email: settings?.email || "",

    primaryServiceRegion:
      settings?.primaryServiceRegion || "",

    businessHours: settings?.businessHours || [],

    social: settings?.social || {},
  };
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatDay(day: FooterBusinessHour["day"]) {
  return day.slice(0, 3);
}

function getEnabledHours(hours: FooterBusinessHour[]) {
  return hours.filter(
    (hour) =>
      hour.enabled &&
      hour.open &&
      hour.close,
  );
}

export default async function Footer() {
  const settings = await getFooterSettings();

  const enabledHours = getEnabledHours(
    settings.businessHours,
  );

  const hasSocial =
    Boolean(settings.social.instagram) ||
    Boolean(settings.social.facebook) ||
    Boolean(settings.social.googleBusiness) ||
    Boolean(settings.social.other);

  return (
    <footer className="relative overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#F8FAFC 1px, transparent 1px), linear-gradient(90deg, #F8FAFC 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Large background brand word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(7rem,21vw,22rem)] font-black uppercase leading-none tracking-[-0.09em] text-white/[0.018]"
      >
        {settings.businessName}
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* =================================================
            TOP BRAND AREA
        ================================================== */}

        <div className="grid gap-12 border-b border-white/10 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-24">
          {/* Brand */}
          <div>
            {/* Logo */}
            {settings.logo?.secureUrl ? (
              <Link
                href="/"
                aria-label={`${settings.businessName} home`}
                className="inline-flex"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white">
                  <Image
                    src={settings.logo.secureUrl}
                    alt={
                      settings.logo.alt ||
                      settings.businessName
                    }
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#08263D] text-lg font-bold text-[#FFD400]"
                aria-label={`${settings.businessName} home`}
              >
                {settings.businessName
                  .charAt(0)
                  .toUpperCase()}
              </Link>
            )}

            {/* Brand name */}
            <h2 className="mt-7 max-w-xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {settings.businessName}
            </h2>

            {settings.tagline && (
              <p className="mt-3 max-w-xl text-base text-[#A8BBC8]">
                {settings.tagline}
              </p>
            )}

            {settings.description && (
              <p className="mt-5 max-w-xl text-sm leading-6 text-[#A8BBC8]/75">
                {settings.description}
              </p>
            )}

            {/* Contact details */}
            <div className="mt-8 flex flex-col gap-3">
              {settings.primaryCallNumber && (
                <a
                  href={phoneHref(
                    settings.primaryCallNumber,
                  )}
                  className="group inline-flex w-fit items-center gap-3 text-sm font-medium text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <Phone className="h-3.5 w-3.5 text-[#FFD400]" />
                  </span>

                  {settings.phone}
                </a>
              )}

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="group inline-flex w-fit items-center gap-3 text-sm font-medium text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <Mail className="h-3.5 w-3.5 text-[#FFD400]" />
                  </span>

                  {settings.email}
                </a>
              )}

              {settings.primaryServiceRegion && (
                <div className="inline-flex w-fit items-center gap-3 text-sm font-medium text-[#A8BBC8]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <MapPin className="h-3.5 w-3.5 text-[#FFD400]" />
                  </span>

                  {settings.primaryServiceRegion}
                </div>
              )}
            </div>
          </div>

          {/* Closing CTA */}
          <div className="flex flex-col justify-end lg:items-end lg:text-right">
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#A8BBC8]">
              Need Battery Assistance?
            </span>

            <h3 className="mt-4 max-w-md text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:max-w-sm">
              Start with the
              <span className="block text-[#FFD400]">
                right next step.
              </span>
            </h3>

            <Link
              href="/book-service"
              className="group mt-7 inline-flex min-h-14 items-center justify-between gap-7 rounded-full bg-[#FFD400] px-5 py-2.5 text-sm font-bold text-[#061A2B] transition-all duration-300 hover:bg-[#F5B800] lg:min-w-[225px]"
            >
              <span>Book a Battery Service</span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <div className="grid gap-12 border-b border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
          {/* Services */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
              Services
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/mobile-car-battery-replacement/"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Car Battery Replacement
              </Link>

              <Link
                href="/car-battery-testing/"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Car Battery Testing
              </Link>

              <Link
                href="/car-jump-start/"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Jump Start Assistance
              </Link>

              <Link
                href="/services"
                className="mt-1 inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#A8BBC8] transition-colors hover:text-[#FFD400]"
              >
                View all services
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
              Explore
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                About
              </Link>

              <Link
                href="/service-areas"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Service Areas
              </Link>

              <Link
                href="/testimonials"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Testimonials
              </Link>

              <Link
                href="/faqs"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                FAQs
              </Link>

              <Link
                href="/blog"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Blog
              </Link>

              <Link
                href="/contact"
                className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Hours */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
              Availability
            </p>

            {enabledHours.length > 0 ? (
              <div className="mt-5 space-y-3">
                {enabledHours.map((hour) => (
                  <div
                    key={hour.day}
                    className="flex items-center justify-between gap-5 text-xs"
                  >
                    <span className="text-[#A8BBC8]">
                      {formatDay(hour.day)}
                    </span>

                    <span className="text-right font-medium text-[#F8FAFC]">
                      {hour.open} – {hour.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 max-w-xs text-sm leading-6 text-[#A8BBC8]">
                Contact the team for current service availability.
              </p>
            )}
          </div>

          {/* Social */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
              Connect
            </p>

            {hasSocial ? (
              <nav className="mt-5 flex flex-col gap-3">
                {settings.social.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                  >
                    Instagram
                  </a>
                )}

                {settings.social.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                  >
                    Facebook
                  </a>
                )}

                {settings.social.googleBusiness && (
                  <a
                    href={settings.social.googleBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                  >
                    Google Business Profile
                  </a>
                )}

                {settings.social.other && (
                  <a
                    href={settings.social.other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
                  >
                    Other
                  </a>
                )}
              </nav>
            ) : (
              <p className="mt-5 text-sm leading-6 text-[#A8BBC8]">
                Follow the business for updates and useful information.
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            LEGAL + SIGNATURE
        ================================================== */}

        <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-[11px] text-[#A8BBC8]/70">
              © {new Date().getFullYear()}{" "}
              {settings.businessName}. All rights reserved.
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <Link
              href="/privacy-policy"
              className="text-[11px] text-[#A8BBC8]/70 transition-colors hover:text-[#F8FAFC]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-[11px] text-[#A8BBC8]/70 transition-colors hover:text-[#F8FAFC]"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Aman Digital Solutions */}
          <div className="flex items-center gap-2 text-[11px] text-[#A8BBC8]/60">
            <span>Built with care by</span>

            <a
              href="https://amandigitalsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
            >
              Aman Digital Solutions
            </a>

            <ArrowUpRight className="h-3 w-3 text-[#FFD400]" />
          </div>
        </div>
      </div>
    </footer>
  );
}