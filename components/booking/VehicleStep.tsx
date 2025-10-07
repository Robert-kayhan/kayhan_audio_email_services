import Image from "next/image";
import React, { useState } from "react";

interface VehicleStepProps {
  formData: any;
  handleChange: (section: string, key: string, value: any) => void;
}

const VehicleStep: React.FC<VehicleStepProps> = ({
  formData,
  handleChange,
}) => {
  const [errors, setErrors] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const classes =
    "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 my-1";

  // Validate individual fields
  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "make":
        if (!value.trim()) error = "Vehicle make is required.";
        break;
      case "model":
        if (!value.trim()) error = "Vehicle model is required.";
        break;
      case "year":
        if (!value.trim()) error = "Year is required.";
        else if (Number(value) < 1950 || Number(value) > new Date().getFullYear() + 1)
          error = "Enter a valid year.";
        break;
      case "vin":
        if (!value.trim()) error = "Registration number is required.";
        
        break;
    }

    setErrors((prev: any) => ({ ...prev, [field]: error }));
  };

  // Handle changes with validation
  const handleInputChange = (key: string, value: string) => {
    handleChange("vehicle", key, value);
    validateField(key, value);
  };

  // File Upload (optional)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploading(true);
    setUploadError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("photo", file);

      const res = await fetch("http://localhost:5002/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
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
      {/* Vehicle Make */}
      <input
        className={classes}
        placeholder="Make"
        value={formData.vehicle.make}
        onChange={(e) => handleInputChange("make", e.target.value)}
        onBlur={(e) => validateField("make", e.target.value)}
      />
      {errors.make && <p className="text-red-400 text-sm">{errors.make}</p>}

      {/* Vehicle Model */}
      <input
        className={classes}
        placeholder="Model"
        value={formData.vehicle.model}
        onChange={(e) => handleInputChange("model", e.target.value)}
        onBlur={(e) => validateField("model", e.target.value)}
      />
      {errors.model && <p className="text-red-400 text-sm">{errors.model}</p>}

      {/* Year */}
      <input
        type="number"
        className={classes}
        placeholder="Year"
        value={formData.vehicle.year}
        onChange={(e) => handleInputChange("year", e.target.value)}
        onBlur={(e) => validateField("year", e.target.value)}
      />
      {errors.year && <p className="text-red-400 text-sm">{errors.year}</p>}

      {/* Registration Number */}
      <input
        className={classes}
        placeholder="Registration Number"
        value={formData.vehicle.vin}
        onChange={(e) => handleInputChange("vin", e.target.value)}
        onBlur={(e) => validateField("vin", e.target.value)}
      />
      {errors.vin && <p className="text-red-400 text-sm">{errors.vin}</p>}

      {/* Current Stereo */}
      <input
        className={classes}
        placeholder="Current Stereo"
        value={formData.vehicle.currentStereo}
        onChange={(e) => handleInputChange("currentStereo", e.target.value)}
        onBlur={(e) => validateField("currentStereo", e.target.value)}
      />
      {errors.currentStereo && (
        <p className="text-red-400 text-sm">{errors.currentStereo}</p>
      )}

      {/* Upload Section (optional) */}
      {/* <div className="mt-3">
        <label
          htmlFor="fileUpload"
          className="group flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-500 rounded-xl cursor-pointer hover:border-green-400 transition-all duration-200"
        >
          <span className="text-gray-400 group-hover:text-green-400">
            Upload Dashboard Picture
          </span>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {uploading && <p className="text-yellow-400 text-sm mt-2">Uploading...</p>}
        {uploadError && <p className="text-red-400 text-sm mt-2">{uploadError}</p>}
      </div> */}

      {formData.vehicle.dashPhotosUrl && !uploading && !uploadError && (
        <div className="mt-3 text-center">
          <Image
            src={formData.vehicle.dashPhotosUrl}
            alt="Dashboard"
            height={100}
            width={150}
            className="rounded-lg mx-auto"
          />
          <p className="text-green-400 text-sm mt-1">Uploaded successfully!</p>
        </div>
      )}
    </>
  );
};

export default VehicleStep;
