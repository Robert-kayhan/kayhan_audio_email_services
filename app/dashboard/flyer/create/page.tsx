"use client";
import React, { useState } from "react";

const defaultFeatureFields = [
  "CPU",
  "RAM",
  "Storage",
  "Bluetooth",
  "Audio Output",
  "Amplifier",
  "DSP",
  "Wireless CarPlay",
  "Android Auto",
  "Split Screen",
  "Screen Size",
  "Resolution",
  "Operating System",
  "Video Output",
];

export default function ProductComparisonForm() {
  const [productA, setProductA] = useState({
    name: "",
    price: "",
    features: {} as Record<string, string>,
  });

  const [productB, setProductB] = useState({
    name: "",
    price: "",
    features: {} as Record<string, string>,
  });

  const handleChange = (
    product: "A" | "B",
    field: string,
    value: string
  ) => {
    const updater = product === "A" ? setProductA : setProductB;
    const current = product === "A" ? productA : productB;

    if (field === "name" || field === "price") {
      updater({ ...current, [field]: value });
    } else {
      updater({
        ...current,
        features: { ...current.features, [field]: value },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product A:", productA);
    console.log("Product B:", productB);
    alert("Submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-900 text-white rounded-xl max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Product Comparison Form</h2>

      <div className="grid grid-cols-3 gap-4 items-center">
        <span></span>
        <input
          type="text"
          placeholder="Product A Name"
          className="input"
          value={productA.name}
          onChange={(e) => handleChange("A", "name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Product B Name"
          className="input"
          value={productB.name}
          onChange={(e) => handleChange("B", "name", e.target.value)}
        />

        <label className="font-semibold">Price</label>
        <input
          type="text"
          placeholder="$0"
          value={productA.price}
          onChange={(e) => handleChange("A", "price", e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="$0"
          value={productB.price}
          onChange={(e) => handleChange("B", "price", e.target.value)}
          className="input"
        />

        {defaultFeatureFields.map((field) => (
          <React.Fragment key={field}>
            <label className="capitalize">{field}</label>
            <input
              type="text"
              placeholder={field}
              value={productA.features[field] || ""}
              onChange={(e) => handleChange("A", field, e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder={field}
              value={productB.features[field] || ""}
              onChange={(e) => handleChange("B", field, e.target.value)}
              className="input"
            />
          </React.Fragment>
        ))}
      </div>

      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white font-semibold mt-6 block mx-auto"
      >
        Submit Comparison
      </button>
    </form>
  );
}
