"use client";

import React, { useState, useRef } from "react";
import AsyncSelect from "react-select/async";
// import { useCreateFlyerMutation } from "@/store/api/flyer/FlyerApi";
import {useCreateSingleFlyerMutation} from "@/store/api/flyer/FlyerApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ComparisonTable from "./ComparisonTable";

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

export default function FlyerModal({
  open,
  onClose,
  userDetails
}: {
  open: boolean;
  onClose: () => void;
  userDetails? : any
}) {
  const flyerRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState("");

  const [customerName, setCustomerName] = useState(userDetails.firstName);
  const [customerPhone, setCustomerPhone] = useState(userDetails.phone);
  const [customerEmail, setCustomerEmail] = useState(userDetails.email);
  const [installationFees, setInstallationFees] = useState("");
  const [deliveryFees, setDeliveryFees] = useState("");
  const [quotationNumber, setQuotationNumber] = useState("");
  const [validationTime, setValidationTime] = useState("");

  const [createSingleFlyer, { isLoading, isError, error, isSuccess }] =
    useCreateSingleFlyerMutation();

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
    const p = data?.data?.result;
    if (!p) return null;

    const imageUrl = p.images?.[0]?.image
      ? `https://d198m4c88a0fux.cloudfront.net/${p.images[0].image}`
      : "/placeholder.webp";

    return {
      id: p.id.toString(),
      name: p.name,
      image: imageUrl,
      price:
        p.discount_price && p.discount_price > 0
          ? `$${p.discount_price}`
          : `$${p.regular_price}`,
      specs: p.specification || {},
    };
  };

  const handleProductChange = async (option: ProductOption | null) => {
    if (option) {
      const p = await fetchProductBySlug(option.value);
      setProduct(p);
      setProductId(p?.id || "");
    } else {
      setProduct(null);
      setProductId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      alert("Please select a product before submitting.");
      return;
    }

    const flyerPayload = {
      title: `Flyer for ${customerName || "Customer"}`,
      description: `Quotation #${quotationNumber}`,
      prodcutoneimageUrl: product.image,
      productSpecificationId: productId,
      customerName,
      customerPhone,
      customerEmail,
      installationFees,
      deliveryFees,
      quotationNumber,
      validationTime,
    };

    try {
      await createSingleFlyer(flyerPayload).unwrap();
      alert("Flyer created successfully!");
      onClose();
      router.push("/dashboard/flyer");
    } catch (err) {
      alert("Error creating flyer, please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white h-[70vh] overflow-y-auto text-gray-900 w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Create Flyer (Single Product)</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              placeholder="Customer Phone"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <input
              placeholder="Customer Email"
              type="email"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
            <input
              placeholder="Installation Fees"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={installationFees}
              onChange={(e) => setInstallationFees(e.target.value)}
            />
            <input
              placeholder="Delivery Fees"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={deliveryFees}
              onChange={(e) => setDeliveryFees(e.target.value)}
            />
            <input
              placeholder="Quotation Number"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={quotationNumber}
              onChange={(e) => setQuotationNumber(e.target.value)}
            />
            <input
              placeholder="Validation Time"
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none sm:col-span-2"
              value={validationTime}
              onChange={(e) => setValidationTime(e.target.value)}
            />
          </div>

          {/* Product Selection */}
          <div>
            <AsyncSelect
              placeholder="Search Product..."
              loadOptions={fetchOptions}
              defaultOptions
              isClearable
              onChange={handleProductChange}
              value={product ? { label: product.name, value: product.id } : null}
              className="text-sm"
            />
          </div>

          {/* Product Preview */}
          {product && (
            <div className="bg-gray-50 border rounded-xl p-4 text-center shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                height={180}
                width={180}
                className="mx-auto mb-3 object-contain rounded"
              />
              <div className="text-xl font-bold text-red-600">{product.price}</div>
              <div className="text-gray-800 font-medium">{product.name}</div>
            </div>
          )}

          {/* Product Specification Table (Single Mode) */}
          {product && (
            <ComparisonTable
              mode="single"
              firstProductId={(id) => setProductId(id)}
            />
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Flyer"}
            </button>
          </div>

          {/* Messages */}
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
