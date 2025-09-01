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

// Step Definitions
const steps = [
  { title: "User Info", icon: User },
  { title: "Vehicle", icon: Car },
  { title: "Booking", icon: ClipboardList },
  { title: "Items", icon: Package },
  // { title: "Mobile Details", icon: MapPinHouse },
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
    items: { list: [], newItem: "" },
    mobileDetails: {
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
  });

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const [createBooking, { isLoading }] = useCreateBookingMutation();

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
        items: { list: [], newItem: "" },
        mobileDetails: {
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
      });
      setCurrentStep(0);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* Progress */}
      <ProgressBar currentStep={currentStep} steps={steps} />

      <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8 space-y-4">
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
        {/* {currentStep === 4 && (
          <MobileDetailsStep formData={formData} handleChange={handleChange} />
        )} */}

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
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------- Other Step Components ---------------
