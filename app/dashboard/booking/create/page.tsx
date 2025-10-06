"use client";

import React, { useState, useCallback } from "react";
import { User, Car, ClipboardList, Package, MapPinHouse } from "lucide-react";

import { useCreateBookingMutation } from "@/store/api/booking/BookingApi";
import ProgressBar from "@/components/booking/ProgressBar";
import UserInfoStep from "@/components/booking/UserInfoStep";
import BookingStep from "@/components/booking/BookingStep";
import MobileDetailsStep from "@/components/booking/MobileDetailsStep";
import VehicleStep from "@/components/booking/VehicleStep";
import { ItemsStep } from "@/components/booking/ItemsStep";
import { useRouter } from "next/navigation";
import { PaymentStep } from "@/components/booking/PaymentStep";
import BookingCalendar from "@/components/booking/BookingCalendar";
// Step Definitions
const steps = [
  { title: "User Info", icon: User },
  { title: "Vehicle", icon: Car },
  { title: "Booking", icon: ClipboardList },
  { title: "Items", icon: Package },
  { title: "PaymentStep", icon: MapPinHouse },
];

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userInfo: { firstname: "", lastname: "", email: "", phone: "" },
    vehicle: {
      make: "",
      model: "",
      year: "",
      vin: "",
      currentStereo: "",
      dashPhotosUrl: "",
    },
    booking: {
      type: "In-Store",
      invoiceNumber: "",
      date: "",
      time: "",
      notes: "",
    },
    items: {
      list: [], // added items
      newItem: "", // current input for item name
      newCharge: "", // current input for item charge
      discountType: "amount", // or "percentage"
      discountValue: 0, // current discount value
      totalAmount: 0, // total after discount
      discountAmount: 0, // calculated discount amount
    },

    mobileDetails: {
      parking: "",
      powerAccess: "",
      instructions: "",
      pickup: "",
      drop: "",
      distance: "",
      duration: "",
      pickupLocation: { lat: 30.6565217, lng: 76.5649627 },
      dropLocation: { lat: null, lng: null },
      routePolyline: "",
    },
    payment: {
      category: "Instant",
      methods: [],
      type: "Full",
      partialAmount: "",
    },
  });

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Step-wise validation before moving forward
  const validateStep = () => {
    switch (currentStep) {
      case 0: // User Info
        if (!formData.userInfo.firstname?.trim()) {
          alert("First name is required");
          return false;
        }
        if (!formData.userInfo.lastname?.trim()) {
          alert("Last name is required");
          return false;
        }
        if (!formData.userInfo.email?.trim()) {
          alert("Email is required");
          return false;
        }
        if (
          formData.userInfo.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userInfo.email)
        ) {
          alert("Enter a valid email");
          return false;
        }
        if (!formData.userInfo.phone?.trim()) {
          alert("Phone number is required");
          return false;
        }
        return true;

      case 1: // Vehicle
        if (!formData.vehicle.make?.trim()) {
          alert("Vehicle make is required");
          return false;
        }
        if (!formData.vehicle.model?.trim()) {
          alert("Vehicle model is required");
          return false;
        }
        if (!formData.vehicle.year?.trim()) {
          alert("Vehicle year is required");
          return false;
        }
        if (isNaN(Number(formData.vehicle.year))) {
          alert("Vehicle year must be a number");
          return false;
        }
        return true;

      case 2: // Booking
        if (!formData.booking.type?.trim()) {
          alert("Booking type is required");
          return false;
        }
        if (!formData.booking.date?.trim()) {
          alert("Booking date is required");
          return false;
        }
        if (!formData.booking.time?.trim()) {
          alert("Booking time is required");
          return false;
        }
        return true;

      case 3: // Items
        if (!formData.items.list.length) {
          alert("Add at least one item");
          return false;
        }
        return true;

      case 4: // Mobile Details
        if (!formData.mobileDetails.pickup?.trim()) {
          alert("Pickup location is required");
          return false;
        }
        if (!formData.mobileDetails.drop?.trim()) {
          alert("Drop location is required");
          return false;
        }
        if (
          !formData.mobileDetails.pickupLocation?.lat ||
          !formData.mobileDetails.pickupLocation?.lng
        ) {
          alert("Pickup coordinates are missing");
          return false;
        }
        if (
          !formData.mobileDetails.dropLocation?.lat ||
          !formData.mobileDetails.dropLocation?.lng
        ) {
          alert("Drop coordinates are missing");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // --- Updated Step Navigation ---
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.userInfo.firstname?.trim())
        return alert("First name is required");
      if (!formData.items.list.length) return alert("Add at least one item");

      // Calculate total amount from items
      const totalAmount = formData.items.totalAmount || 0;
      console.log(totalAmount)
      // Payment validation
      if (formData.payment.type === "Full") {
        const paidAmount = formData.payment.partialAmount
          ? parseFloat(formData.payment.partialAmount)
          : totalAmount;

        if (paidAmount > totalAmount || Number(formData.payment.partialAmount) > totalAmount) {
          return alert("Payment cannot exceed total amount");
        }
      }

      const payload = {
        userData: formData.userInfo,
        vehicle: formData.vehicle,
        booking: formData.booking,
        items: formData.items.list,
        mobileDetails: formData.mobileDetails,
        paymentDetails: formData.payment,
        totalAmount: totalAmount,
      };

      await createBooking(payload).unwrap();
      alert("Booking created successfully!");

      // Reset form
      setFormData({
        userInfo: { firstname: "", lastname: "", email: "", phone: "" },
        vehicle: {
          make: "",
          model: "",
          year: "",
          vin: "",
          currentStereo: "",
          dashPhotosUrl: "",
        },
        booking: {
          type: "In-Store",
          invoiceNumber: "",
          date: "",
          time: "",
          notes: "",
        },
        items: {
          list: [],
          newItem: "",
          newCharge: "",
          discountType: "amount",
          discountValue: 0,
          totalAmount: 0,
          discountAmount: 0,
        },
        mobileDetails: {
          routePolyline: "",
          parking: "",
          powerAccess: "",
          instructions: "",
          pickup: "Unit 3/151 Dohertys Rd, Laverton North VIC 3026, Australia",
          drop: "",
          distance: "",
          duration: "",
          pickupLocation: { lat: 30.6565217, lng: 76.5649627 },
          dropLocation: { lat: null, lng: null },
        },
        payment: {
          category: "Instant",
          methods: [],
          type: "Full",
          partialAmount: "",
        },
      });

      router.push("/dashboard/booking");
    } catch (err: any) {
      console.error("Booking failed:", err);
      alert(err?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      {/* Progress */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <ProgressBar currentStep={currentStep} steps={steps} />
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-6 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Form column */}
        <div className="bg-gray-900/80 backdrop-blur rounded-2xl shadow-xl p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-green-400 flex items-center justify-center gap-4">
            {steps[currentStep].title}
          </h2>

          {/* Step Content */}
          {currentStep === 0 && (
            <UserInfoStep formData={formData} handleChange={handleChange} />
          )}
          {currentStep === 1 && (
            <VehicleStep formData={formData} handleChange={handleChange} />
          )}
          {currentStep === 2 && (
            <>
              <BookingStep formData={formData} handleChange={handleChange} />
              {formData.booking.type === "Mobile" && (
                <MobileDetailsStep
                  formData={formData}
                  handleChange={handleChange}
                />
              )}
            </>
          )}
          {currentStep === 3 && (
            <ItemsStep
              items={formData.items}
              setItems={(data: any) =>
                setFormData({ ...formData, items: data })
              }
            />
          )}
          {currentStep === 4 && (
            <PaymentStep formData={formData} handleChange={handleChange} />
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1 sm:flex-none px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
            >
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex-1 sm:flex-none px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
              >
                {isLoading ? "Creating…" : "Submit"}
              </button>
            )}
          </div>
        </div>

        {/* Calendar column (hidden below on mobile) */}
        <aside className="hidden lg:block">
          <div className="bg-gray-900/80 backdrop-blur rounded-2xl shadow-xl p-4">
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Booking Calendar
            </h3>
            <BookingCalendar />
          </div>
        </aside>
      </div>

      {/* Mobile calendar below form */}
      <div className="block lg:hidden max-w-6xl mx-auto px-4 pb-6">
        <div className="bg-gray-900/80 backdrop-blur rounded-2xl shadow-xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-green-400">
            Booking Calendar
          </h3>
          <BookingCalendar />
        </div>
      </div>
    </div>
  );
}
