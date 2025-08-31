"use client";

import React, { useState, useCallback } from "react";
import { User, Car, ClipboardList, Package, MapPinHouse } from "lucide-react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useCreateBookingMutation } from "@/store/api/booking/BookingApi";
// Steps
const steps = [
  { title: "User Info", icon: User },
  { title: "Vehicle", icon: Car },
  { title: "Booking", icon: ClipboardList },
  { title: "Items", icon: Package },
  // { title: "Mobile Details", icon: MapPinHouse },
];

// Input field
const InputField = ({ type = "text", placeholder, value, onChange }: any) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
  />
);

// Textarea field
const TextAreaField = ({ placeholder, value, onChange }: any) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
  />
);

// Items step
const ItemsStep = ({ items, setItems }: any) => {
  const addItem = () => {
    if (items.newItem.trim()) {
      setItems({ list: [...items.list, items.newItem.trim()], newItem: "" });
    }
  };

  const removeItem = (index: number) =>
    setItems({
      list: items.list.filter((_:any, i:any) => i !== index),
      newItem: items.newItem,
    });

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <InputField
          placeholder="Add an item"
          value={items.newItem}
          onChange={(e: any) => setItems({ ...items, newItem: e.target.value })}
        />
        <button
          type="button"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
          onClick={addItem}
        >
          Add
        </button>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {items.list.map((item: string, index: number) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item}</span>
            <button
              type="button"
              className="text-red-500 hover:text-red-400"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Distance calculator
const calculateDistanceKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userInfo: { firstname: "", lastname: "", email: "", phone: "" },
    vehicle: { make: "", model: "", year: "", vin: "" ,currentStereo:""},
    booking: {
      type: "Mobile",
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
      location: { lat: 28.6139, lng: 77.209 },
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
  const [createBooking, { isLoading, isSuccess, isError, error }] =
    useCreateBookingMutation();
  const handleSubmit = async () => {
    try {
      // ✅ Basic validation rules
      if (!formData.userInfo.firstname?.trim()) {
        alert("First name is required");
        setCurrentStep(0);
        return;
      }
      if (!formData.userInfo.lastname?.trim()) {
        alert("Last name is required");
        setCurrentStep(0);
        return;
      }
      if (!formData.userInfo.email?.trim()) {
        alert("Email is required");
        setCurrentStep(0);
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.userInfo.email)) {
        alert("Please enter a valid email");
        setCurrentStep(0);
        return;
      }
      if (!formData.userInfo.phone?.trim()) {
        alert("Phone number is required");
        setCurrentStep(0);
        return;
      }

      if (!formData.vehicle.make?.trim() || !formData.vehicle.model?.trim()) {
        alert("Vehicle make and model are required");
        setCurrentStep(1);
        return;
      }
      if (!formData.vehicle.year?.trim()) {
        alert("Vehicle year is required");
        setCurrentStep(1);
        return;
      }

      if (!formData.booking.date?.trim()) {
        alert("Booking date is required");
        setCurrentStep(2);
        return;
      }
      if (!formData.booking.time?.trim()) {
        alert("Booking time is required");
        setCurrentStep(2);
        return;
      }
      if (!formData.items.list.length) {
        alert("Please add at least one item");
        setCurrentStep(3);
        return;
      }

      if (formData.booking.type === "Mobile") {
        if (
          !formData.mobileDetails.location?.lat ||
          !formData.mobileDetails.location?.lng
        ) {
          alert("Please set a valid mobile service location");
          setCurrentStep(4);
          return;
        }
      }

      // ✅ Payload ready after validation
      const payload = {
        userData: formData.userInfo,
        vehicle: formData.vehicle,
        booking: formData.booking,
        items: formData.items.list,
        mobileDetails: formData.mobileDetails,
      };

      console.log("Submitting booking payload:", payload);
      const res = await createBooking(payload).unwrap();

      alert("Booking created successfully!");
      console.log("Server response:", res);

      // ✅ Reset form after success
      setFormData({
        userInfo: { firstname: "", lastname: "", email: "", phone: "" },
        vehicle: { make: "", model: "", year: "", vin: "",
          currentStereo:""
         },
        booking: {
          type: "Mobile",
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
          location: { lat: 28.6139, lng: 77.209 },
        },
      });
      setCurrentStep(0);
    } catch (err) {
      console.error("Booking creation failed:", err);
      alert("Failed to create booking. Please try again.");
    }
  };

  // Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });
  const mapContainerStyle = { width: "100%", height: "300px" };
  const workshopLocation = { lat: 30.770527, lng: 76.502311 };
  const distanceKm = calculateDistanceKm(
    workshopLocation.lat,
    workshopLocation.lng,
    formData.mobileDetails.location.lat,
    formData.mobileDetails.location.lng
  ).toFixed(2);

  // Directions
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const calculateRoute = useCallback(() => {
    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: workshopLocation,
        destination: formData.mobileDetails.location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) setDirections(result);
        else console.error("Directions error:", status);
      }
    );
  }, [formData.mobileDetails.location]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mb-10">
        <div className="flex justify-between mb-2 text-sm">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`flex flex-col items-center transition-all ${
                  index <= currentStep ? "text-green-400" : "text-gray-500"
                }`}
              >
                <Icon size={22} className="mb-1" />
                <span>{step.title}</span>
              </div>
            );
          })}
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center justify-center gap-2">
          {steps[currentStep].title}
        </h2>

        {/* Step content */}
        {currentStep === 0 && (
          <>
            <InputField
              placeholder="First Name"
              value={formData.userInfo.firstname}
              onChange={(e:any) =>
                handleChange("userInfo", "firstname", e.target.value)
              }
            />
            <InputField
              placeholder="Last Name"
              value={formData.userInfo.lastname}
              onChange={(e:any) =>
                handleChange("userInfo", "lastname", e.target.value)
              }
            />
            <InputField
              type="email"
              placeholder="Email"
              value={formData.userInfo.email}
              onChange={(e:any) =>
                handleChange("userInfo", "email", e.target.value)
              }
            />
            <InputField
              type="tel"
              placeholder="Phone"
              value={formData.userInfo.phone}
              onChange={(e:any) =>
                handleChange("userInfo", "phone", e.target.value)
              }
            />
          </>
        )}

        {currentStep === 1 && (
          <>
            <InputField
              placeholder="Make"
              value={formData.vehicle.make}
              onChange={(e:any) => handleChange("vehicle", "make", e.target.value)}
            />
            <InputField
              placeholder="Model"
              value={formData.vehicle.model}
              onChange={(e:any) => handleChange("vehicle", "model", e.target.value)}
            />
            <InputField
              type="number"
              placeholder="Year"
              value={formData.vehicle.year}
              onChange={(e:any) => handleChange("vehicle", "year", e.target.value)}
            />
            <InputField
              placeholder="VIN Number"
              value={formData.vehicle.vin}
              onChange={(e:any) => handleChange("vehicle", "vin", e.target.value)}
            />
             <InputField
              placeholder="currentStereo"
              value={formData.vehicle.currentStereo}
              onChange={(e:any) => handleChange("vehicle", "currentStereo", e.target.value)}
            />
            <input type="image" placeholder="upload" />
          </>
        )}

        {currentStep === 2 && (
          <>
            <select
              value={formData.booking.type}
              onChange={(e) => handleChange("booking", "type", e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
            >
              <option value="Mobile">Mobile</option>
              <option value="In-Store">Store</option>
            </select>
            <InputField
              placeholder="Invoice Number"
              value={formData.booking.invoiceNumber}
              onChange={(e:any) =>
                handleChange("booking", "invoiceNumber", e.target.value)
              }
            />
            <InputField
              type="date"
              placeholder="Date"
              value={formData.booking.date}
              onChange={(e:any) => handleChange("booking", "date", e.target.value)}
            />
            <InputField
              type="time"
              placeholder="Time"
              value={formData.booking.time}
              onChange={(e:any) => handleChange("booking", "time", e.target.value)}
            />
            <TextAreaField
              placeholder="Notes"
              value={formData.booking.notes}
              onChange={(e:any) => handleChange("booking", "notes", e.target.value)}
            />
          </>
        )}

        {currentStep === 3 && (
          <ItemsStep
            items={formData.items}
            setItems={(data: any) => setFormData({ ...formData, items: data })}
          />
        )}

        {currentStep === 4 && (
          <>
            <InputField
              placeholder="Parking Restrictions"
              value={formData.mobileDetails.parking}
              onChange={(e:any) =>
                handleChange("mobileDetails", "parking", e.target.value)
              }
            />
            <InputField
              placeholder="Power Access"
              value={formData.mobileDetails.powerAccess}
              onChange={(e:any) =>
                handleChange("mobileDetails", "powerAccess", e.target.value)
              }
            />
            <TextAreaField
              placeholder="Special Instructions"
              value={formData.mobileDetails.instructions}
              onChange={(e:any) =>
                handleChange("mobileDetails", "instructions", e.target.value)
              }
            />

            {formData.booking.type === "Mobile" && isLoaded && (
              <div className="mt-4 relative">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={15}
                  center={formData.mobileDetails.location}
                >
                  <Marker position={workshopLocation} label="Workshop" />
                  <Marker
                    position={formData.mobileDetails.location}
                    draggable
                    onDragEnd={(e: google.maps.MapMouseEvent) => {
                      handleChange("mobileDetails", "location", {
                        lat: e.latLng!.lat(),
                        lng: e.latLng!.lng(),
                      });
                      setDirections(null);
                    }}
                    label="Mobile"
                  />

                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
                <p className="mt-2 text-green-400 font-bold">
                  Distance from workshop: {distanceKm} km
                </p>
                <button
                  onClick={calculateRoute}
                  className="mt-2 px-4 py-2 bg-green-600 rounded-lg"
                >
                  Show Route
                </button>
              </div>
            )}
            {!isLoaded && <p>Loading map...</p>}
          </>
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
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
