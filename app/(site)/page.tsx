
"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Cog,
  Gauge,
  Hammer,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Car Servicing",
    description: "Routine maintenance and vehicle care.",
  },
  {
    icon: Cog,
    title: "Mechanical Repairs",
    description: "Practical solutions for everyday car problems.",
  },
  {
    icon: Gauge,
    title: "Vehicle Diagnostics",
    description: "Identify issues with a more informed approach.",
  },
  {
    icon: ShieldCheck,
    title: "Brake & Safety Checks",
    description: "Keep essential vehicle systems in focus.",
  },
];

const highlights = [
  "A broader range of automotive services",
  "A cleaner, easier booking experience",
  "A fresh look with the same trusted focus",
];

export default function HomePage() {
  return (
    <main className="relative isolate min-h-[85vh] overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-32 h-[420px] w-[420px] rounded-full bg-[#0D6E91]/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#0D6E91]/15 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(248,250,252,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.12) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#061A2B]" />
      </div>

      {/* Main announcement */}
      <section className="mx-auto flex w-full max-w-7xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-28 lg:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD400]/25 bg-[#FFD400]/[0.07] px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD400] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FFD400]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFD400] sm:text-xs">
                Something better is on the way
              </span>
            </div>

            <p className="mt-8 text-sm font-semibold tracking-[0.2em] text-[#A8BBC8]">
              INTRODUCING A NEW CHAPTER
            </p>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              A new era of
              <span className="mt-2 block text-[#FFD400]">
                automotive care.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#B7C7D3] sm:text-lg">
              We are working behind the scenes to bring you a refreshed
              automotive service experience. From routine maintenance
              to mechanical repairs, a more complete journey is taking shape.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B]">
                  <Wrench className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">Rapid Auto Services</p>
                  <p className="mt-1 text-xs text-[#A8BBC8]">
                    A fresh direction
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#A8BBC8]">
                <Clock3 className="h-4 w-4 text-[#FFD400]" />
                <span>Website under development</span>
              </div>
            </div>

            <a
              href="#coming-soon"
              className="group mt-10 inline-flex items-center gap-3 text-sm font-bold text-[#F8FAFC] transition-colors hover:text-[#FFD400]"
            >
              Explore what's coming
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </a>
          </motion.div>

          {/* Premium animated service visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute inset-10 rounded-full bg-[#0D6E91]/20 blur-[80px]" />

            <div className="relative overflow-hidden rounded-[32px] border border-white/[0.12] bg-gradient-to-br from-[#0B3048] via-[#08263D] to-[#071B2C] p-6 shadow-[0_35px_100px_rgba(0,0,0,0.35)] sm:p-9">
              <div className="flex items-center justify-between border-b border-white/[0.09] pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8BBC8]">
                    Our next chapter
                  </p>
                  <p className="mt-2 text-lg font-extrabold">
                    Built around your drive.
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400]">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="relative my-8 flex aspect-square max-h-[300px] items-center justify-center overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#061A2B]/70">
                <div className="absolute h-52 w-52 rounded-full border border-[#0D6E91]/30" />
                <div className="absolute h-40 w-40 rounded-full border border-dashed border-[#FFD400]/25" />

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 32,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-64 w-64 rounded-full border border-transparent border-t-[#0D6E91]/70"
                />

                <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] border border-[#FFD400]/25 bg-gradient-to-br from-[#FFD400] to-[#E8AD00] text-[#061A2B] shadow-[0_0_65px_rgba(255,212,0,0.12)]">
                  <Wrench className="h-12 w-12" strokeWidth={1.8} />
                </div>

                <div className="absolute left-5 top-6 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#08263D] text-[#FFD400] shadow-lg sm:left-8">
                  <Cog className="h-5 w-5" />
                </div>

                <div className="absolute bottom-7 right-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#08263D] text-[#FFD400] shadow-lg sm:right-8">
                  <Gauge className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0D6E91]/20 text-[#FFD400]">
                  <Hammer className="h-4 w-4" />
                </div>

                <div>
                  <p className="font-bold">More than just batteries.</p>
                  <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                    A broader automotive service experience is in development.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/10 bg-[#08263D] px-4 py-3 shadow-2xl sm:-left-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#FFD400]" />
                <span className="text-xs font-bold">A fresh new experience</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming services */}
      <section
        id="coming-soon"
        className="border-t border-white/[0.08] bg-[#08263D]/45"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFD400]">
              What's taking shape
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              One destination.
              <span className="block text-[#A8BBC8]">
                More ways to care for your car.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#A8BBC8] sm:text-base">
              We're preparing a more comprehensive service experience
              designed to make looking after your vehicle simpler.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  className="group rounded-2xl border border-white/[0.09] bg-[#061A2B]/65 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D6E91]/70 hover:bg-[#08263D]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FFD400]/15 bg-[#FFD400]/[0.07] text-[#FFD400] transition-colors group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-base font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#A8BBC8]">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.09] bg-[#061A2B]/60 p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="text-lg font-extrabold">
                The next chapter starts here.
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                We're working on the details to make your next visit better.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#FFD400]/20 bg-[#FFD400]/[0.07] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#FFD400]">
              <Sparkles className="h-4 w-4" />
              Coming soon
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 bg-gradient-to-r from-[#061A2B] via-[#FFD400] to-[#0D6E91]" />
    </main>
  );
}
