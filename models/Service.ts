import mongoose, { Document, Model, Schema } from "mongoose";

export type ServiceStatus = "active" | "inactive";

export interface IServiceMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

export interface IServiceProcessStep {
  title: string;
  description: string;
}

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;

  heroImage?: IServiceMedia;
  gallery: IServiceMedia[];

  benefits: string[];
  included: string[];
  processSteps: IServiceProcessStep[];
  suitableFor: string[];

  estimatedTime?: string;
  emergencyService: boolean;
  onSiteService: boolean;

  ctaText?: string;
  ctaLink?: string;

  featured: boolean;
  displayOrder: number;
  status: ServiceStatus;

  seoTitle?: string;
  seoDescription?: string;
  ogImage?: IServiceMedia;

  createdAt: Date;
  updatedAt: Date;
}

const ServiceMediaSchema = new Schema<IServiceMedia>(
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
      lowercase: true,
    },

    bytes: {
      type: Number,
      required: true,
      min: 0,
    },

    resourceType: {
      type: String,
      enum: ["image"],
      default: "image",
      required: true,
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
    versionKey: false,
  }
);

const ServiceProcessStepSchema = new Schema<IServiceProcessStep>(
  {
    title: {
      type: String,
      required: [true, "Process step title is required"],
      trim: true,
      minlength: [2, "Process step title must be at least 2 characters"],
      maxlength: [120, "Process step title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Process step description is required"],
      trim: true,
      minlength: [
        2,
        "Process step description must be at least 2 characters",
      ],
      maxlength: [
        500,
        "Process step description cannot exceed 500 characters",
      ],
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const ServiceSchema = new Schema<IService>(
  {
    /*
     * BASIC INFORMATION
     */

    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      minlength: [2, "Service title must be at least 2 characters"],
      maxlength: [120, "Service title cannot exceed 120 characters"],
    },

    slug: {
      type: String,
      required: [true, "Service slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Service slug must be at least 2 characters"],
      maxlength: [160, "Service slug cannot exceed 160 characters"],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Service slug must contain only lowercase letters, numbers and hyphens",
      ],
      index: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      minlength: [
        10,
        "Short description must be at least 10 characters",
      ],
      maxlength: [
        300,
        "Short description cannot exceed 300 characters",
      ],
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [10000, "Description cannot exceed 10,000 characters"],
    },

    icon: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    /*
     * MEDIA
     */

    heroImage: {
      type: ServiceMediaSchema,
      required: false,
    },

    gallery: {
      type: [ServiceMediaSchema],
      default: [],
      validate: {
        validator: (value: IServiceMedia[]) => value.length <= 12,
        message: "A service can have a maximum of 12 gallery images",
      },
    },

    /*
     * SERVICE CONTENT
     */

    benefits: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 20,
        message: "A service can have a maximum of 20 benefits",
      },
    },

    included: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 30,
        message: "A service can have a maximum of 30 included items",
      },
    },

    processSteps: {
      type: [ServiceProcessStepSchema],
      default: [],
      validate: {
        validator: (value: IServiceProcessStep[]) => value.length <= 12,
        message: "A service can have a maximum of 12 process steps",
      },
    },

    suitableFor: {
      type: [String],
      default: [],
      validate: {
        validator: (value: string[]) => value.length <= 20,
        message: "A service can have a maximum of 20 suitable-for items",
      },
    },

    /*
     * SERVICE DETAILS
     */

    estimatedTime: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    emergencyService: {
      type: Boolean,
      default: false,
      required: true,
    },

    onSiteService: {
      type: Boolean,
      default: false,
      required: true,
    },

    /*
     * CTA
     */

    ctaText: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    ctaLink: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    /*
     * DISPLAY / PUBLISHING
     */

    featured: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 100000,
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Invalid service status",
      },
      default: "inactive",
      required: true,
      index: true,
    },

    /*
     * SEO
     */

    seoTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },

    seoDescription: {
      type: String,
      trim: true,
      maxlength: 170,
    },

    ogImage: {
      type: ServiceMediaSchema,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
 * Useful compound indexes for future listing/filtering.
 */

ServiceSchema.index({
  status: 1,
  displayOrder: 1,
});

ServiceSchema.index({
  status: 1,
  featured: 1,
  displayOrder: 1,
});

const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);

export default Service;