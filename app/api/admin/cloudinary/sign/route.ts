import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

const MAX_TIMESTAMP_AGE_SECONDS = 10 * 60;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const paramsToSign = body?.paramsToSign;

    if (
      !paramsToSign ||
      typeof paramsToSign !== "object" ||
      Array.isArray(paramsToSign)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid signing parameters",
        },
        { status: 400 }
      );
    }

    const timestamp = Number(paramsToSign.timestamp);

    if (!Number.isFinite(timestamp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid timestamp",
        },
        { status: 400 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    if (Math.abs(now - timestamp) > MAX_TIMESTAMP_AGE_SECONDS) {
      return NextResponse.json(
        {
          success: false,
          message: "Signature timestamp expired",
        },
        { status: 400 }
      );
    }

    const folder = paramsToSign.folder;

    if (
      typeof folder !== "string" ||
      !folder.startsWith("car-battery-service/")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary folder",
        },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Cloudinary signature error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate Cloudinary signature",
      },
      { status: 500 }
    );
  }
}