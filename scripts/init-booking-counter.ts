import "dotenv/config";

import { connectDB } from "@/lib/db";
import Counter from "@/models/Counter";
import Booking from "@/models/Booking";

async function main() {
  await connectDB();

  const bookings =
    await Booking.find({
      bookingReference: {
        $regex: /^BCS-\d+$/,
      },
    })
      .select("bookingReference")
      .lean();

  let highestNumber = 0;

  for (const booking of bookings) {
    const match =
      booking.bookingReference.match(
        /^BCS-(\d+)$/
      );

    if (!match) {
      continue;
    }

    const number =
      Number(match[1]);

    if (
      Number.isFinite(number) &&
      number > highestNumber
    ) {
      highestNumber = number;
    }
  }

  const counter =
    await Counter.findOneAndUpdate(
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
        new: true,
        upsert: true,
      }
    );

  console.log(
    "Booking counter initialized:",
    {
      key: counter?.key,
      value: counter?.value,
      highestExistingBooking:
        highestNumber,
    }
  );

  process.exit(0);
}

main().catch((error) => {
  console.error(
    "Failed to initialize booking counter:",
    error
  );

  process.exit(1);
});