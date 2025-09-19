"use client";

import React, { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useGetAllBookingQuery } from "@/store/api/booking/BookingApi";

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch bookings
  const { data, isLoading, isError } = useGetAllBookingQuery({
    page: 1,
    limit: 10000,
  });

  // keep full booking object so nested data exists
  const bookings = useMemo(() => {
    if (!data?.bookings) return [];
    return data.bookings;
  }, [data]);

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    bookings.forEach((b: any) => {
      if (!map[b.date]) map[b.date] = [];
      map[b.date].push(b);
    });
    return map;
  }, [bookings]);

  const handleDateChange = (value: any) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0] ?? null);
    } else {
      setSelectedDate(value);
    }
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
      return "bg-gray-400 text-white";
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

  // key for selected date
  const selectedKey =
    selectedDate &&
    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
      selectedDate.getDate()
    ).padStart(2, "0")}`;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 ">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Booking Calendar
      </h1>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={getTileClassName}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
      />

      {selectedDate && (
        <div className="mt-4 text-gray-900 h-[300px] overflow-auto dark:text-gray-100">
          <h2 className="font-semibold">
            Bookings on {selectedDate.toDateString()}:
          </h2>
          <ul className="list-disc ml-5 mt-2 space-y-4">
            {(bookingsByDate[selectedKey!] || []).map((b: any) => (
              <li key={b.id} className="border rounded-md p-3">
                <div className="font-medium">Booking ID: {b.id}</div>
                <div>Status: {b.status}</div>
                <div>Type: {b.type}</div>
                <div>Invoice Number: {b.invoiceNumber || "N/A"}</div>
                <div>
                  Date/Time: {b.date} {b.time}
                </div>
                <div>Notes: {b.notes}</div>

                {/* User Details */}
                {b.User && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Customer Details:</h3>
                    <p>
                      Name: {b.User.firstname} {b.User.lastname}
                    </p>
                    <p>Email: {b.User.email}</p>
                    <p>Phone: {b.User.phone}</p>
                  </div>
                )}

                {/* Vehicle Details */}
                {b.Vehicle && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Vehicle Details:</h3>
                    <p>
                      {b.Vehicle.year} {b.Vehicle.make} {b.Vehicle.model}
                    </p>
                    <p>VIN: {b.Vehicle.vinNumber}</p>
                    <p>
                      Current Stereo: {b.Vehicle.currentStereo || "N/A"}
                    </p>
                  </div>
                )}

                {/* Booking Items */}
                {b.BookingItems?.length > 0 && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Items:</h3>
                    <ul className="list-disc ml-5">
                      {b.BookingItems.map((item: any) => (
                        <li key={item.id}>
                          {item.itemType} – ${item.charge}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mobile Installation Detail */}
                {b.MobileInstallationDetail && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Mobile Installation:</h3>
                    <p>Pickup: {b.MobileInstallationDetail.pickupAddress}</p>
                    <p>Dropoff: {b.MobileInstallationDetail.dropoffAddress}</p>
                    <p>Distance: {b.MobileInstallationDetail.routeDistance}</p>
                    <p>Duration: {b.MobileInstallationDetail.routeDuration}</p>
                  </div>
                )}

                {/* Payment */}
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
