"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    const callbackUrl =
      searchParams.get("callbackUrl") || "/admin";

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      window.location.assign(result.url || callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[#F8FAFC]"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A8BBC8]"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            disabled={isSubmitting}
            required
            maxLength={254}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#061A2B] pl-11 pr-4 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#718895] focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-[#F8FAFC]"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A8BBC8]"
          />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
            required
            maxLength={128}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#061A2B] pl-11 pr-12 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#718895] focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={isSubmitting}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#A8BBC8] transition hover:bg-white/5 hover:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/40 disabled:pointer-events-none disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Eye aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#FFD400] px-5 text-sm font-bold text-[#061A2B] transition hover:bg-[#F5B800] focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-offset-2 focus:ring-offset-[#08263D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}