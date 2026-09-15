"use client";

import {
  Check,
  Clock3,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
  Smartphone,
} from "lucide-react";
import CloudinaryImageUpload, {
  type CloudinaryImageAsset,
} from "@/components/admin/media/CloudinaryImageUpload";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";



type BusinessHour = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  enabled: boolean;
  open?: string;
  close?: string;
};

type Social = {
  instagram: string;
  facebook: string;
  googleBusiness: string;
  other: string;
};

type Settings = {
  businessName: string;
  tagline: string;
  description: string;

  logo: CloudinaryImageAsset | null;

  phone: string;
  primaryCallNumber: string;
  whatsapp: string;
  email: string;

  address: string;
  primaryServiceRegion: string;
  serviceAreaInformation: string;

  businessHours: BusinessHour[];
  emergencyAvailability: string;

  social: Social;

  bookingCta: string;
  quoteCta: string;

  defaultSiteTitle: string;
  defaultSiteDescription: string;
  defaultOgImage: CloudinaryImageAsset | null;
};

const DAYS: BusinessHour["day"][] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EMPTY_SOCIAL: Social = {
  instagram: "",
  facebook: "",
  googleBusiness: "",
  other: "",
};

function createDefaultHours(): BusinessHour[] {
  return DAYS.map((day) => ({
    day,
    enabled: false,
    open: "",
    close: "",
  }));
}

function createEmptySettings(): Settings {
  return {
    businessName: "",
    tagline: "",
    description: "",

    logo: null,

    phone: "",
    primaryCallNumber: "",
    whatsapp: "",
    email: "",

    address: "",
    primaryServiceRegion: "",
    serviceAreaInformation: "",

    businessHours: createDefaultHours(),
    emergencyAvailability: "",

    social: {
      ...EMPTY_SOCIAL,
    },

    bookingCta: "",
    quoteCta: "",

    defaultSiteTitle: "",
    defaultSiteDescription: "",
    defaultOgImage: null,
  };
}

function normalizeSettings(
  value: unknown
): Settings {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return createEmptySettings();
  }

  const data =
    value as Partial<Settings>;

  const incomingHours =
    Array.isArray(data.businessHours)
      ? data.businessHours
      : [];

  const hours = DAYS.map((day) => {
    const existing =
      incomingHours.find(
        (item) =>
          item &&
          typeof item === "object" &&
          item.day === day
      );

    return {
      day,
      enabled:
        existing?.enabled === true,
      open:
        typeof existing?.open === "string"
          ? existing.open
          : "",
      close:
        typeof existing?.close === "string"
          ? existing.close
          : "",
    };
  });

 const incomingSocial: Partial<Social> =
  data.social &&
  typeof data.social === "object"
    ? (data.social as Partial<Social>)
    : {};

  return {
    businessName:
      typeof data.businessName === "string"
        ? data.businessName
        : "",

    tagline:
      typeof data.tagline === "string"
        ? data.tagline
        : "",

    description:
      typeof data.description === "string"
        ? data.description
        : "",

    logo:
      data.logo ?? null,

    phone:
      typeof data.phone === "string"
        ? data.phone
        : "",

    primaryCallNumber:
      typeof data.primaryCallNumber ===
      "string"
        ? data.primaryCallNumber
        : "",

    whatsapp:
      typeof data.whatsapp === "string"
        ? data.whatsapp
        : "",

    email:
      typeof data.email === "string"
        ? data.email
        : "",

    address:
      typeof data.address === "string"
        ? data.address
        : "",

    primaryServiceRegion:
      typeof data.primaryServiceRegion ===
      "string"
        ? data.primaryServiceRegion
        : "",

    serviceAreaInformation:
      typeof data.serviceAreaInformation ===
      "string"
        ? data.serviceAreaInformation
        : "",

    businessHours: hours,

    emergencyAvailability:
      typeof data.emergencyAvailability ===
      "string"
        ? data.emergencyAvailability
        : "",

    social: {
      instagram:
        typeof incomingSocial.instagram ===
        "string"
          ? incomingSocial.instagram
          : "",

      facebook:
        typeof incomingSocial.facebook ===
        "string"
          ? incomingSocial.facebook
          : "",

      googleBusiness:
        typeof incomingSocial.googleBusiness ===
        "string"
          ? incomingSocial.googleBusiness
          : "",

      other:
        typeof incomingSocial.other ===
        "string"
          ? incomingSocial.other
          : "",
    },

    bookingCta:
      typeof data.bookingCta === "string"
        ? data.bookingCta
        : "",

    quoteCta:
      typeof data.quoteCta === "string"
        ? data.quoteCta
        : "",

    defaultSiteTitle:
      typeof data.defaultSiteTitle ===
      "string"
        ? data.defaultSiteTitle
        : "",

    defaultSiteDescription:
      typeof data.defaultSiteDescription ===
      "string"
        ? data.defaultSiteDescription
        : "",

    defaultOgImage:
      data.defaultOgImage ?? null,
  };
}

function getErrorMessage(
  value: unknown
): string {
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

export default function SiteSettingsForm() {
  const [settings, setSettings] =
    useState<Settings>(
      createEmptySettings()
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {}
    );

  const [loadError, setLoadError] =
    useState("");

  const hasChanges = useMemo(
    () => !loading,
    [loading]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          "/api/admin/settings",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: unknown =
          await response.json();

        if (!response.ok) {
          throw new Error(
            getErrorMessage(result)
          );
        }

        if (cancelled) {
          return;
        }

        if (
          typeof result === "object" &&
          result !== null &&
          "data" in result
        ) {
          setSettings(
            normalizeSettings(
              result.data
            )
          );
        }
      } catch (error) {
        console.error(
          "Load site settings error:",
          error
        );

        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load site settings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<
    K extends keyof Settings
  >(
    field: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    clearError(String(field));
  }

  function updateSocial(
    field: keyof Social,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      social: {
        ...current.social,
        [field]: value,
      },
    }));

    clearError(`social.${field}`);
  }

  function updateHour(
    index: number,
    changes: Partial<BusinessHour>
  ) {
    setSettings((current) => ({
      ...current,
      businessHours:
        current.businessHours.map(
          (hour, hourIndex) =>
            hourIndex === index
              ? {
                  ...hour,
                  ...changes,
                }
              : hour
        ),
    }));
  }

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = {
        ...current,
      };

      delete next[field];

      return next;
    });
  }

  function validate() {
    const next: Record<
      string,
      string
    > = {};

    const businessName =
      settings.businessName.trim();

    const phone =
      settings.phone.trim();

    const primaryCallNumber =
      settings.primaryCallNumber.trim();

    if (businessName.length < 2) {
      next.businessName =
        "Business name is required.";
    }

    if (phone.length < 5) {
      next.phone =
        "Business phone is required.";
    }

    if (
      primaryCallNumber.length < 5
    ) {
      next.primaryCallNumber =
        "Primary call number is required.";
    }

    if (
      settings.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        settings.email.trim()
      )
    ) {
      next.email =
        "Enter a valid email address.";
    }

    for (const [
      index,
      hour,
    ] of settings.businessHours.entries()) {
      if (!hour.enabled) {
        continue;
      }

      if (
        !hour.open ||
        !hour.close
      ) {
        next[`hours.${index}`] =
          `Add opening and closing time for ${hour.day}.`;
      }
    }

    setErrors(next);

    if (
      Object.keys(next).length > 0
    ) {
      toast.error(
        "Please fix the highlighted fields."
      );

      return false;
    }

    return true;
  }

 
 

 


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        businessName:
          settings.businessName.trim(),

        tagline:
          settings.tagline.trim(),

        description:
          settings.description.trim(),

        logo: settings.logo,

        phone:
          settings.phone.trim(),

        primaryCallNumber:
          settings.primaryCallNumber.trim(),

        whatsapp:
          settings.whatsapp.trim(),

        email:
          settings.email.trim(),

        address:
          settings.address.trim(),

        primaryServiceRegion:
          settings.primaryServiceRegion.trim(),

        serviceAreaInformation:
          settings.serviceAreaInformation.trim(),

        businessHours:
          settings.businessHours.map(
            (hour) => ({
              day: hour.day,
              enabled: hour.enabled,
              ...(hour.enabled &&
              hour.open
                ? {
                    open: hour.open,
                  }
                : {}),
              ...(hour.enabled &&
              hour.close
                ? {
                    close: hour.close,
                  }
                : {}),
            })
          ),

        emergencyAvailability:
          settings.emergencyAvailability.trim(),

        social: {
          instagram:
            settings.social.instagram.trim(),

          facebook:
            settings.social.facebook.trim(),

          googleBusiness:
            settings.social.googleBusiness.trim(),

          other:
            settings.social.other.trim(),
        },

        bookingCta:
          settings.bookingCta.trim(),

        quoteCta:
          settings.quoteCta.trim(),

        defaultSiteTitle:
          settings.defaultSiteTitle.trim(),

        defaultSiteDescription:
          settings.defaultSiteDescription.trim(),

        defaultOgImage:
          settings.defaultOgImage,
      };

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PATCH",
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

      if (
        typeof result === "object" &&
        result !== null &&
        "data" in result
      ) {
        setSettings(
          normalizeSettings(
            result.data
          )
        );
      }

      setErrors({});

      toast.success(
        "Site settings saved successfully."
      );
    } catch (error) {
      console.error(
        "Save site settings error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save site settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading site settings...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6">
        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            Unable to load site settings
          </p>

          <p className="mt-1 text-sm text-red-600">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-4 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pb-28"
    >
      {/* ---------------------------------------------------------------- */}
      {/* INTRO                                                            */}
      {/* ---------------------------------------------------------------- */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
            <Settings2 size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Global website settings
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Information saved here can be
              used throughout the website.
              Keep business details accurate
              and only enter information
              supplied by the business owner.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* BUSINESS                                                         */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<Settings2 size={18} />}
          title="Business"
          description="The core identity and messaging of the business."
        />

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <Field
            label="Business Name"
            required
            hint="Used as the main business identity across the website."
            error={errors.businessName}
          >
            <input
              value={settings.businessName}
              onChange={(event) =>
                updateField(
                  "businessName",
                  event.target.value
                )
              }
              maxLength={150}
              placeholder="Car Battery Service"
              className={inputClass(
                Boolean(
                  errors.businessName
                )
              )}
            />
          </Field>

          <Field
            label="Tagline"
            hint="Short brand message shown near the business name."
            error={errors.tagline}
          >
            <input
              value={settings.tagline}
              onChange={(event) =>
                updateField(
                  "tagline",
                  event.target.value
                )
              }
              maxLength={250}
              placeholder="Your business tagline"
              className={inputClass(
                Boolean(errors.tagline)
              )}
            />
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Business Description"
              hint="A concise description of the business."
              error={errors.description}
            >
              <textarea
                value={settings.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                maxLength={3000}
                rows={5}
                placeholder="Describe the business and its services..."
                className={`${inputClass(
                  Boolean(errors.description)
                )} resize-y`}
              />

              <FieldCounter
                value={
                  settings.description
                }
                max={3000}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <CloudinaryImageUpload
  value={settings.logo}
  onChange={(value) => updateField("logo", value)}
  folder="car-battery-service/settings/logo"
  label="Business Logo"
  description="Upload the approved business logo."
  disabled={saving}
/>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CONTACT                                                          */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<Phone size={18} />}
          title="Contact"
          description="Phone, WhatsApp and email information used for customer contact."
        />

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <Field
            label="Business Phone"
            required
            hint="Main business contact number."
            error={errors.phone}
          >
            <InputWithIcon
              icon={<Phone size={17} />}
              value={settings.phone}
              onChange={(value) =>
                updateField(
                  "phone",
                  value
                )
              }
              placeholder="+61 467 037 886"
              maxLength={50}
              hasError={Boolean(
                errors.phone
              )}
            />
          </Field>

          <Field
            label="Primary Call Number"
            required
            hint="Number used by prominent Call Now buttons."
            error={
              errors.primaryCallNumber
            }
          >
            <InputWithIcon
              icon={<Phone size={17} />}
              value={
                settings.primaryCallNumber
              }
              onChange={(value) =>
                updateField(
                  "primaryCallNumber",
                  value
                )
              }
              placeholder="+61 467 037 886"
              maxLength={50}
              hasError={Boolean(
                errors.primaryCallNumber
              )}
            />
          </Field>

          <Field
            label="WhatsApp Number"
            hint="Optional. Add only if WhatsApp contact is genuinely available."
            error={errors.whatsapp}
          >
            <InputWithIcon
              icon={
                <Smartphone size={17} />
              }
              value={settings.whatsapp}
              onChange={(value) =>
                updateField(
                  "whatsapp",
                  value
                )
              }
              placeholder="+61 467 037 886"
              maxLength={50}
              hasError={Boolean(
                errors.whatsapp
              )}
            />
          </Field>

          <Field
            label="Business Email"
            hint="Optional."
            error={errors.email}
          >
            <InputWithIcon
              icon={<Mail size={17} />}
              type="email"
              value={settings.email}
              onChange={(value) =>
                updateField(
                  "email",
                  value
                )
              }
              placeholder="hello@example.com"
              maxLength={254}
              hasError={Boolean(
                errors.email
              )}
            />
          </Field>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* LOCATION                                                         */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<MapPin size={18} />}
          title="Location"
          description="Public location and service-region information."
        />

        <div className="space-y-5 p-5 md:p-6">
          <Field
            label="Public Address"
            hint="Optional. Only enter an address that should be publicly displayed."
            error={errors.address}
          >
            <textarea
              value={settings.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              maxLength={500}
              rows={3}
              placeholder="Public business address"
              className={`${inputClass(
                Boolean(errors.address)
              )} resize-y`}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Primary Service Region"
              hint="Main region served by the business."
              error={
                errors.primaryServiceRegion
              }
            >
              <input
                value={
                  settings.primaryServiceRegion
                }
                onChange={(event) =>
                  updateField(
                    "primaryServiceRegion",
                    event.target.value
                  )
                }
                maxLength={200}
                placeholder="Melbourne West"
                className={inputClass(
                  Boolean(
                    errors.primaryServiceRegion
                  )
                )}
              />
            </Field>

            <Field
              label="Service Area Information"
              hint="Short public explanation of service coverage."
              error={
                errors.serviceAreaInformation
              }
            >
              <textarea
                value={
                  settings.serviceAreaInformation
                }
                onChange={(event) =>
                  updateField(
                    "serviceAreaInformation",
                    event.target.value
                  )
                }
                maxLength={1000}
                rows={3}
                placeholder="Service availability information..."
                className={`${inputClass(
                  Boolean(
                    errors.serviceAreaInformation
                  )
                )} resize-y`}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* BUSINESS HOURS                                                   */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<Clock3 size={18} />}
          title="Business Hours"
          description="Only enable days and times that have been genuinely supplied."
        />

        <div className="p-5 md:p-6">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            {settings.businessHours.map(
              (hour, index) => (
                <div
                  key={hour.day}
                  className={`grid gap-3 p-4 sm:grid-cols-[150px_1fr_1fr_auto] sm:items-center ${
                    index !==
                    settings.businessHours
                      .length -
                      1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {hour.day}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {hour.enabled
                        ? "Open"
                        : "Closed / not supplied"}
                    </p>
                  </div>

                  <TimeInput
                    value={
                      hour.open ?? ""
                    }
                    disabled={
                      !hour.enabled
                    }
                    onChange={(value) =>
                      updateHour(index, {
                        open: value,
                      })
                    }
                  />

                  <TimeInput
                    value={
                      hour.close ?? ""
                    }
                    disabled={
                      !hour.enabled
                    }
                    onChange={(value) =>
                      updateHour(index, {
                        close: value,
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateHour(index, {
                        enabled:
                          !hour.enabled,
                        open: hour.enabled
                          ? ""
                          : hour.open ||
                            "",
                        close:
                          hour.enabled
                            ? ""
                            : hour.close ||
                              "",
                      })
                    }
                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                      hour.enabled
                        ? "bg-slate-950 text-white hover:bg-slate-800"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {hour.enabled ? (
                      <>
                        <Check
                          size={14}
                        />
                        Open
                      </>
                    ) : (
                      "Closed"
                    )}
                  </button>

                  {errors[
                    `hours.${index}`
                  ] && (
                    <p className="text-xs font-medium text-red-600 sm:col-span-4">
                      {
                        errors[
                          `hours.${index}`
                        ]
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-5">
            <Field
              label="Emergency / Availability Information"
              hint="Optional. Do not claim emergency availability unless genuinely supplied."
              error={
                errors.emergencyAvailability
              }
            >
              <textarea
                value={
                  settings.emergencyAvailability
                }
                onChange={(event) =>
                  updateField(
                    "emergencyAvailability",
                    event.target.value
                  )
                }
                maxLength={500}
                rows={3}
                placeholder="Emergency or availability information..."
                className={`${inputClass(
                  Boolean(
                    errors.emergencyAvailability
                  )
                )} resize-y`}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SOCIAL                                                           */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<Globe2 size={18} />}
          title="Social Links"
          description="Add only genuine business social profiles and public listings."
        />

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <SocialField
            label="Instagram"
            placeholder="https://instagram.com/..."
            value={
              settings.social.instagram
            }
            onChange={(value) =>
              updateSocial(
                "instagram",
                value
              )
            }
            error={
              errors["social.instagram"]
            }
          />

          <SocialField
            label="Facebook"
            placeholder="https://facebook.com/..."
            value={
              settings.social.facebook
            }
            onChange={(value) =>
              updateSocial(
                "facebook",
                value
              )
            }
            error={
              errors["social.facebook"]
            }
          />

          <SocialField
            label="Google Business Profile"
            placeholder="https://maps.google.com/..."
            value={
              settings.social.googleBusiness
            }
            onChange={(value) =>
              updateSocial(
                "googleBusiness",
                value
              )
            }
            error={
              errors[
                "social.googleBusiness"
              ]
            }
          />

          <SocialField
            label="Other Social / Business Link"
            placeholder="https://..."
            value={
              settings.social.other
            }
            onChange={(value) =>
              updateSocial(
                "other",
                value
              )
            }
            error={
              errors["social.other"]
            }
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                              */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<Phone size={18} />}
          title="Call To Action"
          description="Default CTA labels used by relevant website actions."
        />

        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
          <Field
            label="Booking CTA"
            hint="Example: Book a Battery Service"
            error={errors.bookingCta}
          >
            <input
              value={settings.bookingCta}
              onChange={(event) =>
                updateField(
                  "bookingCta",
                  event.target.value
                )
              }
              maxLength={100}
              placeholder="Book a Battery Service"
              className={inputClass(
                Boolean(
                  errors.bookingCta
                )
              )}
            />
          </Field>

          <Field
            label="Quote CTA"
            hint="Example: Request a Quote"
            error={errors.quoteCta}
          >
            <input
              value={settings.quoteCta}
              onChange={(event) =>
                updateField(
                  "quoteCta",
                  event.target.value
                )
              }
              maxLength={100}
              placeholder="Request a Quote"
              className={inputClass(
                Boolean(
                  errors.quoteCta
                )
              )}
            />
          </Field>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SEO                                                              */}
      {/* ---------------------------------------------------------------- */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader
          icon={<Globe2 size={18} />}
          title="SEO Defaults"
          description="Fallback metadata for pages that do not define their own SEO values."
        />

        <div className="space-y-5 p-5 md:p-6">
          <Field
            label="Default Site Title"
            hint="Recommended maximum around 160 characters."
            error={
              errors.defaultSiteTitle
            }
          >
            <input
              value={
                settings.defaultSiteTitle
              }
              onChange={(event) =>
                updateField(
                  "defaultSiteTitle",
                  event.target.value
                )
              }
              maxLength={160}
              placeholder="Car Battery Service | Melbourne West"
              className={inputClass(
                Boolean(
                  errors.defaultSiteTitle
                )
              )}
            />

            <FieldCounter
              value={
                settings.defaultSiteTitle
              }
              max={160}
            />
          </Field>

          <Field
            label="Default Site Description"
            hint="Default search/social description."
            error={
              errors.defaultSiteDescription
            }
          >
            <textarea
              value={
                settings.defaultSiteDescription
              }
              onChange={(event) =>
                updateField(
                  "defaultSiteDescription",
                  event.target.value
                )
              }
              maxLength={320}
              rows={4}
              placeholder="Default website description..."
              className={`${inputClass(
                Boolean(
                  errors.defaultSiteDescription
                )
              )} resize-y`}
            />

            <FieldCounter
              value={
                settings.defaultSiteDescription
              }
              max={320}
            />
          </Field>

         <CloudinaryImageUpload
  value={settings.defaultOgImage}
  onChange={(value) =>
    updateField("defaultOgImage", value)
  }
  folder="car-battery-service/settings/og"
  label="Default OG Image"
  description="Optional social sharing image used when a page does not provide its own."
  disabled={saving}
/>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SAVE BAR                                                         */}
      {/* ---------------------------------------------------------------- */}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <span
              className={`h-2 w-2 rounded-full ${
                hasChanges
                  ? "bg-emerald-500"
                  : "bg-slate-300"
              }`}
            />

            Settings are saved to the
            database.
          </div>

          <button
            type="submit"
            disabled={saving}
            className="ml-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ========================================================================== */
/* UI HELPERS                                                                 */
/* ========================================================================== */

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

function FieldCounter({
  value,
  max,
}: {
  value: string;
  max: number;
}) {
  return (
    <div className="mt-1 text-right text-[11px] font-medium text-slate-400">
      {value.length} / {max}
    </div>
  );
}

function InputWithIcon({
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  maxLength,
  hasError,
}: {
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  hasError: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${inputClass(
          hasError
        )} pl-10`}
      />
    </div>
  );
}

function TimeInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition ${
        disabled
          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
          : "border-slate-200 bg-white text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      }`}
    />
  );
}

function SocialField({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Field
      label={label}
      hint="Optional."
      error={error}
    >
      <div className="relative">
        <Globe2
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="url"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={`${inputClass(
            Boolean(error)
          )} pl-10`}
        />
      </div>
    </Field>
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