
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";
import FooterAnimatedLogo from "./FooterAnimatedLogo";

interface FooterMedia {
  secureUrl: string;
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

const DEFAULT_SETTINGS: FooterSettings = {
  businessName: "Mobile Car Services",
  tagline: "Automotive Care & Repairs",
  description:
    "Get in touch with Mobile Car Services to discuss your vehicle's needs, explore available services and find out about service availability in your area.",
  logo: null,
  phone: "",
  primaryCallNumber: "",
  email: "",
  primaryServiceRegion: "Melbourne West",
  businessHours: [],
  social: {},
};

async function getFooterData(): Promise<FooterData> {
  await connectDB();

  const [settings, services] = await Promise.all([
    SiteSettings.findOne()
      .select(
        "businessName tagline description logo phone primaryCallNumber email primaryServiceRegion businessHours social",
      )
      .lean(),

    Service.find({ status: "active" })
      .select("_id title slug")
      .sort({
        featured: -1,
        displayOrder: 1,
        title: 1,
      })
      .limit(6)
      .lean(),
  ]);

  const businessName =
    settings?.businessName || DEFAULT_SETTINGS.businessName;

  const logo = settings?.logo?.secureUrl
    ? {
        secureUrl: settings.logo.secureUrl,
        alt: settings.logo.alt || businessName,
      }
    : null;

  return {
    settings: {
      businessName,
      tagline: settings?.tagline || DEFAULT_SETTINGS.tagline,
      description:
        settings?.description || DEFAULT_SETTINGS.description,
      logo,
      phone: settings?.phone || "",
      primaryCallNumber:
        settings?.primaryCallNumber || settings?.phone || "",
      email: settings?.email || "",
      primaryServiceRegion:
        settings?.primaryServiceRegion ||
        DEFAULT_SETTINGS.primaryServiceRegion,
      businessHours: Array.isArray(settings?.businessHours)
        ? settings.businessHours
        : [],
      social: settings?.social || {},
    },

    services: services.map((service) => ({
      id: String(service._id),
      title: service.title,
      slug: service.slug,
    })),
  };
}

function phoneHref(phone: string): string | undefined {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

function isExternalUrl(value?: string): boolean {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function formatDay(day: FooterBusinessHour["day"]) {
  return day.slice(0, 3);
}

function getEnabledHours(hours: FooterBusinessHour[]) {
  return hours.filter(
    (hour) => hour.enabled && hour.open && hour.close,
  );
}



export default async function Footer() {
  
  let data: FooterData = {
    settings: DEFAULT_SETTINGS,
    services: [],
  };

  try {
    data = await getFooterData();
  } catch (error) {
    console.error("Failed to load footer data:", error);
  }

  const { settings, services } = data;
  const enabledHours = getEnabledHours(settings.businessHours);
  const callHref = phoneHref(
    settings.primaryCallNumber || settings.phone,
  );

  const socialLinks = [
    {
      label: "Instagram",
      url: settings.social.instagram,
      mark: "ig",
    },
    {
      label: "Facebook",
      url: settings.social.facebook,
      mark: "f",
    },
    {
      label: "Google Business Profile",
      url: settings.social.googleBusiness,
      mark: "G",
    },
    {
      label: "Other social profile",
      url: settings.social.other,
      mark: "↗",
    },
  ].filter((item) => isExternalUrl(item.url));

  

  return (
    <footer className="relative isolate overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="absolute -left-64 -top-56 h-[600px] w-[600px] rounded-full bg-[#0D6E91]/[0.09] blur-[150px]" />

        <div className="absolute -right-64 top-[20%] h-[650px] w-[650px] rounded-full bg-[#0D6E91]/[0.07] blur-[160px]" />

        <div className="absolute bottom-[-300px] left-[42%] h-[600px] w-[600px] rounded-full bg-[#FFD400]/[0.025] blur-[150px]" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(5rem,16vw,18rem)] font-black uppercase leading-none tracking-[-0.1em] text-white/[0.018]"
      >
        RAPID
      </div>

      <div className="relative mx-auto max-w-[1420px] px-5 sm:px-6 lg:px-8">
        {/* Brand and primary CTA */}
        <div className="border-b border-white/[0.08] py-16 sm:py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
            <div>
              
<div className="flex items-start gap-5">
                <FooterAnimatedLogo
                  businessName={settings.businessName}
                  logo={settings.logo}
                />

                <div className="min-w-0 pt-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                    Automotive Care &amp; Repairs
                  </p>

                  <h2 className="mt-2 break-words text-2xl font-black tracking-[-0.04em] text-[#F8FAFC] sm:text-3xl">
                    {settings.businessName}
                  </h2>

                  {settings.tagline && (
                    <p className="mt-1 text-sm text-[#A8BBC8]">
                      {settings.tagline}
                    </p>
                  )}
                </div>
              </div>


              {settings.description && (
                <p className="mt-8 max-w-2xl text-sm leading-7 text-[#A8BBC8]/90 sm:text-[15px] sm:leading-8">
                  {settings.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {callHref && (
                  <a
                    href={callHref}
                    className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 transition-colors hover:border-[#FFD400]/25 hover:bg-[#FFD400]/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                      <Phone
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                    </span>

                    <span className="text-xs font-semibold text-[#F8FAFC]">
                      {settings.phone || settings.primaryCallNumber}
                    </span>
                  </a>
                )}

                {settings.primaryServiceRegion && (
                  <div className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2">
                    <MapPin
                      aria-hidden="true"
                      className="h-4 w-4 text-[#FFD400]"
                    />

                    <span className="text-xs font-semibold text-[#A8BBC8]">
                      {settings.primaryServiceRegion}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking card */}
            <div className="lg:justify-self-end">
              <div className="max-w-md rounded-[26px] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="flex items-center justify-between gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#FFD400] text-[#061A2B]">
                    <Wrench
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                    Need automotive assistance?
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">
                  Let&apos;s discuss what your vehicle needs.
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#A8BBC8]">
                  Explore the available services and take the next step.
                </p>

                <Link
                  href="/book-service"
                  className="group mt-6 inline-flex min-h-13 w-full items-center justify-between gap-3 rounded-full bg-[#FFD400] px-5 text-sm font-extrabold text-[#061A2B] transition-colors duration-200 hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8FAFC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B]"
                >
                  <span>Book a Service</span>

                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#061A2B] text-[#FFD400] transition-transform duration-300 motion-safe:group-hover:rotate-45"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="grid gap-12 border-b border-white/[0.08] py-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_0.9fr_0.75fr] lg:gap-14 lg:py-14">
          {/* Services */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                Services
              </p>
            </div>

            <nav aria-label="Services" className="mt-5 flex flex-col gap-2">
              {services.length > 0 ? (
                services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="group flex w-full max-w-[280px] items-center justify-between gap-3 rounded-xl py-2 text-sm text-[#F8FAFC] transition-colors duration-200 hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    <span>{service.title}</span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-[#A8BBC8] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-[#FFD400] group-hover:opacity-100"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[#A8BBC8]">
                  Explore our available automotive services.
                </p>
              )}

              <Link
                href="/services"
                className="group mt-2 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#A8BBC8] transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
              >
                View all services
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
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
              className="mt-5 flex flex-col items-start gap-2.5"
            >
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Service Areas", href: "/service-areas" },
                { label: "Testimonials", href: "/testimonials" },
                { label: "FAQs", href: "/faqs" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-0.5 text-sm text-[#F8FAFC] transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Business hours */}
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A8BBC8]">
                Business Hours
              </p>
            </div>

            {enabledHours.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.025]">
                {enabledHours.map((hour, index) => (
                  <div
                    key={hour.day}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
                      index !== enabledHours.length - 1
                        ? "border-b border-white/[0.05]"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 text-[11px] font-medium text-[#A8BBC8]">
                      <Clock3
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0"
                      />
                      {formatDay(hour.day)}
                    </span>

                    <span className="text-right text-[11px] font-semibold text-[#F8FAFC]">
                      {hour.open} – {hour.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[18px] border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-start gap-3">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD400]"
                  />

                  <p className="text-xs leading-5 text-[#A8BBC8]">
                    Contact the team to confirm current service
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

            {socialLinks.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label} (opens in a new tab)`}
                    title={item.label}
                    className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-white/[0.08] bg-white/[0.025] text-sm font-bold text-[#A8BBC8] transition-colors duration-200 hover:border-[#FFD400]/30 hover:bg-[#FFD400]/[0.07] hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
                  >
                    {item.mark}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-5 max-w-[220px] text-xs leading-6 text-[#A8BBC8]">
                Contact our team for information about available services.
              </p>
            )}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="group mt-6 flex w-fit max-w-full items-start gap-2.5 break-all text-xs text-[#A8BBC8] transition-colors hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
              >
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFD400]"
                />
                <span>{settings.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* Service area */}
        <div className="border-b border-white/[0.08] py-10 sm:py-12">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#FFD400] text-[#061A2B]">
                <MapPin
                  aria-hidden="true"
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#FFD400]">
                  Service Areas
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                  Looking for service in your area?
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Explore our published service areas to review local
                  coverage details and find out whether the service you
                  need is available at your location.
                </p>

                {settings.primaryServiceRegion && (
                  <p className="mt-3 text-xs font-semibold text-[#F8FAFC]">
                    Primary service region: {settings.primaryServiceRegion}
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/service-areas"
              className="group inline-flex min-h-11 w-fit shrink-0 items-center gap-3 rounded-full border border-white/15 px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#F8FAFC] transition-colors hover:border-[#FFD400]/50 hover:text-[#FFD400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
            >
              Explore Areas
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Legal and credit */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="text-[10px] text-[#A8BBC8]">
              © {new Date().getFullYear()} {settings.businessName}.
              All rights reserved.
            </span>

            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-white/20 sm:block"
            />

            <Link
              href="/privacy-policy"
              className="text-[10px] text-[#A8BBC8] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-[10px] text-[#A8BBC8] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          <a
            href="https://amandigitalsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-2 text-[10px] text-[#A8BBC8] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]"
          >
            <span>Built with care by</span>

            <span className="font-semibold text-[#F8FAFC] transition-colors group-hover:text-[#FFD400]">
              Aman Digital Solutions
            </span>

            <ArrowUpRight
              aria-hidden="true"
              className="h-3 w-3 text-[#FFD400] transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
