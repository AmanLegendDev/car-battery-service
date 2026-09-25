"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  CreditCard,
  Phone,
} from "lucide-react";
import Link from "next/link";

import { HERO_DATA } from "./heroData";

interface HeroSettings {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  serviceRegion: string;
  bookingCta: string;
}

interface HeroContentProps {
  settings: HeroSettings | null;
}

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HeroContent({
  settings,
}: HeroContentProps) {
  const phoneNumber =
    settings?.phone || HERO_DATA.phone.number;

  const phoneHref = `tel:${phoneNumber.replace(
    /[^+\d]/g,
    "",
  )}`;

  const description =
    settings?.description ||
    HERO_DATA.description;

  const bookingLabel =
    settings?.bookingCta ||
    HERO_DATA.primaryCta.label;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={contentVariants}
      className="relative z-20 w-full max-w-[720px]"
    >
      {/* =========================================================
          EYEBROW
      ========================================================== */}
      <motion.div
        variants={itemVariants}
        className="mb-5 flex items-center gap-3 sm:mb-6 lg:mb-7"
      >
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-[#FFD400] shadow-[0_0_14px_rgba(255,212,0,0.7)]"
        />

        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B5C5D0] sm:text-[10px] sm:tracking-[0.22em] lg:text-[11px]">
          {HERO_DATA.eyebrow}
        </span>
      </motion.div>

      {/* =========================================================
          HEADLINE
      ========================================================== */}
      <motion.h1
        id="hero-heading"
        variants={itemVariants}
        className="max-w-[760px] text-[clamp(3rem,9.5vw,6.4rem)] font-black leading-[0.92] tracking-[-0.055em] text-[#F8FAFC] sm:text-[clamp(4rem,8vw,6.2rem)] lg:text-[clamp(4.5rem,6.3vw,6.4rem)]"
      >
        <span className="block">
          {HERO_DATA.title.lineOne}
        </span>

        <span className="mt-2 block text-[#FFD400] sm:mt-3">
          {HERO_DATA.title.lineTwo}
        </span>
      </motion.h1>

      {/* =========================================================
          DESCRIPTION
      ========================================================== */}
      <motion.p
        variants={itemVariants}
        className="mt-6 max-w-[540px] text-[14px] leading-6 text-[#B3C3CE] sm:mt-7 sm:text-[15px] sm:leading-7 lg:mt-8 lg:text-[16px] lg:leading-8"
      >
        {description}
      </motion.p>

      {/* =========================================================
          CTA BUTTONS
      ========================================================== */}
      <motion.div
        variants={itemVariants}
        className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center"
      >
        {/* Primary */}
        <Link
          href="/book-service"
          aria-label={bookingLabel}
          className="group inline-flex h-[54px] w-full items-center justify-center gap-3 rounded-2xl bg-[#FFD400] px-6 text-[14px] font-extrabold text-[#061A2B] shadow-[0_14px_40px_rgba(255,212,0,0.16)] transition-all duration-200 hover:bg-[#F5B800] hover:shadow-[0_18px_48px_rgba(255,212,0,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061A2B] active:scale-[0.985] sm:h-14 sm:w-auto sm:min-w-[145px]"
        >
          <Phone
            aria-hidden="true"
            className="h-[17px] w-[17px] transition-transform duration-200 group-hover:rotate-[-8deg]"
          />

          <span>{bookingLabel}</span>
        </Link>

        {/* Secondary */}
        <a
          href={phoneHref}
          aria-label={`Call ${phoneNumber}`}
          className="group inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl border border-white/[0.15] bg-[#08263D]/45 px-6 text-[14px] font-bold text-[#F8FAFC] shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-200 hover:border-white/[0.24] hover:bg-[#08263D]/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/50 active:scale-[0.985] sm:h-14 sm:w-auto sm:min-w-[175px]"
        >
          <span>Call Now</span>

          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </a>
      </motion.div>

      {/* =========================================================
          PAYMENT TRUST SIGNAL
          Compact enough for mobile, premium enough for desktop.
      ========================================================== */}
      <motion.div
        variants={itemVariants}
        className="mt-4 sm:mt-5"
      >
        <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/[0.09] bg-[#08263D]/55 px-3.5 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] backdrop-blur-md sm:px-4 sm:py-3"
        >
          {/* Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#FFD400]/15 bg-[#FFD400]/[0.07] text-[#FFD400]">
            <CreditCard
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </div>

          {/* Copy */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#F8FAFC] sm:text-[11px]">
                Accepted all types of payments
              </span>

              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#FFD400]">
                <Check
                  aria-hidden="true"
                  className="h-3 w-3"
                  strokeWidth={2.5}
                />
                Flexible
              </span>
            </div>

            <p className="mt-0.5 text-[9px] leading-4 text-[#8FA5B3] sm:text-[10px]">
              Afterpay · Zip Pay · PayPal · Apple Pay · Google Pay · Cards
            </p>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          PHONE DETAIL
      ========================================================== */}
      <motion.div
        variants={itemVariants}
        className="mt-5 flex items-center sm:mt-6"
      >
        <div className="relative flex items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-[#08263D]/55 shadow-[0_8px_25px_rgba(0,0,0,0.16)] backdrop-blur-md">
            <Phone
              aria-hidden="true"
              className="h-4 w-4 text-[#FFD400]"
            />
          </div>
        </div>

        <div className="ml-3.5">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#718895]">
            {HERO_DATA.phone.label}
          </span>

          <a
            href={phoneHref}
            className="mt-1 block text-[13px] font-bold tracking-[0.04em] text-[#F8FAFC] transition-colors duration-200 hover:text-[#FFD400] focus:outline-none focus-visible:text-[#FFD400]"
          >
            {phoneNumber}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}