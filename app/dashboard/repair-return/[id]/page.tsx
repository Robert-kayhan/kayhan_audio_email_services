"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import FileUpload from "@/components/global/FileUpload";
import {
  useGetRepairReportQuery,
  useAddNotesMutation,
  useUpdateRepairReportMutation,
} from "@/store/api/repair-return/repairApi";

const formatValue = (val: any, fallbackKey: string = "name") => {
  if (!val) return "";
  if (typeof val === "object") return val?.[fallbackKey] ?? "";
  return val.toString();
};

const formatCurrency = (amount: number) => `$${amount}`;

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
    {children}
  </div>
);

const RepairReportDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetRepairReportQuery(id);
  const report = data?.data?.result ?? null;
  console.log(data, "This is data");
  // --- Notes ---
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  // --- Tracking ---
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [adminPostMethod, setAdminPostMethod] = useState(
    report?.admin_post_method || ""
  );
  const [adminTrackingNumber, setAdminTrackingNumber] = useState(
    report?.admin_tracking_number || ""
  );

  // --- Products ---
  const [products, setProducts] = useState(report?.products || []);
  console.log(products, "this is product");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: 1,
    price: 0,
  });

  // --- File Uploads ---
  const [isReceivedFileModalOpen, setIsReceivedFileModalOpen] = useState(false);
  const [userReceivedFiles, setUserReceivedFiles] = useState(
    report?.user_received_productImages || []
  );

  const [isSendFileModalOpen, setIsSendFileModalOpen] = useState(false);
  const [productSendFiles, setProductSendFiles] = useState(
    report?.product_send_productImages || []
  );

  // --- Mutations ---
  const [addNotes, { isLoading: isAdding }] = useAddNotesMutation();
  const [updateRepairReport, { isLoading: isUpdating }] =
    useUpdateRepairReportMutation();

  // Sync products and files when report data loads
  useEffect(() => {
    if (report?.products) setProducts(report.products);
    if (report?.user_received_productImages)
      setUserReceivedFiles(report.user_received_productImages);
    if (report?.product_send_productImages)
      setProductSendFiles(report.product_send_productImages);
  }, [
    report?.products,
    report?.user_received_productImages,
    report?.product_send_productImages,
  ]);

  if (isLoading)
    return <div className="p-6 text-gray-500">Loading repair report...</div>;
  if (isError || !report)
    return (
      <div className="p-6 text-red-500">Failed to load repair report.</div>
    );

  // --- Handlers ---
  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNotes({ id, data: { text: noteText } }).unwrap();
      toast.success("Note added successfully!");
      setNoteText("");
      setIsNoteModalOpen(false);
    } catch (error) {
      toast.error("Failed to add note.");
      console.error(error);
    }
  };

  const handleUpdateTracking = async () => {
    if (!adminPostMethod.trim() || !adminTrackingNumber.trim()) {
      toast.error("Please fill both Post Method and Tracking Number");
      return;
    }
    try {
      await updateRepairReport({
        id,
        data: {
          admin_post_method: adminPostMethod,
          admin_tracking_number: adminTrackingNumber,
        },
      }).unwrap();
      toast.success("Admin tracking info updated!");
      setIsTrackingModalOpen(false);
    } catch (error) {
      toast.error("Failed to update tracking info");
      console.error(error);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) return toast.error("Product name required!");
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ name: "", quantity: 1, price: 0 });
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p: any) => p.id !== id));
  };

  const handleSaveProducts = async () => {
    try {
      await updateRepairReport({ id, data: { products } }).unwrap();
      toast.success("Products updated successfully!");
    } catch (err) {
      toast.error("Failed to update products");
      console.error(err);
    }
  };
  const parsedProducts =
    typeof products === "string" ? JSON.parse(products) : products;
  // Parse the addresses
  const billingAddress =
    typeof report.billing_address === "string"
      ? JSON.parse(report.billing_address)
      : report.billing_address;

  const shippingAddress =
    typeof report.shipping_address === "string"
      ? JSON.parse(report.shipping_address)
      : report.shipping_address;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Repair Report #{report.order_id}
          </h1>
          <p className="text-sm text-gray-500">
            Created: {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Update Admin Tracking
          </button>
          <button
            onClick={() => setIsReceivedFileModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Received Images
          </button>
          <button
            onClick={() => setIsSendFileModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Upload Send Images
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Customer Info
          </h2>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Name:</strong> {report.customer_name}
            </p>
            <p>
              <strong>Email:</strong> {report.customer_email}
            </p>
            <p>
              <strong>Phone:</strong> {report.customer_phone}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Billing Address
          </h2>
          <p>{billingAddress?.street_address || billingAddress?.street}</p>
          <p>
            {billingAddress?.city},{" "}
            {billingAddress?.state?.name || billingAddress?.state}{" "}
            {billingAddress?.postcode}
          </p>
          <p>{billingAddress?.country?.name || billingAddress?.country}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Shipping Address
          </h2>
          <p>{shippingAddress?.street_address || shippingAddress?.street}</p>
          <p>
            {shippingAddress?.city},{" "}
            {shippingAddress?.state?.name || shippingAddress?.state}{" "}
            {shippingAddress?.postcode}
          </p>
          <p>{shippingAddress?.country?.name || shippingAddress?.country}</p>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Products
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Product
            </button>
            <button
              onClick={handleSaveProducts}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              💾 Save Products
            </button>
          </div>
        </div>

        {products.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parsedProducts.map((p: any, idx: number) => (
                  <tr
                    key={p.id || idx}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3">{formatCurrency(p.price)}</td>
                    <td className="p-3">
                      {formatCurrency(p.price * p.quantity)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </Card>

      {/* Tracking Info */}
      <Card>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Tracking Information
        </h2>
        <div className="text-sm space-y-1">
          <p>
            <strong>User Tracking:</strong>{" "}
            {report.user_tracking_number || "N/A"} (
            {report.user_post_method || "N/A"})
          </p>
          <p>
            <strong>Admin Tracking:</strong>{" "}
            {report.admin_tracking_number || "N/A"} (
            {report.admin_post_method || "N/A"})
          </p>
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          User Received Images
        </h2>
        <ImageGallery images={userReceivedFiles} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Product Send Images
        </h2>
        <ImageGallery images={productSendFiles} />
      </Card>
      {/* Notes */}
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notes
          </h2>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + Add Note
          </button>
        </div>

        {report.notes?.length ? (
          <ul className="space-y-2">
            {Array(report?.notes)?.map((n: any, idx: number) => (
              <li
                key={idx}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700"
              >
                <p className="text-gray-900 dark:text-gray-100">{n.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notes available.</p>
        )}
      </Card>

      {/* --- Modals Section --- */}

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsNoteModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              ➕ Add a New Note
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={4}
              placeholder="Write your note..."
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={isAdding}
                className={`px-5 py-2 rounded-lg text-white font-medium transition ${isAdding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                💾 {isAdding ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tracking Modal */}
      {isTrackingModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsTrackingModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              📝 Update Admin Tracking
            </h3>
            <input
              type="text"
              placeholder="Admin Post Method"
              value={adminPostMethod}
              onChange={(e) => setAdminPostMethod(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Admin Tracking Number"
              value={adminTrackingNumber}
              onChange={(e) => setAdminTrackingNumber(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsTrackingModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTracking}
                disabled={isUpdating}
                className={`px-5 py-2 rounded-lg text-white font-medium transition ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              ➕ Add Product
            </h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full p-3 mb-3 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  quantity: Number(e.target.value),
                })
              }
              className="w-full p-3 mb-3 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
              className="w-full p-3 mb-3 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- File Upload Modals --- */}

      {/* 1️⃣ User Received Product Images */}
      {isReceivedFileModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsReceivedFileModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              📥 Upload Received Product Images
            </h3>
            {/* <FileUpload files={user */}
            <FileUpload
              files={userReceivedFiles}
              setFiles={setUserReceivedFiles}
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsReceivedFileModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateRepairReport({
                      id,
                      data: { user_received_productImages: userReceivedFiles },
                    }).unwrap();
                    toast.success("Received images updated successfully!");
                    setIsReceivedFileModalOpen(false);
                  } catch (err) {
                    toast.error("Failed to update received images");
                    console.error(err);
                  }
                }}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2️⃣ Product Send Images */}
      {isSendFileModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsSendFileModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              📤 Upload Send Product Images
            </h3>
            <FileUpload
              files={productSendFiles}
              setFiles={setProductSendFiles}
            />
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setIsSendFileModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateRepairReport({
                      id,
                      data: { product_send_productImages: productSendFiles },
                    }).unwrap();
                    toast.success("Send images updated successfully!");
                    setIsSendFileModalOpen(false);
                  } catch (err) {
                    toast.error("Failed to update send images");
                    console.error(err);
                  }
                }}
                className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairReportDetailPage;
const ImageGallery = ({ images }: { images?: string[] }) => {
  // Ensure images is an array
  if (!Array.isArray(images) || images.length === 0) {
    return <p className="text-gray-500">No images uploaded.</p>;
  }

  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {images.map((url, idx) => (
        <div
          key={idx}
          className="w-24 h-24 rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm"
        >
          <Image
            src={url}
            alt={`img-${idx}`}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};
