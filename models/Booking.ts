import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type VehicleIssue =
  | "Car won't start"
  | "Battery appears flat"
  | "Needs a jump start"
  | "Battery testing"
  | "Battery replacement"
  | "Not sure / Need help";

export interface IBookingCustomer {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface IBookingVehicle {
  registrationNumber: string;
  issue: VehicleIssue | "";
  notes: string;
}

export interface IBookingService {
  serviceId: Types.ObjectId | null;
  serviceName: string;
}

export interface IBookingLocation {
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  accessNotes: string;
}

export interface IBookingAppointment {
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface IBooking extends Document {
  bookingReference: string;

  customer: IBookingCustomer;
  vehicle: IBookingVehicle;
  service: IBookingService;
  location: IBookingLocation;
  appointment: IBookingAppointment;

  status: BookingStatus;

  archived: boolean;
  archivedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const BookingCustomerSchema =
  new Schema<IBookingCustomer>(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },
    },
    {
      _id: false,
    }
  );

const BookingVehicleSchema =
  new Schema<IBookingVehicle>(
    {
      registrationNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      issue: {
        type: String,
        enum: [
          "",
          "Car won't start",
          "Battery appears flat",
          "Needs a jump start",
          "Battery testing",
          "Battery replacement",
          "Not sure / Need help",
        ],
        default: "",
      },

      notes: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },
    },
    {
      _id: false,
    }
  );

const BookingServiceSchema =
  new Schema<IBookingService>(
    {
      serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        default: null,
      },

      serviceName: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const BookingLocationSchema =
  new Schema<IBookingLocation>(
    {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      suburb: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postcode: {
        type: String,
        required: true,
        trim: true,
      },

      accessNotes: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },
    },
    {
      _id: false,
    }
  );

const BookingAppointmentSchema =
  new Schema<IBookingAppointment>(
    {
      date: {
        type: String,
        required: true,
        trim: true,
      },

      startTime: {
        type: String,
        required: true,
        trim: true,
      },

      endTime: {
        type: String,
        required: true,
        trim: true,
      },

      timezone: {
        type: String,
        required: true,
        default: "Australia/Melbourne",
      },
    },
    {
      _id: false,
    }
  );

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    customer: {
      type: BookingCustomerSchema,
      required: true,
    },

    vehicle: {
      type: BookingVehicleSchema,
      required: true,
    },

    service: {
      type: BookingServiceSchema,
      required: true,
    },

    location: {
      type: BookingLocationSchema,
      required: true,
    },

    appointment: {
      type: BookingAppointmentSchema,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    /*
     * Archive is intentionally NOT a booking status.
     *
     * The original status is preserved when a booking
     * is archived.
     */
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Appointment lookup / availability.
 *
 * Archived bookings remain in the database but are
 * not treated as active bookings by the API.
 */
BookingSchema.index({
  "appointment.date": 1,
  "appointment.startTime": 1,
  status: 1,
  archived: 1,
});

BookingSchema.index({
  "appointment.date": 1,
  status: 1,
  archived: 1,
});

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>(
    "Booking",
    BookingSchema
  );

export default Booking;