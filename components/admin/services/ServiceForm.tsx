"use client";

import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Image as ImageIcon,
  Info,
  Layers3,
  Loader2,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


import CloudinaryImageUpload, {
  type CloudinaryImageAsset,
} from "@/components/admin/media/CloudinaryImageUpload";

import CloudinaryImageGallery, {
  type CloudinaryGalleryAsset,
} from "@/components/admin/media/CloudinaryImageGallery";

import { createServiceSchema } from "@/validations/service";

interface ProcessStep {
  title: string;
  description: string;
}

interface ServiceFormState {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;

  benefits: string[];
  included: string[];
  processSteps: ProcessStep[];
  suitableFor: string[];

  estimatedTime: string;
  emergencyService: boolean;
  onSiteService: boolean;

  heroImage: CloudinaryImageAsset | null;
  gallery: CloudinaryGalleryAsset[];
  ogImage: CloudinaryImageAsset | null;

  ctaText: string;
  ctaLink: string;

  featured: boolean;
  displayOrder: number;
  status: "active" | "inactive";

  seoTitle: string;
  seoDescription: string;
}

type FieldErrors = Record<string, string[]>;

interface ServiceFormProps {
  mode?: "create" | "edit";
  serviceId?: string;
}

interface ServiceApiResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    icon: string;
    benefits: string[];
    included: string[];
    processSteps: ProcessStep[];
    suitableFor: string[];
    estimatedTime: string;
    emergencyService: boolean;
    onSiteService: boolean;
    heroImage: CloudinaryImageAsset | null;
    gallery: CloudinaryGalleryAsset[];
    ogImage: CloudinaryImageAsset | null;
    ctaText: string;
    ctaLink: string;
    featured: boolean;
    displayOrder: number;
    status: "active" | "inactive";
    seoTitle: string;
    seoDescription: string;
  };
  message?: string;
  errors?: FieldErrors;
}

const initialForm: ServiceFormState = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  icon: "",

  benefits: [""],
  included: [""],
  processSteps: [
    {
      title: "",
      description: "",
    },
  ],
  suitableFor: [""],

  estimatedTime: "",
  emergencyService: false,
  onSiteService: false,

  heroImage: null,
  gallery: [],
  ogImage: null,

  ctaText: "",
  ctaLink: "",

  featured: false,
  displayOrder: 0,
  status: "inactive",

  seoTitle: "",
  seoDescription: "",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function cleanStringArray(items: string[]) {
  return items
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanProcessSteps(items: ProcessStep[]) {
  return items
    .map((step) => ({
      title: step.title.trim(),
      description: step.description.trim(),
    }))
    .filter((step) => step.title || step.description);
}

function getFirstError(errors: FieldErrors, field: string) {
  return errors[field]?.[0];
}

function SectionHeader({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: typeof Info;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-sm font-bold text-white">
        {number}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#0D6E91]" />

          <h2 className="text-base font-bold text-slate-950">
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function Label({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-800">
      {children}

      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10";

const textareaClass =
  "w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10";

export default function ServiceForm({
  mode = "create",
  serviceId,
}: ServiceFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [form, setForm] = useState<ServiceFormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [slugWasEdited, setSlugWasEdited] = useState(isEditMode);

  const canSubmit = useMemo(
    () => !isSubmitting && !isLoadingService && !loadError,
    [isSubmitting, isLoadingService, loadError]
  );

  useEffect(() => {
    if (!isEditMode) {
      setIsLoadingService(false);
      return;
    }

    if (!serviceId) {
      setLoadError("Service ID is missing.");
      setIsLoadingService(false);
      return;
    }

    const controller = new AbortController();

    async function loadService() {
      try {
        setIsLoadingService(true);
        setLoadError(null);
        setErrors({});

        const response = await fetch(
          `/api/admin/services/${serviceId}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result: ServiceApiResponse =
          await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to load service."
          );
        }

        const service = result.data;

        setForm({
          title: service.title ?? "",
          slug: service.slug ?? "",
          shortDescription: service.shortDescription ?? "",
          description: service.description ?? "",
          icon: service.icon ?? "",
          benefits:
            service.benefits?.length > 0
              ? service.benefits
              : [""],
          included:
            service.included?.length > 0
              ? service.included
              : [""],
          processSteps:
            service.processSteps?.length > 0
              ? service.processSteps
              : [{ title: "", description: "" }],
          suitableFor:
            service.suitableFor?.length > 0
              ? service.suitableFor
              : [""],
          estimatedTime: service.estimatedTime ?? "",
          emergencyService: Boolean(service.emergencyService),
          onSiteService: Boolean(service.onSiteService),
          heroImage: service.heroImage ?? null,
          gallery: service.gallery ?? [],
          ogImage: service.ogImage ?? null,
          ctaText: service.ctaText ?? "",
          ctaLink: service.ctaLink ?? "",
          featured: Boolean(service.featured),
          displayOrder: Number(service.displayOrder ?? 0),
          status: service.status === "active" ? "active" : "inactive",
          seoTitle: service.seoTitle ?? "",
          seoDescription: service.seoDescription ?? "",
        });

        // Existing slugs should remain stable unless the admin
        // explicitly edits the slug field.
        setSlugWasEdited(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Load service form error:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load service.";

        setLoadError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingService(false);
        }
      }
    }

    loadService();

    return () => controller.abort();
  }, [isEditMode, serviceId]);

  function updateField<K extends keyof ServiceFormState>(
    field: K,
    value: ServiceFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field as string]) return current;

      const next = { ...current };
      delete next[field as string];

      return next;
    });
  }

  function handleTitleChange(value: string) {
    updateField("title", value);

    if (!slugWasEdited) {
      setForm((current) => ({
        ...current,
        title: value,
        slug: slugify(value),
      }));
    }
  }

  function handleSlugChange(value: string) {
    setSlugWasEdited(true);

    updateField("slug", slugify(value));
  }

  function addArrayItem(field: "benefits" | "included" | "suitableFor") {
    setForm((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  }

  function removeArrayItem(
    field: "benefits" | "included" | "suitableFor",
    index: number
  ) {
    setForm((current) => {
      const next = [...current[field]];

      next.splice(index, 1);

      return {
        ...current,
        [field]: next.length > 0 ? next : [""],
      };
    });
  }

  function updateArrayItem(
    field: "benefits" | "included" | "suitableFor",
    index: number,
    value: string
  ) {
    setForm((current) => {
      const next = [...current[field]];
      next[index] = value;

      return {
        ...current,
        [field]: next,
      };
    });
  }

  function addProcessStep() {
    setForm((current) => ({
      ...current,
      processSteps: [
        ...current.processSteps,
        {
          title: "",
          description: "",
        },
      ],
    }));
  }

  function removeProcessStep(index: number) {
    setForm((current) => {
      const next = [...current.processSteps];

      next.splice(index, 1);

      return {
        ...current,
        processSteps:
          next.length > 0
            ? next
            : [
                {
                  title: "",
                  description: "",
                },
              ],
      };
    });
  }

  function updateProcessStep(
    index: number,
    field: keyof ProcessStep,
    value: string
  ) {
    setForm((current) => {
      const next = [...current.processSteps];

      next[index] = {
        ...next[index],
        [field]: value,
      };

      return {
        ...current,
        processSteps: next,
      };
    });
  }

  function moveProcessStep(
    index: number,
    direction: "up" | "down"
  ) {
    const newIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= form.processSteps.length
    ) {
      return;
    }

    setForm((current) => {
      const next = [...current.processSteps];

      [next[index], next[newIndex]] = [
        next[newIndex],
        next[index],
      ];

      return {
        ...current,
        processSteps: next,
      };
    });
  }

  function validateClientSide() {
    const payload = {
      ...form,
      benefits: cleanStringArray(form.benefits),
      included: cleanStringArray(form.included),
      suitableFor: cleanStringArray(form.suitableFor),
      processSteps: cleanProcessSteps(form.processSteps),
      displayOrder: Number(form.displayOrder),
    };

    const parsed = createServiceSchema.safeParse(payload);

    if (parsed.success) {
      return parsed.data;
    }

    const nextErrors: FieldErrors = {};

    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");

      if (!nextErrors[path]) {
        nextErrors[path] = [];
      }

      nextErrors[path].push(issue.message);
    }

    setErrors(nextErrors);

    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    const validatedData = validateClientSide();

    if (!validatedData) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      setErrors({});

      const endpoint = isEditMode
        ? `/api/admin/services/${serviceId}`
        : "/api/admin/services";

      const response = await fetch(endpoint, {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const result: ServiceApiResponse =
        await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        }

        toast.error(
          result.message ||
            (isEditMode
              ? "Unable to update service."
              : "Unable to create service.")
        );

        return;
      }

      toast.success(
        isEditMode
          ? "Service updated successfully."
          : "Service created successfully."
      );

      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error("Service form submission error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingService) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-100" />
                  <div className="h-3 w-64 rounded bg-slate-100" />
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-12 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100 md:col-span-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-black text-slate-950">
          Unable to load service
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {loadError}
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#061A2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#08263D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-28 lg:pb-10"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {/* BASIC INFORMATION */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="01"
            icon={Info}
            title="Basic Information"
            description="Define the service name, URL and primary customer-facing information."
          />

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <Label required>Service Title</Label>

              <input
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(event.target.value)
                }
                placeholder="e.g. Battery Replacement"
                className={inputClass}
                maxLength={120}
              />

              <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
                <FieldError
                  message={getFirstError(errors, "title")}
                />

                <span>{form.title.length}/120</span>
              </div>
            </div>

            <div>
              <Label required>URL Slug</Label>

              <input
                value={form.slug}
                onChange={(event) =>
                  handleSlugChange(event.target.value)
                }
                placeholder="battery-replacement"
                className={inputClass}
                maxLength={160}
                spellCheck={false}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Public URL: /services/{form.slug || "..."}
              </p>

              <FieldError
                message={getFirstError(errors, "slug")}
              />
            </div>

            <div className="md:col-span-2">
              <Label required>Short Description</Label>

              <textarea
                value={form.shortDescription}
                onChange={(event) =>
                  updateField(
                    "shortDescription",
                    event.target.value
                  )
                }
                placeholder="A concise description used on service cards and previews."
                className={textareaClass}
                rows={3}
                maxLength={300}
              />

              <div className="mt-1.5 flex justify-between">
                <FieldError
                  message={getFirstError(
                    errors,
                    "shortDescription"
                  )}
                />

                <span className="text-[11px] text-slate-400">
                  {form.shortDescription.length}/300
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label required>Service Description</Label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Explain what this service is, why it is needed and what the customer receives."
                className={textareaClass}
                rows={8}
                maxLength={10000}
              />

              <div className="mt-1.5 flex justify-between">
                <FieldError
                  message={getFirstError(
                    errors,
                    "description"
                  )}
                />

                <span className="text-[11px] text-slate-400">
                  {form.description.length}/10000
                </span>
              </div>
            </div>

            <div>
              <Label>Icon</Label>

              <input
                value={form.icon}
                onChange={(event) =>
                  updateField("icon", event.target.value)
                }
                placeholder="BatteryCharging"
                className={inputClass}
                maxLength={100}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Optional icon identifier used by the website.
              </p>
            </div>
          </div>
        </section>

        {/* SERVICE CONTENT */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="02"
            icon={Layers3}
            title="Service Content"
            description="Build structured content for the service detail page instead of putting everything into one description."
          />

          <div className="mt-7 space-y-8">
            {/* BENEFITS */}

            <DynamicStringList
              title="Benefits"
              description="Why should a customer choose or need this service?"
              items={form.benefits}
              onAdd={() => addArrayItem("benefits")}
              onRemove={(index) =>
                removeArrayItem("benefits", index)
              }
              onChange={(index, value) =>
                updateArrayItem(
                  "benefits",
                  index,
                  value
                )
              }
              placeholder="e.g. Convenient mobile assistance"
              addLabel="Add Benefit"
            />

            {/* INCLUDED */}

            <DynamicStringList
              title="What's Included"
              description="List the key things included in this service."
              items={form.included}
              onAdd={() => addArrayItem("included")}
              onRemove={(index) =>
                removeArrayItem("included", index)
              }
              onChange={(index, value) =>
                updateArrayItem(
                  "included",
                  index,
                  value
                )
              }
              placeholder="e.g. Battery condition check"
              addLabel="Add Included Item"
            />

            {/* PROCESS */}

            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    How It Works
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add the actual steps customers should expect.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addProcessStep}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#0D6E91] hover:text-[#0D6E91] sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Process Step
                </button>
              </div>

              <div className="space-y-3">
                {form.processSteps.map(
                  (step, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#061A2B] text-xs font-bold text-white">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-3">
                          <input
                            value={step.title}
                            onChange={(event) =>
                              updateProcessStep(
                                index,
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="Step title"
                            className={inputClass}
                            maxLength={120}
                          />

                          <textarea
                            value={step.description}
                            onChange={(event) =>
                              updateProcessStep(
                                index,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Explain what happens during this step."
                            className={textareaClass}
                            rows={3}
                            maxLength={500}
                          />
                        </div>

                        <div className="flex shrink-0 flex-col gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() =>
                              moveProcessStep(
                                index,
                                "up"
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
                            aria-label="Move step up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={
                              index ===
                              form.processSteps.length - 1
                            }
                            onClick={() =>
                              moveProcessStep(
                                index,
                                "down"
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
                            aria-label="Move step down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={
                              form.processSteps.length === 1
                            }
                            onClick={() =>
                              removeProcessStep(index)
                            }
                            className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                            aria-label="Remove process step"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* SUITABLE FOR */}

            <DynamicStringList
              title="Suitable For"
              description="Describe vehicles, situations or customers this service is suitable for."
              items={form.suitableFor}
              onAdd={() =>
                addArrayItem("suitableFor")
              }
              onRemove={(index) =>
                removeArrayItem(
                  "suitableFor",
                  index
                )
              }
              onChange={(index, value) =>
                updateArrayItem(
                  "suitableFor",
                  index,
                  value
                )
              }
              placeholder="e.g. Vehicles that won't start"
              addLabel="Add Item"
            />
          </div>
        </section>

        {/* SERVICE DETAILS */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="03"
            icon={Clock3}
            title="Service Details"
            description="Give customers useful operational information without inventing claims."
          />

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <Label>Estimated Time</Label>

              <input
                value={form.estimatedTime}
                onChange={(event) =>
                  updateField(
                    "estimatedTime",
                    event.target.value
                  )
                }
                placeholder="e.g. 30–60 minutes"
                className={inputClass}
                maxLength={100}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Only enter an estimate genuinely supported by the business.
              </p>
            </div>

            <div className="space-y-3">
              <Toggle
                checked={form.emergencyService}
                onChange={(value) =>
                  updateField(
                    "emergencyService",
                    value
                  )
                }
                title="Emergency Service"
                description="Mark this service as available for emergency assistance."
              />

              <Toggle
                checked={form.onSiteService}
                onChange={(value) =>
                  updateField(
                    "onSiteService",
                    value
                  )
                }
                title="On-site Service"
                description="Mark this service as delivered at the customer's location."
              />
            </div>
          </div>
        </section>

        {/* MEDIA */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="04"
            icon={ImageIcon}
            title="Media"
            description="Add the primary service image and supporting gallery images."
          />

          <div className="mt-7 space-y-8">
            <div>
              <CloudinaryImageUpload
                value={form.heroImage}
                onChange={(value) =>
                  updateField(
                    "heroImage",
                    value
                  )
                }
                folder="car-battery-service/services/hero"
                label="Service Hero Image"
                description="Recommended: high-quality landscape image. JPG, PNG, WebP or AVIF, maximum 10MB."
              />

              <FieldError
                message={getFirstError(
                  errors,
                  "heroImage"
                )}
              />
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Service Gallery
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add supporting service images. You can reorder or remove them before saving.
                </p>
              </div>

              <CloudinaryImageGallery
                value={form.gallery}
                onChange={(value) =>
                  updateField(
                    "gallery",
                    value
                  )
                }
                folder="car-battery-service/services/gallery"
                maxImages={12}
              />

              <FieldError
                message={getFirstError(
                  errors,
                  "gallery"
                )}
              />
            </div>

            <div>
              <CloudinaryImageUpload
                value={form.ogImage}
                onChange={(value) =>
                  updateField(
                    "ogImage",
                    value
                  )
                }
                folder="car-battery-service/services/og"
                label="Social / Open Graph Image"
                description="Optional image used when the service page is shared."
              />
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="05"
            icon={Sparkles}
            title="Call To Action"
            description="Define the primary action customers should take from the service page."
          />

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div>
              <Label>CTA Text</Label>

              <input
                value={form.ctaText}
                onChange={(event) =>
                  updateField(
                    "ctaText",
                    event.target.value
                  )
                }
                placeholder="e.g. Book This Service"
                className={inputClass}
                maxLength={100}
              />
            </div>

            <div>
              <Label>CTA Link</Label>

              <input
                value={form.ctaLink}
                onChange={(event) =>
                  updateField(
                    "ctaLink",
                    event.target.value
                  )
                }
                placeholder="/book-service"
                className={inputClass}
                maxLength={500}
              />

              <FieldError
                message={getFirstError(
                  errors,
                  "ctaText"
                )}
              />

              <p className="mt-1.5 text-[11px] text-slate-400">
                Supports internal paths, HTTPS URLs, tel: and mailto: links.
              </p>
            </div>
          </div>
        </section>

        {/* SEO */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="06"
            icon={Search}
            title="SEO"
            description="Optional search and social metadata for this service page."
          />

          <div className="mt-7 space-y-5">
            <div>
              <Label>SEO Title</Label>

              <input
                value={form.seoTitle}
                onChange={(event) =>
                  updateField(
                    "seoTitle",
                    event.target.value
                  )
                }
                placeholder="Search engine title"
                className={inputClass}
                maxLength={70}
              />

              <div className="mt-1.5 flex justify-end text-[11px] text-slate-400">
                {form.seoTitle.length}/70
              </div>
            </div>

            <div>
              <Label>SEO Description</Label>

              <textarea
                value={form.seoDescription}
                onChange={(event) =>
                  updateField(
                    "seoDescription",
                    event.target.value
                  )
                }
                placeholder="Short description for search engines."
                className={textareaClass}
                rows={4}
                maxLength={170}
              />

              <div className="mt-1.5 flex justify-end text-[11px] text-slate-400">
                {form.seoDescription.length}/170
              </div>
            </div>
          </div>
        </section>

        {/* PUBLISHING */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeader
            number="07"
            icon={ShieldCheck}
            title="Publishing"
            description="Control how and where this service appears across the website."
          />

          <div className="mt-7 space-y-5">
            <Toggle
              checked={form.featured}
              onChange={(value) =>
                updateField("featured", value)
              }
              title="Featured Service"
              description="Allow this service to appear in featured service sections."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Display Order</Label>

                <input
                  type="number"
                  min={0}
                  max={100000}
                  step={1}
                  value={form.displayOrder}
                  onChange={(event) =>
                    updateField(
                      "displayOrder",
                      Number(event.target.value)
                    )
                  }
                  className={inputClass}
                />

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Lower numbers appear first.
                </p>
              </div>

              <div>
                <Label>Status</Label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as
                        | "active"
                        | "inactive"
                    )
                  }
                  className={inputClass}
                >
                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="active">
                    Active / Published
                  </option>
                </select>

                <p className="mt-1.5 text-[11px] text-slate-400">
                  Inactive services should not appear on the public website.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#0D6E91]/15 bg-[#0D6E91]/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0D6E91]" />

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Publishing safety
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  New services default to inactive. Publish only after the content and media have been reviewed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* DESKTOP ACTION BAR */}

      <div className="mx-auto mt-6 hidden max-w-6xl items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#08263D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditMode ? "Saving Changes..." : "Creating Service..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? "Save Changes" : "Create Service"}
            </>
          )}
        </button>
      </div>

      {/* MOBILE STICKY ACTION BAR */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/services")
            }
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditMode ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Create Service"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function DynamicStringList({
  title,
  description,
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
  addLabel,
}: {
  title: string;
  description: string;
  items: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  placeholder: string;
  addLabel: string;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#0D6E91] hover:text-[#0D6E91] sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
              {index + 1}
            </div>

            <input
              value={item}
              onChange={(event) =>
                onChange(index, event.target.value)
              }
              placeholder={placeholder}
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={`Remove ${title} item`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300"
      aria-pressed={checked}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#FFD400]"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#061A2B] shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}