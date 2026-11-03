import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

/* =========================================
   BOOKING STATUS
========================================= */

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

/* =========================================
   CUSTOMER
   STEP 2 — CONTACT
========================================= */

export interface IBookingCustomer {
  fullName: string;
  phone: string;
  email: string;
}

/* =========================================
   VEHICLE
   STEP 1 — VEHICLE INFORMATION
========================================= */

export interface IBookingVehicle {
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  notes: string;
}

/* =========================================
   SERVICE
   STEP 3 — SERVICE INFORMATION
========================================= */

export interface IBookingService {
  serviceId: Types.ObjectId | null;
  serviceName: string;
  issueDescription: string;
  images: string[];
  video: string;
}

/* =========================================
   LOCATION
   STEP 4 — SERVICE LOCATION
========================================= */

export interface IBookingLocation {
  address: string;
  suburb: string;
  postcode: string;
  serviceArea: string;
  state: string;
  accessNotes: string;
}

/* =========================================
   APPOINTMENT
   STEP 4 — PREFERRED DATE & TIME
========================================= */

export interface IBookingAppointment {
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

/* =========================================
   MAIN BOOKING DOCUMENT
========================================= */

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

/* =========================================
   CUSTOMER SCHEMA
========================================= */

const BookingCustomerSchema =
  new Schema<IBookingCustomer>(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },

      email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
        maxlength: 254,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================
   VEHICLE SCHEMA
========================================= */

const BookingVehicleSchema =
  new Schema<IBookingVehicle>(
    {
      registrationNumber: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
        maxlength: 20,
      },

      make: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
      },

      model: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      year: {
        type: String,
        required: true,
        trim: true,
        maxlength: 4,
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

  

/* =========================================
   SERVICE SCHEMA
========================================= */

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
        maxlength: 150,
      },

      issueDescription: {
        type: String,
        default: "",
        trim: true,
        maxlength: 3000,
      },

      images: {
        type: [String],
        default: [],
        validate: {
          validator: (images: string[]) =>
            images.length <= 5,
          message: "Maximum 5 vehicle images are allowed.",
        },
      },

      video: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

/* =========================================
   LOCATION SCHEMA
========================================= */

const BookingLocationSchema =
  new Schema<IBookingLocation>(
    {
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250,
      },

      suburb: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      postcode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10,
      },

      serviceArea: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      state: {
        type: String,
        required: true,
        trim: true,
        default: "VIC",
        maxlength: 10,
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

/* =========================================
   APPOINTMENT SCHEMA
========================================= */

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

/* =========================================
   MAIN BOOKING SCHEMA
========================================= */

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
     * Archive is separate from booking status.
     * Original booking status remains unchanged.
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

/* =========================================
   AVAILABILITY INDEXES
========================================= */

/*
 * Used to find bookings for a specific date
 * and appointment start time.
 */

BookingSchema.index({
  "appointment.date": 1,
  "appointment.startTime": 1,
  status: 1,
  archived: 1,
});

/*
 * Used to fetch bookings by date and status.
 */

BookingSchema.index({
  "appointment.date": 1,
  status: 1,
  archived: 1,
});

/*
 * Used for customer booking history.
 */

BookingSchema.index({
  "customer.phone": 1,
  createdAt: -1,
});

/* =========================================
   MODEL EXPORT
========================================= */

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>(
    "Booking",
    BookingSchema
  );

export default Booking;