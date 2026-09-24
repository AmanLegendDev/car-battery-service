import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#061A2B] px-6 text-[#F8FAFC]">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0D6E91] bg-[#08263D]">
          <LoaderCircle className="h-7 w-7 animate-spin text-[#FFD400]" />
        </div>

        <p className="mt-5 text-sm font-semibold text-[#F8FAFC]">
          Loading
        </p>

        <p className="mt-1 text-sm text-[#A8BBC8]">
          Please wait a moment...
        </p>
      </div>
    </main>
  );
}