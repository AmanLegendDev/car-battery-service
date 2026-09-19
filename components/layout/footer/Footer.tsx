import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
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

interface FooterService {
  id: string;
  title: string;
  slug: string;
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

interface FooterData {
  settings: FooterSettings;
  services: FooterService[];
}

async function getFooterData(): Promise<FooterData> {
  await connectDB();

  const [settings, services] = await Promise.all([
    SiteSettings.findOne()
      .select(
        "businessName tagline description logo phone primaryCallNumber email primaryServiceRegion businessHours social"
      )
      .lean(),

    Service.find({
      status: "active",
    })
      .select("_id title slug")
      .sort({
        featured: -1,
        displayOrder: 1,
        title: 1,
      })
      .lean(),
  ]);

  return {
    settings: {
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
            alt:
              settings.logo.alt ||
              settings.businessName ||
              "Car Battery Service",
          }
        : null,

      phone: settings?.phone || "",

      primaryCallNumber:
        settings?.primaryCallNumber ||
        settings?.phone ||
        "",

      email: settings?.email || "",

      primaryServiceRegion:
        settings?.primaryServiceRegion || "",

      businessHours:
        settings?.businessHours || [],

      social: settings?.social || {},
    },

    services: services.map((service) => ({
      id: String(service._id),
      title: service.title,
      slug: service.slug,
    })),
  };
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatDay(
  day: FooterBusinessHour["day"]
) {
  return day.slice(0, 3);
}

function getEnabledHours(
  hours: FooterBusinessHour[]
) {
  return hours.filter(
    (hour) =>
      hour.enabled &&
      hour.open &&
      hour.close
  );
}

function isExternalUrl(value?: string) {
  if (!value) {
    return false;
  }

  return /^https?:\/\//i.test(value);
}

export default async function Footer() {
  const { settings, services } =
    await getFooterData();

  const enabledHours = getEnabledHours(
    settings.businessHours
  );

  const hasInstagram = isExternalUrl(
    settings.social.instagram
  );

  const hasFacebook = isExternalUrl(
    settings.social.facebook
  );

  const hasGoogleBusiness = isExternalUrl(
    settings.social.googleBusiness
  );

  const hasOtherSocial = isExternalUrl(
    settings.social.other
  );

  const hasSocial =
    hasInstagram ||
    hasFacebook ||
    hasGoogleBusiness ||
    hasOtherSocial;

  return (
    <footer className="relative overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />

        {/* Blue atmosphere */}
        <div className="absolute -left-64 -top-56 h-[600px] w-[600px] rounded-full bg-[#0D6E91]/[0.09] blur-[150px]" />

        <div className="absolute -right-64 top-[20%] h-[650px] w-[650px] rounded-full bg-[#0D6E91]/[0.07] blur-[160px]" />

        {/* Yellow atmosphere */}
        <div className="absolute bottom-[-300px] left-[42%] h-[600px] w-[600px] rounded-full bg-[#FFD400]/[0.025] blur-[150px]" />
      </div>

      {/* Large background word */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(6rem,20vw,20rem)] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.018]"
      >
        {settings.businessName}
      </div>

      <div className="relative mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <div className="border-b border-white/[0.08] py-16 sm:py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            {/* Brand */}
            <div>
              <div className="flex items-start gap-5">
                {/* Logo */}
                {settings.logo?.secureUrl ? (
                  <Link
                    href="/"
                    aria-label={`${settings.businessName} home`}
                    className="group shrink-0"
                  >
                    <div className="relative h-[76px] w-[76px] overflow-hidden rounded-[20px] border border-white/[0.09] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:-translate-y-1">
                      <Image
                        src={
                          settings.logo.secureUrl
                        }
                        alt={
                          settings.logo.alt ||
                          settings.businessName
                        }
                        fill
                        sizes="76px"
                        className="object-contain p-2.5"
                      />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/"
                    aria-label={`${settings.businessName} home`}
                    className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[20px] border border-white/[0.09] bg-[#08263D] text-2xl font-black text-[#FFD400]"
                  >
                    {settings.businessName
                      .charAt(0)
                      .toUpperCase()}
                  </Link>
                )}

                <div className="pt-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                    Mobile Battery Service
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                    {settings.businessName}
                  </h2>

                  {settings.tagline ? (
                    <p className="mt-1 text-sm text-[#A8BBC8]">
                      {settings.tagline}
                    </p>
                  ) : null}
                </div>
              </div>

              {settings.description ? (
                <p className="mt-8 max-w-2xl text-sm leading-7 text-[#A8BBC8]/80 sm:text-[15px] sm:leading-8">
                  {settings.description}
                </p>
              ) : null}

              {/* Contact */}
              <div className="mt-8 flex flex-wrap gap-3">
                {settings.primaryCallNumber ? (
                  <a
                    href={phoneHref(
                      settings.primaryCallNumber
                    )}
                    className="group inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 transition-all duration-200 hover:border-[#FFD400]/25 hover:bg-[#FFD400]/[0.05]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                      <Phone className="h-3.5 w-3.5" />
                    </span>

                    <span className="text-xs font-semibold text-[#F8FAFC]">
                      {settings.phone ||
                        settings.primaryCallNumber}
                    </span>
                  </a>
                ) : null}

                {settings.primaryServiceRegion ? (
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5">
                    <MapPin className="h-4 w-4 text-[#FFD400]" />

                    <span className="text-xs font-semibold text-[#A8BBC8]">
                      {settings.primaryServiceRegion}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* CTA */}
            <div className="lg:justify-self-end">
              <div className="max-w-md rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#FFD400] text-[#061A2B]">
                    <BatteryCharging
                      className="h-5 w-5"
                      strokeWidth={2}
                    />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718895]">
                    Need assistance?
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
                  Book a battery service at your vehicle&apos;s
                  location.
                </h3>

                <Link
                  href="/book-service"
                  className="group mt-6 inline-flex min-h-13 w-full items-center justify-between rounded-full bg-[#FFD400] px-5 text-sm font-extrabold text-[#061A2B] transition-all duration-200 hover:bg-[#F5B800]"
                >
                  <span>Book a Battery Service</span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div className="grid gap-12 border-b border-white/[0.08] py-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.9fr_0.75fr] lg:gap-14 lg:py-14">
          {/* Services */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                Services
              </p>
            </div>

            <nav
              aria-label="Services"
              className="mt-5 flex flex-col gap-2"
            >
              {services.length > 0 ? (
                services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group flex w-full max-w-[280px] items-center justify-between rounded-xl py-2 text-sm text-[#F8FAFC] transition-all duration-200 hover:pl-1 hover:text-[#FFD400]"
                  >
                    <span>{service.title}</span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 -translate-x-1 text-[#718895] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-[#FFD400] group-hover:opacity-100"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[#718895]">
                  Services currently unavailable.
                </p>
              )}

              <Link
                href="/services"
                className="group mt-2 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A8BBC8] transition-colors hover:text-[#FFD400]"
              >
                View all services

                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </nav>
          </div>

          {/* Explore */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D6E91]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                Explore
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-col gap-2.5"
            >
              <Link
                href="/"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                About
              </Link>

              <Link
                href="/service-areas"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Service Areas
              </Link>

              <Link
                href="/testimonials"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Testimonials
              </Link>

              <Link
                href="/faqs"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                FAQs
              </Link>

              <Link
                href="/blog"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Blog
              </Link>

              <Link
                href="/contact"
                className="w-fit py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Availability */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                Availability
              </p>
            </div>

            {enabledHours.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.025]">
                {enabledHours.map((hour, index) => (
                  <div
                    key={hour.day}
                    className={`flex items-center justify-between gap-4 px-4 py-2.5 ${
                      index !==
                      enabledHours.length - 1
                        ? "border-b border-white/[0.05]"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[11px] font-medium text-[#718895]">
                      <Clock3 className="h-3 w-3" />

                      {formatDay(hour.day)}
                    </span>

                    <span className="text-[11px] font-semibold text-[#F8FAFC]">
                      {hour.open} – {hour.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD400]" />

                  <p className="text-xs leading-5 text-[#A8BBC8]">
                    Contact the team for current service
                    availability.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connect */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D6E91]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                Connect
              </p>
            </div>

            {hasSocial ? (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {/* Instagram */}
                {hasInstagram ? (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="group flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/[0.08] bg-white/[0.025] text-[#A8BBC8] transition-all duration-200 hover:border-[#FFD400]/30 hover:bg-[#FFD400]/[0.07] hover:text-[#FFD400]"
                  >
                   <svg
  aria-hidden="true"
  viewBox="0 0 24 24"
  fill="none"
  className="h-[18px] w-[18px]"
>
  <rect
    x="3"
    y="3"
    width="18"
    height="18"
    rx="5"
    stroke="currentColor"
    strokeWidth="1.8"
  />

  <circle
    cx="12"
    cy="12"
    r="4"
    stroke="currentColor"
    strokeWidth="1.8"
  />

  <circle
    cx="17.5"
    cy="6.5"
    r="1"
    fill="currentColor"
  />
</svg>
                  </a>
                ) : null}

                {/* Google Business Profile */}
                {hasGoogleBusiness ? (
                  <a
                    href={
                      settings.social
                        .googleBusiness
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google Business Profile"
                    title="Google Business Profile"
                    className="group flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/[0.08] bg-white/[0.025] text-[#A8BBC8] transition-all duration-200 hover:border-[#FFD400]/30 hover:bg-[#FFD400]/[0.07] hover:text-[#FFD400]"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[16px] font-black"
                    >
                      G
                    </span>
                  </a>
                ) : null}

                {/* Facebook */}
                {hasFacebook ? (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="group flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/[0.08] bg-white/[0.025] text-[#A8BBC8] transition-all duration-200 hover:border-[#FFD400]/30 hover:bg-[#FFD400]/[0.07] hover:text-[#FFD400]"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[18px] font-black"
                    >
                      f
                    </span>
                  </a>
                ) : null}

                {/* Other */}
                {hasOtherSocial ? (
                  <a
                    href={settings.social.other}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social profile"
                    title="Social profile"
                    className="group flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/[0.08] bg-white/[0.025] text-[#A8BBC8] transition-all duration-200 hover:border-[#FFD400]/30 hover:bg-[#FFD400]/[0.07] hover:text-[#FFD400]"
                  >
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-[18px] w-[18px]"
                    />
                  </a>
                ) : null}
              </div>
            ) : (
              <div className="mt-5">
                <p className="max-w-[220px] text-xs leading-6 text-[#718895]">
                  Connect with the business online for
                  updates and useful information.
                </p>
              </div>
            )}

            {/* Email */}
            {settings.email ? (
              <a
                href={`mailto:${settings.email}`}
                className="group mt-6 flex w-fit items-center gap-2.5 text-xs text-[#A8BBC8] transition-colors hover:text-[#FFD400]"
              >
                <Mail className="h-3.5 w-3.5 text-[#FFD400]" />

                <span>{settings.email}</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* =====================================================
            TRUST / SERVICE STRIP
        ====================================================== */}

        <div className="border-b border-white/[0.08] py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                <CheckCircle2
                  className="h-4 w-4"
                  strokeWidth={2.2}
                />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F8FAFC]">
                  Mobile battery assistance
                </p>

                <p className="mt-1 text-[10px] text-[#718895]">
                  Battery replacement, testing and jump start
                  assistance
                </p>
              </div>
            </div>

            <Link
              href="/services"
              className="group inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8] transition-colors hover:text-[#FFD400]"
            >
              Explore services

              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* =====================================================
            LEGAL + SIGNATURE
        ====================================================== */}

        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-[10px] text-[#718895]">
              © {new Date().getFullYear()}{" "}
              {settings.businessName}. All rights reserved.
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/[0.15] sm:block" />

            <Link
              href="/privacy-policy"
              className="text-[10px] text-[#718895] transition-colors hover:text-[#F8FAFC]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-[10px] text-[#718895] transition-colors hover:text-[#F8FAFC]"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Aman Digital Solutions */}
          <a
            href="https://amandigitalsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 text-[10px] text-[#718895] transition-colors hover:text-[#F8FAFC]"
          >
            <span>Built with care by</span>

            <span className="font-semibold text-[#F8FAFC] group-hover:text-[#FFD400]">
              Aman Digital Solutions
            </span>

            <ArrowUpRight
              aria-hidden="true"
              className="h-3 w-3 text-[#FFD400] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}