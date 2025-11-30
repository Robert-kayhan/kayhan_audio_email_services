"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetTechRepairQuery,
  useUpdateTechReportMutation,
} from "@/store/api/repair-return/tech-repair-returnApi";
import toast from "react-hot-toast";

const RepairDetailPage = () => {
  const { id } = useParams();
  const {
    data: rawData,
    isLoading,
    isError,
  } = useGetTechRepairQuery(Number(id));
  const data = rawData?.data;

  const [isModalOpen, setModalOpen] = useState(false);
  const [postMethod, setPostMethod] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [updateTechReport] = useUpdateTechReportMutation();

  if (isLoading)
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-300">
        Loading...
      </div>
    );

  if (isError || !data)
    return (
      <div className="text-center py-8 text-red-500">Failed to load report</div>
    );

  const handleOpenModal = () => {
    setPostMethod(data.postMethod || "");
    setTrackingNumber(data.trackingNumber || "");
    setNotes(data.notes || "");
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    // Basic validations
    if (!postMethod.trim()) {
      toast.error("Post Method cannot be empty");
      return;
    }

    if (!trackingNumber.trim()) {
      toast.error("Tracking Number cannot be empty");
      return;
    }

    if (notes.length > 500) {
      toast.error("Notes cannot exceed 500 characters");
      return;
    }

    try {
      const datas = { postMethod, trackingNumber, notes };
      await updateTechReport({ id: data.id, data: datas }).unwrap();
      toast.success("Report updated successfully");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update report");
    }
  };

  const handleComplete = async () => {
    try {
      await updateTechReport({
        id: data.id,
        data: { status: "complete" },
      }).unwrap();
      toast.success("Status updated to complete");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Repair Report Details
      </h1>

      {/* Details Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Company Name:
            </span>{" "}
            {data.companyName}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Product Name:
            </span>{" "}
            {data.productName}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Model:
            </span>{" "}
            {data.modelName}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Year:
            </span>{" "}
            {data.year}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Order No:
            </span>{" "}
            {data.orderNo}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Reason:
            </span>{" "}
            {data.reason}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Notes:
            </span>{" "}
            {data.notes || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Status:
            </span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                data.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : data.status === "complete"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {data.status}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Post Method:
            </span>{" "}
            {data.postMethod || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Tracking Number:
            </span>{" "}
            {data.trackingNumber || "N/A"}
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 mt-4 space-y-2">
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Created At:
            </span>{" "}
            {new Date(data.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Updated At:
            </span>{" "}
            {new Date(data.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        {data.postMethod == null && data.trackingNumber == null && (
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Update Report
          </button>
        )}
        {data.status !== "complete" &&
          data.postMethod &&
          data.trackingNumber && (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
            >
              Mark as Complete
            </button>
          )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setModalOpen(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-6 mx-4 md:mx-0 transform transition-transform duration-300 scale-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Update Report
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Post Method
                </span>
                <input
                  type="text"
                  value={postMethod}
                  onChange={(e) => setPostMethod(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Tracking Number
                </span>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Notes
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </label>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition font-medium"
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

export default RepairDetailPage;
