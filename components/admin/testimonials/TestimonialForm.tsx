"use client";

import { useState } from "react";
import {
  Check,
  ImagePlus,
  Loader2,
  MessageSquareQuote,
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

interface UploadedPhoto {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

const MAX_TESTIMONIAL_LENGTH = 3000;

function getErrorMessage(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

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

export default function TestimonialForm() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState("");

  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  const [photo, setPhoto] =
    useState<UploadedPhoto | null>(null);

  const [featured, setFeatured] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  const [displayOrder, setDisplayOrder] =
    useState("0");

  const [submitting, setSubmitting] =
    useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  function clearFieldError(field: string) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      return next;
    });
  }

  function validate() {
    const nextErrors: Record<string, string> =
      {};

    const cleanName = name.trim();
    const cleanBusinessName =
      businessName.trim();
    const cleanRole = role.trim();
    const cleanTestimonial =
      testimonial.trim();

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
    } else if (
      cleanTestimonial.length >
      MAX_TESTIMONIAL_LENGTH
    ) {
      nextErrors.testimonial =
        "Testimonial cannot exceed 3000 characters.";
    }

    if (
      rating !== null &&
      (rating < 1 || rating > 5)
    ) {
      nextErrors.rating =
        "Rating must be between 1 and 5.";
    }

    const order = Number(displayOrder);

    if (
      !Number.isInteger(order) ||
      order < 0 ||
      order > 100000
    ) {
      nextErrors.displayOrder =
        "Display order must be a whole number between 0 and 100000.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function handlePhotoUpload(
    result: CloudinaryUploadWidgetResults
  ) {
    const info = result.info;

    if (
      typeof info !== "object" ||
      info === null
    ) {
      toast.error("Image upload failed.");
      return;
    }

    if (
      !("public_id" in info) ||
      !("secure_url" in info) ||
      typeof info.public_id !== "string" ||
      typeof info.secure_url !== "string"
    ) {
      toast.error(
        "Uploaded image data is invalid."
      );
      return;
    }

    const width =
      "width" in info &&
      typeof info.width === "number"
        ? info.width
        : 0;

    const height =
      "height" in info &&
      typeof info.height === "number"
        ? info.height
        : 0;

    const bytes =
      "bytes" in info &&
      typeof info.bytes === "number"
        ? info.bytes
        : 0;

    const format =
      "format" in info &&
      typeof info.format === "string"
        ? info.format
        : "jpg";

    if (!width || !height) {
      toast.error(
        "Could not read image dimensions."
      );
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
      alt: `${
        name.trim() || "Customer"
      } testimonial photo`,
    });

    toast.success(
      "Customer photo added."
    );
  }

  function removePhoto() {
    setPhoto(null);

    toast.success(
      "Customer photo removed."
    );
  }

  function toggleRating(value: number) {
    setRating((current) =>
      current === value ? null : value
    );

    clearFieldError("rating");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validate()) {
      toast.error(
        "Please fix the highlighted fields."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: name.trim(),
        businessName:
          businessName.trim() || undefined,
        role: role.trim() || undefined,

        ...(photo
          ? {
              photo: {
                ...photo,
                alt: `${
                  name.trim() || "Customer"
                } testimonial photo`,
              },
            }
          : {}),

        testimonial:
          testimonial.trim(),

        ...(rating !== null
          ? { rating }
          : {}),

        featured,
        published,
        displayOrder:
          Number(displayOrder),
      };

      const response = await fetch(
        "/api/admin/testimonials",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result: unknown =
        await response.json();

      if (!response.ok) {
        if (
          typeof result === "object" &&
          result !== null &&
          "errors" in result &&
          typeof result.errors ===
            "object" &&
          result.errors !== null
        ) {
          const serverErrors: Record<
            string,
            string
          > = {};

          for (const [
            key,
            value,
          ] of Object.entries(
            result.errors
          )) {
            if (
              Array.isArray(value) &&
              typeof value[0] === "string"
            ) {
              serverErrors[key] =
                value[0];
            }
          }

          setErrors(serverErrors);
        }

        throw new Error(
          getErrorMessage(result)
        );
      }

      toast.success(
        "Testimonial added successfully."
      );

      // Reset form after successful DB insert.
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
    } catch (error) {
      console.error(
        "Create testimonial error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add testimonial."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pb-28"
    >
      {/* ------------------------------------------------------------------ */}
      {/* CUSTOMER                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              className={inputClass(
                Boolean(errors.name)
              )}
            />
          </Field>

          <Field
            label="Business Name"
            hint="Optional."
            error={errors.businessName}
          >
            <input
              value={businessName}
              onChange={(event) => {
                setBusinessName(
                  event.target.value
                );
                clearFieldError(
                  "businessName"
                );
              }}
              maxLength={150}
              placeholder="e.g. ABC Business"
              className={inputClass(
                Boolean(
                  errors.businessName
                )
              )}
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
              className={inputClass(
                Boolean(errors.role)
              )}
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
                  onSuccess={
                    handlePhotoUpload
                  }
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="group flex w-full items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-left transition hover:border-slate-400 hover:bg-slate-100"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                        <ImagePlus
                          size={22}
                        />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-slate-900">
                          Upload customer
                          photo
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          Optional · Use a
                          real customer photo
                          only
                        </span>
                      </span>
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                  <img
                    src={photo.secureUrl}
                    alt={
                      photo.alt ||
                      "Customer testimonial photo"
                    }
                    className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Customer photo
                      uploaded
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {photo.format.toUpperCase()}{" "}
                      · {photo.width}×
                      {photo.height}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <CldUploadWidget
                      uploadPreset="car_battery_service"
                      onSuccess={
                        handlePhotoUpload
                      }
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() =>
                            open()
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Replace
                        </button>
                      )}
                    </CldUploadWidget>

                    <button
                      type="button"
                      onClick={
                        removePhoto
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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

      {/* ------------------------------------------------------------------ */}
      {/* REVIEW                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={
            <MessageSquareQuote size={18} />
          }
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
                  setTestimonial(
                    event.target.value
                  );
                  clearFieldError(
                    "testimonial"
                  );
                }}
                maxLength={
                  MAX_TESTIMONIAL_LENGTH
                }
                rows={7}
                placeholder="Enter the genuine customer feedback..."
                className={`${inputClass(
                  Boolean(
                    errors.testimonial
                  )
                )} min-h-40 resize-y`}
              />

              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-400 shadow-sm">
                {testimonial.length.toLocaleString()}{" "}
                /{" "}
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
              {[1, 2, 3, 4, 5].map(
                (value) => {
                  const active =
                    rating !== null &&
                    value <= rating;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        toggleRating(value)
                      }
                      aria-label={`${value} star rating`}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                        active
                          ? "border-amber-300 bg-amber-50 text-amber-500"
                          : "border-slate-200 bg-white text-slate-300 hover:border-slate-300 hover:text-slate-400"
                      }`}
                    >
                      <Star
                        size={20}
                        fill={
                          active
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  );
                }
              )}

              {rating !== null && (
                <button
                  type="button"
                  onClick={() =>
                    setRating(null)
                  }
                  className="ml-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  <X size={14} />
                  Clear rating
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {rating
                ? `${rating} out of 5 selected`
                : "No rating selected"}
            </p>
          </Field>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DISPLAY                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                setDisplayOrder(
                  event.target.value
                );
                clearFieldError(
                  "displayOrder"
                );
              }}
              className={`${inputClass(
                Boolean(
                  errors.displayOrder
                )
              )} max-w-xs`}
            />
          </Field>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ACTION BAR                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-4">
          <div className="mr-auto hidden text-xs text-slate-500 sm:block">
            {published
              ? "This testimonial will be published."
              : "This testimonial will be saved as a draft."}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Adding...
              </>
            ) : (
              <>
                <Check size={17} />
                Add Testimonial
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* UI HELPERS                                                                 */
/* -------------------------------------------------------------------------- */

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
    <div className="flex gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-0.5 max-w-2xl text-xs leading-5 text-slate-500">
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
        <label className="block text-sm font-semibold text-slate-800">
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>

        {hint && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {hint}
          </p>
        )}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
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
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-slate-950"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function inputClass(
  hasError: boolean
) {
  return `w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
      : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
  }`;
}