/**
 * Seed script — creates a default ADMIN user if one doesn't already exist.
 * Run once: node seed.js
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["ADMIN", "SALES_USER", "PURCHASE_USER", "MANUFACTURING_USER", "INVENTORY_MANAGER", "BUSINESS_OWNER"],
      default: "SALES_USER",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const ADMIN_EMAIL    = "admin@nexuserp.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAME     = "System Admin";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
    console.log("   Password: Admin@1234  (unchanged — use the existing hash)");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    role: "ADMIN",
  });

  console.log("🎉 Admin user created successfully!");
  console.log("   Email   : " + ADMIN_EMAIL);
  console.log("   Password: " + ADMIN_PASSWORD);
  console.log("   Role    : ADMIN");

  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
