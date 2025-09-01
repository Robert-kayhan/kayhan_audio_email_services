"use client";

import React, { useState } from "react";
import {
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = { lat: 30.6565217, lng: 76.5649627 };

interface MobileDetailsStepProps {
  formData: any;
  handleChange: (section: string, field: string, value: any) => void;
}

const libraries:any
//  (
//   "places" | "drawing" | "geometry" | "localContext" | "visualization"
// )[]
 = ["places"];

const MobileDetailsStep: React.FC<MobileDetailsStepProps> = ({
  formData,
  handleChange,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries,
  });

  const classes =
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500";

  const [pickupAuto, setPickupAuto] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [dropAuto, setDropAuto] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // ✅ Calculate route safely
  const calculateRoute = () => {
    if (!pickupAuto || !dropAuto) return;

    const pickupPlace : any = pickupAuto.getPlace();
    const dropPlace:any = dropAuto.getPlace();

    if (pickupPlace?.geometry?.location && dropPlace?.geometry?.location) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickupPlace.geometry.location,
          destination: dropPlace.geometry.location,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);

            const leg = result.routes[0].legs[0];

            handleChange(
              "mobileDetails",
              "pickup",
              pickupPlace.formatted_address || ""
            );
            handleChange(
              "mobileDetails",
              "drop",
              dropPlace.formatted_address || ""
            );
            handleChange("mobileDetails", "distance", leg.distance?.text || "");
            handleChange("mobileDetails", "duration", leg.duration?.text || "");

            handleChange("mobileDetails", "pickupLocation", {
              lat: pickupPlace.geometry.location.lat(),
              lng: pickupPlace.geometry.location.lng(),
            });
            handleChange("mobileDetails", "dropLocation", {
              lat: dropPlace.geometry.location.lat(),
              lng: dropPlace.geometry.location.lng(),
            });
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  if (loadError) return <p className="text-red-500">Error loading maps</p>;
  if (!isLoaded) return <p className="text-gray-400">Loading map…</p>;

  return (
    <div className="space-y-4">
      {/* Parking Restrictions */}
      <input
        placeholder="Parking Restrictions"
        value={formData.mobileDetails.parking}
        onChange={(e) =>
          handleChange("mobileDetails", "parking", e.target.value)
        }
        className={classes}
      />

      {/* Power Access */}
      <input
        placeholder="Power Access"
        value={formData.mobileDetails.powerAccess}
        onChange={(e) =>
          handleChange("mobileDetails", "powerAccess", e.target.value)
        }
        className={classes}
      />

      {/* Special Instructions */}
      <textarea
        placeholder="Special Instructions"
        value={formData.mobileDetails.instructions}
        onChange={(e) =>
          handleChange("mobileDetails", "instructions", e.target.value)
        }
        className={classes}
      />

      {/* Google Map Route Picker */}
      <div className="flex gap-2 mb-4">
        <Autocomplete onLoad={setPickupAuto}>
          <input
            type="text"
            placeholder="Pickup address"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>

        <Autocomplete onLoad={setDropAuto}>
          <input
            type="text"
            placeholder="Drop address"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>

        <button
          onClick={calculateRoute}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Show Route
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Distance + Duration Preview */}
      {formData.mobileDetails.distance && formData.mobileDetails.duration && (
        <div className="mt-4 p-2 border rounded bg-gray-700 text-white">
          <p>
            <strong>Pickup:</strong> {formData.mobileDetails.pickup}
          </p>
          <p>
            <strong>Drop:</strong> {formData.mobileDetails.drop}
          </p>
          <p>
            <strong>Distance:</strong> {formData.mobileDetails.distance}
          </p>
          <p>
            <strong>Duration:</strong> {formData.mobileDetails.duration}
          </p>
        </div>
      )}
    </div>
  );
};

export default MobileDetailsStep;
