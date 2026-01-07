"use server";
import connectDB from "../mongodb";
import { Booking } from "@/database";

export const bookEvent = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();
    const existingBooking = await Booking.findOne({ eventId, email });
    if (existingBooking) {
      return { success: false, message: "You have already booked this event" };
    }
    await Booking.create({ eventId, email });
    return {
      success: true,
      message: "Event booked successfully",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to book event" };
  }
};
