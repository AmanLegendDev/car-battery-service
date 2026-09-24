import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login | Car Battery Service",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#061A2B] text-[#F8FAFC]">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#0D6E91]/10 blur-[100px]" />

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#FFD400]/[0.05] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,110,145,0.05),transparent_55%)]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[430px]">

          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#FFD400] text-[#061A2B] shadow-[0_12px_35px_rgba(255,212,0,0.12)]">
              <span className="text-xl font-black tracking-tight">
                CB
              </span>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#FFD400]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#F8FAFC] sm:text-[34px]">
              Welcome back
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-[#718895]">
              Sign in to manage your Car Battery Service website.
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-[28px] border border-white/[0.08] bg-[#08263D]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
            <Suspense
              fallback={
                <div className="space-y-5">
                  <div className="h-12 animate-pulse rounded-2xl bg-white/[0.05]" />
                  <div className="h-12 animate-pulse rounded-2xl bg-white/[0.05]" />
                  <div className="h-12 animate-pulse rounded-2xl bg-white/[0.05]" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

          {/* Bottom note */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#67E8A5]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#536977]">
              Authorized access only
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}