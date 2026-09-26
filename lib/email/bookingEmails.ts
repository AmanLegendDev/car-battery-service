import nodemailer from "nodemailer";

import SiteSettings from "@/models/SiteSettings";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://carbatteryservices.com.au";

const DEFAULT_BUSINESS_NAME =
  "Car Battery Service";

const DEFAULT_REGION =
  "Melbourne West";

const DEFAULT_PHONE =
  "+61 467 037 886";

interface BookingEmailData {
  bookingReference: string;

  customer: {
    fullName: string;
    phone: string;
    email?: string;
  };

  vehicle: {
    registrationNumber: string;
    issue: string;
    notes?: string;
  };

  service: {
    serviceName: string;
  };

  location: {
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    accessNotes?: string;
  };

  appointment: {
    date: string;
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

type BookingStatusEmail =
  | "completed"
  | "cancelled";

/* ============================================================
   HELPERS
============================================================ */

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safe(value: unknown) {
  return escapeHtml(value);
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function formatTime(value: string) {
  if (!value) {
    return "—";
  }

  const [hoursString, minutesString] =
    value.split(":");

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return value;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/* ============================================================
   SITE SETTINGS
============================================================ */

async function getEmailSettings() {
  const settings =
    await SiteSettings.findOne()
      .select(
        "businessName phone primaryCallNumber primaryServiceRegion email logo"
      )
      .lean();

  return {
    businessName:
      settings?.businessName?.trim() ||
      DEFAULT_BUSINESS_NAME,

    phone:
      settings?.primaryCallNumber?.trim() ||
      settings?.phone?.trim() ||
      DEFAULT_PHONE,

    region:
      settings?.primaryServiceRegion?.trim() ||
      DEFAULT_REGION,

    email:
      settings?.email?.trim() ||
      "",

    logo:
      settings?.logo?.secureUrl ||
      "",
  };
}

/* ============================================================
   GMAIL TRANSPORT
============================================================ */

function getTransporter() {
  const user =
    process.env.GMAIL_USER?.trim();

  const password =
    process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

  if (!user) {
    throw new Error(
      "GMAIL_USER is not configured."
    );
  }

  if (!password) {
    throw new Error(
      "GMAIL_APP_PASSWORD is not configured."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",

    auth: {
      user,
      pass: password,
    },
  });
}

/* ============================================================
   SEND EMAIL
============================================================ */

async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const settings =
    await getEmailSettings();

  const gmailUser =
    process.env.GMAIL_USER?.trim();

  if (!gmailUser) {
    throw new Error(
      "GMAIL_USER is not configured."
    );
  }

  const transporter =
    getTransporter();

  return transporter.sendMail({
    from: `"${settings.businessName}" <${gmailUser}>`,
    to,
    subject,
    html,

    ...(replyTo
      ? {
          replyTo,
        }
      : {}),
  });
}

/* ============================================================
   SHARED EMAIL UI
============================================================ */

function emailShell({
  businessName,
  logo,
  phone,
  region,
  eyebrow,
  title,
  intro,
  accent = "#FFD400",
  children,
}: {
  businessName: string;
  logo: string;
  phone: string;
  region: string;
  eyebrow: string;
  title: string;
  intro: string;
  accent?: string;
  children: string;
}) {
  const logoBlock = logo
    ? `
      <img
        src="${safe(logo)}"
        alt="${safe(businessName)}"
        width="74"
        height="74"
        style="
          display:block;
          width:74px;
          height:74px;
          object-fit:contain;
          border-radius:18px;
          border:1px solid #21445d;
          background:#08263D;
          padding:7px;
        "
      />
    `
    : `
      <div
        style="
          width:74px;
          height:74px;
          border-radius:18px;
          background:#FFD400;
          color:#061A2B;
          font-size:25px;
          font-weight:900;
          line-height:74px;
          text-align:center;
        "
      >
        CB
      </div>
    `;

  const phoneHref =
    phone.replace(/[^+\d]/g, "");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${safe(title)}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#041522;
    color:#F8FAFC;
    font-family:Arial,Helvetica,sans-serif;
  "
>
  <div
    style="
      width:100%;
      padding:38px 14px;
      background:#041522;
      box-sizing:border-box;
    "
  >
    <div
      style="
        max-width:620px;
        margin:0 auto;
        overflow:hidden;
        border:1px solid #12344a;
        border-radius:28px;
        background:#061A2B;
        box-shadow:0 24px 80px rgba(0,0,0,0.30);
      "
    >

      <!-- TOP BRAND -->

      <div
        style="
          padding:28px 28px 24px;
          border-bottom:1px solid #12344a;
          background:#08263D;
        "
      >
        ${logoBlock}

        <div style="height:18px;"></div>

        <div
          style="
            color:${accent};
            font-size:10px;
            line-height:16px;
            font-weight:800;
            letter-spacing:2px;
            text-transform:uppercase;
          "
        >
          ${safe(eyebrow)}
        </div>

        <div
          style="
            margin-top:8px;
            color:#F8FAFC;
            font-size:28px;
            line-height:36px;
            font-weight:800;
            letter-spacing:-0.5px;
          "
        >
          ${safe(title)}
        </div>

        <div
          style="
            margin-top:12px;
            color:#A8BBC8;
            font-size:14px;
            line-height:23px;
          "
        >
          ${safe(intro)}
        </div>
      </div>

      <!-- CONTENT -->

      <div style="padding:26px 28px 30px;">
        ${children}
      </div>

      <!-- FOOTER -->

      <div
        style="
          padding:22px 28px 26px;
          border-top:1px solid #12344a;
          background:#041522;
        "
      >
        <div
          style="
            color:#F8FAFC;
            font-size:14px;
            font-weight:800;
          "
        >
          ${safe(businessName)}
        </div>

        <div
          style="
            margin-top:5px;
            color:#A8BBC8;
            font-size:12px;
            line-height:19px;
          "
        >
          Mobile Car Battery Service
          <br />
          ${safe(region)}
        </div>

        <div style="height:14px;"></div>

        <a
          href="tel:${safe(phoneHref)}"
          style="
            color:#FFD400;
            font-size:13px;
            font-weight:700;
            text-decoration:none;
          "
        >
          ${safe(phone)}
        </a>

        <div style="height:7px;"></div>

        <a
          href="${SITE_URL}"
          style="
            color:#7DD3FC;
            font-size:12px;
            text-decoration:none;
          "
        >
          carbatteryservices.com.au
        </a>

        <div
          style="
            margin-top:16px;
            color:#5f7786;
            font-size:10px;
            line-height:16px;
          "
        >
          This is an automated service email.
          Please keep your booking reference
          for future communication.
        </div>
      </div>

    </div>
  </div>
</body>
</html>
`;
}

/* ============================================================
   BOOKING DETAILS
============================================================ */

function bookingDetailsHtml(
  booking: BookingEmailData
) {
  return `
    <div
      style="
        margin-bottom:22px;
        padding:18px;
        border:1px solid #163b53;
        border-radius:18px;
        background:#08263D;
      "
    >
      <div
        style="
          color:#7DD3FC;
          font-size:10px;
          font-weight:800;
          letter-spacing:1.5px;
          text-transform:uppercase;
        "
      >
        Booking Reference
      </div>

      <div
        style="
          margin-top:6px;
          color:#FFD400;
          font-size:22px;
          font-weight:900;
          letter-spacing:0.5px;
        "
      >
        ${safe(booking.bookingReference)}
      </div>
    </div>

    ${detailGroup("Customer", [
      ["Name", booking.customer.fullName],
      ["Phone", booking.customer.phone],
      [
        "Email",
        booking.customer.email ||
          "Not provided",
      ],
    ])}

    ${detailGroup("Service", [
      [
        "Service",
        booking.service.serviceName,
      ],
      [
        "Issue",
        booking.vehicle.issue ||
          "Not specified",
      ],
    ])}

    ${detailGroup("Vehicle", [
      [
        "Registration",
        booking.vehicle.registrationNumber,
      ],
      [
        "Vehicle notes",
        booking.vehicle.notes || "None",
      ],
    ])}

    ${detailGroup("Appointment", [
      [
        "Date",
        formatDate(
          booking.appointment.date
        ),
      ],
      [
        "Time",
        `${formatTime(
          booking.appointment.startTime
        )} – ${formatTime(
          booking.appointment.endTime
        )}`,
      ],
      [
        "Timezone",
        booking.appointment.timezone,
      ],
    ])}

    ${detailGroup("Service Location", [
      [
        "Address",
        booking.location.address,
      ],
      [
        "Suburb",
        booking.location.suburb,
      ],
      [
        "State",
        booking.location.state,
      ],
      [
        "Postcode",
        booking.location.postcode,
      ],
      [
        "Access notes",
        booking.location.accessNotes ||
          "None",
      ],
    ])}
  `;
}

function detailGroup(
  title: string,
  rows: Array<[string, string]>
) {
  return `
    <div
      style="
        margin-bottom:18px;
        padding:18px;
        border:1px solid #12344a;
        border-radius:18px;
        background:#061A2B;
      "
    >
      <div
        style="
          margin-bottom:13px;
          color:#FFD400;
          font-size:10px;
          font-weight:800;
          letter-spacing:1.5px;
          text-transform:uppercase;
        "
      >
        ${safe(title)}
      </div>

      ${rows
        .map(
          ([label, value]) => `
            <div
              style="
                padding:8px 0;
                border-bottom:1px solid #0e2c40;
              "
            >
              <div
                style="
                  color:#718895;
                  font-size:11px;
                  line-height:17px;
                "
              >
                ${safe(label)}
              </div>

              <div
                style="
                  margin-top:2px;
                  color:#F8FAFC;
                  font-size:13px;
                  line-height:20px;
                  font-weight:600;
                "
              >
                ${safe(value)}
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

/* ============================================================
   CUSTOMER — BOOKING RECEIVED
============================================================ */

export async function sendCustomerBookingReceivedEmail(
  booking: BookingEmailData
) {
  const customerEmail =
    booking.customer.email?.trim();

  if (!customerEmail) {
    return;
  }

  const settings =
    await getEmailSettings();

  const html = emailShell({
    businessName:
      settings.businessName,

    logo:
      settings.logo,

    phone:
      settings.phone,

    region:
      settings.region,

    eyebrow:
      "Booking Received",

    title:
      "Your booking request is in.",

    intro:
      `Hi ${booking.customer.fullName}, we've received your service request and saved your appointment details.`,

    children: `
      <div
        style="
          margin-bottom:22px;
          color:#D6E2E9;
          font-size:14px;
          line-height:24px;
        "
      >
        Thank you for choosing
        <strong style="color:#F8FAFC;">
          ${safe(settings.businessName)}
        </strong>.

        Your booking request has been
        successfully received.
      </div>

      ${bookingDetailsHtml(booking)}

      <div
        style="
          margin-top:20px;
          padding:17px 18px;
          border-left:3px solid #FFD400;
          border-radius:12px;
          background:#08263D;
          color:#A8BBC8;
          font-size:12px;
          line-height:20px;
        "
      >
        <strong style="color:#F8FAFC;">
          What's next?
        </strong>

        <br />

        Our team will review your request
        and contact you if anything needs
        to be confirmed.

        Please keep your booking reference

        <strong style="color:#FFD400;">
          ${safe(booking.bookingReference)}
        </strong>

        for future communication.
      </div>

      <div style="height:24px;"></div>

      <a
        href="${SITE_URL}"
        style="
          display:inline-block;
          padding:13px 19px;
          border-radius:12px;
          background:#FFD400;
          color:#061A2B;
          font-size:13px;
          font-weight:800;
          text-decoration:none;
        "
      >
        Visit Our Website
      </a>
    `,
  });

  return sendEmail({
    to: customerEmail,

    subject:
      `Booking Received — ${booking.bookingReference}`,

    html,

    replyTo:
      settings.email ||
      process.env.GMAIL_USER,
  });
}

/* ============================================================
   BUSINESS — NEW BOOKING RECEIVED
============================================================ */

export async function sendAdminNewBookingEmail(
  booking: BookingEmailData
) {
  const settings =
    await getEmailSettings();

  const adminEmail =
    settings.email?.trim();

  if (!adminEmail) {
    throw new Error(
      "Site Settings email is not configured."
    );
  }

  const html = emailShell({
    businessName:
      settings.businessName,

    logo:
      settings.logo,

    phone:
      settings.phone,

    region:
      settings.region,

    eyebrow:
      "New Booking Received",

    title:
      "New customer booking.",

    intro:
      "A new mobile service booking has just been submitted through your website.",

    children: `
      <div
        style="
          margin-bottom:22px;
          padding:17px 18px;
          border:1px solid rgba(255,212,0,0.20);
          border-radius:18px;
          background:#08263D;
        "
      >
        <div
          style="
            color:#FFD400;
            font-size:12px;
            line-height:19px;
            font-weight:800;
          "
        >
          ACTION REQUIRED
        </div>

        <div
          style="
            margin-top:4px;
            color:#F8FAFC;
            font-size:14px;
            line-height:22px;
          "
        >
          A customer has submitted a new
          booking request.

          Open your admin dashboard
          to review it.
        </div>
      </div>

      ${bookingDetailsHtml(booking)}

      <div style="height:5px;"></div>

      <a
        href="${SITE_URL}/admin/bookings"
        style="
          display:inline-block;
          padding:13px 19px;
          border-radius:12px;
          background:#FFD400;
          color:#061A2B;
          font-size:13px;
          font-weight:800;
          text-decoration:none;
        "
      >
        Open Booking Dashboard
      </a>
    `,
  });

  return sendEmail({
    to: adminEmail,

    subject:
      `New Booking Received — ${booking.bookingReference}`,

    html,

    replyTo:
      booking.customer.email ||
      undefined,
  });
}

/* ============================================================
   CUSTOMER — COMPLETED / CANCELLED
============================================================ */

export async function sendCustomerBookingStatusEmail(
  booking: BookingEmailData,
  status: BookingStatusEmail
) {
  const customerEmail =
    booking.customer.email?.trim();

  if (!customerEmail) {
    return;
  }

  const settings =
    await getEmailSettings();

  const completed =
    status === "completed";

  const title =
    completed
      ? "Your service is complete."
      : "Your booking has been cancelled.";

  const eyebrow =
    completed
      ? "Service Completed"
      : "Booking Update";

  const intro =
    completed
      ? `Your booking ${booking.bookingReference} has been marked as completed.`
      : `Your booking ${booking.bookingReference} has been cancelled.`;

  const accent =
    completed
      ? "#67E8A5"
      : "#FF7D7D";

  const html = emailShell({
    businessName:
      settings.businessName,

    logo:
      settings.logo,

    phone:
      settings.phone,

    region:
      settings.region,

    eyebrow,

    title,

    intro,

    accent,

    children: `
      <div
        style="
          margin-bottom:22px;
          padding:20px;
          border:1px solid #163b53;
          border-radius:18px;
          background:#08263D;
        "
      >
        <div
          style="
            color:${accent};
            font-size:11px;
            font-weight:800;
            letter-spacing:1.4px;
            text-transform:uppercase;
          "
        >
          Booking
          ${
            completed
              ? "Completed"
              : "Cancelled"
          }
        </div>

        <div
          style="
            margin-top:8px;
            color:#F8FAFC;
            font-size:16px;
            line-height:25px;
            font-weight:700;
          "
        >
          ${
            completed
              ? "Thank you for choosing Car Battery Service."
              : "If you still need assistance, please contact us and our team can help with your next service request."
          }
        </div>
      </div>

      ${detailGroup("Booking", [
        [
          "Reference",
          booking.bookingReference,
        ],
        [
          "Service",
          booking.service.serviceName,
        ],
        [
          "Appointment",
          `${formatDate(
            booking.appointment.date
          )} · ${formatTime(
            booking.appointment.startTime
          )} – ${formatTime(
            booking.appointment.endTime
          )}`,
        ],
      ])}

      ${
        !completed
          ? `
            <div
              style="
                margin-top:4px;
                padding:16px 18px;
                border-left:3px solid #FF7D7D;
                border-radius:12px;
                background:#08263D;
                color:#A8BBC8;
                font-size:12px;
                line-height:20px;
              "
            >
              Need another appointment?

              <a
                href="${SITE_URL}/book-service"
                style="
                  color:#FFD400;
                  font-weight:800;
                  text-decoration:none;
                "
              >
                Book a new service
              </a>

              or call us on

              <a
                href="tel:${safe(
                  settings.phone.replace(
                    /[^+\d]/g,
                    ""
                  )
                )}"
                style="
                  color:#FFD400;
                  font-weight:800;
                  text-decoration:none;
                "
              >
                ${safe(settings.phone)}
              </a>.
            </div>
          `
          : `
            <div
              style="
                margin-top:4px;
                padding:16px 18px;
                border-left:3px solid #67E8A5;
                border-radius:12px;
                background:#08263D;
                color:#A8BBC8;
                font-size:12px;
                line-height:20px;
              "
            >
              We appreciate your business
              and thank you for choosing

              <strong style="color:#F8FAFC;">
                ${safe(settings.businessName)}
              </strong>.
            </div>
          `
      }

      <div style="height:24px;"></div>

      <a
        href="${SITE_URL}"
        style="
          display:inline-block;
          padding:13px 19px;
          border-radius:12px;
          background:#FFD400;
          color:#061A2B;
          font-size:13px;
          font-weight:800;
          text-decoration:none;
        "
      >
        Visit Our Website
      </a>
    `,
  });

  return sendEmail({
    to: customerEmail,

    subject:
      completed
        ? `Service Completed — ${booking.bookingReference}`
        : `Booking Cancelled — ${booking.bookingReference}`,

    html,

    replyTo:
      settings.email ||
      process.env.GMAIL_USER,
  });
}