// Types for Sports Field Booking Platform

export interface Field {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  image: string;
  facilities: string[];
  // Extended for venue detail page
  images?: string[];
  openHours?: string;
  totalCourts?: number;
  aboutVenue?: string;
  rules?: string[];
  reviews?: Review[];
  rating?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  timeAgo: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export type PaymentType = "va" | "qris" | "ewallet" | "retail" | "card";

export interface Booking {
  id: string;
  fieldId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  paymentStatus: "paid" | "partial" | "pending" | "failed";
  paymentMethod: "full" | "dp";
  paymentType?: PaymentType;
  paymentDetail?: string; // e.g., "BCA", "GoPay", etc.
  createdAt: string;
  barcode: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
}

export interface ScheduleData {
  fieldId: string;
  date: Date | undefined;
  time: string;
  duration: number;
}
