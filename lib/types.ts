// Types for Sports Field Booking Platform

export interface Field {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  image: string;
  facilities: string[];
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

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
