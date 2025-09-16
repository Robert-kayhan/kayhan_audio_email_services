"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetBookingByIdQuery } from "@/store/api/booking/BookingApi";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const BookingDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetBookingByIdQuery(id as string);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  if (isLoading) return <p className="text-gray-300">Loading...</p>;
  if (!data?.booking) return <p className="text-gray-300">No booking found</p>;

  const { booking } = data;
  const { BookingItems, MobileInstallationDetail, Vehicle, payment } = booking;

  const mapCenter = {
    lat: MobileInstallationDetail?.pickupLat || 30.6565,
    lng: MobileInstallationDetail?.pickupLng || 76.565,
  };

  const polylinePath = MobileInstallationDetail?.routePolyline
    ? decodePolyline(MobileInstallationDetail.routePolyline)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Booking Details
        </h1>

        {/* Booking & Customer */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg">
              <h2 className="font-semibold text-lg mb-3">📑 Booking</h2>
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

            <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg">
              <h2 className="font-semibold text-lg mb-3">👤 Customer</h2>
              <p>
                <b>Name:</b> {booking?.User?.firstname}{" "}
                {booking?.User?.lastname}
              </p>
              <p>
                <b>Email:</b> {booking?.User?.email}
              </p>
              <p>
                <b>Phone:</b> {booking?.User?.phone}
              </p>
            </section>
          </div>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={10}
            >
              <Marker
                position={{
                  lat: MobileInstallationDetail.pickupLat,
                  lng: MobileInstallationDetail.pickupLng,
                }}
                label="P"
              />
              <Marker
                position={{
                  lat: MobileInstallationDetail.dropoffLat,
                  lng: MobileInstallationDetail.dropoffLng,
                }}
                label="D"
              />
              {polylinePath.length > 0 && (
                <Polyline
                  path={polylinePath}
                  options={{ strokeColor: "#00ff00", strokeWeight: 4 }}
                />
              )}
            </GoogleMap>
          )}
        </div>

        {/* Vehicle Info */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg">
          <h2 className="font-semibold text-lg mb-3">🚗 Vehicle</h2>
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

        {/* Items & Charges */}
        {BookingItems?.length > 0 && (
          <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg">
            <h2 className="font-semibold text-lg mb-3">🛠️ Items & Charges</h2>
            <ul className="divide-y divide-gray-700">
              {BookingItems.map((item: any, i: number) => (
                <li key={i} className="flex justify-between py-2">
                  <span>
                    {item?.itemType}{" "}
                    {item?.otherItemText ? ` - ${item.otherItemText}` : ""}
                  </span>
                  <span className="text-green-400 font-semibold">
                    ₹{parseFloat(item?.charge).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>

            {/* Payment & Discount Summary */}
            {payment && (
              <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
                <p>
                  <b>Subtotal:</b> ₹
                  {parseFloat(payment.totalAmount) +
                    parseFloat(payment.discountAmount)}{" "}
                </p>
                <p>
                  <b>Discount:</b>{" "}
                  {payment.discountType === "amount" ? "₹" : ""}
                  {payment.discountValue}
                  {payment.discountType === "percentage" ? "%" : ""}
                </p>
                <p>
                  <b>Discount Amount:</b> ₹{parseFloat(payment.discountAmount)}
                </p>
                <p>
                  <b>Total:</b> ₹{parseFloat(payment.totalAmount)}
                </p>
                <p>
                  <b>Paid Amount:</b> ₹{parseFloat(payment.paidAmount)}
                </p>
                <p>
                  <b>Remaining:</b> ₹
                  {parseFloat(payment.totalAmount) -
                    parseFloat(payment.paidAmount)}
                </p>
                <p>
                  <b>Payment Method(s):</b> {payment.methods.join(", ")}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Mobile Installation Info */}
        {booking?.type === "Mobile" && MobileInstallationDetail && (
          <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl shadow-lg space-y-4">
            <h2 className="font-semibold text-lg mb-3">
              🔧 Mobile Installation
            </h2>
            <p>
              <b>Pickup:</b> {MobileInstallationDetail.pickupAddress}
            </p>
            <p>
              <b>Drop:</b> {MobileInstallationDetail.dropoffAddress}
            </p>
            <p>
              <b>Distance:</b> {MobileInstallationDetail.routeDistance}
            </p>
            <p>
              <b>Duration:</b> {MobileInstallationDetail.routeDuration}
            </p>
            <p>
              <b>Parking Restrictions:</b>{" "}
              {MobileInstallationDetail.parkingRestrictions || "None"}
            </p>
            <p>
              <b>Power Access:</b> {MobileInstallationDetail.powerAccess}
            </p>
            <p>
              <b>Special Instructions:</b>{" "}
              {MobileInstallationDetail.specialInstructions || "None"}
            </p>

            {/* Map */}
          </section>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsPage;

// Utility function to decode Google encoded polyline
function decodePolyline(encoded: string) {
  let points: { lat: number; lng: number }[] = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}
