"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "@/store/api/booking/BookingApi";
import MobileDetailsStep from "@/components/booking/MobileDetailsStep";
import { ItemsStep } from "@/components/booking/ItemsStep"; // <-- import your new ItemsStep

type Item = { name: string; charge: number };
type ItemsState = {
  list: Item[];
  newItem: string;
  newCharge: string;
  discountType: "amount" | "percentage";
  discountValue: number;
  totalAmount: number;
  discountAmount: number;
};

export default function UpdateBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetBookingByIdQuery(id);
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [payment, setPayment] = useState();
  const [formData, setFormData] = useState<any>({
    userData: { firstname: "", lastname: "", email: "", phone: "" },
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
      routePolyline: "",
    },
  });

  const [itemsState, setItemsState] = useState<ItemsState>({
    list: [],
    newItem: "",
    newCharge: "",
    discountType: "amount",
    discountValue: 0,
    totalAmount: 0,
    discountAmount: 0,
  });

  useEffect(() => {
    if (data?.booking) {
      // Set formData
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
        mobileDetails: {
          parking:
            data.booking.MobileInstallationDetail?.parkingRestrictions || "",
          powerAccess: data.booking.MobileInstallationDetail?.powerAccess || "",
          instructions:
            data.booking.MobileInstallationDetail?.specialInstructions || "",
          pickup:
            data.booking.MobileInstallationDetail?.pickupAddress ||
            "Unit 3/151 Dohertys Rd, Laverton North VIC 3026, Australia",
          drop: data.booking.MobileInstallationDetail?.dropoffAddress || "",
          distance: data.booking.MobileInstallationDetail?.routeDistance || "",
          duration: data.booking.MobileInstallationDetail?.routeDuration || "",
          pickupLocation: {
            lat: data.booking.MobileInstallationDetail?.pickupLat || 30.6565217,
            lng: data.booking.MobileInstallationDetail?.pickupLng || 76.5649627,
          },
          dropLocation: {
            lat: data.booking.MobileInstallationDetail?.dropoffLat,
            lng: data.booking.MobileInstallationDetail?.dropoffLng,
          },
          routePolyline:
            data.booking.MobileInstallationDetail?.routePolyline || "",
        },
      });

      // Map booking items to ItemsStep state
      const list =
        data.booking.BookingItems?.map((item: any) => ({
          name: item.itemType || "",
          charge: parseFloat(item.charge) || 0,
        })) || [];

      const subtotal = list.reduce(
        (sum: any, item: any) => sum + item.charge,
        0
      );

      setItemsState({
        list,
        newItem: "",
        newCharge: "",
        discountType: "amount",
        discountValue: 0,
        totalAmount: subtotal,
        discountAmount: 0,
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
      const body = {
        ...formData,
        items: itemsState.list.map((item) => ({
          itemType: item.name,
          charge: item.charge,
        })),
        totalAmount : itemsState.totalAmount,
        discount : itemsState.discountAmount
      };
      await updateBooking({ id, body }).unwrap();
      alert("Booking updated successfully");
      router.push("/dashboard/booking");
    } catch (err: any) {
      alert(err?.data?.error || "Update failed");
    }
  };

  if (isLoading) return <p className="p-4">Loading booking...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Update Booking
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white dark:bg-gray-900 shadow rounded-lg p-6"
      >
        {/* User Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            User Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData.userData).map((key) => (
              <input
                key={key}
                type="text"
                value={formData.userData[key] || ""}
                onChange={(e) => handleChange("userData", key, e.target.value)}
                placeholder={key}
                className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            ))}
          </div>
        </section>

        {/* Vehicle Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(formData.vehicle).map((key) => (
              <input
                key={key}
                type="text"
                value={formData.vehicle[key] || ""}
                onChange={(e) => handleChange("vehicle", key, e.target.value)}
                placeholder={key}
                className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            ))}
          </div>
        </section>

        {/* Booking Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Booking Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.booking.installationType}
              onChange={(e) =>
                handleChange("booking", "installationType", e.target.value)
              }
              className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="date"
              value={formData.booking.preferredDate || ""}
              onChange={(e) =>
                handleChange("booking", "preferredDate", e.target.value)
              }
              className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="time"
              value={formData.booking.time || ""}
              onChange={(e) => handleChange("booking", "time", e.target.value)}
              className="border rounded px-3 py-2 w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <textarea
              placeholder="Notes"
              value={formData.booking.notes || ""}
              onChange={(e) => handleChange("booking", "notes", e.target.value)}
              className="border rounded px-3 py-2 w-full col-span-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </section>

        {/* Mobile Installation Details */}
        {formData.booking.installationType === "Mobile" && (
          <MobileDetailsStep formData={formData} handleChange={handleChange} />
        )}

        {/* Items */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Items
          </h2>
          <ItemsStep items={itemsState} setItems={setItemsState} />
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
