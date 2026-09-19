import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck2,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from "lucide-react";



export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking Request Received | Car Battery Service",
  description:
    "Your car battery service booking request has been received.",
};

interface BookingSuccessPageProps {
  searchParams: Promise<{
    reference?: string;
  }>;
}

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;

  const reference = params.reference?.trim() || "";

  return (
    <>
   
    <main className="min-h-screen bg-[#061A2B] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#0D6E91]/20 blur-[120px]"/>
        <div className="absolute bottom-[-220px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#FFD400]/8 blur-[120px]" />
      </div>

      {/* Header */}
     

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center px-5 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          {/* Success icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#FFD400]/30 bg-[#FFD400]/10 shadow-[0_0_60px_rgba(255,212,0,0.08)]">
            <CheckCircle2
              size={42}
              strokeWidth={1.8}
              className="text-[#FFD400]"
            />
          </div>

          {/* Heading */}
          <div className="mt-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FFD400]">
              Booking Request Received
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              You&apos;re all set.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#A8BBC8] sm:text-lg">
              Your car battery service booking request has been submitted
              successfully. Please keep your booking reference for future
              communication.
            </p>
          </div>

          {/* Reference card */}
          <div className="mx-auto mt-10 max-w-xl">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D6E91]/20 text-[#FFD400]">
                  <CalendarCheck2 size={19} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                    Booking Reference
                  </p>

                  <p className="mt-1 text-sm text-white/70">
                    Keep this reference for your records.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/[0.06] px-5 py-5 text-center">
                <p className="break-all text-2xl font-black tracking-[0.12em] text-[#FFD400] sm:text-3xl">
                  {reference || "REQUEST RECEIVED"}
                </p>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mx-auto mt-5 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#FFD400]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Request submitted
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                    Your booking details have been submitted for the requested
                    service.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#FFD400]">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Need help?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#A8BBC8]">
                    Call the service directly if you need assistance with
                    your request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] shadow-lg shadow-[#FFD400]/10 transition hover:bg-[#F5B800]"
            >
              <ArrowLeft size={17} />
              Back to Website
            </Link>

            <a
              href="tel:+61467037886"
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Phone size={17} />
              Call +61 467 037 886
            </a>
          </div>

          {/* Bottom note */}
          <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-5 text-[#A8BBC8]/80">
            Please note: this page confirms that your booking request was
            received. It does not mean the appointment has been confirmed.
          </p>
        </div>
      </section>
    </main>
    
    </>
  );
}