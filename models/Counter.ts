import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICounter extends Document {
  key: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const CounterSchema = new Schema<ICounter>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Counter: Model<ICounter> =
  mongoose.models.Counter ||
  mongoose.model<ICounter>("Counter", CounterSchema);

export default Counter;