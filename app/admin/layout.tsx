import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

import AdminShell from "@/components/admin/layout/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return null;
  }

  await connectDB();

  const settings = await SiteSettings.findOne()
    .select("businessName logo")
    .lean();

  const businessName =
    settings?.businessName || "Car Battery Service";

  const logoUrl =
    settings?.logo?.secureUrl || undefined;

  return (
    <AdminShell
      businessName={businessName}
      logoUrl={logoUrl}
    >
      {children}
    </AdminShell>
  );
}