import mongoose, { Schema, type Model } from "mongoose";

export interface ITestimonialPhoto {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: "image";
  alt: string;
}

export interface ITestimonial {
  name: string;
  businessName?: string;
  role?: string;

  /**
   * Optional customer photo.
   *
   * If no photo is provided, the public UI should use
   * a generated initials-based avatar instead.
   */
  photo?: ITestimonialPhoto;

  testimonial: string;

  /**
   * Optional because we must never fabricate a rating.
   */
  rating?: number;

  /**
   * Optional relation to an existing Project.
   */
 

  featured: boolean;
  published: boolean;
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

const TestimonialPhotoSchema = new Schema<ITestimonialPhoto>(
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
      default: "image",
      required: true,
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

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    businessName: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    role: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    photo: {
      type: TestimonialPhotoSchema,
      required: false,
    },

    testimonial: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },

    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },

  

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    published: {
      type: Boolean,
      default: false,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.index({
  published: 1,
  displayOrder: 1,
});

TestimonialSchema.index({
  published: 1,
  featured: 1,
  displayOrder: 1,
});

TestimonialSchema.index({
  name: 1,
  businessName: 1,
});

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;