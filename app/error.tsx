"use client";

import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#061A2B] px-6 py-16 text-[#F8FAFC]">
      <div className="relative w-full max-w-2xl text-center">
        <div className="absolute left-1/2 top-1/2 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0D6E91]/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#08263D]">
            <AlertTriangle className="h-8 w-8 text-[#FFD400]" />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-[#FFD400]">
            Something went wrong
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            We could not load this page
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#A8BBC8]">
            Something unexpected happened while loading the page.
            Please try again or return to the homepage.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#0D6E91] bg-[#08263D] px-6 text-sm font-bold text-[#F8FAFC] transition hover:border-[#FFD400]/50 hover:bg-[#0D6E91]/20"
            >
              <ArrowLeft className="h-4 w-4 text-[#FFD400]" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}