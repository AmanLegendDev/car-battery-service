import { auth } from "@/auth";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Wrench,
} from "lucide-react";

const managementItems = [
  {
    title: "Services",
    description: "Manage your battery service offerings.",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    title: "Service Areas",
    description: "Manage genuine areas where you provide service.",
    href: "/admin/service-areas",
    icon: MapPin,
  },
  {
    title: "FAQs",
    description: "Manage customer questions and answers.",
    href: "/admin/faqs",
    icon: MessageSquare,
  },
  {
    title: "Blog",
    description: "Create and manage helpful articles.",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Reviews",
    description: "Manage genuine customer reviews.",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Bookings",
    description: "View and manage customer bookings.",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Enquiries",
    description: "Manage customer enquiries and follow-ups.",
    href: "/admin/enquiries",
    icon: ClipboardList,
  },
  {
    title: "Site Settings",
    description: "Manage global business and website settings.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default async function AdminDashboardPage() {
  const session = await auth();

  const adminName = session?.user?.name || "Admin";

  return (
    <main className="min-h-screen bg-[#061A2B]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B]">
                <LayoutDashboard
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Admin Dashboard
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {adminName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base">
              Manage your website content, customer requests and
              business information from one place.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#08263D] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[#A8BBC8]">
              Signed in as
            </p>

            <p className="mt-1 max-w-[240px] truncate text-sm font-semibold text-[#F8FAFC]">
              {session?.user?.email}
            </p>
          </div>
        </header>

        {/* Quick overview */}
        <section aria-labelledby="overview-heading" className="mb-10">
          <div className="mb-5">
            <h2
              id="overview-heading"
              className="text-xl font-semibold"
            >
              Business overview
            </h2>

            <p className="mt-1 text-sm text-[#A8BBC8]">
              Live metrics will appear here once the CMS modules are
              connected.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#08263D] p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold">
                  Your admin foundation is ready
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8]">
                  Bookings, enquiries, services, areas and published
                  content will use real database data. No fake
                  statistics are displayed.
                </p>
              </div>

              <div className="shrink-0 rounded-xl border border-[#FFD400]/20 bg-[#FFD400]/10 px-4 py-3">
                <span className="text-sm font-semibold text-[#FFD400]">
                  Secure Admin
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Management */}
        <section aria-labelledby="management-heading">
          <div className="mb-5">
            <h2
              id="management-heading"
              className="text-xl font-semibold"
            >
              Management
            </h2>

            <p className="mt-1 text-sm text-[#A8BBC8]">
              Manage every part of the business website from the
              sections below.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {managementItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-white/10 bg-[#08263D] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#0a2d47] focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-offset-2 focus:ring-offset-[#061A2B]"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </div>

                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5 text-[#A8BBC8] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#FFD400]"
                    />
                  </div>

                  <h3 className="font-semibold text-[#F8FAFC]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                    {item.description}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}