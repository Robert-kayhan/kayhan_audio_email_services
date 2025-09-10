"use client";

import React, { useState } from "react";
import {
  useGetAllProductSpecificationsQuery,
  useDeleteProductSpecificationMutation,
  useUpdateProductSpecificationMutation,
} from "@/store/api/flyer/productSpecificationApi";
import Link from "next/link";

export default function SpecificationsListPage() {
  const { data, isLoading, isError, refetch } =
    useGetAllProductSpecificationsQuery({});
  const [deleteSpecification] = useDeleteProductSpecificationMutation();
  const [updateSpecification] = useUpdateProductSpecificationMutation();

  const [editingSpec, setEditingSpec] = useState<any>(null);
  const [newName, setNewName] = useState("");

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this specification?")) return;
    try {
      await deleteSpecification(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Error deleting specification:", err);
    }
  };

  const handleEdit = (spec: any) => {
    setEditingSpec(spec);
    setNewName(spec.name);
  };

  const handleUpdate = async () => {
    if (!newName.trim()) return alert("Name cannot be empty");
    try {
      await updateSpecification({
        id: editingSpec.id,
        name: newName,
      }).unwrap();
      setEditingSpec(null);
      setNewName("");
      refetch();
    } catch (err) {
      console.error("Error updating specification:", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (isError)
    return <p className="p-4 text-red-500">Failed to load specifications.</p>;

  const specs = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Product Specifications
        </h1>
        <Link
          href="/dashboard/product-specifications/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Add Specification
        </Link>
      </div>

      {specs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No specifications found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  ID
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Specification Name
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Created At
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Updated At
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec: any, idx: number) => (
                <tr
                  key={spec.id}
                  className={`${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } hover:bg-blue-50 dark:hover:bg-gray-700 transition`}
                >
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {spec.id}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {spec.name}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {spec.createdAt}
                  </td>
                  <td className="p-3 text-gray-900 dark:text-gray-100">
                    {spec.updatedAt}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(spec)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(spec.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingSpec && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Edit Specification
            </h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Enter new name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingSpec(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
