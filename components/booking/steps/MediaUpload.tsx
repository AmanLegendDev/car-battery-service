
"use client";

import {
  ImagePlus,
  Video,
  UploadCloud,
  Loader2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useRef, useState } from "react";

interface MediaUploadProps {
  images: string[];
  video: string;
  onImagesChange: (images: string[]) => void;
  onVideoChange: (video: string) => void;
  disabled?: boolean;
}

interface SignatureResponse {
  success: boolean;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: "image" | "video";
  uploadPreset: string;
  message?: string;
}

const SIGNATURE_ENDPOINT = "/api/booking/cloudinary/sign";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

export default function MediaUpload({
  images,
  video,
  onImagesChange,
  onVideoChange,
  disabled = false,
}: MediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const [error, setError] = useState("");

  const remainingImages = MAX_IMAGES - images.length;

  async function getSignature(
    resourceType: "image" | "video"
  ): Promise<SignatureResponse> {
    const response = await fetch(SIGNATURE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resourceType }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to prepare upload."
      );
    }

    return data as SignatureResponse;
  }

  function uploadToCloudinary(
    file: File,
    resourceType: "image" | "video",
    signatureData: SignatureResponse,
    onProgress: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("signature", signatureData.signature);
      formData.append("folder", signatureData.folder);
      formData.append("upload_preset", signatureData.uploadPreset);

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round(
            (event.loaded / event.total) * 100
          );

          onProgress(progress);
        }
      };

      xhr.onload = () => {
        try {
          const result = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            if (!result.secure_url) {
              reject(new Error("Cloudinary URL was not returned."));
              return;
            }

            resolve(result.secure_url);
          } else {
            reject(
              new Error(
                result.error?.message || "Cloudinary upload failed."
              )
            );
          }
        } catch {
          reject(new Error("Invalid upload response."));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during upload."));
      };

      xhr.onabort = () => {
        reject(new Error("Upload was cancelled."));
      };

      xhr.send(formData);
    });
  }

  async function handleImageSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    event.target.value = "";

    if (!files.length) return;

    setError("");

    if (files.length > remainingImages) {
      setError(
        `You can upload only ${remainingImages} more image(s).`
      );
      return;
    }

    for (const file of files) {
      if (!IMAGE_TYPES.includes(file.type)) {
        setError("Only JPG, PNG and WEBP images are allowed.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`${file.name} exceeds the 10 MB limit.`);
        return;
      }
    }

    setImageUploading(true);
    setImageProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const signature = await getSignature("image");

        const url = await uploadToCloudinary(
          file,
          "image",
          signature,
          (progress) => {
            const overallProgress = Math.round(
              ((index + progress / 100) / files.length) * 100
            );

            setImageProgress(overallProgress);
          }
        );

        uploadedUrls.push(url);
      }

      onImagesChange([...images, ...uploadedUrls]);
      setImageProgress(100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload images."
      );
    } finally {
      setImageUploading(false);
    }
  }

  async function handleVideoSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setError("");

    if (!VIDEO_TYPES.includes(file.type)) {
      setError("Only MP4, MOV and WEBM videos are allowed.");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video size must not exceed 100 MB.");
      return;
    }

    setVideoUploading(true);
    setVideoProgress(0);

    try {
      const signature = await getSignature("video");

      const url = await uploadToCloudinary(
        file,
        "video",
        signature,
        setVideoProgress
      );

      onVideoChange(url);
      setVideoProgress(100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload video."
      );
    } finally {
      setVideoUploading(false);
    }
  }

  function removeImage(index: number) {
    onImagesChange(
      images.filter((_, imageIndex) => imageIndex !== index)
    );
    setError("");
  }

  function removeVideo() {
    onVideoChange("");
    setError("");
  }

  const busy = imageUploading || videoUploading;

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}

      <div>
        <h3 className="text-sm font-bold text-slate-900">
          Vehicle Photos & Video
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Upload photos or a short video to help our mechanic
          understand the issue before arriving.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* IMAGE UPLOAD */}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4 text-[#0D6E91]" />

            <h4 className="text-sm font-bold text-slate-800">
              Vehicle Photos
            </h4>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        {/* IMAGE PREVIEWS */}

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              >
                <div className="aspect-square">
                  <img
                    src={image}
                    alt={`Vehicle photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <span className="absolute left-2 top-2 rounded-md bg-[#061A2B]/80 px-2 py-1 text-[10px] font-bold text-white">
                  Photo {index + 1}
                </span>

                <button
                  type="button"
                  disabled={disabled || busy}
                  onClick={() => removeImage(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* IMAGE PROGRESS */}

        {imageUploading && (
          <div className="space-y-2 rounded-xl border border-[#0D6E91]/20 bg-[#0D6E91]/5 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#0D6E91]" />
                Uploading photos...
              </span>

              <span>{imageProgress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#0D6E91] transition-all"
                style={{ width: `${imageProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* IMAGE SELECTOR */}

        {remainingImages > 0 && (
          <>
            <input
              ref={imageInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              hidden
              disabled={disabled || busy}
              onChange={handleImageSelection}
            />

            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => imageInputRef.current?.click()}
              className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {imageUploading ? (
                <Loader2 className="h-7 w-7 animate-spin text-[#0D6E91]" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <UploadCloud className="h-5 w-5 text-[#0D6E91]" />
                </span>
              )}

              <span className="mt-3 text-sm font-bold text-slate-800">
                {imageUploading
                  ? "Uploading images..."
                  : "Select Images"}
              </span>

              <span className="mt-1 text-xs text-slate-500">
                JPG, PNG or WEBP · Maximum 10 MB each
              </span>
            </button>
          </>
        )}
      </section>

      {/* VIDEO UPLOAD */}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4 text-[#0D6E91]" />

          <h4 className="text-sm font-bold text-slate-800">
            Vehicle Video
          </h4>

          <span className="text-[10px] text-slate-400">
            Optional
          </span>
        </div>

        {/* VIDEO PREVIEW */}

        {video ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <video
              src={video}
              controls
              playsInline
              preload="metadata"
              className="max-h-64 w-full bg-black"
            />

            <div className="flex items-center justify-between gap-3 p-3">
              <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Video uploaded successfully
              </span>

              <button
                type="button"
                disabled={disabled || busy}
                onClick={removeVideo}
                className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              ref={videoInputRef}
              type="file"
              accept=".mp4,.mov,.webm"
              hidden
              disabled={disabled || busy}
              onChange={handleVideoSelection}
            />

            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => videoInputRef.current?.click()}
              className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {videoUploading ? (
                <Loader2 className="h-7 w-7 animate-spin text-[#0D6E91]" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Video className="h-5 w-5 text-[#0D6E91]" />
                </span>
              )}

              <span className="mt-3 text-sm font-bold text-slate-800">
                {videoUploading
                  ? "Uploading video..."
                  : "Select Video"}
              </span>

              <span className="mt-1 text-xs text-slate-500">
                MP4, MOV or WEBM · Maximum 100 MB
              </span>
            </button>
          </>
        )}

        {/* VIDEO PROGRESS */}

        {videoUploading && (
          <div className="space-y-2 rounded-xl border border-[#0D6E91]/20 bg-[#0D6E91]/5 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#0D6E91]" />
                Uploading video...
              </span>

              <span>{videoProgress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#0D6E91] transition-all"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <p className="text-[11px] leading-5 text-slate-400">
        Uploading photos and videos is optional. Your mechanic
        can still assist you if you choose not to upload media.
      </p>
    </div>
  );
}
