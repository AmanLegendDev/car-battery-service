import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config({
  path: ".env.local",
});

// ─────────────────────────────────────────────
// Environment Variables
// ─────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate required environment variables
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

// Create guaranteed string values after validation
const mongoUri = MONGODB_URI;
const adminName = ADMIN_NAME;
const adminEmail = ADMIN_EMAIL;
const adminPassword = ADMIN_PASSWORD;

// Password validation
if (adminPassword.length < 12) {
  throw new Error(
    "ADMIN_PASSWORD must be at least 12 characters long."
  );
}

const normalizedEmail = adminEmail.trim().toLowerCase();

// ─────────────────────────────────────────────
// Admin Schema
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Seed Admin
// ─────────────────────────────────────────────

async function main() {
  try {
    console.log("");
    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB.");

    // Remove existing admin accounts
    const deleteResult = await Admin.deleteMany({});

    console.log(
      `Deleted ${deleteResult.deletedCount} existing admin account(s).`
    );

    // Hash password
    const passwordHash = await bcrypt.hash(
      adminPassword,
      12
    );

    // Create new admin
    await Admin.create({
      name: adminName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log("");
    console.log("========================================");
    console.log("       ADMIN CREATED SUCCESSFULLY");
    console.log("========================================");
    console.log(`Name:  ${adminName.trim()}`);
    console.log(`Email: ${normalizedEmail}`);
    console.log("Password: [hidden]");
    console.log("========================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("Admin seed failed.");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
}

main();