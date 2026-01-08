export type BlockStatus = "booked" | "blocked" | "maintenance" | "pending";

export interface ScheduleBlock {
  id: string;
  fieldId: string; // The physical court/field ID (e.g. "field-1-court-1")
  title: string;
  startHour: number; // e.g. 10 for 10:00
  duration: number; // in hours, e.g. 1 or 1.5
  status: BlockStatus;
  notes?: string;
  bookingId?: string; // If linked to a real booking
}

export interface OperatingHours {
  open: number; // 0-23
  close: number; // 0-23
  isClosed: boolean;
}

export interface Court {
    id: string;
    name: string;
}
