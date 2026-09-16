import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  MapPin,
  Phone,
} from "lucide-react";

import { ABOUT_HERO } from "./aboutHeroData";

interface AboutHeroProps {
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

function getPhoneHref(phone: string) {
  const cleanedPhone = phone.replace(
    /[^\d+]/g,
    "",
  );

  return cleanedPhone
    ? `tel:${cleanedPhone}`
    : "";
}

export default function AboutHero({
  business,
}: AboutHeroProps) {
  const phone =
    business.primaryCallNumber ||
    business.phone;

  const phoneHref = getPhoneHref(phone);

  return (
    <section className="relative isolate overflow-hidden bg-[#061A2B]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#0D6E91]/20 blur-[110px]" />

        <div className="absolute -right-40 bottom-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#FFD400]/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(248,250,252,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          {/* Main content */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B]">
                <BatteryCharging size={14} />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                {ABOUT_HERO.eyebrow}
              </span>
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#F8FAFC] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
              Straightforward mobile battery{" "}
              <span className="text-[#FFD400]">
                assistance.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#A8BBC8] sm:text-lg">
              {business.description ||
                ABOUT_HERO.description}
            </p>

            {business.primaryServiceRegion ? (
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#F8FAFC]/75">
                <MapPin
                  size={16}
                  className="text-[#FFD400]"
                />

                <span>
                  Serving{" "}
                  <span className="font-semibold text-[#F8FAFC]">
                    {business.primaryServiceRegion}
                  </span>
                </span>
              </div>
            ) : null}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={ABOUT_HERO.primaryHref}
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#FFD400] px-7 text-sm font-bold text-[#061A2B] shadow-[0_10px_35px_rgba(255,212,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F5B800]"
              >
                {ABOUT_HERO.primaryCta}

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href={ABOUT_HERO.secondaryHref}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.045] px-7 text-sm font-semibold text-[#F8FAFC] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
              >
                {ABOUT_HERO.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Visual information card */}
          <div className="relative lg:justify-self-end lg:w-full lg:max-w-[30rem]">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2.5rem] bg-[#0D6E91]/10 blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#FFD400]/[0.07] blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
                    <BatteryCharging size={27} />
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                    Mobile Service
                  </span>
                </div>

                <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                  {business.businessName}
                </p>

                <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#F8FAFC] sm:text-3xl">
                  {business.tagline ||
                    "Mobile Car Battery Assistance"}
                </h2>

                <div className="mt-8 space-y-3">
                  {business.primaryServiceRegion ? (
                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D6E91]/25 text-[#FFD400]">
                        <MapPin size={18} />
                      </span>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A8BBC8]">
                          Service Region
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#F8FAFC]">
                          {business.primaryServiceRegion}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {phone ? (
                    <a
                      href={phoneHref}
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D6E91]/25 text-[#FFD400]">
                        <Phone size={18} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A8BBC8]">
                          Call
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[#F8FAFC]">
                          {phone}
                        </p>
                      </div>

                      <ArrowRight
                        size={16}
                        className="ml-auto shrink-0 text-[#A8BBC8] transition-transform group-hover:translate-x-1"
                      />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}