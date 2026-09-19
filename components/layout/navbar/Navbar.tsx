import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import NavbarClient from "./NavbarClient";

export interface NavbarService {
  id: string;
  title: string;
  slug: string;
}

export default async function Navbar() {
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
    .lean();

  const navbarServices: NavbarService[] = services.map((service) => ({
    id: String(service._id),
    title: service.title,
    slug: service.slug,
  }));

  return <NavbarClient services={navbarServices} />;
}