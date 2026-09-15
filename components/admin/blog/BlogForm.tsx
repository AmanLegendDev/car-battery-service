"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Image as ImageIcon,
  Link2,
  Loader2,
  Plus,
  Search,
  Settings2,
  Tag,
  User,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import TiptapEditor from "@/components/editor/TiptapEditor";

import CloudinaryImageUpload, {
  type CloudinaryImageAsset,
} from "@/components/admin/media/CloudinaryImageUpload";

import {
  createBlogSchema,
} from "@/validations/blog";

/* =========================================================
   TYPES
========================================================= */

type BlogStatus =
  | "draft"
  | "published"
  | "scheduled";

type ServiceOption = {
  id: string;
  title: string;
  slug: string;
};

type ServiceAreaOption = {
  id: string;
  name: string;
  slug: string;
};

type FormErrors = Record<
  string,
  string
>;

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateTimeForInput(
  value: string | Date | null
) {
  if (!value) return "";

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() -
      offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function dateTimeLocalToISO(
  value: string
) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function normalizeTags(
  value: string[]
) {
  return Array.from(
    new Set(
      value
        .map((tag) =>
          tag
            .trim()
            .replace(/\s+/g, " ")
        )
        .filter(Boolean)
        .map((tag) =>
          tag.toLowerCase()
        )
    )
  );
}

function getErrorMessage(
  error: unknown
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(
      (error as { message?: unknown })
        .message ?? ""
    );
  }

  return "";
}

/* =========================================================
   DEFAULTS
========================================================= */

const EMPTY_CONTENT =
  "<p></p>";

const DEFAULT_AUTHOR_NAME =
  "Car Battery Service";

const DEFAULT_AUTHOR_ROLE =
  "Mobile Car Battery Service";

/* =========================================================
   COMPONENT
========================================================= */

export default function BlogForm() {
  const router = useRouter();

  /* -------------------------------------------------------
     BASIC
  ------------------------------------------------------- */

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [excerpt, setExcerpt] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [tags, setTags] =
    useState<string[]>([]);

  const [tagInput, setTagInput] =
    useState("");

  /* -------------------------------------------------------
     CONTENT
  ------------------------------------------------------- */

  const [content, setContent] =
    useState(EMPTY_CONTENT);

  /* -------------------------------------------------------
     COVER
  ------------------------------------------------------- */

  const [coverImage, setCoverImage] =
    useState<CloudinaryImageAsset | null>(
      null
    );

  const [coverAlt, setCoverAlt] =
    useState("");

  /* -------------------------------------------------------
     AUTHOR
  ------------------------------------------------------- */

  const [authorName, setAuthorName] =
    useState(DEFAULT_AUTHOR_NAME);

  const [authorRole, setAuthorRole] =
    useState(DEFAULT_AUTHOR_ROLE);

  const [authorImage, setAuthorImage] =
    useState<CloudinaryImageAsset | null>(
      null
    );

  const [authorImageAlt, setAuthorImageAlt] =
    useState("");

  /* -------------------------------------------------------
     RELATIONSHIPS
  ------------------------------------------------------- */

  const [services, setServices] =
    useState<ServiceOption[]>([]);

  const [serviceAreas, setServiceAreas] =
    useState<ServiceAreaOption[]>([]);

  const [
    selectedServices,
    setSelectedServices,
  ] = useState<string[]>([]);

  const [
    selectedServiceAreas,
    setSelectedServiceAreas,
  ] = useState<string[]>([]);

  const [
    relationshipSearch,
    setRelationshipSearch,
  ] = useState("");

  const [
    relationshipsLoading,
    setRelationshipsLoading,
  ] = useState(true);

  /* -------------------------------------------------------
     PUBLISHING
  ------------------------------------------------------- */

  const [status, setStatus] =
    useState<BlogStatus>("draft");

  const [featured, setFeatured] =
    useState(false);

  const [publishedAt, setPublishedAt] =
    useState("");

  const [scheduledAt, setScheduledAt] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState("0");

  /* -------------------------------------------------------
     SEO
  ------------------------------------------------------- */

  const [seoTitle, setSeoTitle] =
    useState("");

  const [
    seoDescription,
    setSeoDescription,
  ] = useState("");

  const [
    canonicalUrl,
    setCanonicalUrl,
  ] = useState("");

  const [noIndex, setNoIndex] =
    useState(false);

  const [ogTitle, setOgTitle] =
    useState("");

  const [
    ogDescription,
    setOgDescription,
  ] = useState("");

  const [ogImage, setOgImage] =
    useState<CloudinaryImageAsset | null>(
      null
    );

  const [ogImageAlt, setOgImageAlt] =
    useState("");

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [activeRelationshipTab, setActiveRelationshipTab] =
    useState<
      "services" | "areas"
    >("services");

  /* =======================================================
     AUTO SLUG
  ======================================================= */

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  /* =======================================================
     RELATIONSHIPS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadRelationships() {
      try {
        setRelationshipsLoading(true);

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

        if (!servicesResponse.ok) {
          throw new Error(
            "Failed to load services."
          );
        }

        if (!areasResponse.ok) {
          throw new Error(
            "Failed to load service areas."
          );
        }

        const servicesJson =
          await servicesResponse.json();

        const areasJson =
          await areasResponse.json();

        if (cancelled) return;

        const serviceData =
          Array.isArray(
            servicesJson?.data
          )
            ? servicesJson.data
            : [];

        const areaData =
          Array.isArray(
            areasJson?.data
          )
            ? areasJson.data
            : [];

        setServices(
          serviceData.map(
            (item: any) => ({
              id: String(
                item.id ??
                  item._id
              ),
              title:
                item.title ?? "",
              slug:
                item.slug ?? "",
            })
          )
        );

        setServiceAreas(
          areaData.map(
            (item: any) => ({
              id: String(
                item.id ??
                  item._id
              ),
              name:
                item.name ?? "",
              slug:
                item.slug ?? "",
            })
          )
        );
      } catch {
        if (!cancelled) {
          toast.error(
            "Could not load related services and service areas."
          );
        }
      } finally {
        if (!cancelled) {
          setRelationshipsLoading(
            false
          );
        }
      }
    }

    loadRelationships();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     RELATIONSHIP SEARCH
  ======================================================= */

  const filteredServices =
    useMemo(() => {
      const query =
        relationshipSearch
          .trim()
          .toLowerCase();

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
    }, [
      services,
      relationshipSearch,
    ]);

  const filteredAreas =
    useMemo(() => {
      const query =
        relationshipSearch
          .trim()
          .toLowerCase();

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
    }, [
      serviceAreas,
      relationshipSearch,
    ]);

  /* =======================================================
     TAGS
  ======================================================= */

  function addTag() {
    const value =
      tagInput
        .trim()
        .replace(/\s+/g, " ");

    if (!value) return;

    if (
      tags.some(
        (tag) =>
          tag.toLowerCase() ===
          value.toLowerCase()
      )
    ) {
      setTagInput("");
      return;
    }

    if (tags.length >= 20) {
      toast.error(
        "Maximum 20 tags allowed."
      );
      return;
    }

    setTags([
      ...tags,
      value,
    ]);

    setTagInput("");
  }

  function removeTag(
    index: number
  ) {
    setTags(
      tags.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  function handleTagKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag();
    }

    if (
      event.key === "Backspace" &&
      !tagInput &&
      tags.length
    ) {
      setTags(
        tags.slice(
          0,
          -1
        )
      );
    }
  }

  /* =======================================================
     RELATIONSHIP TOGGLE
  ======================================================= */

  function toggleService(
    id: string
  ) {
    setSelectedServices(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [
              ...current,
              id,
            ]
    );
  }

  function toggleServiceArea(
    id: string
  ) {
    setSelectedServiceAreas(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [
              ...current,
              id,
            ]
    );
  }

  /* =======================================================
     BUILD MEDIA
  ======================================================= */

  function buildMedia(
    image:
      | CloudinaryImageAsset
      | null,
    alt: string
  ) {
    if (!image) return null;

    return {
      publicId:
        image.publicId,

      secureUrl:
        image.secureUrl,

      width:
        image.width,

      height:
        image.height,

      format:
        image.format,

      bytes:
        image.bytes,

      resourceType:
        image.resourceType,

      alt:
        alt.trim(),
    };
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  function validateForm() {
    const payload = {
      title,
      slug,
      excerpt,
      content,

      coverImage:
        buildMedia(
          coverImage,
          coverAlt
        ),

      authorName,
      authorRole,

      authorImage:
        buildMedia(
          authorImage,
          authorImageAlt
        ),

      category,
      tags: normalizeTags(tags),

      status,
      featured,

      publishedAt:
        status === "published"
          ? dateTimeLocalToISO(
              publishedAt
            )
          : null,

      scheduledAt:
        status === "scheduled"
          ? dateTimeLocalToISO(
              scheduledAt
            )
          : null,

      displayOrder:
        Number(displayOrder),

      seoTitle,
      seoDescription,
      canonicalUrl,
      noIndex,

      ogTitle,
      ogDescription,

      ogImage:
        buildMedia(
          ogImage,
          ogImageAlt
        ),

      relatedServices:
        selectedServices,

      relatedServiceAreas:
        selectedServiceAreas,
    };

    const result =
      createBlogSchema.safeParse(
        payload
      );

    if (!result.success) {
      const nextErrors: FormErrors =
        {};

      for (const issue of result.error
        .issues) {
        const path =
          issue.path.join(".");

        if (!nextErrors[path]) {
          nextErrors[path] =
            issue.message;
        }
      }

      setErrors(nextErrors);

      const firstError =
        Object.values(
          nextErrors
        )[0];

      if (firstError) {
        toast.error(
          firstError
        );
      }

      return null;
    }

    setErrors({});

    return result.data;
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event?: React.FormEvent
  ) {
    event?.preventDefault();

    if (isSubmitting) {
      return;
    }

    const payload =
      validateForm();

    if (!payload) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await fetch(
          "/api/admin/blog",
          {
            method: "POST",
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
        await response.json();

      if (!response.ok) {
        if (
          result?.errors
        ) {
          const serverErrors: FormErrors =
            {};

          Object.entries(
            result.errors
          ).forEach(
            ([
              key,
              value,
            ]) => {
              if (
                Array.isArray(
                  value
                ) &&
                value[0]
              ) {
                serverErrors[
                  key
                ] = String(
                  value[0]
                );
              }
            }
          );

          setErrors(
            serverErrors
          );
        }

        toast.error(
          result?.message ??
            "Failed to create blog post."
        );

        return;
      }

      toast.success(
        "Blog post created successfully."
      );

      router.push(
        "/admin/blog"
      );

      router.refresh();
    } catch {
      toast.error(
        "Something went wrong while creating the blog post."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-32 lg:pb-10"
    >
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <Section
          icon={FileText}
          number="01"
          title="Basic Information"
          description="Define the blog identity, category and URL."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              label="Blog Title"
              required
              error={errors.title}
            >
              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. How Much Does a Full Car Service Cost?"
                className={inputClass(
                  !!errors.title
                )}
              />
              <CharacterHint
                value={title}
                max={160}
              />
            </Field>

            <Field
              label="Category"
              required
              error={errors.category}
            >
              <input
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                placeholder="e.g. Car Battery Care"
                className={inputClass(
                  !!errors.category
                )}
              />
            </Field>

            <div className="lg:col-span-2">
              <Field
                label="Slug"
                required
                error={errors.slug}
                hint="Lowercase URL-safe slug. It becomes /blog/[slug]."
              >
                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-[#0D6E91] focus-within:ring-2 focus-within:ring-[#0D6E91]/10">
                  <span className="hidden items-center border-r border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 sm:flex">
                    /blog/
                  </span>

                  <input
                    value={slug}
                    onChange={(event) => {
                      setSlug(
                        slugify(
                          event.target
                            .value
                        )
                      );

                      setSlugEdited(
                        true
                      );
                    }}
                    placeholder="your-blog-slug"
                    className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none"
                  />
                </div>
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field
                label="Excerpt"
                required
                error={errors.excerpt}
                hint="Short summary used on blog cards and previews."
              >
                <textarea
                  value={excerpt}
                  onChange={(event) =>
                    setExcerpt(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Write a concise summary of what this article covers..."
                  className={textareaClass(
                    !!errors.excerpt
                  )}
                />

                <CharacterHint
                  value={excerpt}
                  max={400}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field
                label="Tags"
                hint="Press Enter or comma after each tag."
              >
                <div className="rounded-xl border border-slate-200 bg-white p-3 focus-within:border-[#0D6E91] focus-within:ring-2 focus-within:ring-[#0D6E91]/10">
                  <div className="flex flex-wrap gap-2">
                    {tags.map(
                      (
                        tag,
                        index
                      ) => (
                        <span
                          key={`${tag}-${index}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#061A2B] px-3 py-1.5 text-xs font-medium text-white"
                        >
                          {tag}

                          <button
                            type="button"
                            onClick={() =>
                              removeTag(
                                index
                              )
                            }
                            className="rounded-full p-0.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            aria-label={`Remove ${tag}`}
                          >
                            <X
                              size={
                                13
                              }
                            />
                          </button>
                        </span>
                      )
                    )}

                    <input
                      value={
                        tagInput
                      }
                      onChange={(
                        event
                      ) =>
                        setTagInput(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={
                        handleTagKeyDown
                      }
                      onBlur={
                        addTag
                      }
                      placeholder={
                        tags.length
                          ? "Add another tag..."
                          : "e.g. battery replacement"
                      }
                      className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  {tags.length}/20
                  tags
                </div>
              </Field>
            </div>
          </div>
        </Section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <Section
          icon={FileText}
          number="02"
          title="Content"
          description="Write the article using the existing Tiptap rich text editor."
        >
          <Field
            label="Article Content"
            required
            error={errors.content}
          >
            <TiptapEditor
              value={content}
              onChange={
                setContent
              }
            />
          </Field>
        </Section>

        {/* =================================================
            COVER MEDIA
        ================================================= */}

        <Section
          icon={ImageIcon}
          number="03"
          title="Cover Media"
          description="Upload the primary image shown with the blog post."
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <Field
              label="Cover Image"
              error={
                errors.coverImage
              }
              hint="Recommended: landscape image suitable for blog cards and article headers."
            >
              <CloudinaryImageUpload
                value={
                  coverImage
                }
                onChange={
                  setCoverImage
                }
                folder="car-battery-service/blog/covers"
              />
            </Field>

            <Field
              label="Cover Image Alt Text"
              error={
                errors[
                  "coverImage.alt"
                ]
              }
              hint="Describe the image naturally for accessibility."
            >
              <textarea
                value={
                  coverAlt
                }
                onChange={(
                  event
                ) =>
                  setCoverAlt(
                    event.target
                      .value
                  )
                }
                rows={5}
                placeholder="e.g. Mobile technician testing a car battery beside a vehicle"
                className={textareaClass(
                  !!errors[
                    "coverImage.alt"
                  ]
                )}
              />

              <CharacterHint
                value={
                  coverAlt
                }
                max={200}
              />
            </Field>
          </div>
        </Section>

        {/* =================================================
            AUTHOR
        ================================================= */}

        <Section
          icon={User}
          number="04"
          title="Author"
          description="Keep author information structured without creating a separate Author CMS."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              label="Author Name"
              required
              error={
                errors.authorName
              }
            >
              <input
                value={
                  authorName
                }
                onChange={(
                  event
                ) =>
                  setAuthorName(
                    event.target
                      .value
                  )
                }
                placeholder="Car Battery Service"
                className={inputClass(
                  !!errors.authorName
                )}
              />
            </Field>

            <Field
              label="Author Role"
              error={
                errors.authorRole
              }
            >
              <input
                value={
                  authorRole
                }
                onChange={(
                  event
                ) =>
                  setAuthorRole(
                    event.target
                      .value
                  )
                }
                placeholder="Mobile Car Battery Service"
                className={inputClass(
                  !!errors.authorRole
                )}
              />
            </Field>

            <div className="lg:col-span-2">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <Field
                  label="Author Image"
                  error={
                    errors.authorImage
                  }
                >
                  <CloudinaryImageUpload
                    value={
                      authorImage
                    }
                    onChange={
                      setAuthorImage
                    }
                    folder="car-battery-service/blog/authors"
                  />
                </Field>

                <Field
                  label="Author Image Alt Text"
                  error={
                    errors[
                      "authorImage.alt"
                    ]
                  }
                >
                  <textarea
                    value={
                      authorImageAlt
                    }
                    onChange={(
                      event
                    ) =>
                      setAuthorImageAlt(
                        event.target
                          .value
                      )
                    }
                    rows={5}
                    placeholder="Describe the author image..."
                    className={textareaClass(
                      !!errors[
                        "authorImage.alt"
                      ]
                    )}
                  />
                </Field>
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================
            RELATIONSHIPS
        ================================================= */}

        <Section
          icon={Link2}
          number="05"
          title="Relationships"
          description="Connect the article with relevant services and genuine service areas."
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#061A2B]">
                  Related Content
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Only select relationships that are genuinely relevant to this article.
                </p>
              </div>

              <div className="flex w-full rounded-xl border border-slate-200 bg-white p-1 sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRelationshipTab(
                      "services"
                    );
                    setRelationshipSearch(
                      ""
                    );
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                    activeRelationshipTab ===
                    "services"
                      ? "bg-[#061A2B] text-white"
                      : "text-slate-500 hover:text-[#061A2B]"
                  }`}
                >
                  Services (
                  {
                    selectedServices.length
                  }
                  )
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRelationshipTab(
                      "areas"
                    );
                    setRelationshipSearch(
                      ""
                    );
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                    activeRelationshipTab ===
                    "areas"
                      ? "bg-[#061A2B] text-white"
                      : "text-slate-500 hover:text-[#061A2B]"
                  }`}
                >
                  Service Areas (
                  {
                    selectedServiceAreas.length
                  }
                  )
                </button>
              </div>
            </div>

            <div className="relative mt-5">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={
                  relationshipSearch
                }
                onChange={(
                  event
                ) =>
                  setRelationshipSearch(
                    event.target
                      .value
                  )
                }
                placeholder={
                  activeRelationshipTab ===
                  "services"
                    ? "Search services..."
                    : "Search service areas..."
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/10"
              />
            </div>

            <div className="mt-4">
              {relationshipsLoading ? (
                <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Loading relationships...
                  </div>
                </div>
              ) : activeRelationshipTab ===
                "services" ? (
                <RelationshipList
                  emptyText="No services found."
                  items={filteredServices.map(
                    (
                      service
                    ) => ({
                      id: service.id,
                      label:
                        service.title,
                      sublabel:
                        service.slug,
                      selected:
                        selectedServices.includes(
                          service.id
                        ),
                      onToggle:
                        () =>
                          toggleService(
                            service.id
                          ),
                    })
                  )}
                />
              ) : (
                <RelationshipList
                  emptyText="No service areas found."
                  items={filteredAreas.map(
                    (
                      area
                    ) => ({
                      id: area.id,
                      label:
                        area.name,
                      sublabel:
                        area.slug,
                      selected:
                        selectedServiceAreas.includes(
                          area.id
                        ),
                      onToggle:
                        () =>
                          toggleServiceArea(
                            area.id
                          ),
                    })
                  )}
                />
              )}
            </div>
          </div>
        </Section>

        {/* =================================================
            PUBLISHING
        ================================================= */}

        <Section
          icon={CalendarDays}
          number="06"
          title="Publishing"
          description="Control the article lifecycle independently from featured status."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              label="Status"
              required
              error={errors.status}
            >
              <div className="relative">
                <select
                  value={
                    status
                  }
                  onChange={(
                    event
                  ) => {
                    const nextStatus =
                      event.target
                        .value as BlogStatus;

                    setStatus(
                      nextStatus
                    );

                    if (
                      nextStatus !==
                      "scheduled"
                    ) {
                      setScheduledAt(
                        ""
                      );
                    }
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/10"
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>

                  <option value="scheduled">
                    Scheduled
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </Field>

            <Field
              label="Display Order"
              error={
                errors.displayOrder
              }
              hint="Lower numbers appear first where ordering is used."
            >
              <input
                type="number"
                min="0"
                max="100000"
                value={
                  displayOrder
                }
                onChange={(
                  event
                ) =>
                  setDisplayOrder(
                    event.target
                      .value
                  )
                }
                className={inputClass(
                  !!errors.displayOrder
                )}
              />
            </Field>

            {status ===
              "published" && (
              <Field
                label="Published Date"
                error={
                  errors.publishedAt
                }
                hint="Leave empty to publish immediately."
              >
                <input
                  type="datetime-local"
                  value={
                    publishedAt
                  }
                  onChange={(
                    event
                  ) =>
                    setPublishedAt(
                      event.target
                        .value
                    )
                  }
                  className={inputClass(
                    !!errors.publishedAt
                  )}
                />
              </Field>
            )}

            {status ===
              "scheduled" && (
              <Field
                label="Scheduled Date"
                required
                error={
                  errors.scheduledAt
                }
                hint="Must be a future date and time."
              >
                <input
                  type="datetime-local"
                  value={
                    scheduledAt
                  }
                  min={formatDateTimeForInput(
                    new Date(
                      Date.now() +
                        60 *
                          1000
                    )
                  )}
                  onChange={(
                    event
                  ) =>
                    setScheduledAt(
                      event.target
                        .value
                    )
                  }
                  className={inputClass(
                    !!errors.scheduledAt
                  )}
                />
              </Field>
            )}

            <div className="lg:col-span-2">
              <Toggle
                checked={
                  featured
                }
                onChange={
                  setFeatured
                }
                title="Featured Post"
                description="Show this article in featured/latest content areas when the public frontend uses featured content."
              />
            </div>
          </div>
        </Section>

        {/* =================================================
            SEO
        ================================================= */}

        <Section
          icon={Globe}
          number="07"
          title="SEO"
          description="Control search metadata, canonical URL and indexing."
        >
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field
                label="SEO Title"
                error={
                  errors.seoTitle
                }
                hint="Recommended maximum: 60–70 characters."
              >
                <input
                  value={
                    seoTitle
                  }
                  onChange={(
                    event
                  ) =>
                    setSeoTitle(
                      event.target
                        .value
                    )
                  }
                  placeholder="SEO title for search engines"
                  className={inputClass(
                    !!errors.seoTitle
                  )}
                />

                <CharacterHint
                  value={
                    seoTitle
                  }
                  max={70}
                />
              </Field>

              <Field
                label="Canonical URL"
                error={
                  errors.canonicalUrl
                }
                hint="Optional. Use a complete HTTP/HTTPS URL."
              >
                <input
                  type="url"
                  value={
                    canonicalUrl
                  }
                  onChange={(
                    event
                  ) =>
                    setCanonicalUrl(
                      event.target
                        .value
                    )
                  }
                  placeholder="https://www.example.com/blog/example"
                  className={inputClass(
                    !!errors.canonicalUrl
                  )}
                />
              </Field>

              <div className="lg:col-span-2">
                <Field
                  label="SEO Description"
                  error={
                    errors.seoDescription
                  }
                  hint="Recommended maximum: 150–170 characters."
                >
                  <textarea
                    value={
                      seoDescription
                    }
                    onChange={(
                      event
                    ) =>
                      setSeoDescription(
                        event.target
                          .value
                      )
                    }
                    rows={4}
                    placeholder="Write a concise search-engine description..."
                    className={textareaClass(
                      !!errors.seoDescription
                    )}
                  />

                  <CharacterHint
                    value={
                      seoDescription
                    }
                    max={170}
                  />
                </Field>
              </div>

              <div className="lg:col-span-2">
                <Toggle
                  checked={
                    noIndex
                  }
                  onChange={
                    setNoIndex
                  }
                  title="No Index"
                  description="Prevent search engines from indexing this post. Keep disabled for normal published SEO content."
                  warning={
                    noIndex
                  }
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
                  <Settings2
                    size={17}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#061A2B]">
                    Open Graph
                  </h3>

                  <p className="text-xs text-slate-500">
                    Social sharing metadata.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <Field
                  label="OG Title"
                  error={
                    errors.ogTitle
                  }
                >
                  <input
                    value={
                      ogTitle
                    }
                    onChange={(
                      event
                    ) =>
                      setOgTitle(
                        event.target
                          .value
                      )
                    }
                    placeholder="Social sharing title"
                    className={inputClass(
                      !!errors.ogTitle
                    )}
                  />

                  <CharacterHint
                    value={
                      ogTitle
                    }
                    max={120}
                  />
                </Field>

                <Field
                  label="OG Description"
                  error={
                    errors.ogDescription
                  }
                >
                  <textarea
                    value={
                      ogDescription
                    }
                    onChange={(
                      event
                    ) =>
                      setOgDescription(
                        event.target
                          .value
                      )
                    }
                    rows={3}
                    placeholder="Social sharing description"
                    className={textareaClass(
                      !!errors.ogDescription
                    )}
                  />

                  <CharacterHint
                    value={
                      ogDescription
                    }
                    max={300}
                  />
                </Field>

                <div className="lg:col-span-2">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <Field
                      label="OG Image"
                      error={
                        errors.ogImage
                      }
                      hint="Optional social sharing image."
                    >
                      <CloudinaryImageUpload
                        value={
                          ogImage
                        }
                        onChange={
                          setOgImage
                        }
                        folder="car-battery-service/blog/og"
                      />
                    </Field>

                    <Field
                      label="OG Image Alt Text"
                      error={
                        errors[
                          "ogImage.alt"
                        ]
                      }
                    >
                      <textarea
                        value={
                          ogImageAlt
                        }
                        onChange={(
                          event
                        ) =>
                          setOgImageAlt(
                            event.target
                              .value
                          )
                        }
                        rows={5}
                        placeholder="Describe the OG image..."
                        className={textareaClass(
                          !!errors[
                            "ogImage.alt"
                          ]
                        )}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================
            DESKTOP ACTION BAR
        ================================================= */}

        <div className="hidden items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/blog"
              )
            }
            disabled={
              isSubmitting
            }
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#061A2B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft
              size={17}
            />
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <SaveStatus
              status={status}
            />

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#061A2B]/10 transition hover:bg-[#08263D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                <>
                  <Check
                    size={17}
                  />
                  Create Blog Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          MOBILE STICKY ACTION BAR
      =================================================== */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(6,26,43,0.10)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-2">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/blog"
              )
            }
            disabled={
              isSubmitting
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50"
          >
            <ArrowLeft
              size={16}
            />
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="inline-flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-[#061A2B] px-3 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Check
                  size={16}
                />
                Create Post
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  icon: Icon,
  number,
  title,
  description,
  children,
}: {
  icon: typeof FileText;
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061A2B] text-[#FFD400]">
            <Icon
              size={18}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0D6E91]">
                {number}
              </span>

              <h2 className="text-base font-bold text-[#061A2B] sm:text-lg">
                {title}
              </h2>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="text-sm font-semibold text-[#061A2B]">
          {label}

          {required && (
            <span className="ml-1 text-[#0D6E91]">
              *
            </span>
          )}
        </label>

        {hint && (
          <span className="text-[11px] leading-4 text-slate-400">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   INPUT CLASSES
========================================================= */

function inputClass(
  hasError = false
) {
  return [
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
    "placeholder:text-slate-400",
    "focus:ring-2",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
      : "border-slate-200 focus:border-[#0D6E91] focus:ring-[#0D6E91]/10",
  ].join(" ");
}

function textareaClass(
  hasError = false
) {
  return [
    "w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition",
    "placeholder:text-slate-400",
    "focus:ring-2",
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
      : "border-slate-200 focus:border-[#0D6E91] focus:ring-[#0D6E91]/10",
  ].join(" ");
}

/* =========================================================
   CHARACTER HINT
========================================================= */

function CharacterHint({
  value,
  max,
}: {
  value: string;
  max: number;
}) {
  const count =
    value.length;

  const exceeded =
    count > max;

  return (
    <div
      className={`text-right text-[11px] ${
        exceeded
          ? "text-red-600"
          : "text-slate-400"
      }`}
    >
      {count}/{max}
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  checked,
  onChange,
  title,
  description,
  warning,
}: {
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
  title: string;
  description: string;
  warning?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
        checked
          ? warning
            ? "border-amber-300 bg-amber-50"
            : "border-[#0D6E91]/30 bg-[#0D6E91]/5"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#0D6E91]"
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

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#061A2B]">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   RELATIONSHIP LIST
========================================================= */

function RelationshipList({
  items,
  emptyText,
}: {
  items: {
    id: string;
    label: string;
    sublabel: string;
    selected: boolean;
    onToggle: () => void;
  }[];
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-5 text-center text-sm text-slate-400">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
      {items.map(
        (item) => (
          <button
            key={item.id}
            type="button"
            onClick={
              item.onToggle
            }
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
              item.selected
                ? "border-[#0D6E91]/40 bg-[#0D6E91]/5"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                item.selected
                  ? "border-[#0D6E91] bg-[#0D6E91] text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {item.selected && (
                <Check
                  size={13}
                  strokeWidth={
                    3
                  }
                />
              )}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#061A2B]">
                {item.label}
              </span>

              <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                {item.sublabel}
              </span>
            </span>
          </button>
        )
      )}
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function SaveStatus({
  status,
}: {
  status: BlogStatus;
}) {
  const labels = {
    draft: "Will save as Draft",
    published:
      "Will publish immediately",
    scheduled:
      "Will be scheduled",
  };

  return (
    <span className="hidden items-center gap-2 text-xs font-medium text-slate-500 xl:flex">
      <span className="h-2 w-2 rounded-full bg-[#0D6E91]" />
      {labels[status]}
    </span>
  );
}