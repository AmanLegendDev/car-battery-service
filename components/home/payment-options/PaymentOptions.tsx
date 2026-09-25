"use client";

import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import PaymentOptionCard from "./PaymentOptionCard";
import {
  PAYMENT_CATEGORIES,
  PAYMENT_OPTIONS,
  type PaymentCategory,
} from "./paymentOptionsData";

function getOptionsByCategory(category: PaymentCategory) {
  return PAYMENT_OPTIONS.filter(
    (option) => option.category === category,
  );
}

export default function PaymentOptions() {
  return (
    <section
      aria-labelledby="payment-options-heading"
      className="relative overflow-hidden bg-[#061A2B] py-20 sm:py-24 lg:py-28"
    >
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Main blue glow */}
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#0D6E91]/[0.075] blur-[140px]" />

        {/* Yellow accent */}
        <div className="absolute right-[-160px] top-[35%] h-[320px] w-[320px] rounded-full bg-[#FFD400]/[0.035] blur-[120px]" />

        {/* Bottom blue glow */}
        <div className="absolute bottom-[-160px] left-[-140px] h-[360px] w-[360px] rounded-full bg-[#0D6E91]/[0.045] blur-[120px]" />

        {/* Technical grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]" />

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#061A2B] to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            HEADER
        ========================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD400]/15 bg-[#FFD400]/[0.045] px-3.5 py-2 shadow-[0_0_30px_rgba(255,212,0,0.04)]">
            <CreditCard
              size={14}
              strokeWidth={1.8}
              className="text-[#FFD400]"
              aria-hidden="true"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD400] sm:text-[11px]">
              Payment Options
            </span>
          </div>

          {/* Heading */}
          <h2
            id="payment-options-heading"
            className="text-3xl font-bold tracking-[-0.045em] text-[#F8FAFC] sm:text-4xl lg:text-[50px] lg:leading-[1.08]"
          >
            Flexible ways to{" "}
            <span className="relative inline-block text-[#FFD400]">
              pay.
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#FFD400]/60 to-transparent"
              />
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#A8BBC8] sm:text-base">
            We offer a range of convenient payment methods, including
            flexible payment options, digital wallets and major cards.
          </p>

          {/* Mini trust line */}
          <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#A8BBC8]/70">
            <span className="h-1 w-1 rounded-full bg-[#FFD400]" />
            Simple
            <span className="text-white/20">•</span>
            Convenient
            <span className="text-white/20">•</span>
            Flexible
          </div>
        </motion.div>

        {/* =========================================================
            PAYMENT GROUPS
        ========================================================== */}
        <div className="mx-auto mt-12 max-w-6xl space-y-11 lg:mt-14 lg:space-y-12">
          {PAYMENT_CATEGORIES.map((category, categoryIndex) => {
            const options = getOptionsByCategory(category.title);

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.55,
                  delay: categoryIndex * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Category heading */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <h3 className="text-sm font-bold tracking-tight text-[#F8FAFC] sm:text-base">
                      {category.title}
                    </h3>

                    <p className="mt-1 text-[11px] leading-5 text-[#A8BBC8] sm:text-xs">
                      {category.description}
                    </p>
                  </div>

                  <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
                </div>

                {/* Cards */}
                <div
                  className={[
                    "grid gap-3",
                    options.length === 2
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3",
                  ].join(" ")}
                >
                  {options.map((option, index) => (
                    <PaymentOptionCard
                      key={option.name}
                      option={option}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* =========================================================
            ACCEPTED ALL PAYMENTS BANNER
        ========================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.55,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[22px] border border-[#FFD400]/10 bg-gradient-to-r from-[#08263D]/90 via-[#08263D]/70 to-[#08263D]/90]"
        >
          {/* Banner glow */}
          <div
            aria-hidden="true"
            className="absolute right-[-80px] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#FFD400]/[0.055] blur-[70px]"
          />

          <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6 sm:py-5">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[#FFD400]/15 bg-[#FFD400]/[0.055] text-[#FFD400]">
              <ShieldCheck
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold tracking-tight text-[#F8FAFC]">
                  Accepted all types of payments
                </p>

                <span className="inline-flex items-center gap-1 rounded-full border border-[#0D6E91]/25 bg-[#0D6E91]/[0.08] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#7DD3FC]">
                  <Sparkles
                    size={9}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Flexible
                </span>
              </div>

              <p className="mt-1 text-[11px] leading-5 text-[#A8BBC8] sm:text-xs">
                Choose the payment method that works best for you when
                arranging your service.
              </p>
            </div>

            {/* Decorative indicator */}
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD400] shadow-[0_0_10px_rgba(255,212,0,0.55)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D6E91]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Bottom spacing / divider */}
        <div
          aria-hidden="true"
          className="mx-auto mt-14 h-px max-w-6xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        />
      </div>
    </section>
  );
}