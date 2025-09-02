"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetBookingByIdQuery } from "@/store/api/booking/BookingApi";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetBookingByIdQuery(id as string);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (!data?.booking) return <p className="text-gray-500">No booking found</p>;

  const { booking, BookingItems } = data;
  console.log(data);
  const { MobileInstallationDetail, Vehicle } = booking;
  // Build Google Maps share URL
  const mapUrl =
    MobileInstallationDetail?.pickupAddress &&
    MobileInstallationDetail?.dropoffAddress
      ? `https://www.google.com/maps/dir/?api=1&origin=${MobileInstallationDetail.pickupLat},${MobileInstallationDetail.pickupLng}&destination=${MobileInstallationDetail.dropoffLat},${MobileInstallationDetail.dropoffLng}&travelmode=driving`
      : null;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Booking Details</h1>

      {/* Booking Info */}
      <section className="border p-4 rounded-lg  shadow">
        <h2 className="font-semibold mb-2">Booking</h2>
        <p>
          <b>Invoice #:</b> {booking?.invoiceNumber}
        </p>
        <p>
          <b>Status:</b> {booking?.status}
        </p>
        <p>
          <b>Date:</b> {booking?.date}
        </p>
        <p>
          <b>Time:</b> {booking?.time}
        </p>
        <p>
          <b>Type:</b> {booking?.type}
        </p>
        <p>
          <b>Notes:</b> {booking?.notes || "N/A"}
        </p>
      </section>

      {/* User Info */}
      <section className="border p-4 rounded-lg  shadow">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>
          <b>Name:</b> {booking?.User?.firstname} {booking?.User?.lastname}
        </p>
        <p>
          <b>Email:</b> {booking?.User?.email}
        </p>
        <p>
          <b>Phone:</b> {booking?.User?.phone}
        </p>
      </section>

      {/* Vehicle Info */}
      <section className="border p-4 rounded-lg  shadow">
        <h2 className="font-semibold mb-2">Vehicle</h2>
        <p>
          <b>Make:</b> {Vehicle?.make}
        </p>
        <p>
          <b>Model:</b> {Vehicle?.model}
        </p>
        <p>
          <b>Year:</b> {Vehicle?.year}
        </p>
      </section>

      {/* Items */}
      {BookingItems?.length > 0 && (
        <section className="border p-4 rounded-lg  shadow">
          <h2 className="font-semibold mb-2">Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            {BookingItems.map((item: any, i: number) => (
              <li key={i}>
                {item?.itemType}
                {item?.otherItemText ? ` - ${item.otherItemText}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mobile Installation */}
      {booking?.type === "Mobile" && (
        <section className="border p-4 rounded-lg  shadow">
          <h2 className="font-semibold mb-2">Mobile Installation</h2>
          <p>
            <b>Pickup:</b> {MobileInstallationDetail?.pickupAddress}
          </p>
          <p>
            <b>Drop:</b> {MobileInstallationDetail?.dropoffAddress}
          </p>
          <p>
            <b>Distance:</b> {MobileInstallationDetail?.routeDistance}
          </p>
          <p>
            <b>Duration:</b> {MobileInstallationDetail?.routeDuration}
          </p>
          <p>
            <b>Parking Restrictions:</b>{" "}
            {MobileInstallationDetail?.parkingRestrictions || "None"}
          </p>
          <p>
            <b>Power Access:</b> {MobileInstallationDetail?.powerAccess}
          </p>
          <p>
            <b>Special Instructions:</b>{" "}
            {MobileInstallationDetail?.specialInstructions || "None"}
          </p>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 inline-block"
            >
              View Route on Google Maps
            </a>
          )}
        </section>
      )}
    </div>
  );
};

export default BookingDetailsPage;
