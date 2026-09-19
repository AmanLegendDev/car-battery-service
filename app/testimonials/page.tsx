import type { Metadata } from "next";

import { connectDB } from "@/lib/db";

import Testimonial from "@/models/Testimonial";
import SiteSettings from "@/models/SiteSettings";



import TestimonialsListingPage, {
  type PublicTestimonial,
  type TestimonialsBusiness,
} from "@/components/testimonials/listing/TestimonialsListingPage";

export const dynamic = "force-dynamic";

async function getTestimonials(): Promise<
  PublicTestimonial[]
> {
  await connectDB();

  const testimonials =
    await Testimonial.find({
      published: true,
    })
      .select(
        [
          "name",
          "businessName",
          "role",
          "photo",
          "testimonial",
          "rating",
          "featured",
          "displayOrder",
        ].join(" "),
      )
      .sort({
        featured: -1,
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

  return testimonials.map(
    (testimonial) => ({
      id: String(
        testimonial._id,
      ),

      name:
        testimonial.name || "",

      businessName:
        testimonial.businessName || "",

      role:
        testimonial.role || "",

      photo:
        testimonial.photo
          ? {
              publicId:
                testimonial.photo.publicId,

              secureUrl:
                testimonial.photo.secureUrl,

              width:
                testimonial.photo.width,

              height:
                testimonial.photo.height,

              format:
                testimonial.photo.format,

              bytes:
                testimonial.photo.bytes,

              resourceType:
                testimonial.photo.resourceType,

              alt:
                testimonial.photo.alt || "",
            }
          : null,

      testimonial:
        testimonial.testimonial || "",

      rating:
        typeof testimonial.rating ===
        "number"
          ? testimonial.rating
          : null,

      featured:
        Boolean(
          testimonial.featured,
        ),

      displayOrder:
        testimonial.displayOrder ?? 0,
    }),
  );
}

async function getBusinessSettings(): Promise<
  TestimonialsBusiness
> {
  await connectDB();

  const settings =
    await SiteSettings.findOne()
      .select(
        [
          "businessName",
          "primaryServiceRegion",
          "phone",
          "primaryCallNumber",
          "whatsapp",
        ].join(" "),
      )
      .lean();

  return {
    businessName:
      settings?.businessName ||
      "Car Battery Service",

    primaryServiceRegion:
      settings?.primaryServiceRegion ||
      "",

    phone:
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",

    whatsapp:
      settings?.whatsapp ||
      settings?.primaryCallNumber ||
      settings?.phone ||
      "",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await getBusinessSettings();

  const region =
    settings.primaryServiceRegion;

  const title = region
    ? `Customer Experiences | ${settings.businessName} | ${region}`
    : `Customer Experiences | ${settings.businessName}`;

  const description = region
    ? `Read genuine customer feedback about ${settings.businessName} and mobile car battery assistance in ${region}.`
    : `Read genuine customer feedback about ${settings.businessName} and its mobile car battery assistance.`;

  return {
    title,

    description,

    alternates: {
      canonical: "/testimonials",
    },

    openGraph: {
      title,
      description,
      url: "/testimonials",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TestimonialsPage() {
  const [
    testimonials,
    business,
  ] = await Promise.all([
    getTestimonials(),
    getBusinessSettings(),
  ]);

  return (
    <>
     

      <main>
        <TestimonialsListingPage
          testimonials={testimonials}
          business={business}
        />
      </main>

    
    </>
  );
}