"use client";

import React, { useState, useRef } from "react";
import AsyncSelect from "react-select/async";
import parse, { Element } from "html-react-parser";
import { useCreateFlyerMutation } from "@/store/api/flyer/FlyerApi";
import ComparisonTable from "@/components/flyer/ComparisonTable";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ProductOption = {
  label: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  specs: Record<string, any>;
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

export default function FlyerModelForTwoProducts({
  open,
  onClose,
  userDetails,
}: {
  open: boolean;
  onClose: () => void;
  userDetails? : any
}) {
  const flyerRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [firstProduct, setFirstProduct] = useState<Product | null>(null);
  const [secondProduct, setSecondProduct] = useState<Product | null>(null);

  // Customer form state
  const [customerName, setCustomerName] = useState(userDetails.firstName);
  const [customerPhone, setCustomerPhone] = useState(userDetails.phone);
  const [customerEmail, setCustomerEmail] = useState(userDetails.email);
  const [installationFees, setInstallationFees] = useState("");
  const [deliveryFees, setDeliveryFees] = useState("");
  const [quotationNumber, setQuotationNumber] = useState("");
  const [validationTime, setValidationTime] = useState("");

  const [firstProductId, setFirstProductId] = useState("");
  const [secondProductId, setSecondProductId] = useState("");

  const [createFlyer, { isLoading, isError, error, isSuccess }] =
    useCreateFlyerMutation();

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
      `https://api.kayhanaudio.com.au/v1/product/list/shop/${slug}`
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
      setFirstProductId(product?.id || "");
    } else {
      setFirstProduct(null);
      setFirstProductId("");
    }
  };

  const handleSecondProductChange = async (option: ProductOption | null) => {
    if (option) {
      const product = await fetchProductBySlug(option.value);
      setSecondProduct(product);
      setSecondProductId(product?.id || "");
    } else {
      setSecondProduct(null);
      setSecondProductId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstProduct || !secondProduct) {
      alert("Please select both products before submitting.");
      return;
    }

    const flyerPayload = {
      title: `Flyer for ${customerName || "Customer"}`,
      description: `Quotation #${quotationNumber}`,
      prodcutoneimageUrl: firstProduct.image,
      prodcutwoimageUrl: secondProduct.image,
      productSpecificationId: firstProductId,
      productSpecificationIdtwo: secondProductId,
      customerName,
      customerPhone,
      customerEmail,
      installationFees,
      deliveryFees,
      quotationNumber,
      validationTime,
    };

    try {
      await createFlyer(flyerPayload).unwrap();
      alert("Flyer created successfully!");
      onClose();
      router.push("/dashboard/flyer");
    } catch (err) {
      alert("Error creating flyer, please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white text-black w-full max-w-6xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Create Flyer (Double Product)</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} ref={flyerRef} className="p-6 space-y-6">
          {/* Customer Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Customer Name"
              className="border px-3 py-2 rounded-lg"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              placeholder="Customer Phone"
              className="border px-3 py-2 rounded-lg"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <input
              placeholder="Customer Email"
              type="email"
              className="border px-3 py-2 rounded-lg"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
            <input
              placeholder="Installation Fees"
              className="border px-3 py-2 rounded-lg"
              value={installationFees}
              onChange={(e) => setInstallationFees(e.target.value)}
            />
            <input
              placeholder="Delivery Fees"
              className="border px-3 py-2 rounded-lg"
              value={deliveryFees}
              onChange={(e) => setDeliveryFees(e.target.value)}
            />
            <input
              placeholder="Quotation Number"
              className="border px-3 py-2 rounded-lg"
              value={quotationNumber}
              onChange={(e) => setQuotationNumber(e.target.value)}
            />
            <input
              placeholder="Validation Time"
              className="border px-3 py-2 rounded-lg sm:col-span-2"
              value={validationTime}
              onChange={(e) => setValidationTime(e.target.value)}
            />
          </div>

          {/* Product Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AsyncSelect
              placeholder="Select First Product"
              loadOptions={fetchOptions}
              defaultOptions
              isClearable
              onChange={handleFirstProductChange}
              value={
                firstProduct
                  ? { label: firstProduct.name, value: firstProduct.id }
                  : null
              }
            />
            <AsyncSelect
              placeholder="Select Second Product"
              loadOptions={fetchOptions}
              defaultOptions
              isClearable
              onChange={handleSecondProductChange}
              value={
                secondProduct
                  ? { label: secondProduct.name, value: secondProduct.id }
                  : null
              }
            />
          </div>

          {/* Product Preview */}
          {firstProduct && secondProduct && (
            <>
              <div className="grid grid-cols-2 gap-6 text-center">
                {[firstProduct, secondProduct].map((product) => (
                  <div key={product.id} className="border p-4 rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      height={160}
                      width={160}
                      className="mx-auto mb-2 object-contain"
                    />
                    <div className="text-xl font-bold text-red-600">{product.price}</div>
                    <div className="font-medium">{product.name}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Specification Comparison</h3>
                <ComparisonTable
                  mode="double"
                  firstProductId={setFirstProductId}
                  secondProductId={setSecondProductId}
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Flyer"}
            </button>
          </div>

          {isError && (
            <p className="text-red-600 text-sm text-center">
              Error: {(error as any)?.data?.message || "Unknown error"}
            </p>
          )}
          {isSuccess && (
            <p className="text-green-600 text-sm text-center">
              Flyer saved successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
