"use client";

import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  FileQuestion,
  Link2,
  Loader2,
  MapPin,
  MessageSquareText,
  Search,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FAQStatus = "active" | "inactive";

interface ServiceOption {
  id: string;
  title: string;
  slug: string;
  status: "active" | "inactive";
}

interface ServiceAreaOption {
  id: string;
  name: string;
  slug: string;
  status: "active" | "draft";
}

interface FAQFormProps {
  mode?: "create" | "edit";
  faqId?: string;
  initialData?: Partial<FAQFormState>;
}

interface FAQFormState {
  question: string;
  answer: string;
  category: string;
  relatedServices: string[];
  relatedServiceAreas: string[];
  featured: boolean;
  displayOrder: number;
  status: FAQStatus;
}

interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  message?: string;
}

interface ApiFAQResponse {
  success: boolean;
  data?: Partial<FAQFormState>;
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

const INITIAL_FORM: FAQFormState = {
  question: "",
  answer: "",
  category: "",
  relatedServices: [],
  relatedServiceAreas: [],
  featured: false,
  displayOrder: 0,
  status: "inactive",
};

const FAQ_CATEGORIES = [
  "General",
  "Battery Problems",
  "Battery Replacement",
  "Battery Testing",
  "Jump Start",
  "Mobile Service",
  "Service Areas",
  "Booking",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string" ? value : fallback;
}

function getBoolean(
  value: unknown,
  fallback = false
): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getNumber(
  value: unknown,
  fallback = 0
): number {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value
    : fallback;
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function normalizeFAQData(
  data: unknown
): FAQFormState {
  if (!isRecord(data)) {
    return INITIAL_FORM;
  }

  const status =
    data.status === "active" ||
    data.status === "inactive"
      ? data.status
      : "inactive";

  return {
    question: getString(data.question),
    answer: getString(data.answer),
    category: getString(data.category),

    relatedServices: getStringArray(
      data.relatedServices
    ),

    relatedServiceAreas: getStringArray(
      data.relatedServiceAreas
    ),

    featured: getBoolean(
      data.featured
    ),

    displayOrder: getNumber(
      data.displayOrder
    ),

    status,
  };
}

export default function FAQForm({
  mode = "create",
  faqId,
  initialData,
}: FAQFormProps) {
  const [form, setForm] = useState<FAQFormState>(() => ({
    ...INITIAL_FORM,
    ...normalizeFAQData(initialData),
  }));

  const [services, setServices] =
    useState<ServiceOption[]>([]);

  const [serviceAreas, setServiceAreas] =
    useState<ServiceAreaOption[]>([]);

  const [isLoadingRelationships, setIsLoadingRelationships] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [serviceSearch, setServiceSearch] =
    useState("");

  const [areaSearch, setAreaSearch] =
    useState("");

  const [openSection, setOpenSection] =
    useState<string | null>(null);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const isEdit = mode === "edit";

  useEffect(() => {
    let cancelled = false;

    async function loadRelationships() {
      setIsLoadingRelationships(true);

      try {
        const [servicesResponse, areasResponse] =
          await Promise.all([
            fetch(
              "/api/admin/services?limit=100",
              {
                cache: "no-store",
              }
            ),
            fetch(
              "/api/admin/service-areas?limit=100",
              {
                cache: "no-store",
              }
            ),
          ]);

        const servicesJson =
          (await servicesResponse.json()) as ApiListResponse<ServiceOption>;

        const areasJson =
          (await areasResponse.json()) as ApiListResponse<ServiceAreaOption>;

        if (cancelled) {
          return;
        }

        if (
          servicesResponse.ok &&
          servicesJson.success &&
          Array.isArray(servicesJson.data)
        ) {
          setServices(servicesJson.data);
        } else {
          setServices([]);
        }

        if (
          areasResponse.ok &&
          areasJson.success &&
          Array.isArray(areasJson.data)
        ) {
          setServiceAreas(areasJson.data);
        } else {
          setServiceAreas([]);
        }
      } catch {
        if (!cancelled) {
          setServices([]);
          setServiceAreas([]);
          toast.error(
            "Unable to load relationships."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRelationships(false);
        }
      }
    }

    loadRelationships();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredServices = useMemo(() => {
    const query =
      serviceSearch.trim().toLowerCase();

    if (!query) {
      return services;
    }

    return services.filter(
      (service) =>
        service.title
          .toLowerCase()
          .includes(query) ||
        service.slug
          .toLowerCase()
          .includes(query)
    );
  }, [services, serviceSearch]);

  const filteredAreas = useMemo(() => {
    const query =
      areaSearch.trim().toLowerCase();

    if (!query) {
      return serviceAreas;
    }

    return serviceAreas.filter(
      (area) =>
        area.name
          .toLowerCase()
          .includes(query) ||
        area.slug
          .toLowerCase()
          .includes(query)
    );
  }, [serviceAreas, areaSearch]);

  const selectedServiceObjects = useMemo(
    () =>
      services.filter((service) =>
        form.relatedServices.includes(
          service.id
        )
      ),
    [services, form.relatedServices]
  );

  const selectedAreaObjects = useMemo(
    () =>
      serviceAreas.filter((area) =>
        form.relatedServiceAreas.includes(
          area.id
        )
      ),
    [serviceAreas, form.relatedServiceAreas]
  );

  function updateField<K extends keyof FAQFormState>(
    field: K,
    value: FAQFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleService(id: string) {
    setForm((current) => {
      const exists =
        current.relatedServices.includes(id);

      return {
        ...current,
        relatedServices: exists
          ? current.relatedServices.filter(
              (serviceId) => serviceId !== id
            )
          : [
              ...current.relatedServices,
              id,
            ],
      };
    });
  }

  function toggleServiceArea(id: string) {
    setForm((current) => {
      const exists =
        current.relatedServiceAreas.includes(
          id
        );

      return {
        ...current,
        relatedServiceAreas: exists
          ? current.relatedServiceAreas.filter(
              (areaId) => areaId !== id
            )
          : [
              ...current.relatedServiceAreas,
              id,
            ],
      };
    });
  }

  function removeService(id: string) {
    setForm((current) => ({
      ...current,
      relatedServices:
        current.relatedServices.filter(
          (serviceId) => serviceId !== id
        ),
    }));
  }

  function removeServiceArea(id: string) {
    setForm((current) => ({
      ...current,
      relatedServiceAreas:
        current.relatedServiceAreas.filter(
          (areaId) => areaId !== id
        ),
    }));
  }

  function validateForm(): boolean {
    const nextErrors: Record<string, string> =
      {};

    const question =
      form.question.trim();

    const answer =
      form.answer.trim();

    const category =
      form.category.trim();

    if (!question) {
      nextErrors.question =
        "Question is required.";
    } else if (question.length < 5) {
      nextErrors.question =
        "Question must be at least 5 characters.";
    } else if (question.length > 300) {
      nextErrors.question =
        "Question cannot exceed 300 characters.";
    }

    if (!answer) {
      nextErrors.answer =
        "Answer is required.";
    } else if (answer.length < 10) {
      nextErrors.answer =
        "Answer must be at least 10 characters.";
    } else if (answer.length > 5000) {
      nextErrors.answer =
        "Answer cannot exceed 5000 characters.";
    }

    if (!category) {
      nextErrors.category =
        "Category is required.";
    } else if (category.length < 2) {
      nextErrors.category =
        "Category must be at least 2 characters.";
    } else if (category.length > 100) {
      nextErrors.category =
        "Category cannot exceed 100 characters.";
    }

    if (
      !Number.isInteger(form.displayOrder) ||
      form.displayOrder < 0
    ) {
      nextErrors.displayOrder =
        "Display order must be a whole number greater than or equal to 0.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstError =
        Object.keys(nextErrors)[0];

      const element =
        document.getElementById(
          `faq-${firstError}`
        );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return false;
    }

    return true;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      toast.error(
        "Please fix the highlighted fields."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: FAQFormState = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: form.category.trim(),

        relatedServices: [
          ...new Set(
            form.relatedServices
          ),
        ],

        relatedServiceAreas: [
          ...new Set(
            form.relatedServiceAreas
          ),
        ],

        featured: form.featured,

        displayOrder:
          Number(form.displayOrder),

        status: form.status,
      };

      const endpoint = isEdit
        ? `/api/admin/faqs/${faqId}`
        : "/api/admin/faqs";

      const response = await fetch(
        endpoint,
        {
          method: isEdit
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result =
        (await response.json()) as ApiFAQResponse;

      if (!response.ok || !result.success) {
        if (result.errors) {
          const serverErrors: Record<
            string,
            string
          > = {};

          for (const [
            field,
            messages,
          ] of Object.entries(
            result.errors
          )) {
            if (
              Array.isArray(messages) &&
              messages.length > 0
            ) {
              serverErrors[field] =
                messages[0] ?? "";
            }
          }

          setErrors(serverErrors);
        }

        throw new Error(
          result.message ??
            "Unable to save FAQ."
        );
      }

      toast.success(
        isEdit
          ? "FAQ updated successfully."
          : "FAQ created successfully."
      );

      window.location.href =
        "/admin/faqs";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleSection(section: string) {
    setOpenSection((current) =>
      current === section
        ? null
        : section
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-28"
    >
      <div className="space-y-6">
        {/* =====================================================
            01 — BASIC INFORMATION
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            number="01"
            icon={
              <FileQuestion className="h-5 w-5" />
            }
            title="Basic Information"
            description="Create a clear, useful question and answer for customers."
            open={openSection === "basic"}
            onToggle={() =>
              toggleSection("basic")
            }
          />

          <div className="border-t border-slate-100 p-5 sm:p-7">
            <div className="space-y-6">
              <FieldLabel
                label="Question"
                required
                hint="Write the question exactly as a customer might ask it."
              />

              <div>
                <input
                  id="faq-question"
                  type="text"
                  value={form.question}
                  onChange={(event) =>
                    updateField(
                      "question",
                      event.target.value
                    )
                  }
                  maxLength={300}
                  placeholder="e.g. How do I know if my car battery is failing?"
                  className={inputClass(
                    Boolean(errors.question)
                  )}
                  disabled={isSubmitting}
                />

                <FieldMeta
                  count={form.question.length}
                  max={300}
                  error={errors.question}
                />
              </div>

              <div>
                <FieldLabel
                  label="Answer"
                  required
                  hint="Give a concise, useful answer. Avoid unsupported guarantees or claims."
                />

                <textarea
                  id="faq-answer"
                  value={form.answer}
                  onChange={(event) =>
                    updateField(
                      "answer",
                      event.target.value
                    )
                  }
                  maxLength={5000}
                  rows={8}
                  placeholder="Write a clear answer that directly helps the customer..."
                  className={`${inputClass(
                    Boolean(errors.answer)
                  )} min-h-[220px] resize-y py-4`}
                  disabled={isSubmitting}
                />

                <FieldMeta
                  count={form.answer.length}
                  max={5000}
                  error={errors.answer}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            02 — ORGANIZATION
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            number="02"
            icon={
              <Tags className="h-5 w-5" />
            }
            title="Organization"
            description="Organize the FAQ so it can be displayed intelligently across the website."
            open={
              openSection ===
              "organization"
            }
            onToggle={() =>
              toggleSection(
                "organization"
              )
            }
          />

          <div className="border-t border-slate-100 p-5 sm:p-7">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FieldLabel
                  label="Category"
                  required
                  hint="Choose an existing category or type a new one."
                />

                <div className="relative">
                  <select
                    id="faq-category"
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.target.value
                      )
                    }
                    className={`${inputClass(
                      Boolean(
                        errors.category
                      )
                    )} appearance-none pr-11`}
                    disabled={isSubmitting}
                  >
                    <option value="">
                      Select a category
                    </option>

                    {FAQ_CATEGORIES.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}

                    {form.category &&
                      !FAQ_CATEGORIES.includes(
                        form.category
                      ) && (
                        <option
                          value={form.category}
                        >
                          {form.category}
                        </option>
                      )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>

                {errors.category && (
                  <ErrorText
                    message={
                      errors.category
                    }
                  />
                )}

                <p className="mt-2 text-xs text-slate-500">
                  Categories help organize FAQs
                  on the main FAQ page.
                </p>
              </div>

              <div>
                <FieldLabel
                  label="Display Order"
                  required
                  hint="Lower numbers appear first."
                />

                <input
                  id="faq-displayOrder"
                  type="number"
                  min={0}
                  step={1}
                  value={form.displayOrder}
                  onChange={(event) =>
                    updateField(
                      "displayOrder",
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className={inputClass(
                    Boolean(
                      errors.displayOrder
                    )
                  )}
                  disabled={isSubmitting}
                />

                {errors.displayOrder && (
                  <ErrorText
                    message={
                      errors.displayOrder
                    }
                  />
                )}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <ToggleRow
                icon={
                  <Sparkles className="h-5 w-5" />
                }
                title="Featured FAQ"
                description="Allow this FAQ to be used in featured FAQ sections such as the homepage."
                checked={form.featured}
                disabled={isSubmitting}
                onChange={(checked) =>
                  updateField(
                    "featured",
                    checked
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            03 — RELATIONSHIPS
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            number="03"
            icon={
              <Link2 className="h-5 w-5" />
            }
            title="Relationships"
            description="Connect this FAQ with the services and genuine service areas where it is relevant."
            open={
              openSection ===
              "relationships"
            }
            onToggle={() =>
              toggleSection(
                "relationships"
              )
            }
          />

          <div className="border-t border-slate-100 p-5 sm:p-7">
            {isLoadingRelationships ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading services and service
                  areas...
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* SERVICES */}

                <RelationshipBox
                  icon={
                    <MessageSquareText className="h-5 w-5" />
                  }
                  title="Related Services"
                  description="Only select services where this FAQ is genuinely relevant."
                  count={
                    form.relatedServices
                      .length
                  }
                  searchValue={
                    serviceSearch
                  }
                  onSearchChange={
                    setServiceSearch
                  }
                  searchPlaceholder="Search services..."
                >
                  {selectedServiceObjects.length >
                    0 && (
                    <SelectedItems
                      items={selectedServiceObjects.map(
                        (service) => ({
                          id: service.id,
                          label: service.title,
                          onRemove: () =>
                            removeService(
                              service.id
                            ),
                        })
                      )}
                    />
                  )}

                  <div className="max-h-[320px] overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                    {filteredServices.length ===
                    0 ? (
                      <EmptyRelationshipState
                        icon={
                          <MessageSquareText className="h-5 w-5" />
                        }
                        message={
                          services.length ===
                          0
                            ? "No services found."
                            : "No services match your search."
                        }
                      />
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredServices.map(
                          (service) => {
                            const checked =
                              form.relatedServices.includes(
                                service.id
                              );

                            return (
                              <RelationshipItem
                                key={
                                  service.id
                                }
                                checked={
                                  checked
                                }
                                title={
                                  service.title
                                }
                                subtitle={
                                  service.slug
                                }
                                disabled={
                                  isSubmitting
                                }
                                onClick={() =>
                                  toggleService(
                                    service.id
                                  )
                                }
                              />
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </RelationshipBox>

                {/* SERVICE AREAS */}

                <RelationshipBox
                  icon={
                    <MapPin className="h-5 w-5" />
                  }
                  title="Related Service Areas"
                  description="Only connect genuine supported areas relevant to this FAQ."
                  count={
                    form.relatedServiceAreas
                      .length
                  }
                  searchValue={areaSearch}
                  onSearchChange={
                    setAreaSearch
                  }
                  searchPlaceholder="Search service areas..."
                >
                  {selectedAreaObjects.length >
                    0 && (
                    <SelectedItems
                      items={selectedAreaObjects.map(
                        (area) => ({
                          id: area.id,
                          label: area.name,
                          onRemove: () =>
                            removeServiceArea(
                              area.id
                            ),
                        })
                      )}
                    />
                  )}

                  <div className="max-h-[320px] overflow-y-auto rounded-2xl border border-slate-200 bg-white">
                    {filteredAreas.length ===
                    0 ? (
                      <EmptyRelationshipState
                        icon={
                          <MapPin className="h-5 w-5" />
                        }
                        message={
                          serviceAreas.length ===
                          0
                            ? "No service areas found."
                            : "No service areas match your search."
                        }
                      />
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredAreas.map(
                          (area) => {
                            const checked =
                              form.relatedServiceAreas.includes(
                                area.id
                              );

                            return (
                              <RelationshipItem
                                key={area.id}
                                checked={
                                  checked
                                }
                                title={
                                  area.name
                                }
                                subtitle={
                                  area.slug
                                }
                                disabled={
                                  isSubmitting
                                }
                                onClick={() =>
                                  toggleServiceArea(
                                    area.id
                                  )
                                }
                              />
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </RelationshipBox>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            04 — PUBLISHING
        ====================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            number="04"
            icon={
              <CircleHelp className="h-5 w-5" />
            }
            title="Publishing"
            description="Control whether this FAQ is available to the public website."
            open={
              openSection ===
              "publishing"
            }
            onToggle={() =>
              toggleSection(
                "publishing"
              )
            }
          />

          <div className="border-t border-slate-100 p-5 sm:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <StatusCard
                active={
                  form.status ===
                  "inactive"
                }
                title="Inactive"
                description="Keep this FAQ hidden from the public website."
                onClick={() =>
                  updateField(
                    "status",
                    "inactive"
                  )
                }
                disabled={isSubmitting}
              />

              <StatusCard
                active={
                  form.status ===
                  "active"
                }
                title="Active"
                description="Make this FAQ available to eligible public sections."
                onClick={() =>
                  updateField(
                    "status",
                    "active"
                  )
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Publishing rule
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Only active FAQs should be
                    displayed on the public
                    website. Inactive FAQs remain
                    available inside the admin CMS
                    for future use or editing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          STICKY ACTION BAR
      ====================================================== */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(6,26,43,0.08)] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-slate-800">
              {isEdit
                ? "Edit FAQ"
                : "Create new FAQ"}
            </p>

            <p className="text-xs text-slate-500">
              {form.status === "active"
                ? "This FAQ will be active."
                : "This FAQ will remain inactive."}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "/admin/faqs")
              }
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#08263D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isEdit
                    ? "Save Changes"
                    : "Save FAQ"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

interface SectionHeaderProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
}

function SectionHeader({
  number,
  icon,
  title,
  description,
  open,
  onToggle,
}: SectionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#0D6E91]">
            {number}
          </span>

          <h2 className="text-base font-bold text-[#061A2B] sm:text-lg">
            {title}
          </h2>
        </div>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="hidden shrink-0 text-slate-400 sm:block">
        {open ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
    </button>
  );
}

/* ============================================================
   FIELD LABEL
============================================================ */

interface FieldLabelProps {
  label: string;
  required?: boolean;
  hint?: string;
}

function FieldLabel({
  label,
  required = false,
  hint,
}: FieldLabelProps) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-[#061A2B]">
          {label}
          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      </div>

      {hint && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   FIELD META
============================================================ */

interface FieldMetaProps {
  count: number;
  max: number;
  error?: string;
}

function FieldMeta({
  count,
  max,
  error,
}: FieldMetaProps) {
  return (
    <div className="mt-2 flex items-start justify-between gap-4">
      {error ? (
        <ErrorText message={error} />
      ) : (
        <span />
      )}

      <span
        className={`shrink-0 text-xs ${
          count > max * 0.9
            ? "font-semibold text-amber-600"
            : "text-slate-400"
        }`}
      >
        {count}/{max}
      </span>
    </div>
  );
}

/* ============================================================
   ERROR
============================================================ */

function ErrorText({
  message,
}: {
  message: string;
}) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

/* ============================================================
   INPUT CLASS
============================================================ */

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-[#0D6E91] focus:ring-[#0D6E91]/10"
  }`;
}

/* ============================================================
   TOGGLE
============================================================ */

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 text-[#0D6E91]">
          {icon}
        </div>

        <div>
          <p className="text-sm font-bold text-[#061A2B]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#0D6E91]"
            : "bg-slate-300"
        } ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================================
   RELATIONSHIP BOX
============================================================ */

interface RelationshipBoxProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  children: React.ReactNode;
}

function RelationshipBox({
  icon,
  title,
  description,
  count,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
}: RelationshipBoxProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
            {icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#061A2B]">
                {title}
              </h3>

              <span className="rounded-full bg-[#061A2B] px-2.5 py-1 text-[11px] font-bold text-white">
                {count}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={searchValue}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
          />
        </div>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   SELECTED ITEMS
============================================================ */

interface SelectedItem {
  id: string;
  label: string;
  onRemove: () => void;
}

function SelectedItems({
  items,
}: {
  items: SelectedItem[];
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-2 rounded-full border border-[#0D6E91]/20 bg-[#0D6E91]/5 px-3 py-1.5 text-xs font-semibold text-[#061A2B]"
        >
          {item.label}

          <button
            type="button"
            onClick={item.onRemove}
            className="rounded-full p-0.5 text-slate-400 transition hover:bg-white hover:text-red-500"
            aria-label={`Remove ${item.label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   RELATIONSHIP ITEM
============================================================ */

interface RelationshipItemProps {
  checked: boolean;
  title: string;
  subtitle: string;
  disabled?: boolean;
  onClick: () => void;
}

function RelationshipItem({
  checked,
  title,
  subtitle,
  disabled,
  onClick,
}: RelationshipItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${
        checked
          ? "bg-[#0D6E91]/5"
          : "hover:bg-slate-50"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : ""
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
          checked
            ? "border-[#0D6E91] bg-[#0D6E91] text-white"
            : "border-slate-300 bg-white"
        }`}
      >
        {checked && (
          <Check className="h-3.5 w-3.5" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-800">
          {title}
        </span>

        <span className="mt-0.5 block truncate text-xs text-slate-400">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

/* ============================================================
   EMPTY RELATIONSHIP
============================================================ */

function EmptyRelationshipState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center px-5 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <p className="mt-3 text-sm font-medium text-slate-500">
        {message}
      </p>
    </div>
  );
}

/* ============================================================
   STATUS CARD
============================================================ */

interface StatusCardProps {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

function StatusCard({
  active,
  title,
  description,
  onClick,
  disabled,
}: StatusCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border p-5 text-left transition ${
        active
          ? "border-[#0D6E91] bg-[#0D6E91]/5 ring-2 ring-[#0D6E91]/10"
          : "border-slate-200 bg-white hover:border-slate-300"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            active
              ? "border-[#0D6E91] bg-[#0D6E91]"
              : "border-slate-300 bg-white"
          }`}
        >
          {active && (
            <span className="h-2 w-2 rounded-full bg-white" />
          )}
        </span>

        <div>
          <p className="text-sm font-bold text-[#061A2B]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}