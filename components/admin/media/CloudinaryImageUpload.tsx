"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useState } from "react";

export interface CloudinaryImageAsset {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface CloudinaryImageUploadProps {
  value: CloudinaryImageAsset | null;
  onChange: (value: CloudinaryImageAsset | null) => void;
  folder: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function CloudinaryImageUpload({
  value,
  onChange,
  folder,
  label = "Image",
  description = "Upload an image.",
  disabled = false,
}: CloudinaryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

function handleSuccess(
  result: CloudinaryUploadWidgetResults
) {
  if (
    !result.info ||
    typeof result.info === "string"
  ) {
    setIsUploading(false);
    return;
  }

    const info = result?.info;

    if (!info || typeof info !== "object") {
      setIsUploading(false);
      return;
    }

    const asset: CloudinaryImageAsset = {
      publicId: String(info.public_id ?? ""),
      secureUrl: String(info.secure_url ?? ""),
      width: Number(info.width ?? 0),
      height: Number(info.height ?? 0),
      format: String(info.format ?? "").toLowerCase(),
      bytes: Number(info.bytes ?? 0),
      resourceType: "image",
      alt: "",
    };

    if (!asset.publicId || !asset.secureUrl) {
      setIsUploading(false);
      return;
    }

    onChange(asset);
    setIsUploading(false);
  }

  return (
    <div>
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <ImagePlus className="h-4 w-4 text-[#0D6E91]" />

          <h3 className="text-sm font-bold text-slate-900">
            {label}
          </h3>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative aspect-video overflow-hidden bg-slate-100">
            <img
              src={value.secureUrl}
              alt={value.alt || label}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">
                {value.publicId}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {value.width} × {value.height} ·{" "}
                {value.format.toUpperCase()}
              </p>
            </div>

            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => onChange(null)}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          signatureEndpoint="/api/admin/cloudinary/sign"
          options={{
            folder,
            multiple: false,
            sources: ["local"],
            clientAllowedFormats: [
              "jpg",
              "jpeg",
              "png",
              "webp",
              "avif",
            ],
            maxFileSize: 10_000_000,
            resourceType: "image",
          }}
          onOpen={() => {
            setIsUploading(true);
          }}
          onClose={() => {
            setIsUploading(false);
          }}
          onSuccess={handleSuccess}
        >
          {({ open }) => (
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => open()}
              className="flex min-h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-[#0D6E91]" />

                  <span className="mt-3 text-sm font-bold text-slate-800">
                    Uploading image...
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    Please wait
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <UploadCloud className="h-6 w-6 text-[#0D6E91]" />
                  </span>

                  <span className="mt-3 text-sm font-bold text-slate-800">
                    Upload Image
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG, WebP or AVIF · Max 10MB
                  </span>
                </>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}