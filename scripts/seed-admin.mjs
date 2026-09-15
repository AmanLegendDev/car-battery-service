import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

if (!ADMIN_NAME) {
  throw new Error("Missing ADMIN_NAME in .env.local");
}

if (!ADMIN_EMAIL) {
  throw new Error("Missing ADMIN_EMAIL in .env.local");
}

if (!ADMIN_PASSWORD) {
  throw new Error("Missing ADMIN_PASSWORD in .env.local");
}

if (ADMIN_PASSWORD.length < 12) {
  throw new Error(
    "ADMIN_PASSWORD must be at least 12 characters long."
  );
}

const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Admin =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);

try {
  await mongoose.connect(MONGODB_URI);

  const existingAdmin = await Admin.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  if (existingAdmin) {
    existingAdmin.name = ADMIN_NAME.trim();
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.role = "admin";
    existingAdmin.isActive = true;

    await existingAdmin.save();

    console.log(
      `Admin updated successfully: ${normalizedEmail}`
    );
  } else {
    await Admin.create({
      name: ADMIN_NAME.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log(
      `Admin created successfully: ${normalizedEmail}`
    );
  }
} catch (error) {
  console.error("Admin seed failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}