export interface Reservation {
  id: string;
  name: string;
  contact: string;
  date: string;
  time: string;
  guests: number;
  comments?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export const TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00"
];

export const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
