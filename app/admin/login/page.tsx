import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";

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
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFD400] text-[#061A2B]">
              <span className="text-2xl font-black">CB</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-[#A8BBC8]">
              Sign in to manage your business website.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#08263D] p-6 shadow-2xl sm:p-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-[#A8BBC8]">
            Authorized access only.
          </p>
        </div>
      </div>
    </main>
  );
}