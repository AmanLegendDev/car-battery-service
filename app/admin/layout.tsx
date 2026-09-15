import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: {
    default: "Admin Dashboard | Car Battery Service",
    template: "%s | Car Battery Service Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      {children}
    </>
  );
}