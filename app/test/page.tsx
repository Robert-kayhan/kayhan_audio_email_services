"use client";

import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // New Delhi

export default function BookingMap() {
  const [pickupAuto, setPickupAuto] = useState<google.maps.places.Autocomplete | null>(null);
  const [dropAuto, setDropAuto] = useState<google.maps.places.Autocomplete | null>(null);

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  // Load pickup/drop autocomplete
  const onPickupLoad = (auto: google.maps.places.Autocomplete) => setPickupAuto(auto);
  const onDropLoad = (auto: google.maps.places.Autocomplete) => setDropAuto(auto);

  // Calculate route
  const calculateRoute = () => {
    if (pickupAuto && dropAuto) {
      const pickupPlace = pickupAuto.getPlace();
      const dropPlace = dropAuto.getPlace();

      if (pickupPlace.geometry && dropPlace.geometry) {
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

              // 📌 Extract distance and duration
              const leg = result.routes[0].legs[0];
              setDistance(leg.distance?.text || null);
              setDuration(leg.duration?.text || null);
            } else {
              console.error("Error fetching directions:", status);
            }
          }
        );
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
      libraries={["places"]}
    >
      {/* Address Inputs */}
      <div className="flex gap-2 mb-4">
        <Autocomplete onLoad={onPickupLoad}>
          <input
            type="text"
            placeholder="Pickup address"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>

        <Autocomplete onLoad={onDropLoad}>
          <input
            type="text"
            placeholder="Drop address"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>

        <button
          onClick={calculateRoute}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Show Route
        </button>
      </div>

      {/* Map */}
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Distance + Duration */}
      {distance && duration && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <p><strong>Distance:</strong> {distance}</p>
          <p><strong>Duration:</strong> {duration}</p>
        </div>
      )}
    </LoadScript>
  );
}
