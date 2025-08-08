"use client";

import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import parse, { Element, domToReact } from "html-react-parser";
import ComparisonTable from "@/components/flyer/ComparisonTable";

type ProductOption = {
  label: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  specs: Record<string, string>;
};

const extractSpecsFromHtml = (html: string): Record<string, string> => {
  const specs: Record<string, string> = {};

  parse(html, {
    replace: (domNode) => {
      if (
        domNode instanceof Element &&
        domNode.name === "li" &&
        domNode.children &&
        domNode.children.length > 0
      ) {
        const raw = domNode.children
          .map((child) =>
            typeof child === "object" && "data" in child ? child.data : ""
          )
          .join("")
          .trim();

        const match = raw.match(/^(.+?):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          specs[key.trim()] = value.trim();
        }
      }
    },
  });

  return specs;
};

export default function FlyerPage() {
  const [firstProduct, setFirstProduct] = useState<Product | null>(null);
  const [secondProduct, setSecondProduct] = useState<Product | null>(null);

  const fetchOptions = async (inputValue: string): Promise<ProductOption[]> => {
    const res = await fetch(
      `https://api.kayhanaudio.com.au/v1/product/list/shop?search=${inputValue}`
    );
    const data = await res.json();

    return (
      data?.data?.result?.map((product: any) => ({
        label: product.name,
        value: product.slug,
      })) || []
    );
  };

  const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
    const res = await fetch(
      `https://api.kayhanaudio.com.au/v1/product//list/shop/${slug}`
    );
    const data = await res.json();
    const product = data?.data?.result;
    if (!product) return null;

    const imageUrl = product.images?.[0]?.image
      ? `https://d198m4c88a0fux.cloudfront.net/${product.images[0].image}`
      : "/placeholder.webp";

    return {
      id: product.id.toString(),
      name: product.name,
      image: imageUrl,
      price:
        product.discount_price && product.discount_price > 0
          ? `$${product.discount_price}`
          : `$${product.regular_price}`,
      specs: product.specification || {},
    };
  };

  const handleFirstProductChange = async (option: ProductOption | null) => {
    if (option) {
      const product = await fetchProductBySlug(option.value);
      setFirstProduct(product);
    } else {
      setFirstProduct(null);
    }
  };

  const handleSecondProductChange = async (option: ProductOption | null) => {
    if (option) {
      const product = await fetchProductBySlug(option.value);
      setSecondProduct(product);
    } else {
      setSecondProduct(null);
    }
  };

  const firstParsedSpecs = firstProduct?.specs?.specification
    ? extractSpecsFromHtml(firstProduct.specs.specification)
    : {};
  console.log(firstParsedSpecs)
  const secondParsedSpecs = secondProduct?.specs?.specification
    ? extractSpecsFromHtml(secondProduct.specs.specification)
    : {};

  const allSpecKeys = Array.from(
    new Set([
      ...Object.keys(firstParsedSpecs),
      ...Object.keys(secondParsedSpecs),
    ])
  );

  return (
    <div className="bg-white text-black xl:w-10/12 mx-auto p-4 border shadow-md font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <img src="/logo.webp" alt="Kayhan Logo" className="min-h-28" />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <input placeholder="Customer Name" className="border p-1 rounded" />
          <input placeholder="Customer Phone" className="border p-1 rounded" />
          <input placeholder="Customer Email" className="border p-1 rounded" />
          <input placeholder="Installation Fees" className="border p-1 rounded" />
          <input placeholder="Delivery Fees" className="border p-1 rounded" />
          <input placeholder="Quotation Number" className="border p-1 rounded" />
          <input placeholder="Validation Time" className="border p-1 rounded col-span-2" />
        </div>
      </div>

      {/* Title */}
      <h2 className="bg-purple-700 text-white text-center py-3 text-xl font-bold mt-4">
        HYUNDAI ILOAD 2007 – 2015
      </h2>

      {/* Product Selection */}
      <div className="grid grid-cols-2 gap-4 my-4">
        <AsyncSelect
          placeholder="Select First Product"
          loadOptions={fetchOptions}
          defaultOptions
          isClearable
          onChange={handleFirstProductChange}
        />
        <AsyncSelect
          placeholder="Select Second Product"
          loadOptions={fetchOptions}
          defaultOptions
          isClearable
          onChange={handleSecondProductChange}
        />
      </div>

      {/* Product Images */}
      {firstProduct && secondProduct && (
        <>
          <div className="grid grid-cols-2 gap-4 items-center text-center py-6">
            {[firstProduct, secondProduct].map((product) => (
              <div key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 mx-auto mb-2 object-contain border p-1"
                />
                <div className="text-2xl font-bold text-red-600">{product.price}</div>
                <div className="text-lg font-semibold">{product.name}</div>
                <button className="mt-2 px-4 py-1 bg-purple-600 text-white rounded text-sm">
                  ORDER NOW
                </button>
              </div>
            ))}
          </div>

          {/* Feature Table */}
          <div className="mt-4">
            <h3 className="text-xl font-bold bg-orange-500 text-white py-2 px-4">
              Specification Comparison Table
            </h3>
            {/* <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-left">Feature</th>
                  <th className="border px-2 py-1 text-center">{firstProduct.name}</th>
                  <th className="border px-2 py-1 text-center">{secondProduct.name}</th>
                </tr>
              </thead>
              <tbody>
                {allSpecKeys.map((key) => (
                  <tr key={key}>
                    <td className="border px-2 py-1 font-medium">{key}</td>
                    <td className="border px-2 py-1 text-center">
                      {firstParsedSpecs[key] || "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {secondParsedSpecs[key] || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <ComparisonTable />
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-sm bg-purple-800 text-white p-4 rounded">
        <p className="mb-1">
          Installation / Handouts on Display at: Unit 3/15 Darlot Rd, Landsdale North VIC 3062, Australia
        </p>
        <p>Email: support@kayhanaudio.com.au | Call Us: 1300 696 488</p>
      </div>
    </div>
  );
}
