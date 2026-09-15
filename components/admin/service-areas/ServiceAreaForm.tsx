"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ExternalLink,
  Globe,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import CloudinaryImageUpload, {
  type CloudinaryImageAsset,
} from "@/components/admin/media/CloudinaryImageUpload";

import {
  createServiceAreaSchema,
} from "@/validations/serviceArea";

interface StringItem {
  id: string;
  value: string;
}

interface ServiceAreaFormState {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;

  suburbs: string[];
  postcodes: string[];

  heroImage: CloudinaryImageAsset | null;

  mapUrl: string;
  serviceAvailability: string;

  featured: boolean;
  displayOrder: number;
  status: "draft" | "active";

  seoTitle: string;
  seoDescription: string;
}

interface FieldErrors {
  [key: string]: string | undefined;
}

const INITIAL_FORM: ServiceAreaFormState = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",

  suburbs: [],
  postcodes: [],

  heroImage: null,

  mapUrl: "",
  serviceAvailability: "",

  featured: false,
  displayOrder: 0,
  status: "draft",

  seoTitle: "",
  seoDescription: "",
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createItemId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) return null;

  return (
    <p className="mt-2 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}

function SectionHeader({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: typeof MapPin;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-sm font-black text-[#FFD400]">
        {number}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#0D6E91]" />

          <h2 className="text-lg font-black tracking-tight text-slate-950">
            {title}
          </h2>
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Label({
  children,
  required = false,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-bold text-slate-800"
    >
      {children}

      {required && (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  );
}

function Counter({
  value,
  max,
}: {
  value: string;
  max: number;
}) {
  return (
    <div className="mt-1.5 flex justify-end text-[11px] font-medium text-slate-400">
      {value.length}/{max}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#0D6E91]/40 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="min-w-0">
        <span className="block text-sm font-bold text-slate-900">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>

      <span
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked
            ? "bg-[#0D6E91]"
            : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition",
            checked
              ? "left-6"
              : "left-1",
          ].join(" ")}
        />
      </span>
    </button>
  );
}

function StringListEditor({
  title,
  description,
  items,
  placeholder,
  addLabel,
  onChange,
  error,
  maxItems,
  itemLabel,
  inputType = "text",
}: {
  title: string;
  description: string;
  items: StringItem[];
  placeholder: string;
  addLabel: string;
  onChange: (items: StringItem[]) => void;
  error?: string;
  maxItems: number;
  itemLabel: string;
  inputType?: "text";
}) {
  function addItem() {
    if (items.length >= maxItems) return;

    onChange([
      ...items,
      {
        id: createItemId(),
        value: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange(
      items.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function updateItem(index: number, value: string) {
    const next = [...items];

    next[index] = {
      ...next[index],
      value,
    };

    onChange(next);
  }

  function moveItem(
    index: number,
    direction: "up" | "down"
  ) {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= items.length
    ) {
      return;
    }

    const next = [...items];

    [next[index], next[newIndex]] = [
      next[newIndex],
      next[index],
    ];

    onChange(next);
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-black text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-xs font-black text-[#FFD400]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`${itemLabel}-${item.id}`}
                  className="sr-only"
                >
                  {itemLabel} {index + 1}
                </label>

                <input
                  id={`${itemLabel}-${item.id}`}
                  type={inputType}
                  value={item.value}
                  onChange={(event) =>
                    updateItem(
                      index,
                      event.target.value
                    )
                  }
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
                />
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() =>
                    moveItem(index, "up")
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#0D6E91] hover:text-[#0D6E91] disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label={`Move ${itemLabel} ${
                    index + 1
                  } up`}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={
                    index === items.length - 1
                  }
                  onClick={() =>
                    moveItem(index, "down")
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#0D6E91] hover:text-[#0D6E91] disabled:cursor-not-allowed disabled:opacity-25"
                  aria-label={`Move ${itemLabel} ${
                    index + 1
                  } down`}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-500 transition hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={items.length >= maxItems}
        onClick={addItem}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#0D6E91]/40 bg-[#0D6E91]/5 px-4 py-3 text-xs font-black text-[#0D6E91] transition hover:bg-[#0D6E91]/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>

      {items.length >= maxItems && (
        <p className="mt-2 text-[11px] text-slate-400">
          Maximum of {maxItems} items reached.
        </p>
      )}

      <FieldError message={error} />
    </div>
  );
}

export default function ServiceAreaForm() {
  const router = useRouter();

  const [form, setForm] =
    useState<ServiceAreaFormState>(
      INITIAL_FORM
    );

  const [suburbs, setSuburbs] = useState<
    StringItem[]
  >([]);

  const [postcodes, setPostcodes] = useState<
    StringItem[]
  >([]);

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showSeoPreview, setShowSeoPreview] =
    useState(false);

  const updateField = <
    K extends keyof ServiceAreaFormState
  >(
    field: K,
    value: ServiceAreaFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  function handleNameChange(value: string) {
    updateField("name", value);

    if (!slugEdited) {
      updateField(
        "slug",
        slugify(value)
      );
    }
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);

    updateField(
      "slug",
      slugify(value)
    );
  }

  const cleanedSuburbs = useMemo(
    () =>
      suburbs
        .map((item) => item.value.trim())
        .filter(Boolean),
    [suburbs]
  );

  const cleanedPostcodes = useMemo(
    () =>
      postcodes
        .map((item) => item.value.trim())
        .filter(Boolean),
    [postcodes]
  );

  function buildPayload(): ServiceAreaFormState {
    return {
      ...form,
      name: form.name.trim(),
      slug: slugify(form.slug),
      shortDescription:
        form.shortDescription.trim(),
      description: form.description.trim(),

      suburbs: cleanedSuburbs,

      postcodes: cleanedPostcodes,

      mapUrl: form.mapUrl.trim(),

      serviceAvailability:
        form.serviceAvailability.trim(),

      seoTitle: form.seoTitle.trim(),

      seoDescription:
        form.seoDescription.trim(),
    };
  }

  function mapZodErrors(
    issues: Array<{
      path: PropertyKey[];
      message: string;
    }>
  ): FieldErrors {
    const next: FieldErrors = {};

    for (const issue of issues) {
      const key = String(
        issue.path[0] ?? "form"
      );

      if (!next[key]) {
        next[key] = issue.message;
      }
    }

    return next;
  }

  async function handleSubmit() {
    if (isSubmitting) return;

    setErrors({});

    const payload = buildPayload();

    const parsed =
      createServiceAreaSchema.safeParse(
        payload
      );

    if (!parsed.success) {
      const fieldErrors =
        mapZodErrors(parsed.error.issues);

      setErrors(fieldErrors);

      toast.error(
        "Please fix the highlighted fields."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/admin/service-areas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            parsed.data
          ),
        }
      );

      const result: unknown =
        await response.json();

      if (
        !result ||
        typeof result !== "object"
      ) {
        throw new Error(
          "Unexpected server response."
        );
      }

      const data = result as {
        success?: boolean;
        message?: string;
        errors?: Record<
          string,
          string[] | undefined
        >;
        field?: string;
      };

      if (!response.ok || !data.success) {
        if (data.errors) {
          const serverErrors: FieldErrors =
            {};

          for (const [
            key,
            messages,
          ] of Object.entries(
            data.errors
          )) {
            if (messages?.[0]) {
              serverErrors[key] =
                messages[0];
            }
          }

          setErrors(serverErrors);
        }

        if (data.field && data.message) {
          setErrors((current) => ({
            ...current,
            [data.field as string]:
              data.message,
          }));
        }

        throw new Error(
          data.message ||
            "Unable to create service area."
        );
      }

      toast.success(
        "Service area created successfully."
      );

      router.push(
        "/admin/service-areas"
      );

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the service area.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    router.push(
      "/admin/service-areas"
    );
  }

  const previewTitle =
    form.seoTitle.trim() ||
    form.name.trim() ||
    "Service Area";

  const previewDescription =
    form.seoDescription.trim() ||
    form.shortDescription.trim() ||
    "Mobile car battery service information.";

  return (
    <div className="pb-32">
      <div className="space-y-6">
        {/* BASIC INFORMATION */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="01"
            icon={MapPin}
            title="Area Information"
            description="Define the service area name, public URL and the main customer-facing information."
          />

          <div className="mt-7 space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <Label
                  htmlFor="service-area-name"
                  required
                >
                  Area Name
                </Label>

                <input
                  id="service-area-name"
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Werribee"
                  maxLength={120}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
                />

                <Counter
                  value={form.name}
                  max={120}
                />

                <FieldError
                  message={errors.name}
                />
              </div>

              <div>
                <Label
                  htmlFor="service-area-slug"
                  required
                >
                  URL Slug
                </Label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    /service-areas/
                  </span>

                  <input
                    id="service-area-slug"
                    value={form.slug}
                    onChange={(event) =>
                      handleSlugChange(
                        event.target.value
                      )
                    }
                    placeholder="werribee"
                    maxLength={160}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-[7.7rem] pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Lowercase letters, numbers and
                  hyphens only.
                </p>

                <FieldError
                  message={errors.slug}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="service-area-short-description"
                required
              >
                Short Description
              </Label>

              <textarea
                id="service-area-short-description"
                value={form.shortDescription}
                onChange={(event) =>
                  updateField(
                    "shortDescription",
                    event.target.value
                  )
                }
                placeholder="A concise introduction to mobile battery service availability in this area."
                maxLength={300}
                rows={3}
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
              />

              <Counter
                value={form.shortDescription}
                max={300}
              />

              <FieldError
                message={
                  errors.shortDescription
                }
              />
            </div>

            <div>
              <Label
                htmlFor="service-area-description"
                required
              >
                Area Description
              </Label>

              <textarea
                id="service-area-description"
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Explain the service coverage and useful information customers should know about this area."
                maxLength={10000}
                rows={8}
                disabled={isSubmitting}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
              />

              <Counter
                value={form.description}
                max={10000}
              />

              <FieldError
                message={errors.description}
              />
            </div>
          </div>
        </section>

        {/* COVERAGE */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="02"
            icon={Globe}
            title="Coverage"
            description="List the genuine suburbs and postcodes covered by this service area."
          />

          <div className="mt-7 grid gap-8 lg:grid-cols-2">
            <StringListEditor
              title="Supported Suburbs"
              description="Add the actual suburbs customers can associate with this area."
              items={suburbs}
              placeholder="e.g. Hoppers Crossing"
              addLabel="Add Suburb"
              itemLabel="Suburb"
              maxItems={50}
              onChange={setSuburbs}
              error={errors.suburbs}
            />

            <StringListEditor
              title="Supported Postcodes"
              description="Add the relevant four-digit Australian postcodes."
              items={postcodes}
              placeholder="e.g. 3030"
              addLabel="Add Postcode"
              itemLabel="Postcode"
              maxItems={50}
              onChange={setPostcodes}
            />

            {errors.postcodes && (
              <div className="lg:col-span-2">
                <FieldError
                  message={errors.postcodes}
                />
              </div>
            )}
          </div>
        </section>

        {/* SERVICE INFORMATION */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="03"
            icon={Sparkles}
            title="Service Information"
            description="Give customers useful local service information without inventing unsupported claims."
          />

          <div className="mt-7 space-y-6">
            <div>
              <Label
                htmlFor="service-availability"
              >
                Service Availability
              </Label>

              <textarea
                id="service-availability"
                value={
                  form.serviceAvailability
                }
                onChange={(event) =>
                  updateField(
                    "serviceAvailability",
                    event.target.value
                  )
                }
                placeholder="Example: Mobile battery services are available in this area."
                maxLength={500}
                rows={4}
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
              />

              <Counter
                value={
                  form.serviceAvailability
                }
                max={500}
              />

              <FieldError
                message={
                  errors.serviceAvailability
                }
              />
            </div>

            <div>
              <Label htmlFor="service-area-map-url">
                Map URL
              </Label>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="service-area-map-url"
                  type="url"
                  value={form.mapUrl}
                  onChange={(event) =>
                    updateField(
                      "mapUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://maps.google.com/..."
                  maxLength={2000}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                Optional. Use a genuine HTTP or
                HTTPS map URL.
              </p>

              <FieldError
                message={errors.mapUrl}
              />
            </div>
          </div>
        </section>

        {/* MEDIA */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="04"
            icon={ImagePlus}
            title="Area Media"
            description="Add a strong local service-area image that can represent this location across the website."
          />

          <div className="mt-7">
            <CloudinaryImageUpload
              value={form.heroImage}
              onChange={(value) =>
                updateField(
                  "heroImage",
                  value
                )
              }
              folder="car-battery-service/service-areas/hero"
              label="Service Area Hero Image"
              description="Recommended: high-quality landscape image. JPG, PNG, WebP or AVIF, maximum 10MB."
              disabled={isSubmitting}
            />

            <FieldError
              message={errors.heroImage}
            />
          </div>
        </section>

        {/* SEO */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="05"
            icon={Search}
            title="SEO"
            description="Optional search metadata for the service-area page."
          />

          <div className="mt-7 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="service-area-seo-title">
                  SEO Title
                </Label>

                <button
                  type="button"
                  onClick={() =>
                    setShowSeoPreview(
                      (current) => !current
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D6E91]"
                >
                  <Search className="h-3.5 w-3.5" />
                  {showSeoPreview
                    ? "Hide Preview"
                    : "Preview"}
                </button>
              </div>

              <input
                id="service-area-seo-title"
                value={form.seoTitle}
                onChange={(event) =>
                  updateField(
                    "seoTitle",
                    event.target.value
                  )
                }
                placeholder="Werribee Mobile Car Battery Service | Car Battery Service"
                maxLength={70}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
              />

              <Counter
                value={form.seoTitle}
                max={70}
              />

              <FieldError
                message={errors.seoTitle}
              />
            </div>

            <div>
              <Label htmlFor="service-area-seo-description">
                SEO Description
              </Label>

              <textarea
                id="service-area-seo-description"
                value={form.seoDescription}
                onChange={(event) =>
                  updateField(
                    "seoDescription",
                    event.target.value
                  )
                }
                placeholder="Describe the mobile battery services available in this area."
                maxLength={170}
                rows={4}
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
              />

              <Counter
                value={form.seoDescription}
                max={170}
              />

              <FieldError
                message={
                  errors.seoDescription
                }
              />
            </div>

            {showSeoPreview && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#0D6E91]" />

                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Search Preview
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="truncate text-base font-semibold text-[#1a0dab]">
                    {previewTitle}
                  </p>

                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    /service-areas/
                    {form.slug ||
                      "service-area"}
                  </p>

                  <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">
                    {previewDescription}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PUBLISHING */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="06"
            icon={Check}
            title="Publishing"
            description="Control whether this area is publicly visible, featured and ordered."
          />

          <div className="mt-7 space-y-5">
            <Toggle
              checked={form.featured}
              onChange={(value) =>
                updateField(
                  "featured",
                  value
                )
              }
              title="Featured Service Area"
              description="Allow this area to appear in featured service-area sections."
              disabled={isSubmitting}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="service-area-display-order">
                  Display Order
                </Label>

                <div className="relative">
                  <ArrowDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="service-area-display-order"
                    type="number"
                    min={0}
                    max={100000}
                    step={1}
                    value={form.displayOrder}
                    onChange={(event) =>
                      updateField(
                        "displayOrder",
                        Number.isFinite(
                          Number(
                            event.target.value
                          )
                        )
                          ? Number(
                              event.target.value
                            )
                          : 0
                      )
                    }
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Lower numbers appear first.
                </p>

                <FieldError
                  message={
                    errors.displayOrder
                  }
                />
              </div>

              <div>
                <Label htmlFor="service-area-status">
                  Status
                </Label>

                <div className="relative">
                  <select
                    id="service-area-status"
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target
                          .value as
                          | "draft"
                          | "active"
                      )
                    }
                    disabled={isSubmitting}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm font-bold text-slate-900 outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10 disabled:bg-slate-50"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="active">
                      Active / Published
                    </option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Draft areas remain hidden from
                  public pages.
                </p>

                <FieldError
                  message={errors.status}
                />
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-[#0D6E91]/15 bg-[#0D6E91]/5 p-4">
              <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#0D6E91]" />

              <div>
                <p className="text-sm font-black text-slate-900">
                  Publishing safety
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  New service areas default to
                  draft. Publish only after the
                  coverage, content and image have
                  been reviewed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DESKTOP ACTION BAR */}
      <div className="mt-7 hidden items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B]">
            <MapPin className="h-5 w-5 text-[#FFD400]" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900">
              {form.name.trim() ||
                "New Service Area"}
            </p>

            <p className="text-xs text-slate-500">
              Review everything before creating
              the area.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#061A2B] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#08263D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-[#FFD400]" />
                Create Service Area
              </>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(6,26,43,0.12)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-xl gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3.5 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex min-w-0 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-3 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-[#FFD400]" />
                Create Area
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}