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
      // Basic validation (similar as before)
      if (!formData.userInfo.firstname?.trim())
        return alert("First name is required");
      if (!formData.items.list.length) return alert("Add at least one item");

      const payload = {
        userData: formData.userInfo,
        vehicle: formData.vehicle,
        booking: formData.booking,
        items: formData.items.list,
        mobileDetails: formData.mobileDetails,
        paymentDetails: formData.payment,
        totalAmount : formData.items
      };

      await createBooking(payload).unwrap();
      alert("Booking created successfully!");
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
          list: [], // added items
          newItem: "", // current input for item name
          newCharge: "", // current input for item charge
          discountType: "amount", // or "percentage"
          discountValue: 0, // current discount value
          totalAmount: 0, // total after discount
          discountAmount: 0, // calculated discount amount
        },

        // items: { list: [], newItem: "" ,},
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
          // routeDistance : {}
        },
        payment: {
          category: "Instant",
          methods: [],
          type: "Full",
          partialAmount: "",
        },
       
      });
      router.push("/dashboard/booking");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking creation failed");
    }
  };

  return (
    <>
    <div className="fixed top-4 right-4 z-50 shadow-lg bg-gray-900 rounded-xl p-4 w-[450px]">
  <BookingCalendar />
</div>

    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* Progress */}
     
      <ProgressBar currentStep={currentStep} steps={steps} />

      <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8 space-y-4">
        {/* <BookingCalendar /> */}
        <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center justify-center gap-2">
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
            setItems={(data: any) => setFormData({ ...formData, items: data })}
          />
        )}
        {currentStep === 4 && (
          <PaymentStep formData={formData} handleChange={handleChange} />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-green-600 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 rounded-lg"
            >
            {isLoading ? "Creating": "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

