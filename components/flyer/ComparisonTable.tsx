"use client";

import React, { useEffect, useState } from "react";
import { useGetAllProductSpecificationsQuery } from "@/store/api/flyer/productSpecificationApi";

// Convert camelCase or mixedCase keys into human-readable labels
function formatFeatureName(key: string) {
  return key
    .replace(/([A-Z])/g, " $1") // add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter
}

// Group specifications by product name
function groupByProduct(specs: any[]) {
  const grouped: Record<
    string,
    { id: string; name: string; specs: { feature: string; value: string }[] }
  > = {};

  specs.forEach((spec) => {
    const productName = spec.name || "Unknown Product";
    if (!grouped[productName]) {
      grouped[productName] = { id: spec.id?.toString() || "", name: productName, specs: [] };
    }

    // Loop through each property except metadata fields
    Object.entries(spec).forEach(([key, value]) => {
      if (["id", "name", "createdAt", "updatedAt"].includes(key)) return;
      grouped[productName].specs.push({
        feature: formatFeatureName(key),
        value: value as string,
      });
    });
  });

  return grouped;
}

type ComparisonTableProps = {
  firstProductId: (id: string) => void;
  secondProductId: (id: string) => void;
};

export default function ComparisonTable({ firstProductId, secondProductId }: ComparisonTableProps) {
  const { data, isLoading, isError } = useGetAllProductSpecificationsQuery({});
  const [product1, setProduct1] = useState<string>("");
  const [product2, setProduct2] = useState<string>("");
  console.log(data , isError)
  const specs = data?.data || [];
  const products = groupByProduct(specs);

  // Notify parent of selected product IDs
  useEffect(() => {
    firstProductId(products[product1]?.id || "");
  }, [product1, products, firstProductId]);

  useEffect(() => {
    secondProductId(products[product2]?.id || "");
  }, [product2, products, secondProductId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !specs.length) {
    return <p className="p-4 text-red-500">Failed to load specifications.</p>;
  }

  const allFeatures =
    product1 && product2
      ? [
          ...new Set([
            ...products[product1]?.specs.map((s) => s.feature),
            ...products[product2]?.specs.map((s) => s.feature),
          ]),
        ]
      : [];

  return (
    <div className="p-4 overflow-x-auto bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100">
      {/* Product Selectors */}
      <div className="flex justify-between gap-4 mb-4">
        {/* Product 1 */}
        <div>
          <label className="block font-medium mb-1">Product 1</label>
          <select
            value={product1}
            onChange={(e) => setProduct1(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Product</option>
            {Object.entries(products).map(([key, prod]) => (
              <option key={key} value={key}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product 2 */}
        <div>
          <label className="block font-medium mb-1">Product 2</label>
          <select
            value={product2}
            onChange={(e) => setProduct2(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            disabled={!product1}
          >
            <option value="">Select Product</option>
            {Object.entries(products)
              .filter(([key]) => key !== product1)
              .map(([key, prod]) => (
                <option key={key} value={key}>
                  {prod.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {product1 && product2 && (
        <table className="w-full border border-gray-300 dark:border-gray-700 text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <th className="p-3 border border-gray-300 dark:border-gray-700">Feature</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">
                {products[product1].name}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">
                {products[product2].name}
              </th>
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, index) => {
              const val1 =
                products[product1].specs.find((s) => s.feature === feature)?.value || "-";
              const val2 =
                products[product2].specs.find((s) => s.feature === feature)?.value || "-";
              return (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 border border-gray-300 dark:border-gray-700 font-medium">
                    {feature}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-700">{val1}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-700">{val2}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
