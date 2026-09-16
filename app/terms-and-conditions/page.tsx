import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import SiteSettings from "@/models/SiteSettings";

import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";
import FloatingCallButton from "@/components/layout/floating-call/FloatingCallButton";

import TermsAndConditionsPage from "@/components/legal/terms/TermsAndConditionsPage";

export const dynamic = "force-dynamic";

export interface TermsBusiness {
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;
  primaryServiceRegion: string;
}

async function getBusinessSettings(): Promise<TermsBusiness> {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .select(
      "businessName tagline description phone primaryCallNumber whatsapp email primaryServiceRegion",
    )
    .lean();

  return {
    businessName:
      settings?.businessName ||
      "Car Battery Service",

    tagline:
      settings?.tagline ||
      "",

    description:
      settings?.description ||
      "",

    phone:
      settings?.phone ||
      "",

    primaryCallNumber:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    whatsapp:
      settings?.whatsapp ||
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    email:
      settings?.email ||
      "",

    primaryServiceRegion:
      settings?.primaryServiceRegion ||
      "",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const business = await getBusinessSettings();

  const title = `Terms & Conditions | ${business.businessName}`;

  const description = business.primaryServiceRegion
    ? `Terms and conditions for using ${business.businessName}'s mobile car battery services in ${business.primaryServiceRegion}.`
    : `Terms and conditions for using ${business.businessName}'s mobile car battery services.`;

  return {
    title,
    description,

    alternates: {
      canonical: "/terms-and-conditions",
    },

    openGraph: {
      title,
      description,
      url: "/terms-and-conditions",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TermsAndConditionsRoute() {
  const business = await getBusinessSettings();

  return (
    <>
      <Navbar />

      <main>
        <TermsAndConditionsPage
          business={business}
        />
      </main>

      <Footer />

      <FloatingCallButton />
    </>
  );
}