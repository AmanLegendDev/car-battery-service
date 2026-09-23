"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ImagePlus,
  Loader2,
  MessageSquareQuote,
  Save,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { toast } from "sonner";

export interface UploadedPhoto {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

export interface TestimonialFormData {
  name: string;
  businessName: string;
  role: string;
  photo: UploadedPhoto | null;
  testimonial: string;
  rating: number | null;
  featured: boolean;
  published: boolean;
  displayOrder: string;
}

interface TestimonialFormProps {
  mode?: "create" | "edit";
  testimonialId?: string;
  initialData?: Partial<TestimonialFormData>;
}

const MAX_TESTIMONIAL_LENGTH = 3000;

function getErrorMessage(value: unknown): string {
  if (typeof value === "string") return value;

  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }

  return "Something went wrong.";
}

function normalizePhoto(
  photo: Partial<UploadedPhoto> | null | undefined
): UploadedPhoto | null {
  if (!photo?.publicId || !photo.secureUrl) return null;

  return {
    publicId: photo.publicId,
    secureUrl: photo.secureUrl,
    width: Number(photo.width ?? 0),
    height: Number(photo.height ?? 0),
    format: String(photo.format ?? "jpg"),
    bytes: Number(photo.bytes ?? 0),
    resourceType: "image",
    alt: String(photo.alt ?? ""),
  };
}

export default function TestimonialForm({
  mode = "create",
  testimonialId,
  initialData,
}: TestimonialFormProps) {
  const isEdit = mode === "edit";

  const [name, setName] = useState(initialData?.name ?? "");
  const [businessName, setBusinessName] = useState(
    initialData?.businessName ?? ""
  );
  const [role, setRole] = useState(initialData?.role ?? "");
  const [testimonial, setTestimonial] = useState(
    initialData?.testimonial ?? ""
  );
  const [rating, setRating] = useState<number | null>(
    initialData?.rating ?? null
  );
  const [photo, setPhoto] = useState<UploadedPhoto | null>(
    normalizePhoto(initialData?.photo)
  );
  const [featured, setFeatured] = useState(
    initialData?.featured ?? false
  );
  const [published, setPublished] = useState(
    initialData?.published ?? false
  );
  const [displayOrder, setDisplayOrder] = useState(
    String(initialData?.displayOrder ?? "0")
  );

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(initialData?.name ?? "");
    setBusinessName(initialData?.businessName ?? "");
    setRole(initialData?.role ?? "");
    setTestimonial(initialData?.testimonial ?? "");
    setRating(initialData?.rating ?? null);
    setPhoto(normalizePhoto(initialData?.photo));
    setFeatured(initialData?.featured ?? false);
    setPublished(initialData?.published ?? false);
    setDisplayOrder(String(initialData?.displayOrder ?? "0"));
  }, [initialData]);

  function clearFieldError(field: string) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    const cleanName = name.trim();
    const cleanBusinessName = businessName.trim();
    const cleanRole = role.trim();
    const cleanTestimonial = testimonial.trim();
    const order = Number(displayOrder);

    if (cleanName.length < 2) {
      nextErrors.name =
        "Customer name must be at least 2 characters.";
    } else if (cleanName.length > 100) {
      nextErrors.name =
        "Customer name cannot exceed 100 characters.";
    }

    if (cleanBusinessName.length > 150) {
      nextErrors.businessName =
        "Business name cannot exceed 150 characters.";
    }

    if (cleanRole.length > 100) {
      nextErrors.role =
        "Role cannot exceed 100 characters.";
    }

    if (cleanTestimonial.length < 10) {
      nextErrors.testimonial =
        "Testimonial must be at least 10 characters.";
    } else if (cleanTestimonial.length > MAX_TESTIMONIAL_LENGTH) {
      nextErrors.testimonial =
        "Testimonial cannot exceed 3000 characters.";
    }

    if (
      rating !== null &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      nextErrors.rating = "Rating must be between 1 and 5.";
    }

    if (
      !Number.isInteger(order) ||
      order < 0 ||
      order > 100000
    ) {
      nextErrors.displayOrder =
        "Display order must be a whole number between 0 and 100000.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handlePhotoUpload(
    result: CloudinaryUploadWidgetResults
  ) {
    const info = result.info;

    if (typeof info !== "object" || info === null) {
      toast.error("Image upload failed.");
      return;
    }

    if (
      !("public_id" in info) ||
      !("secure_url" in info) ||
      typeof info.public_id !== "string" ||
      typeof info.secure_url !== "string"
    ) {
      toast.error("Uploaded image data is invalid.");
      return;
    }

    const width =
      "width" in info && typeof info.width === "number"
        ? info.width
        : 0;

    const height =
      "height" in info && typeof info.height === "number"
        ? info.height
        : 0;

    const bytes =
      "bytes" in info && typeof info.bytes === "number"
        ? info.bytes
        : 0;

    const format =
      "format" in info && typeof info.format === "string"
        ? info.format
        : "jpg";

    if (!width || !height) {
      toast.error("Could not read image dimensions.");
      return;
    }

    setPhoto({
      publicId: info.public_id,
      secureUrl: info.secure_url,
      width,
      height,
      bytes,
      format,
      resourceType: "image",
      alt: `${name.trim() || "Customer"} testimonial photo`,
    });

    toast.success("Customer photo added.");
  }

  function removePhoto() {
    setPhoto(null);
    toast.success("Customer photo removed.");
  }

  function toggleRating(value: number) {
    setRating((current) => (current === value ? null : value));
    clearFieldError("rating");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (isEdit && !testimonialId) {
      toast.error("Review ID is missing.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: name.trim(),
        businessName: businessName.trim() || undefined,
        role: role.trim() || undefined,
        photo: photo
          ? {
              ...photo,
              alt:
                photo.alt ||
                `${name.trim() || "Customer"} testimonial photo`,
            }
          : undefined,
        testimonial: testimonial.trim(),
        ...(rating !== null ? { rating } : {}),
        featured,
        published,
        displayOrder: Number(displayOrder),
      };

      const endpoint = isEdit
        ? `/api/admin/testimonials/${testimonialId}`
        : "/api/admin/testimonials";

      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        if (
          typeof result === "object" &&
          result !== null &&
          "errors" in result &&
          typeof result.errors === "object" &&
          result.errors !== null
        ) {
          const serverErrors: Record<string, string> = {};

          for (const [key, value] of Object.entries(result.errors)) {
            if (
              Array.isArray(value) &&
              typeof value[0] === "string"
            ) {
              serverErrors[key] = value[0];
            }
          }

          setErrors(serverErrors);
        }

        throw new Error(getErrorMessage(result));
      }

      toast.success(
        isEdit
          ? "Review updated successfully."
          : "Review added successfully."
      );

      if (!isEdit) {
        setName("");
        setBusinessName("");
        setRole("");
        setTestimonial("");
        setRating(null);
        setPhoto(null);
        setFeatured(false);
        setPublished(false);
        setDisplayOrder("0");
        setErrors({});
      }
    } catch (error) {
      console.error(
        isEdit
          ? "Update testimonial error:"
          : "Create testimonial error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : isEdit
            ? "Failed to update review."
            : "Failed to add review."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28">
      {/* CUSTOMER */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08263D] shadow-xl shadow-black/10">
        <SectionHeader
          icon={<UserRound size={18} />}
          title="Customer"
          description="Add the genuine customer details associated with this feedback."
        />

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <Field
            label="Customer Name"
            required
            hint="The real name of the customer."
            error={errors.name}
          >
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              maxLength={100}
              placeholder="e.g. John Smith"
              className={inputClass(Boolean(errors.name))}
            />
          </Field>

          <Field
            label="Business Name"
            hint="Optional. Leave empty for individual customers."
            error={errors.businessName}
          >
            <input
              value={businessName}
              onChange={(event) => {
                setBusinessName(event.target.value);
                clearFieldError("businessName");
              }}
              maxLength={150}
              placeholder="e.g. ABC Business"
              className={inputClass(Boolean(errors.businessName))}
            />
          </Field>

          <Field
            label="Role / Designation"
            hint="Optional. Example: Owner, Manager, Director."
            error={errors.role}
          >
            <input
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                clearFieldError("role");
              }}
              maxLength={100}
              placeholder="e.g. Business Owner"
              className={inputClass(Boolean(errors.role))}
            />
          </Field>

          {/* PHOTO */}
          <div className="md:col-span-2">
            <Field
              label="Customer Photo"
              hint="Optional. If unavailable, the public website can use initials."
            >
              {!photo ? (
                <CldUploadWidget
                  uploadPreset="car_battery_service"
                  onSuccess={handlePhotoUpload}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="group flex w-full items-center gap-4 rounded-xl border border-dashed border-[#2A526B] bg-[#061A2B] p-5 text-left transition hover:border-[#0D6E91] hover:bg-[#0D6E91]/10"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0D6E91]/15 text-[#57C7EE] ring-1 ring-[#0D6E91]/20">
                        <ImagePlus size={22} />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-[#F8FAFC]">
                          Upload customer photo
                        </span>
                        <span className="mt-1 block text-xs text-[#718895]">
                          Optional · Use a real customer photo only
                        </span>
                      </span>
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-[#061A2B] p-4 sm:flex-row sm:items-center">
                  <img
                    src={photo.secureUrl}
                    alt={photo.alt || "Customer testimonial photo"}
                    className="h-20 w-20 rounded-xl object-cover ring-1 ring-white/[0.1]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#F8FAFC]">
                      Customer photo uploaded
                    </p>

                    <p className="mt-1 text-xs text-[#718895]">
                      {photo.format.toUpperCase()} · {photo.width}×
                      {photo.height}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <CldUploadWidget
                      uploadPreset="car_battery_service"
                      onSuccess={handlePhotoUpload}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="rounded-lg border border-white/[0.08] bg-[#08263D] px-3 py-2 text-xs font-semibold text-[#A8BBC8] transition hover:border-[#0D6E91] hover:text-[#57C7EE]"
                        >
                          Replace
                        </button>
                      )}
                    </CldUploadWidget>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </Field>
          </div>
        </div>
      </section>

      {/* REVIEW */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08263D] shadow-xl shadow-black/10">
        <SectionHeader
          icon={<MessageSquareQuote size={18} />}
          title="Review"
          description="Only enter genuine customer feedback. Never invent review content or ratings."
        />

        <div className="space-y-6 p-5 md:p-6">
          <Field
            label="Testimonial"
            required
            hint="Enter the genuine customer feedback."
            error={errors.testimonial}
          >
            <div className="relative">
              <textarea
                value={testimonial}
                onChange={(event) => {
                  setTestimonial(event.target.value);
                  clearFieldError("testimonial");
                }}
                maxLength={MAX_TESTIMONIAL_LENGTH}
                rows={7}
                placeholder="Enter the genuine customer feedback..."
                className={`${inputClass(
                  Boolean(errors.testimonial)
                )} min-h-40 resize-y pr-24`}
              />

              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md border border-white/[0.07] bg-[#08263D] px-2 py-1 text-[11px] font-medium text-[#718895]">
                {testimonial.length.toLocaleString()} /{" "}
                {MAX_TESTIMONIAL_LENGTH.toLocaleString()}
              </div>
            </div>
          </Field>

          <Field
            label="Rating"
            hint="Optional. Only add a genuine/verified rating."
            error={errors.rating}
          >
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const active =
                  rating !== null && value <= rating;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleRating(value)}
                    aria-label={`${value} star rating`}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                      active
                        ? "border-[#FFD400]/40 bg-[#FFD400]/10 text-[#FFD400]"
                        : "border-white/[0.08] bg-[#061A2B] text-[#385267] hover:border-[#0D6E91] hover:text-[#57C7EE]"
                    }`}
                  >
                    <Star
                      size={20}
                      fill={active ? "currentColor" : "none"}
                    />
                  </button>
                );
              })}

              {rating !== null && (
                <button
                  type="button"
                  onClick={() => setRating(null)}
                  className="ml-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#718895] hover:text-[#F8FAFC]"
                >
                  <X size={14} />
                  Clear rating
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-[#718895]">
              {rating
                ? `${rating} out of 5 selected`
                : "No rating selected"}
            </p>
          </Field>
        </div>
      </section>

      {/* DISPLAY */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08263D] shadow-xl shadow-black/10">
        <SectionHeader
          icon={<Star size={18} />}
          title="Display"
          description="Control public visibility and testimonial ordering."
        />

        <div className="space-y-4 p-5 md:p-6">
          <ToggleRow
            title="Featured testimonial"
            description="Highlight this testimonial in featured testimonial sections."
            checked={featured}
            onChange={setFeatured}
          />

          <ToggleRow
            title="Published"
            description="Make this testimonial visible on the public website."
            checked={published}
            onChange={setPublished}
          />

          <Field
            label="Display Order"
            hint="Lower numbers appear first."
            error={errors.displayOrder}
          >
            <input
              type="number"
              min={0}
              max={100000}
              step={1}
              value={displayOrder}
              onChange={(event) => {
                setDisplayOrder(event.target.value);
                clearFieldError("displayOrder");
              }}
              className={`${inputClass(
                Boolean(errors.displayOrder)
              )} max-w-xs`}
            />
          </Field>
        </div>
      </section>

      {/* ACTION BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-[#061A2B]/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4">
          <div className="mr-auto hidden text-xs text-[#718895] sm:block">
            {published
              ? "This testimonial will be published."
              : "This testimonial will be saved as unpublished."}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-6 text-sm font-bold text-[#061A2B] shadow-lg shadow-[#FFD400]/10 transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {isEdit ? "Saving..." : "Adding..."}
              </>
            ) : (
              <>
                {isEdit ? (
                  <Save size={17} />
                ) : (
                  <Check size={17} />
                )}
                {isEdit ? "Save Changes" : "Add Testimonial"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 border-b border-white/[0.07] bg-[#061A2B]/40 px-5 py-4 md:px-6">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFD400]/10 text-[#FFD400] ring-1 ring-[#FFD400]/10">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-[#F8FAFC]">
          {title}
        </h2>

        <p className="mt-0.5 max-w-2xl text-xs leading-5 text-[#718895]">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <label className="block text-sm font-semibold text-[#F8FAFC]">
          {label}
          {required && (
            <span className="ml-1 text-[#FFD400]">*</span>
          )}
        </label>

        {hint && (
          <p className="mt-1 text-xs leading-5 text-[#718895]">
            {hint}
          </p>
        )}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#061A2B] p-4 text-left transition hover:border-white/[0.13] hover:bg-[#0A2D47]"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#F8FAFC]">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-[#718895]">
          {description}
        </span>
      </span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#FFD400]" : "bg-[#29465A]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#F8FAFC] shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-[#061A2B] px-3.5 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#607887] ${
    hasError
      ? "border-red-400/60 focus:border-red-300 focus:ring-2 focus:ring-red-400/10"
      : "border-white/[0.08] focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/20"
  }`;
}
