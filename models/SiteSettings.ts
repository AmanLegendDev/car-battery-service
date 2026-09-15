import mongoose, {
  Schema,
  type Model,
} from "mongoose";

export interface ISiteSettingsMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

export interface ISiteSettingsSocial {
  instagram?: string;
  facebook?: string;
  googleBusiness?: string;
  other?: string;
}

export interface ISiteSettingsBusinessHours {
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
}

export interface ISiteSettings {
  businessName: string;
  tagline?: string;
  description?: string;

  logo?: ISiteSettingsMedia;

  phone: string;
  primaryCallNumber: string;
  whatsapp?: string;
  email?: string;

  address?: string;
  primaryServiceRegion?: string;
  serviceAreaInformation?: string;

  businessHours: ISiteSettingsBusinessHours[];
  emergencyAvailability?: string;

  social: ISiteSettingsSocial;

  bookingCta?: string;
  quoteCta?: string;

  defaultSiteTitle?: string;
  defaultSiteDescription?: string;
  defaultOgImage?: ISiteSettingsMedia;

  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema =
  new Schema<ISiteSettingsMedia>(
    {
      publicId: {
        type: String,
        required: true,
        trim: true,
      },

      secureUrl: {
        type: String,
        required: true,
        trim: true,
      },

      width: {
        type: Number,
        required: true,
        min: 1,
      },

      height: {
        type: Number,
        required: true,
        min: 1,
      },

      format: {
        type: String,
        required: true,
        trim: true,
      },

      bytes: {
        type: Number,
        required: true,
        min: 0,
      },

      resourceType: {
        type: String,
        enum: ["image"],
        required: true,
        default: "image",
      },

      alt: {
        type: String,
        trim: true,
        maxlength: 200,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const BusinessHoursSchema =
  new Schema<ISiteSettingsBusinessHours>(
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },

      enabled: {
        type: Boolean,
        default: false,
      },

      open: {
        type: String,
        trim: true,
      },

      close: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const SocialSchema =
  new Schema<ISiteSettingsSocial>(
    {
      instagram: {
        type: String,
        trim: true,
      },

      facebook: {
        type: String,
        trim: true,
      },

      googleBusiness: {
        type: String,
        trim: true,
      },

      other: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const SiteSettingsSchema =
  new Schema<ISiteSettings>(
    {
      businessName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 150,
      },

      tagline: {
        type: String,
        trim: true,
        maxlength: 250,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 3000,
      },

      logo: {
        type: MediaSchema,
        required: false,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      primaryCallNumber: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      whatsapp: {
        type: String,
        trim: true,
        maxlength: 50,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 254,
      },

      address: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      primaryServiceRegion: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      serviceAreaInformation: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      businessHours: {
        type: [BusinessHoursSchema],
        default: [],
      },

      emergencyAvailability: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      social: {
        type: SocialSchema,
        default: {},
      },

      bookingCta: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      quoteCta: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      defaultSiteTitle: {
        type: String,
        trim: true,
        maxlength: 160,
      },

      defaultSiteDescription: {
        type: String,
        trim: true,
        maxlength: 320,
      },

      defaultOgImage: {
        type: MediaSchema,
        required: false,
      },
    },
    {
      timestamps: true,
    }
  );

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>(
    "SiteSettings",
    SiteSettingsSchema
  );

export default SiteSettings;