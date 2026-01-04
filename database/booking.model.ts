import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface định nghĩa cấu trúc dữ liệu của Booking document
 */
export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema cho Booking model
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event", // Reference tới Event model
      required: [true, "Event ID is required"],
      index: true, // Index để tối ưu queries theo eventId
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string): boolean {
          // Regex validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

/**
 * Pre-save middleware:
 * - Verify eventId tồn tại trong Event collection
 * - Throw error nếu event không tồn tại
 */
bookingSchema.pre("save", async function () {
  // Chỉ validate eventId nếu nó được modified hoặc document mới
  if (this.isModified("eventId") || this.isNew) {
    // Dynamic import Event model để tránh circular dependency
    const Event =
      mongoose.models.Event || (await import("./event.model")).default;

    // Kiểm tra event có tồn tại không
    const eventExists = await Event.findById(this.eventId);

    if (!eventExists) {
      throw new Error(
        `Event with ID ${this.eventId.toString()} does not exist`
      );
    }
  }
});

/**
 * Compound index: eventId + email
 * Đảm bảo một email chỉ book một event một lần
 */
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

/**
 * Export Booking model
 * Sử dụng pattern để tránh model recompilation error trong Next.js development
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
