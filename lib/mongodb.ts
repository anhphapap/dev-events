import mongoose from "mongoose";

// Kiểm tra xem MONGODB_URI có tồn tại trong environment variables không
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const MONGODB_URI: string = process.env.MONGODB_URI;

/**
 * Interface định nghĩa cấu trúc của cached connection
 * conn: Mongoose connection instance
 * promise: Promise của connection (để xử lý multiple connection attempts)
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Mở rộng global object để lưu cache connection
 * Điều này cần thiết để duy trì connection qua các hot reloads trong development
 * Trong production, global object sẽ không bị reset giữa các requests
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Khởi tạo cached connection
// Sử dụng global object để cache không bị mất khi hot reload (Next.js dev mode)
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Hàm kết nối đến MongoDB database
 * Sử dụng connection caching để tránh tạo nhiều connections không cần thiết
 *
 * @returns Promise<typeof mongoose> - Mongoose instance đã được kết nối
 */
async function connectDB(): Promise<typeof mongoose> {
  // Nếu đã có connection, trả về connection đó
  if (cached.conn) {
    return cached.conn;
  }

  // Nếu chưa có promise (connection attempt), tạo mới
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Tắt buffering để tránh lỗi khi connection chưa sẵn sàng
    };

    // Tạo connection promise và lưu vào cache
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    // Đợi connection hoàn tất và lưu vào cache
    cached.conn = await cached.promise;
  } catch (error) {
    // Nếu connection thất bại, reset promise để có thể retry
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

/**
 * Hàm ngắt kết nối database
 * Sử dụng khi cần đóng connection một cách graceful
 *
 * @returns Promise<void>
 */
async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("🔌 MongoDB disconnected");
  }
}

export { connectDB, disconnectDB };
export default connectDB;
