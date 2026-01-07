import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Event } from "@/database";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Nếu deploy Vercel: tăng thời gian xử lý (tùy plan)
// export const maxDuration = 60;

type CloudinaryResult = { secure_url: string };

function uploadToCloudinary(file: File) {
  return new Promise<CloudinaryResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "events",
        resource_type: "image",
        // có thể set chất lượng để nhẹ hơn (Cloudinary auto optimize)
        // transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url)
          return reject(new Error("Upload failed: no secure_url"));
        resolve(result as CloudinaryResult);
      }
    );

    // Pipe web stream -> node stream
    Readable.fromWeb(file.stream() as any).pipe(uploadStream);
  });
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }
    let tags = JSON.parse(formData.get("tags") as string);
    let agenda = JSON.parse(formData.get("agenda") as string);
    // Tách field text riêng để tránh dính File vào event object
    const entries = Array.from(formData.entries()).filter(
      ([k]) => k !== "image"
    );
    const event: any = Object.fromEntries(entries);

    // Upload
    const uploadResult = await uploadToCloudinary(file);
    event.image = uploadResult.secure_url;

    const createdEvent = await Event.create({ ...event, tags, agenda });
    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Event creation failed:", e);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events retrieved successfully", events },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event retrieval failed",
        error: e?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
