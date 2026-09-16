import Link from "next/link";

import {
  ArrowUpRight,
  MapPin,
} from "lucide-react";

export default function ServiceAreasEmptyState() {
  return (
    <section className="bg-[#F8FAFC] text-[#061A2B]">
      <div className="mx-auto flex min-h-[65vh] max-w-[1420px] items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full border-y border-[#061A2B]/10 py-16 sm:py-24">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400]">
            <MapPin
              className="h-6 w-6"
              strokeWidth={1.7}
            />
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-[#061A2B]/40">
            Service Coverage
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl">
            Location information
            <br />
            <span className="text-[#061A2B]/30">
              is being prepared.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-[#061A2B]/50 sm:text-base">
            There are currently no active service areas listed.
            Please contact Car Battery Service to discuss where you
            need assistance.
          </p>

          <Link
            href="/"
            className="group mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#061A2B] pl-5 pr-1.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Back to home</span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD400] text-[#061A2B] transition-transform duration-300 group-hover:rotate-45">
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