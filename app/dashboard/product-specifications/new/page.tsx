"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useCreateProductSpecificationMutation } from "@/store/api/flyer/productSpecificationApi";

type ProductSpecificationForm = {
  name?: string;
  processor?: string;
  operatingSystem?: string;
  memory?: string;
  wirelessCarPlayAndroidAuto?: string;
  audioVideoOutput?: string;
  amplifier?: string;
  cameraInputs?: string;
  microphone?: string;
  bluetooth?: string;
  usbPorts?: string;
  steeringWheelACControls?: string;
  factoryReversingCamera?: string;
  audioVideoFeatures?: string;
  radioTuner?: string;
  googlePlayStore?: string;
  netflix?: string;
  disneyPlus?: string;
  foxtel?: string;
  apps?: string;
  screenSize?: string;
  screenResolution?: string;
  onlineVideos?: string;
};

export default function NewProductSpecificationPage() {
  const { register, handleSubmit, reset } = useForm<ProductSpecificationForm>();

  // RTK Query mutation hook
  const [createProductSpecification, { isLoading }] =
    useCreateProductSpecificationMutation();

  const onSubmit = async (data: ProductSpecificationForm) => {
    try {
      await createProductSpecification(data).unwrap();
      alert("✅ Specification added successfully!");
      reset();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add specification");
    }
  };

  const fields: { name: keyof ProductSpecificationForm; label: string }[] = [
    { name: "name", label: "Specification Name" },
    { name: "processor", label: "Processor" },
    { name: "operatingSystem", label: "Operating System" },
    { name: "memory", label: "Memory" },
    { name: "wirelessCarPlayAndroidAuto", label: "Wireless CarPlay/Android Auto" },
    { name: "audioVideoOutput", label: "Audio/Video Output" },
    { name: "amplifier", label: "Amplifier" },
    { name: "cameraInputs", label: "Camera Inputs" },
    { name: "microphone", label: "Microphone" },
    { name: "bluetooth", label: "Bluetooth" },
    { name: "usbPorts", label: "USB Ports" },
    { name: "steeringWheelACControls", label: "Steering Wheel & AC Controls" },
    { name: "factoryReversingCamera", label: "Factory Reversing Camera" },
    { name: "audioVideoFeatures", label: "Audio/Video Features" },
    { name: "radioTuner", label: "Radio Tuner" },
    { name: "googlePlayStore", label: "Google Play Store" },
    { name: "netflix", label: "Netflix" },
    { name: "disneyPlus", label: "Disney+" },
    { name: "foxtel", label: "Foxtel" },
    { name: "apps", label: "Apps" },
    { name: "screenSize", label: "Screen Size" },
    { name: "screenResolution", label: "Screen Resolution" },
    { name: "onlineVideos", label: "Online Videos" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Add Product Specification
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-2 font-semibold text-gray-700">
                  {field.label}
                </label>
                <input
                  {...register(field.name)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-black"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200`}
            >
              {isLoading ? "Saving..." : "Save Specification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
