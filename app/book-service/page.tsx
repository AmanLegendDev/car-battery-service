import { connectDB } from "@/lib/db";
import Service from "@/models/Service";

import BookingPage from "@/components/booking/BookingPage";

export const dynamic = "force-dynamic";



export const metadata = {
  title: "Book a Battery Service | Car Battery Service",
  description:
    "Request a mobile car battery service in Melbourne West.",
};

export default async function BookServicePage() {
  await connectDB();

  const services = await Service.find({
    status: "active",
  })
    .select("_id title shortDescription heroImage")
    .sort({
      displayOrder: 1,
      createdAt: 1,
    })
    .lean();

  const publicServices = services.map((service) => ({
    id: service._id.toString(),
    title: service.title,
    shortDescription:
      service.shortDescription || "",
  }));

  return (
   <>
 
    <BookingPage
      services={publicServices}
    />
   
   </>
  );
}