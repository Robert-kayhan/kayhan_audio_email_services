"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "@/store/api/booking/BookingApi";
import MobileDetailsStep from "@/components/booking/MobileDetailsStep";

export default function UpdateBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetBookingByIdQuery(id);
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  const [formData, setFormData] = useState<any>({
    userData: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
    vehicle: {
      make: "",
      model: "",
      year: "",
      vinNumber: "",
      currentStereo: "",
    },
    booking: {
      installationType: "In-Store",
      invoiceNumber: "",
      preferredDate: "",
      time: "",
      notes: "",
    },
    items: [],
    mobileDetails: {
      parking: "",
      powerAccess: "",
      instructions: "",
      pickup:
        "Unit 3/151 Dohertys Rd, Laverton North VIC 3026, Australia",
      drop: "",
      distance: "",
      duration: "",
      pickupLocation: { lat: 30.6565217, lng: 76.5649627 },
      dropLocation: { lat: null, lng: null },
      routePolyline: "",
    },
  });

  // Prefill form
  useEffect(() => {
    if (data?.booking) {
      setFormData({
        userData: {
          firstname: data.booking.User?.firstname || "",
          lastname: data.booking.User?.lastname || "",
          email: data.booking.User?.email || "",
          phone: data.booking.User?.phone || "",
        },
        vehicle: {
          make: data.booking.Vehicle?.make || "",
          model: data.booking.Vehicle?.model || "",
          year: data.booking.Vehicle?.year || "",
          vinNumber: data.booking.Vehicle?.vinNumber || "",
          currentStereo: data.booking.Vehicle?.currentStereo || "",
        },
        booking: {
          installationType: data.booking.type || "In-Store",
          invoiceNumber: data.booking.invoiceNumber || "",
          preferredDate: data.booking.date || "",
          time: data.booking.time || "",
          notes: data.booking.notes || "",
        },
        items:
          data.booking.BookingItems?.map((item: any) => ({
            id: item.id,
            itemType: item.itemType,
            otherItemText: item.otherItemText || "",
            charge: item.charge || 0,
          })) || [],
        mobileDetails: {
          parking:
            data.booking.MobileInstallationDetail?.parkingRestrictions || "",
          powerAccess:
            data.booking.MobileInstallationDetail?.powerAccess || "",
          instructions:
            data.booking.MobileInstallationDetail?.specialInstructions || "",
          pickup:
            data.booking.MobileInstallationDetail?.pickupAddress ||
            "Unit 3/151 Dohertys Rd, Laverton North VIC 3026, Australia",
          drop: data.booking.MobileInstallationDetail?.dropoffAddress || "",
          distance:
            data.booking.MobileInstallationDetail?.routeDistance || "",
          duration:
            data.booking.MobileInstallationDetail?.routeDuration || "",
          pickupLocation: {
            lat:
              data.booking.MobileInstallationDetail?.pickupLat ||
              30.6565217,
            lng:
              data.booking.MobileInstallationDetail?.pickupLng ||
              76.5649627,
          },
          dropLocation: {
            lat: data.booking.MobileInstallationDetail?.dropoffLat,
            lng: data.booking.MobileInstallationDetail?.dropoffLng,
          },
          routePolyline:
            data.booking.MobileInstallationDetail?.routePolyline || "",
        },
      });
    }
  }, [data]);

  const handleChange = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateBooking({ id, body: formData }).unwrap();
      alert("Booking updated successfully");
      router.push("/dashboard/booking");
    } catch (err: any) {
      alert(err?.data?.error || "Update failed");
    }
  };

  if (isLoading) return <p className="p-4">Loading booking...</p>;

  // Calculate total charges
  const totalCharges = formData.items.reduce(
    (sum: number, item: any) => sum + (parseFloat(item.charge) || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Booking</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-[#07050e] shadow rounded-lg p-6"
      >
        {/* User Info */}
        <section>
          <h2 className="text-lg text-white font-semibold mb-4">
            User Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData.userData).map((key) => (
              <input
                key={key}
                type="text"
                value={formData.userData[key] || ""}
                onChange={(e) =>
                  handleChange("userData", key, e.target.value)
                }
                placeholder={key}
                className="border rounded px-3 py-2 w-full"
              />
            ))}
          </div>
        </section>

        {/* Vehicle Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData.vehicle).map((key) => (
              <input
                key={key}
                type="text"
                value={formData.vehicle[key] || ""}
                onChange={(e) =>
                  handleChange("vehicle", key, e.target.value)
                }
                placeholder={key}
                className="border rounded px-3 py-2 w-full"
              />
            ))}
          </div>
        </section>

        {/* Booking Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Booking Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.booking.installationType}
              onChange={(e) =>
                handleChange("booking", "installationType", e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            >
              <option>In-Store</option>
              <option>Mobile</option>
            </select>
            <input
              type="text"
              placeholder="Invoice Number"
              value={formData.booking.invoiceNumber || ""}
              onChange={(e) =>
                handleChange("booking", "invoiceNumber", e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="date"
              value={formData.booking.preferredDate || ""}
              onChange={(e) =>
                handleChange("booking", "preferredDate", e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="time"
              value={formData.booking.time || ""}
              onChange={(e) =>
                handleChange("booking", "time", e.target.value)
              }
              className="border rounded px-3 py-2 w-full"
            />
            <textarea
              placeholder="Notes"
              value={formData.booking.notes || ""}
              onChange={(e) =>
                handleChange("booking", "notes", e.target.value)
              }
              className="border rounded px-3 py-2 w-full col-span-2"
            />
          </div>
        </section>

        {/* Mobile Installation Details */}
        {formData.booking.installationType === "Mobile" &&
          !!formData.mobileDetails && (
            <MobileDetailsStep
              formData={formData}
              handleChange={handleChange}
            />
          )}

        {/* Items */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          {formData.items.map((item: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 mb-2 items-center"
            >
              {/* Item Type */}
              <input
                type="text"
                placeholder="Item Type"
                value={item.itemType || ""}
                onChange={(e) => {
                  const updated = [...formData.items];
                  updated[index].itemType = e.target.value;
                  setFormData((prev: any) => ({ ...prev, items: updated }));
                }}
                className="border rounded px-3 py-2 w-full"
              />

              {/* Installation Charge */}
              <input
                type="number"
                placeholder="Charge"
                value={item.charge || ""}
                onChange={(e) => {
                  const updated = [...formData.items];
                  updated[index].charge = e.target.value;
                  setFormData((prev: any) => ({ ...prev, items: updated }));
                }}
                className="border rounded px-3 py-2 w-full"
              />

              {/* Delete Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.items.filter(
                      (_: any, i: number) => i !== index
                    );
                    setFormData((prev: any) => ({ ...prev, items: updated }));
                  }}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add Item */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev: any) => ({
                ...prev,
                items: [
                  ...prev.items,
                  { itemType: "", otherItemText: "", charge: "" },
                ],
              }))
            }
            className="text-blue-600 text-sm mt-2"
          >
            + Add Item
          </button>

          {/* Total Charges */}
          <div className="mt-4 font-semibold text-white">
            Total Charges:{" "}
            <span className="text-green-400">${totalCharges.toFixed(2)}</span>
          </div>
        </section>

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Booking"}
        </button>
      </form>
    </div>
  );
}
