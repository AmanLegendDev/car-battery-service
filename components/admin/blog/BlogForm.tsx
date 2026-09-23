"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  Search,
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

import { createBlogSchema } from "@/validations/blog";

/* =========================================================
   TYPES
========================================================= */

export type BlogStatus =
  | "draft"
  | "published"
  | "scheduled";

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;

  coverImage: CloudinaryImageAsset | null;
  coverAlt: string;

  authorName: string;
  authorRole: string;
  authorImage: CloudinaryImageAsset | null;
  authorImageAlt: string;

  category: string;
  tags: string[];

  status: BlogStatus;
  featured: boolean;

  publishedAt: string;
  scheduledAt: string;
  displayOrder: string;

  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noIndex: boolean;

  ogTitle: string;
  ogDescription: string;
  ogImage: CloudinaryImageAsset | null;
  ogImageAlt: string;

  relatedServices: string[];
  relatedServiceAreas: string[];
}

export interface BlogFormProps {
  mode?: "create" | "edit";
  blogId?: string;
  initialData?: Partial<BlogFormData>;
}

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

type FormErrors = Record<string, string>;

/* =========================================================
   HELPERS
========================================================= */

const EMPTY_CONTENT = "<p></p>";

const DEFAULT_AUTHOR_NAME = "Car Battery Service";
const DEFAULT_AUTHOR_ROLE = "Mobile Car Battery Service";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) =>
          tag.trim().replace(/\s+/g, " ")
        )
        .filter(Boolean)
        .map((tag) => tag.toLowerCase())
    )
  );
}

function formatDateTimeForInput(
  value: string | Date | null | undefined
) {
  if (!value) return "";

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function dateTimeLocalToISO(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function assetFromInitial(
  value: unknown
): CloudinaryImageAsset | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const image = value as Record<string, unknown>;

  if (
    typeof image.publicId !== "string" ||
    typeof image.secureUrl !== "string"
  ) {
    return null;
  }

  return {
    publicId: image.publicId,
    secureUrl: image.secureUrl,
    width: Number(image.width ?? 0),
    height: Number(image.height ?? 0),
    format: String(image.format ?? ""),
    bytes: Number(image.bytes ?? 0),
    resourceType: "image",
    alt: String(image.alt ?? ""),
  };
}
function buildMedia(
  image: CloudinaryImageAsset | null,
  alt: string
) {
  if (!image) return null;

  return {
    publicId: image.publicId,
    secureUrl: image.secureUrl,
    width: image.width,
    height: image.height,
    format: image.format,
    bytes: image.bytes,
    resourceType: image.resourceType,
    alt: alt.trim(),
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BlogForm({
  mode = "create",
  blogId,
  initialData,
}: BlogFormProps) {
  const router = useRouter();

  const isEdit = mode === "edit";

  /* -------------------------------------------------------
     BASIC
  ------------------------------------------------------- */

  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [slug, setSlug] = useState(
    initialData?.slug ?? ""
  );

  const [slugEdited, setSlugEdited] = useState(
    Boolean(initialData?.slug)
  );

  const [excerpt, setExcerpt] = useState(
    initialData?.excerpt ?? ""
  );

  const [category, setCategory] = useState(
    initialData?.category ?? ""
  );

  const [tags, setTags] = useState<string[]>(
    initialData?.tags ?? []
  );

  const [tagInput, setTagInput] = useState("");

  /* -------------------------------------------------------
     CONTENT
  ------------------------------------------------------- */

  const [content, setContent] = useState(
    initialData?.content || EMPTY_CONTENT
  );

  /* -------------------------------------------------------
     COVER
  ------------------------------------------------------- */

  const [coverImage, setCoverImage] =
    useState<CloudinaryImageAsset | null>(
      assetFromInitial(initialData?.coverImage)
    );

  const [coverAlt, setCoverAlt] = useState(
    initialData?.coverImage &&
    typeof initialData.coverImage === "object"
      ? String(
          (
            initialData.coverImage as {
              alt?: string;
            }
          ).alt ?? ""
        )
      : ""
  );

  /* -------------------------------------------------------
     AUTHOR
  ------------------------------------------------------- */

  const [authorName, setAuthorName] = useState(
    initialData?.authorName ||
      DEFAULT_AUTHOR_NAME
  );

  const [authorRole, setAuthorRole] = useState(
    initialData?.authorRole ||
      DEFAULT_AUTHOR_ROLE
  );

  const [authorImage, setAuthorImage] =
    useState<CloudinaryImageAsset | null>(
      assetFromInitial(initialData?.authorImage)
    );

  const [authorImageAlt, setAuthorImageAlt] =
    useState(
      initialData?.authorImage &&
      typeof initialData.authorImage === "object"
        ? String(
            (
              initialData.authorImage as {
                alt?: string;
              }
            ).alt ?? ""
          )
        : ""
    );

  /* -------------------------------------------------------
     RELATIONSHIPS
  ------------------------------------------------------- */

  const [services, setServices] = useState<
    ServiceOption[]
  >([]);

  const [serviceAreas, setServiceAreas] =
    useState<ServiceAreaOption[]>([]);

  const [selectedServices, setSelectedServices] =
    useState<string[]>(
      initialData?.relatedServices ?? []
    );

  const [
    selectedServiceAreas,
    setSelectedServiceAreas,
  ] = useState<string[]>(
    initialData?.relatedServiceAreas ?? []
  );

  const [
    relationshipSearch,
    setRelationshipSearch,
  ] = useState("");

  const [
    activeRelationshipTab,
    setActiveRelationshipTab,
  ] = useState<"services" | "areas">(
    "services"
  );

  const [
    relationshipsLoading,
    setRelationshipsLoading,
  ] = useState(true);

  /* -------------------------------------------------------
     PUBLISHING
  ------------------------------------------------------- */

  const [status, setStatus] =
    useState<BlogStatus>(
      initialData?.status ?? "draft"
    );

  const [featured, setFeatured] =
    useState(Boolean(initialData?.featured));

  const [publishedAt, setPublishedAt] =
    useState(
      formatDateTimeForInput(
        initialData?.publishedAt
      )
    );

  const [scheduledAt, setScheduledAt] =
    useState(
      formatDateTimeForInput(
        initialData?.scheduledAt
      )
    );

  const [displayOrder, setDisplayOrder] =
    useState(
      String(initialData?.displayOrder ?? 0)
    );

  /* -------------------------------------------------------
     SEO
  ------------------------------------------------------- */

  const [seoTitle, setSeoTitle] = useState(
    initialData?.seoTitle ?? ""
  );

  const [seoDescription, setSeoDescription] =
    useState(
      initialData?.seoDescription ?? ""
    );

  const [canonicalUrl, setCanonicalUrl] =
    useState(
      initialData?.canonicalUrl ?? ""
    );

  const [noIndex, setNoIndex] = useState(
    Boolean(initialData?.noIndex)
  );

  const [ogTitle, setOgTitle] = useState(
    initialData?.ogTitle ?? ""
  );

  const [ogDescription, setOgDescription] =
    useState(
      initialData?.ogDescription ?? ""
    );

  const [ogImage, setOgImage] =
    useState<CloudinaryImageAsset | null>(
      assetFromInitial(initialData?.ogImage)
    );

  const [ogImageAlt, setOgImageAlt] =
    useState(
      initialData?.ogImage &&
      typeof initialData.ogImage === "object"
        ? String(
            (
              initialData.ogImage as {
                alt?: string;
              }
            ).alt ?? ""
          )
        : ""
    );

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

        if (
          !servicesResponse.ok ||
          !areasResponse.ok
        ) {
          throw new Error(
            "Failed to load relationships."
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
            (item: Record<string, unknown>) => ({
              id: String(
                item.id ?? item._id
              ),
              title: String(
                item.title ?? ""
              ),
              slug: String(
                item.slug ?? ""
              ),
            })
          )
        );

        setServiceAreas(
          areaData.map(
            (item: Record<string, unknown>) => ({
              id: String(
                item.id ?? item._id
              ),
              name: String(
                item.name ?? ""
              ),
              slug: String(
                item.slug ?? ""
              ),
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
          setRelationshipsLoading(false);
        }
      }
    }

    loadRelationships();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     FILTERED RELATIONSHIPS
  ======================================================= */

  const filteredServices = useMemo(() => {
    const query =
      relationshipSearch
        .trim()
        .toLowerCase();

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
  }, [
    services,
    relationshipSearch,
  ]);

  const filteredAreas = useMemo(() => {
    const query =
      relationshipSearch
        .trim()
        .toLowerCase();

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
  }, [
    serviceAreas,
    relationshipSearch,
  ]);

  /* =======================================================
     TAGS
  ======================================================= */

  function addTag() {
    const value = tagInput
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

    setTags([...tags, value]);
    setTagInput("");
  }

  function removeTag(index: number) {
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
      setTags(tags.slice(0, -1));
    }
  }

  /* =======================================================
     RELATIONSHIP TOGGLES
  ======================================================= */

  function toggleService(id: string) {
    setSelectedServices((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  function toggleServiceArea(id: string) {
    setSelectedServiceAreas((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  /* =======================================================
     VALIDATION + PAYLOAD
  ======================================================= */

  function buildPayload() {
    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      excerpt: excerpt.trim(),
      content,

      coverImage: buildMedia(
        coverImage,
        coverAlt
      ),

      authorName: authorName.trim(),
      authorRole: authorRole.trim(),

      authorImage: buildMedia(
        authorImage,
        authorImageAlt
      ),

      category: category.trim(),
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

      displayOrder: Number(
        displayOrder
      ),

      seoTitle: seoTitle.trim(),
      seoDescription:
        seoDescription.trim(),
      canonicalUrl:
        canonicalUrl.trim(),
      noIndex,

      ogTitle: ogTitle.trim(),
      ogDescription:
        ogDescription.trim(),

      ogImage: buildMedia(
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

      for (const issue of result
        .error.issues) {
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
        toast.error(firstError);
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
    event: FormEvent
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    if (isEdit && !blogId) {
      toast.error(
        "Blog ID is missing."
      );
      return;
    }

    const payload = buildPayload();

    if (!payload) return;

    try {
      setIsSubmitting(true);

      const endpoint = isEdit
        ? `/api/admin/blog/${blogId}`
        : "/api/admin/blog";

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
        await response.json();

      if (!response.ok) {
        if (result?.errors) {
          const serverErrors: FormErrors =
            {};

          Object.entries(
            result.errors
          ).forEach(
            ([key, value]) => {
              if (
                Array.isArray(
                  value
                ) &&
                value[0]
              ) {
                serverErrors[key] =
                  String(value[0]);
              }
            }
          );

          setErrors(
            serverErrors
          );
        }

        toast.error(
          result?.message ??
            `Failed to ${
              isEdit
                ? "update"
                : "create"
            } blog post.`
        );

        return;
      }

      toast.success(
        isEdit
          ? "Blog post updated successfully."
          : "Blog post created successfully."
      );

      router.push(
        "/admin/blog"
      );

      router.refresh();
    } catch {
      toast.error(
        `Something went wrong while ${
          isEdit
            ? "updating"
            : "creating"
        } the blog post.`
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
      className="min-h-screen bg-[#061A2B] pb-32 text-[#F8FAFC] lg:pb-10"
    >
      <div className="mx-auto w-full max-w-6xl space-y-6 px-1">

        {/* =================================================
            BASIC
        ================================================= */}

        <Section
          icon={FileText}
          number="01"
          title="Basic Information"
          description="Define the article identity, URL, category and tags."
        >
          <div className="grid gap-5 lg:grid-cols-2">

            <Field
              label="Blog Title"
              required
              error={errors.title}
            >
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Enter blog title..."
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
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="e.g. Battery Care"
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
                hint="This becomes /blog/[slug]"
              >
                <div className="flex overflow-hidden rounded-xl border border-white/[0.10] bg-[#061A2B] focus-within:border-[#0D6E91] focus-within:ring-2 focus-within:ring-[#0D6E91]/10">
                  <span className="hidden items-center border-r border-white/[0.08] bg-[#061A2B] px-4 text-xs font-semibold text-[#718895] sm:flex">
                    /blog/
                  </span>

                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(
                        slugify(
                          e.target.value
                        )
                      );
                      setSlugEdited(
                        true
                      );
                    }}
                    placeholder="your-blog-slug"
                    className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-[#F8FAFC] outline-none placeholder:text-[#718895]"
                  />
                </div>
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field
                label="Excerpt"
                required
                error={errors.excerpt}
              >
                <textarea
                  value={excerpt}
                  onChange={(e) =>
                    setExcerpt(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Write a concise article summary..."
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
                hint="Press Enter or comma to add a tag."
              >
                <div className="rounded-xl border border-white/[0.10] bg-[#061A2B] p-3 focus-within:border-[#0D6E91] focus-within:ring-2 focus-within:ring-[#0D6E91]/10">
                  <div className="flex flex-wrap gap-2">

                    {tags.map(
                      (tag, index) => (
                        <span
                          key={`${tag}-${index}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#061A2B] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          <Tag
                            size={12}
                          />

                          {tag}

                          <button
                            type="button"
                            onClick={() =>
                              removeTag(
                                index
                              )
                            }
                            className="rounded-full p-0.5 text-[#A8BBC8] hover:bg-[#061A2B]/10 hover:text-white"
                          >
                            <X
                              size={13}
                            />
                          </button>
                        </span>
                      )
                    )}

                    <input
                      value={
                        tagInput
                      }
                      onChange={(e) =>
                        setTagInput(
                          e.target.value
                        )
                      }
                      onKeyDown={
                        handleTagKeyDown
                      }
                      onBlur={addTag}
                      placeholder={
                        tags.length
                          ? "Add another tag..."
                          : "e.g. battery replacement"
                      }
                      className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-2 text-sm text-[#F8FAFC] outline-none placeholder:text-[#718895]"
                    />
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#718895]">
                  {tags.length}/20 tags
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
          title="Article Content"
          description="Write the complete article using the rich text editor."
        >
          <Field
            label="Content"
            required
            error={errors.content}
          >
            <TiptapEditor
              value={content}
              onChange={setContent}
            />
          </Field>
        </Section>

        {/* =================================================
            COVER
        ================================================= */}

        <Section
          icon={ImageIcon}
          number="03"
          title="Cover Media"
          description="Primary image displayed on article cards and the article page."
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

            <Field
              label="Cover Image"
              error={errors.coverImage}
            >
              <CloudinaryImageUpload
                value={coverImage}
                onChange={
                  setCoverImage
                }
                folder="car-battery-service/blog/cover"
              />
            </Field>

            <Field
              label="Cover Alt Text"
              error={
                errors["coverImage.alt"]
              }
            >
              <textarea
                value={coverAlt}
                onChange={(e) =>
                  setCoverAlt(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Describe the cover image..."
                className={textareaClass(
                  !!errors[
                    "coverImage.alt"
                  ]
                )}
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
          description="Structured author information without creating a separate author CMS."
        >
          <div className="grid gap-5 lg:grid-cols-2">

            <Field
              label="Author Name"
              required
              error={errors.authorName}
            >
              <input
                value={authorName}
                onChange={(e) =>
                  setAuthorName(
                    e.target.value
                  )
                }
                className={inputClass(
                  !!errors.authorName
                )}
              />
            </Field>

            <Field
              label="Author Role"
              error={errors.authorRole}
            >
              <input
                value={authorRole}
                onChange={(e) =>
                  setAuthorRole(
                    e.target.value
                  )
                }
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
                    value={authorImage}
                    onChange={
                      setAuthorImage
                    }
                    folder="car-battery-service/blog/author"
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
                    onChange={(e) =>
                      setAuthorImageAlt(
                        e.target.value
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
          title="Related Content"
          description="Connect this article with genuinely relevant services and service areas."
        >
          <div className="rounded-2xl border border-white/[0.08] bg-[#061A2B]/70 p-4 sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  Relationships
                </h3>

                <p className="mt-1 text-xs text-[#A8BBC8]">
                  Select only content that is actually relevant.
                </p>
              </div>

              <div className="flex rounded-xl border border-white/[0.08] bg-[#061A2B] p-1">

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
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${
                    activeRelationshipTab ===
                    "services"
                      ? "bg-[#061A2B] text-white"
                      : "text-[#A8BBC8]"
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
                  className={`rounded-lg px-4 py-2 text-xs font-bold ${
                    activeRelationshipTab ===
                    "areas"
                      ? "bg-[#061A2B] text-white"
                      : "text-[#A8BBC8]"
                  }`}
                >
                  Areas (
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
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718895]"
              />

              <input
                value={
                  relationshipSearch
                }
                onChange={(e) =>
                  setRelationshipSearch(
                    e.target.value
                  )
                }
                placeholder={
                  activeRelationshipTab ===
                  "services"
                    ? "Search services..."
                    : "Search service areas..."
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#061A2B] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/10"
              />
            </div>

            <div className="mt-4">

              {relationshipsLoading ? (
                <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-[#061A2B]">
                  <div className="flex items-center gap-2 text-sm text-[#A8BBC8]">
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Loading...
                  </div>
                </div>
              ) : activeRelationshipTab ===
                "services" ? (
                <RelationshipList
                  items={filteredServices.map(
                    (service) => ({
                      id: service.id,
                      label:
                        service.title,
                      sublabel:
                        service.slug,
                      selected:
                        selectedServices.includes(
                          service.id
                        ),
                      onToggle: () =>
                        toggleService(
                          service.id
                        ),
                    })
                  )}
                  emptyText="No services found."
                />
              ) : (
                <RelationshipList
                  items={filteredAreas.map(
                    (area) => ({
                      id: area.id,
                      label:
                        area.name,
                      sublabel:
                        area.slug,
                      selected:
                        selectedServiceAreas.includes(
                          area.id
                        ),
                      onToggle: () =>
                        toggleServiceArea(
                          area.id
                        ),
                    })
                  )}
                  emptyText="No service areas found."
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
          description="Manage draft, published and scheduled states independently from featured status."
        >
          <div className="grid gap-5 lg:grid-cols-2">

            <Field
              label="Status"
              required
              error={errors.status}
            >
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => {
                    const next =
                      e.target
                        .value as BlogStatus;

                    setStatus(next);

                    if (
                      next !==
                      "scheduled"
                    ) {
                      setScheduledAt(
                        ""
                      );
                    }
                  }}
                  className="w-full appearance-none rounded-xl border border-white/[0.10] bg-[#061A2B] px-4 py-3 pr-10 text-sm font-semibold text-[#F8FAFC] outline-none focus:border-[#0D6E91] focus:ring-2 focus:ring-[#0D6E91]/10"
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
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718895]"
                />
              </div>
            </Field>

            <Field
              label="Display Order"
              error={errors.displayOrder}
            >
              <input
                type="number"
                min="0"
                max="100000"
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(
                    e.target.value
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
                hint="Leave empty if publishing now."
              >
                <input
                  type="datetime-local"
                  value={
                    publishedAt
                  }
                  onChange={(e) =>
                    setPublishedAt(
                      e.target.value
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
              >
                <input
                  type="datetime-local"
                  value={
                    scheduledAt
                  }
                  onChange={(e) =>
                    setScheduledAt(
                      e.target.value
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
                checked={featured}
                onChange={
                  setFeatured
                }
                title="Featured Article"
                description="Marks this article as featured. Featured is separate from publishing status."
              />
            </div>
          </div>
        </Section>

        {/* =================================================
            SEO
        ================================================= */}

        <Section
          icon={Search}
          number="07"
          title="SEO & Social"
          description="Control search metadata, canonical URL and social sharing metadata."
        >
          <div className="grid gap-5 lg:grid-cols-2">

            <Field
              label="SEO Title"
              error={errors.seoTitle}
            >
              <input
                value={seoTitle}
                onChange={(e) =>
                  setSeoTitle(
                    e.target.value
                  )
                }
                placeholder="SEO title..."
                className={inputClass(
                  !!errors.seoTitle
                )}
              />

              <CharacterHint
                value={seoTitle}
                max={180}
              />
            </Field>

            <Field
              label="Canonical URL"
              error={errors.canonicalUrl}
            >
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) =>
                  setCanonicalUrl(
                    e.target.value
                  )
                }
                placeholder="https://example.com/blog/..."
                className={inputClass(
                  !!errors.canonicalUrl
                )}
              />
            </Field>

            <Field
              label="SEO Description"
              error={
                errors.seoDescription
              }
            >
              <textarea
                value={seoDescription}
                onChange={(e) =>
                  setSeoDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Search engine description..."
                className={textareaClass(
                  !!errors.seoDescription
                )}
              />

              <CharacterHint
                value={
                  seoDescription
                }
                max={300}
              />
            </Field>

            <div>
              <Toggle
                checked={noIndex}
                onChange={setNoIndex}
                title="No Index"
                description="Prevent search engines from indexing this article."
                warning
              />
            </div>

            <Field
              label="OG Title"
              error={errors.ogTitle}
            >
              <input
                value={ogTitle}
                onChange={(e) =>
                  setOgTitle(
                    e.target.value
                  )
                }
                placeholder="Social sharing title..."
                className={inputClass(
                  !!errors.ogTitle
                )}
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
                onChange={(e) =>
                  setOgDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Social sharing description..."
                className={textareaClass(
                  !!errors.ogDescription
                )}
              />
            </Field>

            <div className="lg:col-span-2">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                <Field
                  label="OG Image"
                  error={
                    errors.ogImage
                  }
                >
                  <CloudinaryImageUpload
                    value={ogImage}
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
                    onChange={(e) =>
                      setOgImageAlt(
                        e.target.value
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
        </Section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="hidden items-center justify-between rounded-2xl border border-white/[0.08] bg-[#08263D] p-4 shadow-xl shadow-black/10 lg:flex">

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
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#A8BBC8] transition hover:bg-[#061A2B]/[0.06] hover:text-[#F8FAFC]"
          >
            <ArrowLeft
              size={17}
            />
            Cancel
          </button>

          <div className="flex items-center gap-3">

            <span className="text-xs font-medium text-[#A8BBC8]">
              {status ===
                "draft" &&
                "Will save as Draft"}

              {status ===
                "published" &&
                "Will publish"}

              {status ===
                "scheduled" &&
                "Will be scheduled"}
            </span>

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="inline-flex min-w-48 items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-5 py-3 text-sm font-bold text-[#061A2B] shadow-lg shadow-[#FFD400]/10 transition hover:bg-[#F5B800] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  {isEdit
                    ? "Updating..."
                    : "Creating..."}
                </>
              ) : (
                <>
                  <Check
                    size={17}
                  />

                  {isEdit
                    ? "Update Blog Post"
                    : "Create Blog Post"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          MOBILE ACTION BAR
      ================================================= */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#061A2B]/95 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden">
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
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-[#08263D] px-3 py-3 text-sm font-semibold text-[#A8BBC8] disabled:opacity-50"
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
            className="inline-flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-[#FFD400] px-3 py-3 text-sm font-bold text-[#061A2B] disabled:opacity-60"
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

                {isEdit
                  ? "Update"
                  : "Create"}
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
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08263D] shadow-2xl shadow-black/10">
      <div className="border-b border-white/[0.07] bg-[#061A2B]/70 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFD400] text-[#061A2B] shadow-lg shadow-[#FFD400]/10">
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFD400]">
                {number}
              </span>

              <h2 className="text-base font-bold text-[#F8FAFC] sm:text-lg">
                {title}
              </h2>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#A8BBC8] sm:text-sm">
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
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="text-sm font-semibold text-[#F8FAFC]">
          {label}
          {required && (
            <span className="ml-1 text-[#FFD400]">*</span>
          )}
        </label>

        {hint && (
          <span className="text-[11px] text-[#718895]">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   INPUTS
========================================================= */

function inputClass(hasError = false) {
  return [
    "w-full rounded-xl border bg-[#061A2B] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition",
    "placeholder:text-[#718895]",
    "focus:ring-2",
    hasError
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/10"
      : "border-white/[0.10] focus:border-[#0D6E91] focus:ring-[#0D6E91]/10",
  ].join(" ");
}

function textareaClass(hasError = false) {
  return [
    "w-full resize-y rounded-xl border bg-[#061A2B] px-4 py-3 text-sm leading-6 text-[#F8FAFC] outline-none transition",
    "placeholder:text-[#718895]",
    "focus:ring-2",
    hasError
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/10"
      : "border-white/[0.10] focus:border-[#0D6E91] focus:ring-[#0D6E91]/10",
  ].join(" ");
}

/* =========================================================
   CHARACTER COUNT
========================================================= */

function CharacterHint({
  value,
  max,
}: {
  value: string;
  max: number;
}) {
  const count = value.length;

  return (
    <div
      className={`text-right text-[11px] ${
        count > max
          ? "text-red-400"
          : "text-[#718895]"
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
  warning = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description: string;
  warning?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
        checked
          ? warning
            ? "border-amber-400/40 bg-amber-400/10"
            : "border-[#0D6E91]/40 bg-[#0D6E91]/10"
          : "border-white/[0.08] bg-[#061A2B] hover:border-white/[0.15]"
      }`}
    >
      <span
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#FFD400]" : "bg-[#061A2B]/20"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#F8FAFC] shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>

      <span>
        <span className="block text-sm font-semibold text-[#F8FAFC]">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-[#A8BBC8]">
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
      <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-white/[0.10] bg-[#061A2B] px-5 text-center text-sm text-[#718895]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onToggle}
          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
            item.selected
              ? "border-[#0D6E91]/50 bg-[#0D6E91]/10"
              : "border-white/[0.08] bg-[#061A2B] hover:border-white/[0.16] hover:bg-[#061A2B]/80"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
              item.selected
                ? "border-[#FFD400] bg-[#FFD400] text-[#061A2B]"
                : "border-white/[0.16] bg-transparent"
            }`}
          >
            {item.selected && (
              <Check size={13} strokeWidth={3} />
            )}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-[#F8FAFC]">
              {item.label}
            </span>

            <span className="mt-0.5 block truncate text-[11px] text-[#718895]">
              {item.sublabel}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
