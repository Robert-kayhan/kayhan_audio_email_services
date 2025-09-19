"use client";

import React, { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useGetAllBookingQuery } from "@/store/api/booking/BookingApi";

interface Booking {
  id: number;
  date: string; // YYYY-MM-DD
  status: string;
}

const BookingCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch bookings
  const { data, isLoading, isError } = useGetAllBookingQuery({
    page: 1,
    limit: 10000,
  });

  const bookings: Booking[] = useMemo(() => {
    if (!data?.bookings) return [];
    return data.bookings.map((b: any) => ({
      id: b.id,
      date: b.date,
      status: b.status,
    }));
  }, [data]);

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    });
    return map;
  }, [bookings]);

  const handleDateChange = (value: Date | Date[]) => {
    if (Array.isArray(value)) setSelectedDate(value[0]);
    else setSelectedDate(value);
  };

  // Add color based on booking status
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
    const dayBookings = bookingsByDate[key];
    if (!dayBookings) return "";


    // If more than 2 bookings, mark as red
    if (dayBookings.length >= 2) return "bg-red-600 text-white";

    // Otherwise, mark based on status
    if (dayBookings.some((b) => b.status === "Cancelled"))
      return "bg-gray-400 text-white"; // optional
    if (dayBookings.some((b) => b.status === "Pending"))
      return "bg-yellow-500 text-black";
    if (dayBookings.some((b) => b.status === "Rescheduled"))
      return "bg-blue-500 text-white";

    return "";
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
    const dayBookings = bookingsByDate[key];
    if (dayBookings) {
      return (
        <div className="text-xs mt-1">
          {dayBookings.length} booking{dayBookings.length > 1 ? "s" : ""}
        </div>
      );
    }
    return null;
  };

  if (isLoading)
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        Loading bookings...
      </div>
    );
  if (isError)
    return <div className="p-4 text-red-500">Failed to load bookings.</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Booking Calendar
      </h1>
      <Calendar
        // onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={getTileClassName}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
      />

      {selectedDate && (
        <div className="mt-4 text-gray-900 dark:text-gray-100">
          <h2 className="font-semibold">
            Bookings on {selectedDate.toDateString()}:
          </h2>
          <ul className="list-disc ml-5 mt-2">
            {(
              bookingsByDate[
                `${selectedDate.getFullYear()}-${String(
                  selectedDate.getMonth() + 1
                ).padStart(
                  2,
                  "0"
                )}-${String(selectedDate.getDate()).padStart(2, "0")}`
              ] || []
            ).map((b) => (
              <li key={b.id}>
                Booking ID: {b.id}, Status: {b.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingCalendarPage;
