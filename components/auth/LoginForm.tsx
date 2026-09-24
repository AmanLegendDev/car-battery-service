"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const callbackUrl =
      searchParams.get("callbackUrl") || "/admin";

    try {
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      window.location.assign(
        result.url || callbackUrl
      );
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      {/* =====================================================
          SECURITY STATUS
      ====================================================== */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#67E8A5]/15 bg-[#67E8A5]/[0.06] px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#67E8A5]/10 text-[#67E8A5]">
          <ShieldCheck
            aria-hidden="true"
            className="h-4 w-4"
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-[#F8FAFC]">
            Secure administrator access
          </p>

          <p className="mt-0.5 text-[11px] text-[#718895]">
            Authorized users only
          </p>
        </div>

        <span
          className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#67E8A5] shadow-[0_0_10px_rgba(103,232,165,0.5)]"
          aria-hidden="true"
        />
      </div>

      {/* =====================================================
          EMAIL
      ====================================================== */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#A8BBC8]"
        >
          Email address
        </label>

        <div className="group relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#718895] transition-colors group-focus-within:text-[#FFD400]"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="admin@example.com"
            disabled={isSubmitting}
            required
            maxLength={254}
            className="h-[52px] w-full rounded-2xl border border-white/[0.09] bg-[#061A2B] pl-11 pr-4 text-sm font-medium text-[#F8FAFC] outline-none transition placeholder:text-[#536977] hover:border-white/[0.14] focus:border-[#FFD400]/60 focus:bg-[#061A2B] focus:ring-4 focus:ring-[#FFD400]/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* =====================================================
          PASSWORD
      ====================================================== */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-[0.12em] text-[#A8BBC8]"
          >
            Password
          </label>

          <span className="text-[10px] font-medium text-[#536977]">
            Secure sign-in
          </span>
        </div>

        <div className="group relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#718895] transition-colors group-focus-within:text-[#FFD400]"
          />

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);

              if (error) {
                setError("");
              }
            }}
            placeholder="Enter your password"
            disabled={isSubmitting}
            required
            maxLength={128}
            className="h-[52px] w-full rounded-2xl border border-white/[0.09] bg-[#061A2B] pl-11 pr-12 text-sm font-medium text-[#F8FAFC] outline-none transition placeholder:text-[#536977] hover:border-white/[0.14] focus:border-[#FFD400]/60 focus:ring-4 focus:ring-[#FFD400]/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            disabled={isSubmitting}
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#718895] transition hover:bg-white/[0.05] hover:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/40 disabled:pointer-events-none disabled:opacity-40"
          >
            {showPassword ? (
              <EyeOff
                aria-hidden="true"
                className="h-[18px] w-[18px]"
              />
            ) : (
              <Eye
                aria-hidden="true"
                className="h-[18px] w-[18px]"
              />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3.5"
        >
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400"
            aria-hidden="true"
          />

          <p className="text-sm leading-5 text-red-200">
            {error}
          </p>
        </div>
      ) : null}

      {/* =====================================================
          SUBMIT
      ====================================================== */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#FFD400] px-5 text-sm font-black text-[#061A2B] shadow-[0_12px_30px_rgba(255,212,0,0.10)] transition-all duration-200 hover:bg-[#F5B800] hover:shadow-[0_14px_35px_rgba(255,212,0,0.15)] focus:outline-none focus:ring-4 focus:ring-[#FFD400]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-[#061A2B]/25 border-t-[#061A2B]"
              aria-hidden="true"
            />

            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in to Admin</span>

            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <div className="flex items-center justify-center gap-2 border-t border-white/[0.07] pt-5">
        <LockKeyhole
          aria-hidden="true"
          className="h-3.5 w-3.5 text-[#536977]"
        />

        <p className="text-[10px] font-medium tracking-wide text-[#536977]">
          Your administrator session is protected
        </p>
      </div>
    </form>
  );
}