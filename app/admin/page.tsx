import { auth } from "@/auth";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Wrench,
  Clock3,
  XCircle,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

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
    href: "/admin/testimonials",
    icon: Star,
  },

  {
    title: "Site Settings",
    description: "Manage global business and website settings.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();

  await connectDB();

  const [
    pendingCount,
    bookedCount,
    completedCount,
    cancelledCount,
    totalCount,
  ] = await Promise.all([
    Booking.countDocuments({
      status: "pending",
    }),

    Booking.countDocuments({
      status: "confirmed",
    }),

    Booking.countDocuments({
      status: "completed",
    }),

    Booking.countDocuments({
      status: "cancelled",
    }),

    Booking.countDocuments({}),
  ]);

  const adminName =
    session?.user?.name?.trim() || "Ankit";

  const bookingStats = [
    {
      title: "Pending Bookings",
      description: "Awaiting completion",
      count: pendingCount,
      href: "/admin/bookings/pending",
      icon: Clock3,
      iconClass: "text-[#FFD400]",
      iconBg: "bg-[#FFD400]/10",
    },
    {
      title: "Booked Bookings",
      description: "Confirmed customer bookings",
      count: bookedCount,
      href: "/admin/bookings/booked",
      icon: CalendarCheck,
      iconClass: "text-[#5EC8FF]",
      iconBg: "bg-[#5EC8FF]/10",
    },
    {
      title: "Completed Bookings",
      description: "Successfully completed",
      count: completedCount,
      href: "/admin/bookings/completed",
      icon: CheckCircle2,
      iconClass: "text-[#67E8A5]",
      iconBg: "bg-[#67E8A5]/10",
    },
    {
      title: "Cancelled Bookings",
      description: "Cancelled requests",
      count: cancelledCount,
      href: "/admin/bookings/cancelled",
      icon: XCircle,
      iconClass: "text-[#FF7D7D]",
      iconBg: "bg-[#FF7D7D]/10",
    },
    {
      title: "Total Bookings",
      description: "All bookings combined",
      count: totalCount,
      href: "/admin/bookings",
      icon: CalendarCheck,
      iconClass: "text-[#FFD400]",
      iconBg: "bg-[#FFD400]/10",
      featured: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="mb-8 flex flex-col gap-6 border-b border-white/[0.08] pb-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B] shadow-[0_8px_30px_rgba(255,212,0,0.14)]">
              <LayoutDashboard
                aria-hidden="true"
                className="h-5 w-5"
              />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
              Admin Dashboard
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Welcome back, {adminName}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8BBC8] sm:text-base">
            Manage bookings, customer requests, website content
            and business information from one place.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/[0.08] bg-[#08263D] px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] xl:w-auto xl:min-w-[270px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#718895]">
            Signed in as
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[#F8FAFC]">
            {session?.user?.email || "Admin"}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#67E8A5]" />
            <span className="text-xs font-medium text-[#A8BBC8]">
              Secure Admin Session
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          BOOKING OVERVIEW
      ===================================================== */}
      <section
        aria-labelledby="booking-overview-heading"
        className="mb-10"
      >
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="booking-overview-heading"
              className="text-xl font-semibold text-[#F8FAFC]"
            >
              Booking overview
            </h2>

            <p className="mt-1 text-sm text-[#A8BBC8]">
              Keep track of customer appointments and booking
              progress.
            </p>
          </div>

          <a
            href="/admin/bookings"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#FFD400] transition hover:text-[#F5B800]"
          >
            View all bookings
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {bookingStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <a
                key={stat.href}
                href={stat.href}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-200 hover:-translate-y-0.5 ${
                  stat.featured
                    ? "border-[#FFD400]/25 bg-[#08263D] shadow-[0_14px_45px_rgba(0,0,0,0.16)]"
                    : "border-white/[0.08] bg-[#08263D] shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
                } hover:border-white/[0.16] hover:bg-[#0A2D47]`}
              >
                {stat.featured && (
                  <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[#FFD400]/10 blur-2xl" />
                )}

                <div className="relative flex items-start justify-between gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <Icon
                      aria-hidden="true"
                      className={`h-5 w-5 ${stat.iconClass}`}
                    />
                  </div>

                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 text-[#718895] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#FFD400]"
                  />
                </div>

                <div className="relative mt-6">
                  <p className="text-3xl font-bold tracking-tight text-[#F8FAFC]">
                    {stat.count}
                  </p>

                  <h3 className="mt-2 text-sm font-semibold text-[#F8FAFC]">
                    {stat.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#A8BBC8]">
                    {stat.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          MANAGEMENT
      ===================================================== */}
      <section aria-labelledby="management-heading">
        <div className="mb-5">
          <h2
            id="management-heading"
            className="text-xl font-semibold text-[#F8FAFC]"
          >
            Management
          </h2>

          <p className="mt-1 text-sm text-[#A8BBC8]">
            Manage every part of the business website from the
            sections below.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {managementItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-white/[0.08] bg-[#08263D] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-[#0A2D47] hover:shadow-[0_16px_45px_rgba(0,0,0,0.16)] focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:ring-offset-2 focus:ring-offset-[#061A2B]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400] transition duration-200 group-hover:bg-[#FFD400] group-hover:text-[#061A2B]">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </div>

                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 text-[#718895] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#FFD400]"
                  />
                </div>

                <h3 className="font-semibold text-[#F8FAFC]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#A8BBC8]">
                  {item.description}
                </p>

                <div className="mt-5 border-t border-white/[0.06] pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718895] transition group-hover:text-[#FFD400]">
                    Manage
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}