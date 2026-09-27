import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config({
  path: ".env.local",
});

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

async function main() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB.");

    // Delete all existing admin accounts
    const deleteResult = await Admin.deleteMany({});

    console.log(
      `Deleted ${deleteResult.deletedCount} existing admin account(s).`
    );

    // Hash the new password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create new admin
    await Admin.create({
      name: ADMIN_NAME.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log("");
    console.log("=================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log(`Name:  ${ADMIN_NAME.trim()}`);
    console.log(`Email: ${normalizedEmail}`);
    console.log("Password: [hidden]");
    console.log("=================================");
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