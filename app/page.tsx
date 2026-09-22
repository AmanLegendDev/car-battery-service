import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

import Hero from "@/components/home/hero/Hero";
import EmergencyAssistance from "@/components/home/emergency-assistance/EmergencyAssistance";
import ServicesOverview from "@/components/home/services/ServicesOverview";
import HowItWorks from "@/components/home/how-it-works/HowItWorks";
import WhyChooseUs from "@/components/home/why-choose-us/WhyChooseUs";
import ServiceAreasOverview from "@/components/home/service-areas/ServiceAreasOverview";
import VehicleBatteryInformation from "@/components/home/vehicle-battery/VehicleBatteryInformation";
import RequestAssistance from "@/components/home/request-assistance/RequestAssistance";
import TestimonialsOverview from "@/components/home/testimonials/TestimonialsOverview";
import FAQOverview from "@/components/home/faqs/FAQOverview";
import BlogPreview from "@/components/home/blog/BlogPreview";
import FinalCTA from "@/components/home/final-cta/FinalCTA";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName tagline description phone primaryCallNumber primaryServiceRegion bookingCta quoteCta logo"
    )
    .lean();

  const heroSettings = settings
    ? {
        businessName: settings.businessName,
        tagline: settings.tagline ?? "",
        description: settings.description ?? "",
        phone: settings.primaryCallNumber || settings.phone,
        serviceRegion:
          settings.primaryServiceRegion ?? "",
        bookingCta:
          settings.bookingCta || "Book a Service",
      }
    : null;

  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <Hero settings={heroSettings} />

      <EmergencyAssistance />

      <ServicesOverview />

      <HowItWorks />

      <WhyChooseUs />

      <ServiceAreasOverview />

      <VehicleBatteryInformation />

      <RequestAssistance />

      <TestimonialsOverview />

      <FAQOverview />

      <BlogPreview />

      <FinalCTA />
    </main>
  );
}