/**
 * Database models entry point
 * Export tất cả models từ một file duy nhất để dễ import
 *
 * Usage:
 * import { Event, Booking } from '@/database';
 */

export { default as Event } from "./event.model";
export { default as Booking } from "./booking.model";

// Export types để sử dụng trong TypeScript
export type { IEvent } from "./event.model";
export type { IBooking } from "./booking.model";
