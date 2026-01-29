import { useState, useEffect } from "react";
import { Reservation } from "@/types/reservation";

const STORAGE_KEY = "restaurant_reservations";

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setReservations(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (data: Reservation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setReservations(data);
  };

  const addReservation = (reservation: Omit<Reservation, "id" | "status" | "createdAt">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: crypto.randomUUID(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [...reservations, newReservation];
    saveToStorage(updated);
    return newReservation;
  };

  const updateStatus = (id: string, status: Reservation["status"]) => {
    const updated = reservations.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    saveToStorage(updated);
  };

  const deleteReservation = (id: string) => {
    const updated = reservations.filter((r) => r.id !== id);
    saveToStorage(updated);
  };

  const getAvailableSlots = (date: string, allSlots: string[]) => {
    const takenSlots = reservations
      .filter((r) => r.date === date && r.status !== "cancelled")
      .map((r) => r.time);
    return allSlots.filter((slot) => !takenSlots.includes(slot));
  };

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
    totalGuests: reservations
      .filter((r) => r.status !== "cancelled")
      .reduce((sum, r) => sum + r.guests, 0),
  };

  return {
    reservations,
    addReservation,
    updateStatus,
    deleteReservation,
    getAvailableSlots,
    stats,
  };
};
