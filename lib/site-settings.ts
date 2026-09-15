import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function getSiteSettings() {
  await connectDB();

  const settings = await SiteSettings.findOne()
    .lean()
    .exec();

  if (!settings) {
    return null;
  }

  return settings;
}