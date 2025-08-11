"use client";

import React, { useState, useRef } from "react";
import AsyncSelect from "react-select/async";
import parse, { Element } from "html-react-parser";
import { useCreateFlyerMutation } from "@/store/api/flyer/FlyerApi";
import ComparisonTable from "@/components/flyer/ComparisonTable";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

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

export default function FlyerPage() {
  const flyerRef = useRef<HTMLFormElement>(null);

  const [firstProduct, setFirstProduct] = useState<Product | null>(null);
  const [secondProduct, setSecondProduct] = useState<Product | null>(null);

  // Customer form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [installationFees, setInstallationFees] = useState("");
  const [deliveryFees, setDeliveryFees] = useState("");
  const [quotationNumber, setQuotationNumber] = useState("");
  const [validationTime, setValidationTime] = useState("");

  // ** Important: IDs for product specs **
  const [firstProductId, setFirstProductId] = useState("");
  const [secondProductId, setSecondProductId] = useState("");

  // RTK Query mutation hook
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

  const firstParsedSpecs = firstProduct?.specs?.specification
    ? extractSpecsFromHtml(firstProduct.specs.specification)
    : {};
  const secondParsedSpecs = secondProduct?.specs?.specification
    ? extractSpecsFromHtml(secondProduct.specs.specification)
    : {};

  const allSpecKeys = Array.from(
    new Set([...Object.keys(firstParsedSpecs), ...Object.keys(secondParsedSpecs)])
  );

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstProduct || !secondProduct) {
      alert("Please select both products before submitting.");
      return;
    }

    // Prepare flyer data shape matching your API
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
      // Optionally clear form & selections here if you want
    } catch (err) {
      alert("Error creating flyer, please try again.");
    }
  };

  // PDF generation function
  const handleSavePDF = async () => {
    if (!flyerRef.current) return;

    const element = flyerRef.current;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("flyer.pdf");
    } catch (error) {
      alert("Failed to save PDF: " + error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        ref={flyerRef}
        className="bg-white text-black xl:w-10/12 mx-auto p-4 border shadow-md font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <Image src="/logo.webp" alt="Kayhan Logo" className="min-h-28" />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <input
              placeholder="Customer Name"
              className="border p-1 rounded"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              placeholder="Customer Phone"
              className="border p-1 rounded"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <input
              placeholder="Customer Email"
              className="border p-1 rounded"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              type="email"
              required
            />
            <input
              placeholder="Installation Fees"
              className="border p-1 rounded"
              value={installationFees}
              onChange={(e) => setInstallationFees(e.target.value)}
            />
            <input
              placeholder="Delivery Fees"
              className="border p-1 rounded"
              value={deliveryFees}
              onChange={(e) => setDeliveryFees(e.target.value)}
            />
            <input
              placeholder="Quotation Number"
              className="border p-1 rounded"
              value={quotationNumber}
              onChange={(e) => setQuotationNumber(e.target.value)}
            />
            <input
              placeholder="Validation Time"
              className="border p-1 rounded col-span-2"
              value={validationTime}
              onChange={(e) => setValidationTime(e.target.value)}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="bg-purple-700 text-white text-center py-3 text-xl font-bold mt-4">
          www.kayhanaudio.com.au
        </h2>

        {/* Product Selection */}
        <div className="grid grid-cols-2 gap-4 my-4">
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
                  <div className="text-2xl font-bold text-red-600">
                    {product.price}
                  </div>
                  <div className="text-lg font-semibold">{product.name}</div>
                  <button
                    type="button"
                    className="mt-2 px-4 py-1 bg-purple-600 text-white rounded text-sm"
                    onClick={() => alert("Order feature not implemented")}
                  >
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
              <ComparisonTable
                firstProductId={setFirstProductId}
                secondProductId={setSecondProductId}
              />
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm bg-purple-800 text-white p-4 rounded">
          <p className="mb-1">
            Installation / Handouts on Display at: Unit 3/15 Darlot Rd, Landsdale
            North VIC 3062, Australia
          </p>
          <p>Email: support@kayhanaudio.com.au | Call Us: 1300 696 488</p>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Flyer"}
          </button>
        </div>

        {/* Feedback messages */}
        {isError && (
          <p className="text-red-600 mt-2 text-center">
            Error saving flyer: {(error as any)?.data?.message || "Unknown error"}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600 mt-2 text-center">Flyer saved successfully!</p>
        )}
      </form>

      {/* PDF Save Button */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleSavePDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>
    </>
  );
}
