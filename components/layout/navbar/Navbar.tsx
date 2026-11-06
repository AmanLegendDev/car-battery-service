
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

import NavbarClient from "./NavbarClient";

export interface NavbarService {
  id: string;
  title: string;
  slug: string;
}

async function getNavbarServices(): Promise<NavbarService[]> {
  try {
    await connectDB();

    const services = await Service.find({
      status: "active",
    })
      .select("_id title slug")
      .sort({
        featured: -1,
        displayOrder: 1,
        title: 1,
      })
      .limit(5)
      .lean();

    return services
      .filter((service) => {
        return (
          typeof service.title === "string" &&
          service.title.trim().length > 0 &&
          typeof service.slug === "string" &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)
        );
      })
      .map((service) => ({
        id: String(service._id),
        title: service.title.trim(),
        slug: service.slug,
      }));
  } catch (error) {
    console.error(
      "[Navbar] Failed to fetch navigation services:",
      error
    );

    return [];
  }
}

export default async function Navbar() {
  const navbarServices = await getNavbarServices();

  return <NavbarClient services={navbarServices} />;
}
