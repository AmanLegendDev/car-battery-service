import Navbar from "@/components/layout/navbar/Navbar";
import Hero from "@/components/home/hero/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061A2B] text-[#F8FAFC]">
      <Navbar />

      <Hero />
    </main>
  );
}