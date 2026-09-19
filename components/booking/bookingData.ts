import type { BookingFormData } from "@/lib/booking/booking.types";

import {
  BOOKING_TIMEZONE,
} from "@/lib/booking/booking.constants";

export const INITIAL_BOOKING_DATA: BookingFormData = {
  vehicle: {
    registrationNumber: "",
    issue: "",
    notes: "",
  },

  service: {
    serviceId: "",
    serviceName: "",
  },

  appointment: {
    date: "",
    startTime: "",
    endTime: "",
    timezone: BOOKING_TIMEZONE,
  },

  customer: {
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  },

  location: {
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    accessNotes: "",
  },

  termsAccepted: false,
};