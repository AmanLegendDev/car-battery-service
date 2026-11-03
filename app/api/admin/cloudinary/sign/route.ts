import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type UploadResourceType = "image" | "video";

const BOOKING_UPLOAD_FOLDER = "car-battery-service/bookings";

const MAX_TIMESTAMP_AGE_SECONDS = 10 * 60;

const CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY;

const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET;

const IMAGE_UPLOAD_PRESET =
  process.env.CLOUDINARY_BOOKING_IMAGE_PRESET;

const VIDEO_UPLOAD_PRESET =
  process.env.CLOUDINARY_BOOKING_VIDEO_PRESET;

export async function POST(request: Request) {
  try {
    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Upload service is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

    if (!IMAGE_UPLOAD_PRESET || !VIDEO_UPLOAD_PRESET) {
      console.error("Booking upload presets are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Upload service is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const resourceType = body?.resourceType as
      | UploadResourceType
      | undefined;

    if (
      resourceType !== "image" &&
      resourceType !== "video"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid upload resource type.",
        },
        { status: 400 }
      );
    }

    /*
     * Select a server-controlled upload preset.
     */

    const uploadPreset =
      resourceType === "image"
        ? IMAGE_UPLOAD_PRESET
        : VIDEO_UPLOAD_PRESET;

    /*
     * Generate timestamp on the server.
     */

    const timestamp = Math.floor(Date.now() / 1000);

    /*
     * Only these parameters are signed.
     * Never accept arbitrary signing parameters
     * from the client.
     */

    const paramsToSign = {
      timestamp,
      folder: BOOKING_UPLOAD_FOLDER,
      upload_preset: uploadPreset,
    };

    const signature =
      cloudinary.utils.api_sign_request(
        paramsToSign,
        CLOUDINARY_API_SECRET
      );

    return NextResponse.json(
      {
        success: true,
        signature,
        timestamp,
        apiKey: CLOUDINARY_API_KEY,
        cloudName: CLOUDINARY_CLOUD_NAME,
        folder: BOOKING_UPLOAD_FOLDER,
        resourceType,
        uploadPreset,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to prepare your upload. Please try again.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}