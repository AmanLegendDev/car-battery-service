import Link from "next/link";
import { ArrowUpRight, Wrench } from "lucide-react";

export default function ServicesEmptyState() {
  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto flex min-h-[55vh] max-w-[1420px] items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full border-y border-[#061A2B]/10 py-14 sm:py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400]">
            <Wrench
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#061A2B]/40">
            Services
          </p>

          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Service information is being prepared.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#061A2B]/50 sm:text-base">
            Please contact Car Battery Service to discuss the assistance you
            need.
          </p>

          <Link
            href="/contact"
            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#061A2B] px-5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Contact us</span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight
                className="h-4 w-4"
                strokeWidth={2}
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}