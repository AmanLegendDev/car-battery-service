import mongoose, { Schema, type Model } from "mongoose";

export type FAQStatus = "active" | "inactive";

export interface IFAQ {
  question: string;
  answer: string;
  category: string;

  relatedServices: mongoose.Types.ObjectId[];
  relatedServiceAreas: mongoose.Types.ObjectId[];

  featured: boolean;
  displayOrder: number;
  status: FAQStatus;

  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 300,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    relatedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    relatedServiceAreas: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceArea",
      },
    ],

    featured: {
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

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Public FAQ queries will primarily use:
 * status + displayOrder
 *
 * Featured FAQ queries will use:
 * status + featured + displayOrder
 */
FAQSchema.index({
  status: 1,
  displayOrder: 1,
});

FAQSchema.index({
  status: 1,
  featured: 1,
  displayOrder: 1,
});

/*
 * Prevent duplicate questions inside the same category.
 *
 * This is intentionally NOT a unique MongoDB index because
 * question wording can legitimately change and we don't want
 * case-sensitive database uniqueness to become a CMS limitation.
 */

const FAQ: Model<IFAQ> =
  mongoose.models.FAQ ||
  mongoose.model<IFAQ>("FAQ", FAQSchema);

export default FAQ;