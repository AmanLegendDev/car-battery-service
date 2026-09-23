import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function main() {
  const { connectDB } = await import("@/lib/db");
  const Booking = (await import("@/models/Booking")).default;
  const Counter = (await import("@/models/Counter")).default;

  await connectDB();

  const bookings = await Booking.find({
    bookingReference: {
      $regex: /^BCS-\d+$/,
    },
  })
    .select("bookingReference")
    .lean();

  let highestNumber = 0;

  for (const booking of bookings) {
    const match =
      booking.bookingReference.match(/^BCS-(\d+)$/);

    if (!match) continue;

    const number = Number(match[1]);

    if (Number.isFinite(number) && number > highestNumber) {
      highestNumber = number;
    }
  }

  const counter = await Counter.findOneAndUpdate(
    {
      key: "booking-reference",
    },
    {
      $max: {
        value: highestNumber,
      },
      $setOnInsert: {
        key: "booking-reference",
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log("");
  console.log("=================================");
  console.log("BOOKING COUNTER SYNC COMPLETE");
  console.log("=================================");
  console.log("Highest existing booking:", highestNumber);
  console.log("Counter key:", counter?.key);
  console.log("Counter value:", counter?.value);
  console.log(
    "NEXT BOOKING:",
    `BCS-${(counter?.value ?? 0) + 1}`
  );
  console.log("=================================");
  console.log("");

  await import("mongoose").then(({ default: mongoose }) =>
    mongoose.disconnect()
  );
}

main().catch((error) => {
  console.error("");
  console.error("BOOKING COUNTER SYNC FAILED:");
  console.error(error);
  console.error("");

  process.exit(1);
});