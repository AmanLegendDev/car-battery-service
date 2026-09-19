import mongoose, {
  Schema,
  type Document,
  type Model,
} from "mongoose";

export interface IAvailabilityTimeBlock {
  start: string;
  end: string;
}

export interface IAvailability extends Document {
  date: string;
  allDayBlocked: boolean;
  timeBlocks: IAvailabilityTimeBlock[];
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilityTimeBlockSchema =
  new Schema<IAvailabilityTimeBlock>(
    {
      start: {
        type: String,
        required: true,
        trim: true,
      },

      end: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    },
  );

const AvailabilitySchema =
  new Schema<IAvailability>(
    {
      date: {
        type: String,
        required: true,
        trim: true,
      },

      allDayBlocked: {
        type: Boolean,
        default: false,
      },

      timeBlocks: {
        type: [AvailabilityTimeBlockSchema],
        default: [],
      },

      reason: {
        type: String,
        default: "",
        trim: true,
        maxlength: 300,
      },
    },
    {
      timestamps: true,
    },
  );

AvailabilitySchema.index(
  { date: 1 },
  { unique: true },
);

const Availability: Model<IAvailability> =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>(
    "Availability",
    AvailabilitySchema,
  );

export default Availability;