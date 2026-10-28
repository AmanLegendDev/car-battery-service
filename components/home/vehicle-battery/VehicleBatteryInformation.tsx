
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  CalendarCheck,
  CarFront,
  CircleAlert,
  ClipboardCheck,
  Gauge,
  Lightbulb,
  Phone,
  SearchCheck,
  Settings2,
  Wrench,
  Zap,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Service from "@/models/Service";

interface HomepageService {
  _id: unknown;
  title: string;
  slug: string;
  shortDescription: string;
}

const VEHICLE_SIGNS = [
  {
    number: "01",
    title: "Unusual noises or vibrations",
    description:
      "New rattling, grinding, squealing or unusual vibrations can indicate a problem with brakes, suspension, tyres, the engine or another component. Note when the symptoms occur.",
    icon: Settings2,
    label: "Noise & vibration",
  },
  {
    number: "02",
    title: "Starting or electrical problems",
    description:
      "Difficulty starting, dim lights or intermittent electrical issues may relate to the battery, starter motor, alternator or electrical connections. The underlying cause needs to be checked.",
    icon: BatteryCharging,
    label: "Starting & electrical",
  },
  {
    number: "03",
    title: "Dashboard warning lights",
    description:
      "Warning lights can indicate anything from routine maintenance needs to a system fault. Check your vehicle handbook and seek appropriate assistance, especially for red warnings.",
    icon: Lightbulb,
    label: "Vehicle warning lights",
  },
  {
    number: "04",
    title: "Changes in vehicle performance",
    description:
      "Reduced power, unusual braking, steering changes, overheating or fluid leaks should not be ignored. Describe the symptoms clearly when arranging an inspection.",
    icon: Gauge,
    label: "Performance & safety",
  },
];

export default async function VehicleBatteryInformation() {
  let businessName = "Mobile Car Services";
  let phone = "+61 467 037 886";
  let callNumber = "+61 467 037 886";
  let services: HomepageService[] = [];

  try {
    await connectDB();

    const [settings, serviceResults] = await Promise.all([
      SiteSettings.findOne()
        .select({
          businessName: 1,
          phone: 1,
          primaryCallNumber: 1,
        })
        .lean(),

      Service.find({
        status: "active",
      })
        .select({
          title: 1,
          slug: 1,
          shortDescription: 1,
        })
        .sort({
          displayOrder: 1,
          title: 1,
        })
        .limit(3)
        .lean(),
    ]);

    if (settings) {
      businessName = settings.businessName || businessName;
      phone = settings.phone || phone;
      callNumber =
        settings.primaryCallNumber || settings.phone || callNumber;
    }

    services = serviceResults as unknown as HomepageService[];
  } catch (error) {
    console.error(
      "Failed to load vehicle information:",
      error
    );
  }

  const phoneHref = `tel:${callNumber.replace(/[^\d+]/g, "")}`;

  return (
    <section
      aria-labelledby="vehicle-information-heading"
      className="relative isolate overflow-hidden bg-[#F8FAFC] text-[#061A2B]"
    >
      {/* Subtle brand atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-24 h-[500px] w-[500px] rounded-full bg-[#0D6E91]/[0.045] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#FFD400]/[0.07] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] top-0 h-full w-px bg-[#061A2B]/[0.035]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-0 h-full w-px bg-[#061A2B]/[0.035]"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Introduction */}
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 bg-[#FFD400]"
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0D6E91]">
                Vehicle Care &amp; Assistance
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <CarFront
                aria-hidden="true"
                className="h-5 w-5 text-[#0D6E91]"
                strokeWidth={1.7}
              />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Understand your vehicle
              </span>
            </div>
          </div>

          <div className="max-w-4xl lg:ml-auto">
            <h2
              id="vehicle-information-heading"
              className="text-4xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
            >
              Know your vehicle.
              <br />
              <span className="text-[#0D6E91]">
                Know when to act.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              From unexpected starting problems to unusual noises
              and dashboard warnings, recognising changes in your
              vehicle can help you decide when to seek professional
              assistance. Understand common warning signs and explore
              the services that may help.
            </p>
          </div>
        </div>

        {/* Vehicle information panel */}
        <div className="mt-14 grid border-y border-[#061A2B]/10 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Visual panel */}
          <div className="relative min-h-[430px] overflow-hidden border-b border-[#061A2B]/10 bg-[#061A2B] lg:min-h-[570px] lg:border-b-0 lg:border-r">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.035]" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.035]" />
              <div className="absolute left-[14%] top-[18%] h-1.5 w-1.5 bg-[#A8BBC8]/25" />
              <div className="absolute right-[18%] top-[28%] h-1.5 w-1.5 bg-[#A8BBC8]/20" />
              <div className="absolute bottom-[22%] left-[23%] h-1.5 w-1.5 bg-[#A8BBC8]/20" />
              <div className="absolute bottom-[16%] right-[28%] h-1.5 w-1.5 bg-[#A8BBC8]/25" />
            </div>

            <div className="absolute left-6 right-6 top-6 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                Automotive Care
              </span>

              <span className="font-mono text-[9px] tracking-[0.16em] text-[#A8BBC8]/60">
                VEHICLE / 01
              </span>
            </div>

            {/* Vehicle emblem */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 sm:h-[310px] sm:w-[310px]"
            >
              <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
              <div className="absolute inset-[12%] rounded-full border border-[#0D6E91]/25" />
              <div className="absolute inset-[24%] rounded-full border border-[#FFD400]/20" />

              <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 bg-[#FFD400]" />

              <div className="absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border border-[#FFD400]/35 bg-[#08263D] shadow-[0_0_90px_rgba(13,110,145,0.2)] sm:h-[135px] sm:w-[135px]">
                <CarFront
                  className="h-12 w-12 text-[#FFD400] sm:h-16 sm:w-16"
                  strokeWidth={1.3}
                />

                <span className="mt-2 text-[7px] font-bold uppercase tracking-[0.2em] text-[#A8BBC8]">
                  Vehicle Care
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#08263D]/90 px-6 py-6 sm:px-8">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                Look beyond the symptoms
              </p>

              <p className="mt-2 max-w-md text-lg font-black leading-tight tracking-[-0.025em] text-[#F8FAFC] sm:text-xl">
                The right service starts with understanding what
                your vehicle is telling you.
              </p>
            </div>
          </div>

          {/* Common vehicle warning signs */}
          <div className="bg-white">
            <div className="border-b border-[#061A2B]/10 px-6 py-7 sm:px-8 sm:py-9 lg:px-10">
              <div className="flex items-center gap-3">
                <CircleAlert
                  aria-hidden="true"
                  className="h-5 w-5 text-[#0D6E91]"
                  strokeWidth={1.7}
                />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                  Common Vehicle Warning Signs
                </p>
              </div>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Warning signs can have several causes. A proper
                assessment helps identify the issue before deciding
                which repair or service is appropriate.
              </p>
            </div>

            <div>
              {VEHICLE_SIGNS.map((sign, index) => {
                const SignIcon = sign.icon;

                return (
                  <article
                    key={sign.number}
                    className={`group relative ${
                      index !== VEHICLE_SIGNS.length - 1
                        ? "border-b border-[#061A2B]/10"
                        : ""
                    }`}
                  >
                    <div className="grid gap-4 px-6 py-7 sm:grid-cols-[44px_1fr_auto] sm:items-start sm:gap-5 sm:px-8 sm:py-8 lg:px-10">
                      <div className="flex h-10 w-10 items-center justify-center border border-[#0D6E91]/15 bg-[#0D6E91]/[0.06] transition-colors duration-300 group-hover:border-[#FFD400] group-hover:bg-[#FFD400]/10">
                        <SignIcon
                          aria-hidden="true"
                          className="h-5 w-5 text-[#0D6E91]"
                          strokeWidth={1.7}
                        />
                      </div>

                      <div>
                        <div className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          {sign.label}
                        </div>

                        <h3 className="text-lg font-black tracking-[-0.025em] sm:text-xl">
                          {sign.title}
                        </h3>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                          {sign.description}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="hidden h-8 w-8 items-center justify-center border border-[#061A2B]/10 transition-colors duration-300 motion-safe:group-hover:border-[#FFD400] motion-safe:group-hover:bg-[#FFD400] sm:flex"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 top-0 w-0 bg-[#FFD400] transition-[width] duration-300 motion-safe:group-hover:w-1"
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic automotive services */}
        <div className="mt-14 lg:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 bg-[#FFD400]"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D6E91]">
                  Explore Our Services
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                Support for your vehicle.
              </h3>
            </div>

            <p className="max-w-lg text-sm leading-6 text-slate-600">
              Explore the automotive services available from{" "}
              {businessName}. From battery assistance to other
              vehicle-related needs, our team can help you discuss
              suitable options and confirm availability.
            </p>
          </div>

          {services.length > 0 && (
            <div className="mt-8 border-t border-[#061A2B]/10">
              {services.map((service, index) => (
                <Link
                  key={String(service._id)}
                  href={`/services/${service.slug}`}
                  className="group grid gap-4 border-b border-[#061A2B]/10 py-6 transition-colors duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D6E91] sm:grid-cols-[44px_1fr_auto] sm:items-center sm:gap-5 sm:px-5"
                >
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <div className="flex items-center gap-3">
                      <Wrench
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-[#0D6E91]"
                        strokeWidth={1.7}
                      />

                      <h4 className="text-base font-black tracking-[-0.02em] sm:text-lg">
                        {service.title}
                      </h4>
                    </div>

                    {service.shortDescription?.trim() && (
                      <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                        {service.shortDescription}
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#061A2B]/15 transition-colors duration-300 motion-safe:group-hover:border-[#FFD400] motion-safe:group-hover:bg-[#FFD400]"
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {services.length === 0 && (
            <p className="mt-6 border-t border-[#061A2B]/10 py-6 text-sm leading-6 text-slate-600">
              Contact our team to discuss your vehicle and the
              services currently available in your area.
            </p>
          )}

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#061A2B] outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-4"
          >
            <span className="border-b-2 border-[#FFD400] pb-1">
              View All Services
            </span>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        {/* Helpful process strip */}
        <div className="mt-10 grid border border-[#061A2B]/10 bg-[#061A2B] sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#08263D]">
              <ClipboardCheck
                aria-hidden="true"
                className="h-5 w-5 text-[#FFD400]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Step 01
              </p>
              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Describe the problem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:border-b-0 sm:border-r sm:px-7">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#08263D]">
              <SearchCheck
                aria-hidden="true"
                className="h-5 w-5 text-[#FFD400]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Step 02
              </p>
              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Discuss possible causes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-5 sm:px-7">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFD400]">
              <CalendarCheck
                aria-hidden="true"
                className="h-5 w-5 text-[#061A2B]"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A8BBC8]">
                Step 03
              </p>
              <p className="mt-1 text-xs font-bold text-[#F8FAFC]">
                Confirm the next step
              </p>
            </div>
          </div>
        </div>

        {/* Final call to action */}
        <div className="mt-10 flex flex-col gap-6 border-t border-[#061A2B]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#FFD400]/30 bg-[#FFD400]/10">
              <CircleAlert
                aria-hidden="true"
                className="h-5 w-5 text-[#0D6E91]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-sm font-black text-[#061A2B]">
                Need help with your vehicle?
              </p>

              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 sm:text-sm">
                Contact {businessName} with your vehicle details,
                symptoms and location to discuss available services.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="group inline-flex min-h-12 items-center gap-3 border border-[#061A2B]/15 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#061A2B] transition-colors duration-300 hover:border-[#061A2B] hover:bg-[#061A2B] hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-2"
            >
              View Services
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </Link>

            <a
              href={phoneHref}
              aria-label={`Call ${businessName} on ${phone}`}
              className="group inline-flex min-h-12 items-center gap-3 bg-[#FFD400] px-5 text-xs font-black uppercase tracking-[0.12em] text-[#061A2B] transition-colors duration-300 hover:bg-[#F5B800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D6E91] focus-visible:ring-offset-2"
            >
              <Phone
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={2.2}
              />

              Call Now

              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-5 text-slate-500">
          Note: This information is general guidance and is not a
          diagnosis. If a vehicle shows a serious warning light,
          overheating, braking problems or unsafe handling, stop
          driving when safe to do so and seek appropriate assistance.
        </p>
      </div>
    </section>
  );
}
