"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
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
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export interface FAQFormState {
  question: string;
  answer: string;
  category: string;
  relatedServices: string[];
  relatedServiceAreas: string[];
  featured: boolean;
  displayOrder: number;
  status: FAQStatus;
}

interface FAQFormProps {
  mode?: "create" | "edit";
  faqId?: string;
  initialData?: Partial<FAQFormState>;
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

function normalizeFAQData(
  data?: Partial<FAQFormState>
): FAQFormState {
  return {
    question:
      typeof data?.question === "string"
        ? data.question
        : "",
    answer:
      typeof data?.answer === "string"
        ? data.answer
        : "",
    category:
      typeof data?.category === "string"
        ? data.category
        : "",
    relatedServices: Array.isArray(
      data?.relatedServices
    )
      ? data.relatedServices.filter(
          (value): value is string =>
            typeof value === "string"
        )
      : [],
    relatedServiceAreas: Array.isArray(
      data?.relatedServiceAreas
    )
      ? data.relatedServiceAreas.filter(
          (value): value is string =>
            typeof value === "string"
        )
      : [],
    featured:
      typeof data?.featured === "boolean"
        ? data.featured
        : false,
    displayOrder:
      typeof data?.displayOrder === "number" &&
      Number.isFinite(data.displayOrder)
        ? data.displayOrder
        : 0,
    status:
      data?.status === "active"
        ? "active"
        : "inactive",
  };
}

export default function FAQForm({
  mode = "create",
  faqId,
  initialData,
}: FAQFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] =
    useState<FAQFormState>(() =>
      normalizeFAQData(initialData)
    );

  const [services, setServices] =
    useState<ServiceOption[]>([]);

  const [serviceAreas, setServiceAreas] =
    useState<ServiceAreaOption[]>([]);

  const [loadingRelations, setLoadingRelations] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [serviceSearch, setServiceSearch] =
    useState("");

  const [areaSearch, setAreaSearch] =
    useState("");

  const [openSection, setOpenSection] =
    useState<string | null>("basic");

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  /* =====================================================
     LOAD RELATIONSHIPS
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadRelationships() {
      setLoadingRelations(true);

      try {
        const [
          servicesResponse,
          areasResponse,
        ] = await Promise.all([
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

        if (cancelled) return;

        if (
          servicesResponse.ok &&
          servicesJson.success &&
          Array.isArray(servicesJson.data)
        ) {
          setServices(servicesJson.data);
        }

        if (
          areasResponse.ok &&
          areasJson.success &&
          Array.isArray(areasJson.data)
        ) {
          setServiceAreas(
            areasJson.data
          );
        }
      } catch (error) {
        console.error(
          "Relationship loading error:",
          error
        );

        if (!cancelled) {
          toast.error(
            "Unable to load services and service areas."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingRelations(false);
        }
      }
    }

    loadRelationships();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     FILTERED RELATIONSHIPS
  ===================================================== */

  const filteredServices = useMemo(() => {
    const query =
      serviceSearch.trim().toLowerCase();

    if (!query) return services;

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

    if (!query) return serviceAreas;

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

  const selectedServices = useMemo(
    () =>
      services.filter((service) =>
        form.relatedServices.includes(
          service.id
        )
      ),
    [services, form.relatedServices]
  );

  const selectedAreas = useMemo(
    () =>
      serviceAreas.filter((area) =>
        form.relatedServiceAreas.includes(
          area.id
        )
      ),
    [serviceAreas, form.relatedServiceAreas]
  );

  /* =====================================================
     FIELD HELPERS
  ===================================================== */

  function updateField<K extends keyof FAQFormState>(
    field: K,
    value: FAQFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) return current;

      const next = {
        ...current,
      };

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
              (item) => item !== id
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
              (item) => item !== id
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
          (item) => item !== id
        ),
    }));
  }

  function removeServiceArea(id: string) {
    setForm((current) => ({
      ...current,
      relatedServiceAreas:
        current.relatedServiceAreas.filter(
          (item) => item !== id
        ),
    }));
  }

  /* =====================================================
     VALIDATION
  ===================================================== */

  function validateForm() {
    const nextErrors: Record<
      string,
      string
    > = {};

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
      !Number.isInteger(
        form.displayOrder
      ) ||
      form.displayOrder < 0
    ) {
      nextErrors.displayOrder =
        "Display order must be 0 or greater.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstError =
        Object.keys(nextErrors)[0];

      document
        .getElementById(
          `faq-${firstError}`
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

      return false;
    }

    return true;
  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    if (!validateForm()) {
      toast.error(
        "Please fix the highlighted fields."
      );
      return;
    }

    if (isEdit && !faqId) {
      toast.error(
        "FAQ ID is missing."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload: FAQFormState = {
        question:
          form.question.trim(),

        answer:
          form.answer.trim(),

        category:
          form.category.trim(),

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
          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        (await response.json()) as ApiFAQResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        if (result.errors) {
          const serverErrors: Record<
            string,
            string
          > = {};

          Object.entries(
            result.errors
          ).forEach(
            ([field, messages]) => {
              if (
                Array.isArray(
                  messages
                ) &&
                messages[0]
              ) {
                serverErrors[field] =
                  messages[0];
              }
            }
          );

          setErrors(serverErrors);
        }

        throw new Error(
          result.message ||
            "Unable to save FAQ."
        );
      }

      toast.success(
        isEdit
          ? "FAQ updated successfully."
          : "FAQ created successfully."
      );

      router.push("/admin/faqs");
      router.refresh();
    } catch (error) {
      console.error(
        "FAQ save error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save FAQ."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* =====================================================
     SECTION TOGGLE
  ===================================================== */

  function toggleSection(
    section: string
  ) {
    setOpenSection((current) =>
      current === section
        ? null
        : section
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-32"
    >
      <div className="space-y-5 sm:space-y-6">

        {/* =================================================
            BASIC
        ================================================= */}

        <AdminSection
          number="01"
          icon={
            <FileQuestion className="h-5 w-5" />
          }
          title="Basic Information"
          description="Write the customer question and its answer."
          open={
            openSection === "basic"
          }
          onToggle={() =>
            toggleSection("basic")
          }
        >
          <div className="space-y-6">

            <div>
              <FieldLabel
                label="Question"
                required
                hint="Write it naturally, exactly how a customer might ask."
              />

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
                disabled={submitting}
                placeholder="e.g. How do I know if my car battery is failing?"
                className={inputClass(
                  Boolean(
                    errors.question
                  )
                )}
              />

              <FieldMeta
                count={
                  form.question.length
                }
                max={300}
                error={
                  errors.question
                }
              />
            </div>

            <div>
              <FieldLabel
                label="Answer"
                required
                hint="Give a clear and useful answer without unsupported claims."
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
                rows={9}
                disabled={submitting}
                placeholder="Write a clear answer that directly helps the customer..."
                className={`${inputClass(
                  Boolean(
                    errors.answer
                  )
                )} min-h-[220px] resize-y`}
              />

              <FieldMeta
                count={
                  form.answer.length
                }
                max={5000}
                error={errors.answer}
              />
            </div>

          </div>
        </AdminSection>

        {/* =================================================
            ORGANIZATION
        ================================================= */}

        <AdminSection
          number="02"
          icon={
            <Tags className="h-5 w-5" />
          }
          title="Organization"
          description="Control category, ordering and featured visibility."
          open={
            openSection ===
            "organization"
          }
          onToggle={() =>
            toggleSection(
              "organization"
            )
          }
        >
          <div className="grid gap-5 lg:grid-cols-2">

            <div>
              <FieldLabel
                label="Category"
                required
                hint="Choose an existing category or enter your own."
              />

              <div className="relative">
                <input
                  id="faq-category"
                  list="faq-category-list"
                  value={form.category}
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target.value
                    )
                  }
                  maxLength={100}
                  disabled={submitting}
                  placeholder="Select or type category..."
                  className={inputClass(
                    Boolean(
                      errors.category
                    )
                  )}
                />

                <datalist id="faq-category-list">
                  {FAQ_CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      />
                    )
                  )}
                </datalist>
              </div>

              {errors.category && (
                <ErrorText
                  message={
                    errors.category
                  }
                />
              )}
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
                value={
                  form.displayOrder
                }
                onChange={(event) =>
                  updateField(
                    "displayOrder",
                    Number(
                      event.target.value
                    )
                  )
                }
                disabled={submitting}
                className={inputClass(
                  Boolean(
                    errors.displayOrder
                  )
                )}
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

          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#061A2B] p-4 sm:p-5">
            <ToggleRow
              icon={
                <Sparkles className="h-5 w-5" />
              }
              title="Featured FAQ"
              description="Allow this FAQ to appear in featured FAQ sections."
              checked={
                form.featured
              }
              disabled={submitting}
              onChange={(checked) =>
                updateField(
                  "featured",
                  checked
                )
              }
            />
          </div>
        </AdminSection>

        {/* =================================================
            RELATIONSHIPS
        ================================================= */}

        <AdminSection
          number="03"
          icon={
            <Link2 className="h-5 w-5" />
          }
          title="Relationships"
          description="Connect this FAQ to relevant services and service areas."
          open={
            openSection ===
            "relationships"
          }
          onToggle={() =>
            toggleSection(
              "relationships"
            )
          }
        >
          {loadingRelations ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-[#061A2B]">
              <div className="flex items-center gap-3 text-sm font-bold text-[#A8BBC8]">
                <Loader2 className="h-5 w-5 animate-spin text-[#FFD400]" />
                Loading relationships...
              </div>
            </div>
          ) : (
            <div className="space-y-6">

              <RelationshipBox
                icon={
                  <MessageSquareText className="h-5 w-5" />
                }
                title="Related Services"
                description="Select only genuinely relevant services."
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
                placeholder="Search services..."
              >
                {selectedServices.length >
                  0 && (
                  <SelectedItems
                    items={selectedServices.map(
                      (service) => ({
                        id: service.id,
                        label:
                          service.title,
                        onRemove: () =>
                          removeService(
                            service.id
                          ),
                      })
                    )}
                  />
                )}

                <RelationshipList>
                  {filteredServices.length ===
                  0 ? (
                    <EmptyRelationship
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
                    filteredServices.map(
                      (service) => (
                        <RelationshipItem
                          key={
                            service.id
                          }
                          checked={form.relatedServices.includes(
                            service.id
                          )}
                          title={
                            service.title
                          }
                          subtitle={
                            service.slug
                          }
                          disabled={
                            submitting
                          }
                          onClick={() =>
                            toggleService(
                              service.id
                            )
                          }
                        />
                      )
                    )
                  )}
                </RelationshipList>
              </RelationshipBox>

              <RelationshipBox
                icon={
                  <MapPin className="h-5 w-5" />
                }
                title="Related Service Areas"
                description="Connect only areas where this FAQ is genuinely relevant."
                count={
                  form.relatedServiceAreas
                    .length
                }
                searchValue={
                  areaSearch
                }
                onSearchChange={
                  setAreaSearch
                }
                placeholder="Search service areas..."
              >
                {selectedAreas.length >
                  0 && (
                  <SelectedItems
                    items={selectedAreas.map(
                      (area) => ({
                        id: area.id,
                        label:
                          area.name,
                        onRemove: () =>
                          removeServiceArea(
                            area.id
                          ),
                      })
                    )}
                  />
                )}

                <RelationshipList>
                  {filteredAreas.length ===
                  0 ? (
                    <EmptyRelationship
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
                    filteredAreas.map(
                      (area) => (
                        <RelationshipItem
                          key={
                            area.id
                          }
                          checked={form.relatedServiceAreas.includes(
                            area.id
                          )}
                          title={
                            area.name
                          }
                          subtitle={
                            area.slug
                          }
                          disabled={
                            submitting
                          }
                          onClick={() =>
                            toggleServiceArea(
                              area.id
                            )
                          }
                        />
                      )
                    )
                  )}
                </RelationshipList>
              </RelationshipBox>

            </div>
          )}
        </AdminSection>

        {/* =================================================
            PUBLISHING
        ================================================= */}

        <AdminSection
          number="04"
          icon={
            <CircleHelp className="h-5 w-5" />
          }
          title="Publishing"
          description="Control whether the FAQ is visible on the public website."
          open={
            openSection ===
            "publishing"
          }
          onToggle={() =>
            toggleSection(
              "publishing"
            )
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">

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
              disabled={submitting}
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
              disabled={submitting}
            />

          </div>

          <div className="mt-5 rounded-2xl border border-[#0D6E91]/20 bg-[#061A2B] p-4 sm:p-5">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD400]" />

              <div>
                <p className="text-sm font-black text-white">
                  Publishing rule
                </p>

                <p className="mt-1 text-xs leading-6 text-[#A8BBC8]">
                  Only active FAQs should be
                  displayed publicly. Inactive
                  FAQs remain available inside
                  the CMS for future editing.
                </p>
              </div>
            </div>
          </div>
        </AdminSection>
      </div>

      {/* =================================================
          STICKY ACTION BAR
      ================================================= */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#061A2B]/95 px-3 py-3 shadow-[0_-15px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">

          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-black text-white">
              {isEdit
                ? "Edit FAQ"
                : "Create new FAQ"}
            </p>

            <p className="text-xs text-[#718895]">
              {form.status ===
              "active"
                ? "FAQ will be active."
                : "FAQ will remain inactive."}
            </p>
          </div>

          <div className="ml-auto flex w-full gap-2 sm:w-auto">

            <button
              type="button"
              disabled={submitting}
              onClick={() =>
                router.push(
                  "/admin/faqs"
                )
              }
              className="flex-1 rounded-xl border border-white/[0.10] bg-[#08263D] px-4 py-3 text-sm font-black text-[#A8BBC8] transition hover:border-white/[0.18] hover:text-white disabled:opacity-50 sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 py-3 text-sm font-black text-[#061A2B] shadow-[0_8px_25px_rgba(255,212,0,0.12)] transition hover:bg-[#FFE04D] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[150px] sm:flex-none"
            >
              {submitting ? (
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

/* =========================================================
   ADMIN SECTION
========================================================= */

function AdminSection({
  number,
  icon,
  title,
  description,
  open,
  onToggle,
  children,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#08263D] shadow-[0_18px_55px_rgba(0,0,0,0.14)]">

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/[0.02] sm:gap-4 sm:p-6"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#061A2B] text-[#FFD400] ring-1 ring-white/[0.05]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-black tracking-[0.2em] text-[#0D6E91]">
              {number}
            </span>

            <h2 className="text-sm font-black text-white sm:text-base">
              {title}
            </h2>
          </div>

          <p className="mt-1 text-xs leading-5 text-[#718895] sm:text-sm">
            {description}
          </p>
        </div>

        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[#718895]" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[#718895]" />
        )}
      </button>

      {open && (
        <div className="border-t border-white/[0.07] p-4 sm:p-6 lg:p-7">
          {children}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   FIELD LABEL
========================================================= */

function FieldLabel({
  label,
  required,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="mb-2.5">
      <label className="text-sm font-black text-white">
        {label}
        {required && (
          <span className="ml-1 text-[#FFD400]">
            *
          </span>
        )}
      </label>

      {hint && (
        <p className="mt-1 text-xs leading-5 text-[#718895]">
          {hint}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function inputClass(
  hasError: boolean
) {
  return [
    "w-full rounded-xl border bg-[#061A2B] px-4 py-3 text-sm font-medium text-white outline-none transition",
    "placeholder:text-[#536A78]",
    "focus:ring-4",
    hasError
      ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/10"
      : "border-white/[0.10] focus:border-[#0D6E91] focus:ring-[#0D6E91]/10",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" ");
}

/* =========================================================
   FIELD META
========================================================= */

function FieldMeta({
  count,
  max,
  error,
}: {
  count: number;
  max: number;
  error?: string;
}) {
  return (
    <div className="mt-2 flex items-start justify-between gap-4">
      {error ? (
        <ErrorText message={error} />
      ) : (
        <span />
      )}

      <span
        className={[
          "shrink-0 text-xs",
          count > max * 0.9
            ? "font-black text-amber-400"
            : "text-[#718895]",
        ].join(" ")}
      >
        {count}/{max}
      </span>
    </div>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorText({
  message,
}: {
  message: string;
}) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-bold text-red-400">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function ToggleRow({
  icon,
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex min-w-0 gap-3">
        <div className="mt-0.5 text-[#FFD400]">
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-white">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#718895]">
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
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition",
          checked
            ? "bg-[#0D6E91]"
            : "bg-[#334A59]",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
            checked
              ? "left-6"
              : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

/* =========================================================
   RELATIONSHIP BOX
========================================================= */

function RelationshipBox({
  icon,
  title,
  description,
  count,
  searchValue,
  onSearchChange,
  placeholder,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  count: number;
  searchValue: string;
  onSearchChange: (
    value: string
  ) => void;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#061A2B] p-4 sm:p-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#08263D] text-[#FFD400]">
            {icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black text-white">
                {title}
              </h3>

              <span className="rounded-full border border-[#0D6E91]/30 bg-[#0D6E91]/10 px-2.5 py-1 text-[10px] font-black text-[#6FB9FF]">
                {count} selected
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#718895]">
              {description}
            </p>
          </div>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#536A78]" />

          <input
            type="search"
            value={searchValue}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/[0.10] bg-[#08263D] py-2.5 pl-10 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-[#536A78] focus:border-[#0D6E91] focus:ring-4 focus:ring-[#0D6E91]/10"
          />
        </div>

      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   RELATIONSHIP LIST
========================================================= */

function RelationshipList({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="max-h-[300px] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#08263D]">
      <div className="divide-y divide-white/[0.06]">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   RELATIONSHIP ITEM
========================================================= */

function RelationshipItem({
  checked,
  title,
  subtitle,
  disabled,
  onClick,
}: {
  checked: boolean;
  title: string;
  subtitle: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 px-4 py-3.5 text-left transition",
        checked
          ? "bg-[#0D6E91]/10"
          : "hover:bg-white/[0.03]",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
          checked
            ? "border-[#0D6E91] bg-[#0D6E91] text-white"
            : "border-white/[0.15] bg-[#061A2B]",
        ].join(" ")}
      >
        {checked && (
          <Check className="h-3.5 w-3.5" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-white">
          {title}
        </span>

        <span className="mt-0.5 block truncate text-xs text-[#718895]">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   SELECTED ITEMS
========================================================= */

function SelectedItems({
  items,
}: {
  items: {
    id: string;
    label: string;
    onRemove: () => void;
  }[];
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#0D6E91]/25 bg-[#0D6E91]/10 px-3 py-1.5 text-xs font-bold text-[#8FD4FF]"
        >
          <span className="max-w-[220px] truncate">
            {item.label}
          </span>

          <button
            type="button"
            onClick={item.onRemove}
            className="rounded-full p-0.5 text-[#718895] transition hover:bg-white/10 hover:text-red-400"
            aria-label={`Remove ${item.label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY RELATIONSHIP
========================================================= */

function EmptyRelationship({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string;
}) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center px-5 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#061A2B] text-[#718895]">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-[#718895]">
        {message}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusCard({
  active,
  title,
  description,
  onClick,
  disabled,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-2xl border p-5 text-left transition",
        active
          ? "border-[#0D6E91]/70 bg-[#0D6E91]/10 ring-2 ring-[#0D6E91]/10"
          : "border-white/[0.08] bg-[#061A2B] hover:border-white/[0.16]",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">

        <span
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            active
              ? "border-[#0D6E91] bg-[#0D6E91]"
              : "border-white/[0.15] bg-[#08263D]",
          ].join(" ")}
        >
          {active && (
            <span className="h-2 w-2 rounded-full bg-white" />
          )}
        </span>

        <div>
          <p className="text-sm font-black text-white">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#718895]">
            {description}
          </p>
        </div>

      </div>
    </button>
  );
}