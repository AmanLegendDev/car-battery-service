import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import FloatingCallButton from "@/components/layout/floating-call/FloatingCallButton";
import PrivacyPolicyPage from "@/components/legal/privacy/PrivacyPolicyPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();

  const business = await SiteSettings.findOne().lean();

  const businessName =
    typeof business?.businessName === "string" &&
    business.businessName.trim()
      ? business.businessName.trim()
      : "Car Battery Service";

  return {
    title: `Privacy Policy | ${businessName}`,
    description: `Privacy Policy for ${businessName}.`,
    alternates: {
      canonical: "/privacy-policy",
    },
    openGraph: {
      title: `Privacy Policy | ${businessName}`,
      description: `Privacy Policy for ${businessName}.`,
      url: "/privacy-policy",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Privacy Policy | ${businessName}`,
      description: `Privacy Policy for ${businessName}.`,
    },
  };
}

export default async function PrivacyPolicyRoute() {
  await connectDB();

  const business = await SiteSettings.findOne().lean();

  const businessData = {
    businessName:
      typeof business?.businessName === "string" &&
      business.businessName.trim()
        ? business.businessName.trim()
        : "Car Battery Service",

    tagline:
      typeof business?.tagline === "string" ? business.tagline : "",

    description:
      typeof business?.description === "string"
        ? business.description
        : "",

    phone:
      typeof business?.phone === "string" ? business.phone : "",

    primaryCallNumber:
      typeof business?.primaryCallNumber === "string"
        ? business.primaryCallNumber
        : "",

    whatsapp:
      typeof business?.whatsapp === "string"
        ? business.whatsapp
        : "",

    email:
      typeof business?.email === "string" ? business.email : "",

    primaryServiceRegion:
      typeof business?.primaryServiceRegion === "string"
        ? business.primaryServiceRegion
        : "",
  };

  return (
    <>
      <Navbar />

      <main>
        <PrivacyPolicyPage business={businessData} />
      </main>

      <Footer />
      <FloatingCallButton />
    </>
  );
}