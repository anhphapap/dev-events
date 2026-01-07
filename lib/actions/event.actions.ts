"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";
import { cacheLife } from "next/cache";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug });
    const similarEvents = await Event.find({
      tags: { $in: event?.tags },
      _id: { $ne: event?._id },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return similarEvents;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function getEvents() {
  "use cache";
  cacheLife("hours");
  try {
    await connectDB();
    return Event.find().sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error(error);
    return [];
  }
}
