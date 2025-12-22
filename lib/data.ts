// Dummy data for Sports Field Booking Platform

import { Field, TimeSlot, Booking } from "./types";

export const fields: Field[] = [
  {
    id: "field-1",
    name: "Lapangan Futsal A",
    location: "Gedung Utama, Lantai 1",
    description: "Lapangan futsal berstandar internasional dengan rumput sintetis berkualitas tinggi. Dilengkapi pencahayaan LED dan AC.",
    pricePerHour: 150000,
    image: "/field-1.jpg",
    facilities: ["AC", "LED Lighting", "Locker Room", "Shower", "Parking"],
  },
  {
    id: "field-2", 
    name: "Lapangan Futsal B",
    location: "Gedung Utama, Lantai 2",
    description: "Lapangan indoor dengan lantai vinyl premium. Cocok untuk latihan dan pertandingan casual.",
    pricePerHour: 120000,
    image: "/field-2.jpg",
    facilities: ["AC", "LED Lighting", "Parking"],
  },
  {
    id: "field-3",
    name: "Lapangan Basket Outdoor",
    location: "Area Outdoor",
    description: "Lapangan basket outdoor dengan ring standar NBA. Area luas dan nyaman untuk bermain.",
    pricePerHour: 100000,
    image: "/field-3.jpg",
    facilities: ["Lighting", "Bench", "Parking"],
  },
];

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;

  for (let hour = startHour; hour < endHour; hour++) {
    const timeString = `${hour.toString().padStart(2, "0")}:00`;
    // Randomly make some slots unavailable for demo
    const available = Math.random() > 0.3;
    slots.push({
      id: `slot-${hour}`,
      time: timeString,
      available,
    });
  }
  return slots;
};

export const dummyBookings: Booking[] = [
  {
    id: "BK-001",
    fieldId: "field-1",
    userName: "Budi Santoso",
    userEmail: "budi@email.com",
    userPhone: "081234567890",
    date: "2025-12-23",
    time: "10:00",
    duration: 2,
    totalPrice: 300000,
    paymentStatus: "paid",
    paymentMethod: "full",
    paymentType: "va",
    paymentDetail: "BCA",
    createdAt: "2025-12-22T08:00:00Z",
    barcode: "BK-001-VERIFIED",
  },
  {
    id: "BK-002",
    fieldId: "field-1",
    userName: "Ani Wijaya",
    userEmail: "ani@email.com",
    userPhone: "082345678901",
    date: "2025-12-23",
    time: "14:00",
    duration: 1,
    totalPrice: 150000,
    paymentStatus: "partial",
    paymentMethod: "dp",
    paymentType: "qris",
    paymentDetail: "QRIS (All Payment)",
    createdAt: "2025-12-22T09:30:00Z",
    barcode: "BK-002-PENDING",
  },
  {
    id: "BK-003",
    fieldId: "field-2",
    userName: "Cahyo Pratama",
    userEmail: "cahyo@email.com",
    userPhone: "083456789012",
    date: "2025-12-24",
    time: "16:00",
    duration: 2,
    totalPrice: 240000,
    paymentStatus: "paid",
    paymentMethod: "full",
    paymentType: "ewallet",
    paymentDetail: "GoPay",
    createdAt: "2025-12-22T10:15:00Z",
    barcode: "BK-003-VERIFIED",
  },
  {
    id: "BK-004",
    fieldId: "field-3",
    userName: "Dewi Lestari",
    userEmail: "dewi@email.com",
    userPhone: "084567890123",
    date: "2025-12-24",
    time: "08:00",
    duration: 2,
    totalPrice: 200000,
    paymentStatus: "pending",
    paymentMethod: "full",
    paymentType: "retail",
    paymentDetail: "Alfamart",
    createdAt: "2025-12-22T11:00:00Z",
    barcode: "BK-004-PENDING",
  },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateBookingId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "BK-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
