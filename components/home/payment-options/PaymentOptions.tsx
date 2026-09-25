"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
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
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#0D6E91]/[0.07] blur-[120px]" />

        <div className="absolute bottom-0 left-[-120px] h-[280px] w-[280px] rounded-full bg-[#FFD400]/[0.035] blur-[100px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD400]/15 bg-[#FFD400]/[0.05] px-3.5 py-2">
            <CreditCard
              size={14}
              strokeWidth={1.8}
              className="text-[#FFD400]"
              aria-hidden="true"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400] sm:text-[11px]">
              Payment Options
            </span>
          </div>

          <h2
            id="payment-options-heading"
            className="text-3xl font-bold tracking-[-0.035em] text-[#F8FAFC] sm:text-4xl lg:text-5xl"
          >
            Flexible ways to{" "}
            <span className="text-[#FFD400]">pay.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#A8BBC8] sm:text-base">
            We offer a range of convenient payment methods, including
            flexible payment options, digital wallets and major cards.
          </p>
        </motion.div>

        {/* Payment groups */}
        <div className="mx-auto mt-12 max-w-6xl space-y-10 lg:mt-14">
          {PAYMENT_CATEGORIES.map((category, categoryIndex) => {
            const options = getOptionsByCategory(category.title);

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: categoryIndex * 0.06,
                }}
              >
                {/* Category heading */}
                <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#F8FAFC] sm:text-base">
                      {category.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#A8BBC8]">
                      {category.description}
                    </p>
                  </div>

                  <div className="hidden h-px flex-1 bg-white/[0.06] sm:ml-6 sm:block" />
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

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-[#08263D]/45 px-5 py-4 text-center backdrop-blur-xl sm:flex-row sm:gap-3 sm:text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FFD400]/15 bg-[#FFD400]/[0.06] text-[#FFD400]">
            <ShieldCheck
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-[#F8FAFC]">
              Convenient payment choices
            </p>

            <p className="mt-0.5 text-[11px] leading-5 text-[#A8BBC8]">
              Select the payment method that suits you when arranging your
              service.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}