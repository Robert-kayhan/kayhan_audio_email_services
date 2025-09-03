"use client";

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = { lat: -37.8284, lng: 144.784 };

interface MobileDetailsStepProps {
  formData: any;
  handleChange: (section: string, field: string, value: any) => void;
}

const libraries: any = ["places"];

// ✅ Helper: decode Google encoded polyline
function decodePolyline(encoded: string): { lat: number; lng: number }[] {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = [];

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return coordinates;
}

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
  const [decodedPolyline, setDecodedPolyline] = useState<
    { lat: number; lng: number }[]
  >([]);

  // ✅ 1. If booking already has polyline → decode & draw
  useEffect(() => {
    if (formData.mobileDetails?.routePolyline) {
      const coords = decodePolyline(formData.mobileDetails.routePolyline);
      setDecodedPolyline(coords);
    }
  }, [formData.mobileDetails?.routePolyline]);

  // ✅ 2. If booking has lat/lng → fetch route
  useEffect(() => {
    if (
      formData.mobileDetails?.pickupLocation?.lat &&
      formData.mobileDetails?.pickupLocation?.lng &&
      formData.mobileDetails?.dropLocation?.lat &&
      formData.mobileDetails?.dropLocation?.lng &&
      !formData.mobileDetails?.routePolyline // only if polyline not stored
    ) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: {
            lat: formData.mobileDetails.pickupLocation.lat,
            lng: formData.mobileDetails.pickupLocation.lng,
          },
          destination: {
            lat: formData.mobileDetails.dropLocation.lat,
            lng: formData.mobileDetails.dropLocation.lng,
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
    }
  }, [formData.mobileDetails]);

  // ✅ 3. When user picks new route
  const calculateRoute = () => {
    if (!pickupAuto || !dropAuto) return;

    const pickupPlace: any = pickupAuto.getPlace();
    const dropPlace: any = dropAuto.getPlace();

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

            // ✅ Save booking details
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

            // ✅ Save polyline (must use .points)
            const polyline = result.routes[0].overview_polyline || "";
            handleChange("mobileDetails", "routePolyline", polyline);
            setDecodedPolyline(decodePolyline(polyline));
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  if (loadError) return <p className="text-red-500">Error loading maps</p>;
  if (!isLoaded) return <p className="text-gray-400">Loading map…</p>;

  // const mapUrl =
  //   formData.mobileDetails?.pickupLocation?.lat &&
  //   formData.mobileDetails?.dropLocation?.lat
  //     ? `https://www.google.com/maps/dir/?api=1&origin=${formData.mobileDetails.pickupLocation.lat},${formData.mobileDetails.pickupLocation.lng}&destination=${formData.mobileDetails.dropLocation.lat},${formData.mobileDetails.dropLocation.lng}&travelmode=driving`
  //     : "";

  // console.log(mapUrl, "this is map url");

  return (
    <div className="space-y-4">
      {/* Parking Restrictions */}
      <input
        placeholder="Parking Restrictions"
        value={formData.mobileDetails?.parking || ""}
        onChange={(e) =>
          handleChange("mobileDetails", "parking", e.target.value)
        }
        className={classes}
      />

      {/* Power Access */}
      <input
        placeholder="Power Access"
        value={formData.mobileDetails.powerAccess || ""}
        onChange={(e) =>
          handleChange("mobileDetails", "powerAccess", e.target.value)
        }
        className={classes}
      />

      {/* Special Instructions */}
      <textarea
        placeholder="Special Instructions"
        value={formData.mobileDetails.instructions || ""}
        onChange={(e) =>
          handleChange("mobileDetails", "instructions", e.target.value)
        }
        className={classes}
      />

      {/* Google Map Route Picker */}
      <div className="flex gap-2 mb-4">
        <Autocomplete
          onLoad={setPickupAuto}
          onPlaceChanged={() => {
            if (!pickupAuto) return;
            const place = pickupAuto.getPlace();
            if (place?.geometry?.location) {
              handleChange(
                "mobileDetails",
                "pickup",
                place.formatted_address || ""
              );
              handleChange("mobileDetails", "pickupLocation", {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
            }
          }}
        >
          <input
            type="text"
            value={formData.mobileDetails.pickup || ""}
            onChange={(e) =>
              handleChange("mobileDetails", "pickup", e.target.value)
            }
            placeholder="Pickup address"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>

        <Autocomplete
          onLoad={setDropAuto}
          onPlaceChanged={() => {
            if (!dropAuto) return;
            const place = dropAuto.getPlace();
            if (place?.geometry?.location) {
              handleChange(
                "mobileDetails",
                "drop",
                place.formatted_address || ""
              );
              handleChange("mobileDetails", "dropLocation", {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
            }
          }}
        >
          <input
            type="text"
            value={formData.mobileDetails.drop || ""}
            onChange={(e) =>
              handleChange("mobileDetails", "drop", e.target.value)
            }
            placeholder="Drop address"
            className="w-full p-2 border rounded"
          />
        </Autocomplete>

        <button
          type="button"
          onClick={calculateRoute}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Check route
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          decodedPolyline.length > 0
            ? decodedPolyline[0]
            : formData.mobileDetails?.pickupLocation?.lat
            ? {
                lat: formData.mobileDetails.pickupLocation.lat,
                lng: formData.mobileDetails.pickupLocation.lng,
              }
            : defaultCenter
        }
        zoom={12}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {decodedPolyline.length > 0 && (
          <Polyline
            path={decodedPolyline}
            options={{
              strokeColor: "#00FF00",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
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