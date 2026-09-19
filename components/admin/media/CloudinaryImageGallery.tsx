"use client";

import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface CloudinaryGalleryAsset {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

interface CloudinaryImageGalleryProps {
  value: CloudinaryGalleryAsset[];
  onChange: (value: CloudinaryGalleryAsset[]) => void;
  folder: string;
  maxImages?: number;
  disabled?: boolean;
}

export default function CloudinaryImageGallery({
  value,
  onChange,
  folder,
  maxImages = 12,
  disabled = false,
}: CloudinaryImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);

  /*
   * Keep the latest gallery value available to upload callbacks.
   *
   * Cloudinary can fire multiple success events very quickly
   * when several files are selected together. A ref prevents
   * those callbacks from working with an old React state snapshot.
   */
  const latestValueRef = useRef<CloudinaryGalleryAsset[]>(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  const canUploadMore = value.length < maxImages;

  function handleSuccess(result: CloudinaryUploadWidgetResults) {
    const info = result?.info;

    if (!info || typeof info !== "object") {
      return;
    }

    const publicId = String(info.public_id ?? "");
    const secureUrl = String(info.secure_url ?? "");

    if (!publicId || !secureUrl) {
      return;
    }

    const asset: CloudinaryGalleryAsset = {
      publicId,
      secureUrl,
      width: Number(info.width ?? 0),
      height: Number(info.height ?? 0),
      format: String(info.format ?? "").toLowerCase(),
      bytes: Number(info.bytes ?? 0),
      resourceType: "image",
      alt: "",
    };

    /*
     * Always read the latest gallery from the ref.
     */
    const current = latestValueRef.current;

    /*
     * Prevent the same Cloudinary asset from being
     * inserted twice.
     */
    const alreadyExists = current.some(
      (image) => image.publicId === asset.publicId
    );

    if (alreadyExists) {
      return;
    }

    /*
     * Respect the gallery limit.
     */
    if (current.length >= maxImages) {
      return;
    }

    /*
     * APPEND — never replace.
     */
    const next = [...current, asset];

    /*
     * Update ref immediately so another Cloudinary
     * success event receives this newly-added image.
     */
    latestValueRef.current = next;

    /*
     * Update the parent ServiceForm state.
     */
    onChange(next);
  }

  function removeImage(index: number) {
    const next = latestValueRef.current.filter(
      (_, itemIndex) => itemIndex !== index
    );

    latestValueRef.current = next;
    onChange(next);
  }

  function moveImage(
    index: number,
    direction: "up" | "down"
  ) {
    const current = latestValueRef.current;

    const newIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= current.length
    ) {
      return;
    }

    const next = [...current];

    [next[index], next[newIndex]] = [
      next[newIndex],
      next[index],
    ];

    latestValueRef.current = next;
    onChange(next);
  }

  function updateAlt(index: number, alt: string) {
    const current = latestValueRef.current;

    if (!current[index]) {
      return;
    }

    const next = [...current];

    next[index] = {
      ...next[index],
      alt,
    };

    latestValueRef.current = next;
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {/* GALLERY GRID */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((image, index) => (
            <div
              key={`${image.publicId}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={image.secureUrl}
                  alt={
                    image.alt ||
                    `Gallery image ${index + 1}`
                  }
                  className="h-full w-full object-cover"
                />

                {/* IMAGE NUMBER */}
                <div className="absolute left-2 top-2 flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#061A2B]/90 px-2 text-xs font-bold text-white backdrop-blur">
                  {index + 1}
                </div>
              </div>

              {/* IMAGE CONTROLS */}
              <div className="space-y-3 p-3">
                {/* ALT TEXT */}
                <div>
                  <label
                    htmlFor={`gallery-alt-${index}`}
                    className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                  >
                    Image Alt Text
                  </label>

                  <input
                    id={`gallery-alt-${index}`}
                    value={image.alt}
                    onChange={(event) =>
                      updateAlt(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="Describe this image"
                    maxLength={200}
                    disabled={disabled}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:opacity-60"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-between gap-2">
                  {/* MOVE */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={
                        disabled || index === 0
                      }
                      onClick={() =>
                        moveImage(index, "up")
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#0D6E91] hover:text-[#0D6E91] disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Move image ${
                        index + 1
                      } up`}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      disabled={
                        disabled ||
                        index === value.length - 1
                      }
                      onClick={() =>
                        moveImage(index, "down")
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#0D6E91] hover:text-[#0D6E91] disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Move image ${
                        index + 1
                      } down`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* DELETE */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeImage(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Remove gallery image ${
                      index + 1
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD */}
      {canUploadMore && (
        <CldUploadWidget
          signatureEndpoint="/api/admin/cloudinary/sign"
          options={{
            folder,

            /*
             * IMPORTANT:
             * Multiple files are allowed.
             */
            multiple: true,

            /*
             * Only allow the remaining number of
             * gallery slots in this upload session.
             */
            maxFiles: maxImages - value.length,

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
              disabled={
                disabled ||
                isUploading ||
                !canUploadMore
              }
              onClick={() => open()}
              className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-5 py-7 text-center transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin text-[#0D6E91]" />

                  <span className="mt-2 text-sm font-bold text-slate-800">
                    Uploading...
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    Please wait while your images upload
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                    <UploadCloud className="h-5 w-5 text-[#0D6E91]" />
                  </span>

                  <span className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <ImagePlus className="h-4 w-4 text-[#0D6E91]" />
                    Add Gallery Images
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    {value.length} / {maxImages} images
                  </span>
                </>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* MAXIMUM REACHED */}
      {!canUploadMore && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
          Maximum of {maxImages} gallery images reached.
        </div>
      )}
    </div>
  );
}