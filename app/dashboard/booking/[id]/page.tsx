"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetBookingByIdQuery } from "@/store/api/booking/BookingApi";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { Check, Calendar, X, CreditCard, View, CheckCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCancelJobMutation,
  useCreateJobMutation,
  useRescheduleJobMutation,
} from "@/store/api/booking/JobReportApi";
import { PaymentModal } from "@/components/booking/PaymentModal";
import FileUpload from "@/components/global/FileUpload";
import Link from "next/link";
import { useRouter } from "next/navigation";
const containerStyle = {
  width: "100%",
  height: "400px",
};
const BookingDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetBookingByIdQuery(id as string);
  console.log(data, "this is dara ");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaymentUpdate, setIsPaymentUpdate] = useState(false);
  const [showJobReportModal, setShowJobReportModal] = useState(false);
  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const [rescheduleJob] = useRescheduleJobMutation();
  const [cancelJob] = useCancelJobMutation();

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

  // ---------- Handlers ----------
  const handleRescheduleJob = async () => {
    if (!rescheduleTime) return toast.error("Please select a date and time.");
    if (!booking) return toast.error("No booking selected.");

    setIsRescheduling(true);
    try {
      await rescheduleJob({
        id: booking.id,
        rescheduleTime,
      }).unwrap();
      toast.success("Booking rescheduled successfully");
      setShowRescheduleModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule booking");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelJob = async () => {
    if (!cancelReason) return toast.error("Please provide a reason.");
    if (!booking) return toast.error("No booking selected.");

    setIsCancelling(true);
    try {
      await cancelJob({
        id: booking.id,
        cancelReason,
      }).unwrap();
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      router.push("/dashboard/booking");
      refetch();
    } catch (err) {
      console.error(err);
      router.push("/dashboard/booking");
      // toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCompleteJob = () => {
    toast.success("Job marked as completed!");
    // Implement your API logic here if needed
  };
  const handleUpdatePayment = () => {
    toast.success("Update payment clicked!");
    // Implement your payment update logic here
  };
  console.log(booking?.reports[0]?.status == "In Progress");
  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Heading */}
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            Booking
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Action Panel */}
        {/* Action Panel */}
        <div className="flex flex-wrap justify-center gap-4 p-6 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-xl">
          {(booking?.reports[0]?.status === "Rescheduled" ||
            booking?.reports?.length === 0) && (
            <button
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              onClick={() => setShowJobReportModal(true)}
            >
              Add Job Report
            </button>
          )}

          {booking?.reports[0]?.status == "In Progress" && (
            <Link
              href={`/dashboard/booking/job/update/${id}`}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <Check size={20} /> Complete Job
            </Link>
          )}
          {booking?.reports?.length !== 0 &&
            booking?.reports[0]?.status !== "In Progress" && (
              <Link
                href={`/dashboard/booking/job/${id}`}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <View size={20} /> View Job
              </Link>
            )}

          {/* {booking?.reports?.length == 0 && ( */}
            <>
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <Calendar size={20} /> Reschedule Job
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <X size={20} /> Cancel Booking
              </button>
            </>
          {/* )} */}

          {booking?.payment?.status !== "Completed" && (
            <button
              onClick={() => setIsPaymentUpdate(!false)}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <CreditCard size={20} /> Update Payment
            </button>
          )}
        </div>

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

          {/* Map */}
          {isLoaded && booking?.type !== "In-Store" && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={10}
            >
              <Marker
                position={{
                  lat: MobileInstallationDetail?.pickupLat,
                  lng: MobileInstallationDetail?.pickupLng,
                }}
                label="P"
              />
              <Marker
                position={{
                  lat: MobileInstallationDetail?.dropoffLat,
                  lng: MobileInstallationDetail?.dropoffLng,
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
                    parseFloat(payment.discountAmount)}
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
                  <b>Payment Method(s):</b>{" "}
                  {Array.isArray(payment?.methods)
                    ? payment.methods.join(", ")
                    : payment?.methods || "N/A"}
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
          </section>
        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-2xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reschedule Job</h2>
            <input
              type="datetime-local"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 mb-4 outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={handleRescheduleJob}
                disabled={isRescheduling}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400"
              >
                {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-2xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Cancel Job</h2>
            <textarea
              placeholder="Enter reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 mb-4 outline-none"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={handleCancelJob}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      <JobReportModal
        isOpen={showJobReportModal}
        onClose={() => setShowJobReportModal(false)}
        bookingId={booking.id}
      />
      <PaymentModal
        bookingId={booking.id}
        isOpen={isPaymentUpdate}
        onClose={() => setIsPaymentUpdate(false)}
      />
    </div>
  );
};

export default BookingDetailsPage;

// ---------- Utility Function ----------
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
interface JobReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

function JobReportModal({ isOpen, onClose, bookingId }: JobReportModalProps) {
  const [formData, setFormData] = useState({
    bookingId,
    techName: "",
    beforePhotos: [] as string[],
  });
  const [createJob] = useCreateJobMutation();
  const submitData = async () => {
    // Basic front-end validation
    if (!formData.techName) {
      toast.error("Please select a technician");
      return;
    }
    if (formData.beforePhotos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    try {
      await createJob(formData).unwrap();
      toast.success("Job report created successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error creating job report:", error);
      toast.error(
        error?.data?.message || "Failed to create job report. Please try again."
      );
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Job Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Technician Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-medium">
            Technician
          </label>
          <select
            name="techName"
            value={formData.techName}
            onChange={(e) =>
              setFormData({ ...formData, techName: e.target.value })
            }
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select Technician</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
          </select>
        </div>

        {/* Before Photos Upload */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">
            Before Photos
          </label>
          <FileUpload
            files={formData.beforePhotos}
            setFiles={(urls) =>
              setFormData({ ...formData, beforePhotos: urls })
            }
          />
        </div>

        {/* Save Button */}
        <button
          onClick={submitData}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          Save Report
        </button>
      </div>
    </div>
  );
}
