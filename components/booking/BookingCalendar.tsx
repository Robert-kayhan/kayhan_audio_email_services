"use client";

import React, { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useGetAllBookingQuery } from "@/store/api/booking/BookingApi";

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch bookings
  const { data, isLoading, isError } = useGetAllBookingQuery(
    {
      page: 1,
      limit: 1000,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      pollingInterval: 10000,
    }
  );
  console.log(data, "this is data");
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

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    const dayBookings = bookingsByDate[key];
    if (!dayBookings) return "";

    if (dayBookings.length >= 2) {
      // red for 2+ bookings
      return "bg-red-500 text-black rounded-full w-full h-full";
    }
    if (dayBookings.length === 1) {
      // orange for 1 booking
      return "bg-orange-500 text-black rounded-full w-full h-full";
    }

    return "";
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const dayBookings = bookingsByDate[key];
    if (!dayBookings) return null;

    return (
      <div className="flex justify-center mt-1">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            dayBookings.length >= 2 ? "bg-red-500" : "bg-orange-500"
          }`}
        ></span>
        <span className="ml-1 text-xs text-gray-700 dark:text-gray-200">
          {dayBookings.length}
        </span>
      </div>
    );
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
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName="text-black"
        // remove bg here – only set text color to ensure visible
        // tileClassName={({ date, view }) => {
        //   if (view !== "month") return "";
        //   const key = `${date.getFullYear()}-${String(
        //     date.getMonth() + 1
        //   ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        //   const dayBookings = bookingsByDate[key];
        //   if (!dayBookings) return "";

        //   if (dayBookings.length >= 2) {
        //     return "text-red-500 font-bold"; // red numbers
        //   }
        //   if (dayBookings.length === 1) {
        //     return "text-orange-500 font-bold"; // orange numbers
        //   }
        //   return "";
        // }}
        className="react-calendar text-black"
      />

      {selectedDate && (
        <div className="mt-4 text-black h-[300px] overflow-auto dark:text-gray-100">
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
                    <p>Current Stereo: {b.Vehicle.currentStereo || "N/A"}</p>
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
