import React, { useState } from "react";

interface VehicleStepProps {
  formData: any;
  handleChange: (section: string, key: string, value: any) => void;
}

const VehicleStep: React.FC<VehicleStepProps> = ({ formData, handleChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const classes =
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    setUploadError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("photo", file);

      const res = await fetch("http://localhost:5002/api/upload ", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        // store the S3 URL in formData
        handleChange("vehicle", "dashPhotosUrl", data.url);
      } else {
        setUploadError(data.message || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        className={classes}
        placeholder="Make"
        value={formData.vehicle.make}
        onChange={(e: any) => handleChange("vehicle", "make", e.target.value)}
      />
      <input
        className={classes}
        placeholder="Model"
        value={formData.vehicle.model}
        onChange={(e: any) => handleChange("vehicle", "model", e.target.value)}
      />
      <input
        type="number"
        className={classes}
        placeholder="Year"
        value={formData.vehicle.year}
        onChange={(e: any) => handleChange("vehicle", "year", e.target.value)}
      />
      <input
        className={classes}
        placeholder="VIN Number"
        value={formData.vehicle.vin}
        onChange={(e: any) => handleChange("vehicle", "vin", e.target.value)}
      />
      <input
        className={classes}
        placeholder="Current Stereo"
        value={formData.vehicle.currentStereo}
        onChange={(e: any) =>
          handleChange("vehicle", "currentStereo", e.target.value)
        }
      />

      {/* File input for image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2 text-white"
      />

      {uploading && <p className="text-sm text-yellow-400">Uploading...</p>}
      {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}

      {formData.vehicle.dashPhotosUrl && !uploading && !uploadError && (
        <p className="mt-2 text-sm text-green-400">
          Uploaded image URL: {formData.vehicle.dashPhotosUrl}
        </p>
      )}
    </>
  );
};

export default VehicleStep;
