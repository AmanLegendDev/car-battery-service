import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IServiceAreaMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

export interface IServiceArea extends Document {
  name: string;
  slug: string;

  shortDescription: string;
  description: string;

  suburbs: string[];
  postcodes: string[];

  heroImage: IServiceAreaMedia | null;

  mapUrl: string;
  serviceAvailability: string;

  featured: boolean;
  displayOrder: number;
  status: "active" | "draft";

  seoTitle: string;
  seoDescription: string;

  createdAt: Date;
  updatedAt: Date;
}

const serviceAreaMediaSchema = new Schema<IServiceAreaMedia>(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    secureUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
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
      lowercase: true,
      maxlength: 20,
    },

    bytes: {
      type: Number,
      required: true,
      min: 0,
    },

    resourceType: {
      type: String,
      required: true,
      enum: ["image"],
      default: "image",
    },

    alt: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
  },
  {
    _id: false,
  }
);

const serviceAreaSchema = new Schema<IServiceArea>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 160,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
    },

    suburbs: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 50,
        message: "A service area can have a maximum of 50 suburbs.",
      },
    },

    postcodes: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 50,
        message: "A service area can have a maximum of 50 postcodes.",
      },
    },

    heroImage: {
      type: serviceAreaMediaSchema,
      default: null,
    },

    mapUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    serviceAvailability: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
      max: 100000,
    },

    status: {
      type: String,
      enum: ["active", "draft"],
      default: "draft",
      index: true,
    },

    seoTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 70,
    },

    seoDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 170,
    },
  },
  {
    timestamps: true,
  }
);

serviceAreaSchema.index({
  status: 1,
  displayOrder: 1,
});

serviceAreaSchema.index({
  status: 1,
  featured: 1,
  displayOrder: 1,
});

serviceAreaSchema.index({
  name: 1,
});

const ServiceArea: Model<IServiceArea> =
  mongoose.models.ServiceArea ||
  mongoose.model<IServiceArea>("ServiceArea", serviceAreaSchema);

export default ServiceArea;