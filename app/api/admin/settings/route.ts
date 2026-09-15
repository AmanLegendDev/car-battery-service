import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import {
  updateSiteSettingsSchema,
} from "@/validations/site-settings";



const DEFAULT_BUSINESS_HOURS = [
  {
    day: "Monday",
    enabled: false,
  },
  {
    day: "Tuesday",
    enabled: false,
  },
  {
    day: "Wednesday",
    enabled: false,
  },
  {
    day: "Thursday",
    enabled: false,
  },
  {
    day: "Friday",
    enabled: false,
  },
  {
    day: "Saturday",
    enabled: false,
  },
  {
    day: "Sunday",
    enabled: false,
  },
];

function serializeSettings(settings: unknown) {
  const data = settings as Record<string, unknown>;

  return {
    id: String(data._id),

    businessName:
      data.businessName ?? "",

    tagline:
      data.tagline ?? "",

    description:
      data.description ?? "",

    logo:
      data.logo ?? null,

    phone:
      data.phone ?? "",

    primaryCallNumber:
      data.primaryCallNumber ?? "",

    whatsapp:
      data.whatsapp ?? "",

    email:
      data.email ?? "",

    address:
      data.address ?? "",

    primaryServiceRegion:
      data.primaryServiceRegion ?? "",

    serviceAreaInformation:
      data.serviceAreaInformation ?? "",

    businessHours:
      data.businessHours ??
      DEFAULT_BUSINESS_HOURS,

    emergencyAvailability:
      data.emergencyAvailability ?? "",

    social:
      data.social ?? {
        instagram: "",
        facebook: "",
        googleBusiness: "",
        other: "",
      },

    bookingCta:
      data.bookingCta ?? "",

    quoteCta:
      data.quoteCta ?? "",

    defaultSiteTitle:
      data.defaultSiteTitle ?? "",

    defaultSiteDescription:
      data.defaultSiteDescription ?? "",

    defaultOgImage:
      data.defaultOgImage ?? null,

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}

export async function GET() {
  try {
    const session = await auth();

   if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const settings =
      await SiteSettings.findOne()
        .lean();

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
     data: serializeSettings(settings),
    });
  } catch (error) {
    console.error(
      "GET /api/admin/settings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load site settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const session = await auth();

   if (session?.user?.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const body: unknown =
      await request.json();

    const parsed =
      updateSiteSettingsSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors:
            parsed.error.flatten()
              .fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const input = parsed.data;

    const settings =
      await SiteSettings.findOneAndUpdate(
        {},
        {
          $set: {
            businessName:
              input.businessName,

            tagline:
              input.tagline || undefined,

            description:
              input.description ||
              undefined,

            logo:
              input.logo ?? undefined,

            phone:
              input.phone,

            primaryCallNumber:
              input.primaryCallNumber,

            whatsapp:
              input.whatsapp || undefined,

            email:
              input.email || undefined,

            address:
              input.address || undefined,

            primaryServiceRegion:
              input.primaryServiceRegion ||
              undefined,

            serviceAreaInformation:
              input.serviceAreaInformation ||
              undefined,

            businessHours:
              input.businessHours,

            emergencyAvailability:
              input.emergencyAvailability ||
              undefined,

            social: {
              instagram:
                input.social.instagram ||
                undefined,

              facebook:
                input.social.facebook ||
                undefined,

              googleBusiness:
                input.social
                  .googleBusiness ||
                undefined,

              other:
                input.social.other ||
                undefined,
            },

            bookingCta:
              input.bookingCta ||
              undefined,

            quoteCta:
              input.quoteCta ||
              undefined,

            defaultSiteTitle:
              input.defaultSiteTitle ||
              undefined,

            defaultSiteDescription:
              input.defaultSiteDescription ||
              undefined,

            defaultOgImage:
              input.defaultOgImage ??
              undefined,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      )
      .lean();

    if (!settings) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to save site settings.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Site settings saved successfully.",
    data: serializeSettings(settings),
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/settings error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to save site settings.",
      },
      {
        status: 500,
      }
    );
  }
}