import Navbar from "@/components/layout/navbar/Navbar";
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
import Footer from "@/components/layout/footer/Footer";
import FloatingCallButton from "@/components/layout/floating-call/FloatingCallButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#061A2B] text-[#F8FAFC]">
      <Navbar />

      <Hero />

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

<Footer />

<FloatingCallButton />
    </main>
  );
}