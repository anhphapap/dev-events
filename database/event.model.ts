import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface định nghĩa cấu trúc dữ liệu của Event document
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema cho Event model
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

/**
 * Helper function: Chuyển đổi string thành URL-friendly slug
 * VD: "Google I/O 2026" => "google-io-2026"
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Xóa ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/--+/g, "-") // Thay nhiều dấu gạch ngang liên tiếp bằng một dấu
    .replace(/^-+|-+$/g, ""); // Xóa dấu gạch ngang ở đầu và cuối
}

/**
 * Helper function: Normalize date string sang ISO format
 * VD: "May 14-15, 2026" => "2026-05-14"
 */
function normalizeDate(dateStr: string): string {
  // Nếu đã ở dạng ISO (YYYY-MM-DD), return ngay
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Parse date string thành Date object
  const date = new Date(dateStr);

  // Nếu parse thành công, convert sang ISO
  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  // Nếu không parse được, giữ nguyên
  return dateStr;
}

/**
 * Helper function: Normalize time string sang format chuẩn (HH:MM AM/PM)
 * VD: "10:00am" => "10:00 AM"
 */
function normalizeTime(timeStr: string): string {
  // Trim và uppercase AM/PM
  return timeStr.trim().replace(/am/gi, " AM").replace(/pm/gi, " PM");
}

/**
 * Pre-save middleware:
 * - Tự động generate slug từ title (chỉ khi title thay đổi)
 * - Normalize date và time sang format chuẩn
 * - Validate các trường required không empty
 */
eventSchema.pre("save", async function () {
  // Generate slug nếu title thay đổi hoặc document mới
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);

    // Kiểm tra slug trùng lặp và thêm số suffix nếu cần
    if (this.isNew) {
      const Model = this.constructor as Model<IEvent>;
      let slugExists = await Model.findOne({ slug: this.slug });
      let counter = 1;

      while (slugExists) {
        this.slug = `${generateSlug(this.title)}-${counter}`;
        slugExists = await Model.findOne({ slug: this.slug });
        counter++;
      }
    }
  }

  // Normalize date sang ISO format
  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  // Normalize time sang format chuẩn
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }

  // Validate agenda và tags không empty
  if (this.agenda.length === 0) {
    throw new Error("Agenda cannot be empty");
  }

  if (this.tags.length === 0) {
    throw new Error("Tags cannot be empty");
  }
});

/**
 * Export Event model
 * Sử dụng pattern để tránh model recompilation error trong Next.js development
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
