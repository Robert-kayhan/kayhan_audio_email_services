"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useGetAllFlyersQuery,
  useDeleteFlyerMutation,
} from "@/store/api/flyer/FlyerApi";
import { Download, Eye, Pencil, Trash2, Sun, Moon } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import FlyerModal from "@/components/flyer/FlyerModal"; // 👈 modal component for flyer creation

export default function FlyersTable() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [darkMode, setDarkMode] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false); 

  const { data, isLoading, isError, error, refetch } = useGetAllFlyersQuery({
    page,
    limit,
  });

  const [deleteFlyer] = useDeleteFlyerMutation();

  useEffect(() => {
    refetch();
  }, [data]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this flyer?")) {
      try {
        await deleteFlyer(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete flyer", err);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading flyers...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading flyers: {error?.toString() || "Unknown error"}
      </div>
    );
  }
  const router = useRouter();
  const flyers = data?.data;
  const pagination = (data as any).pagination;

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen p-4 transition-colors duration-300`}
    >
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-3xl font-medium font-serif">Flyers</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select
            onChange={(e) => {
              if (e.target.value === "single") setShowModal(true);
              if (e.target.value === "double") router.push("/dashboard/flyer/create");
            }}
            defaultValue=""
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition cursor-pointer"
          >
            <option value="" disabled>
              + Create Flyer
            </option>
            <option value="single">Single Product</option>
            <option value="double">Double Product</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } min-w-full border border-gray-300 dark:border-gray-700`}
        >
          <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Created At</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flyers?.map((flyer: any) => (
              <tr
                key={flyer.id}
                className={`${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <td className="px-4 py-2 border-b">{flyer.id}</td>
                <td className="px-4 py-2 border-b">{flyer.title}</td>
                <td className="px-4 py-2 border-b">{flyer.description}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(flyer.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b space-x-2 flex flex-wrap">
                  {/* View */}
                  <a
                    href={flyer.flyer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition text-sm"
                  >
                    <Eye size={16} className="mr-1" /> View
                  </a>

                  {/* Download */}
                  <a
                    href={flyer.flyer_url}
                    download
                    className="inline-flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
                  >
                    <Download size={16} className="mr-1" /> Download
                  </a>

                  {/* Edit */}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(flyer.id)}
                    className="inline-flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalRecords={pagination.total}
            totalPages={pagination.totalPages}
            limit={limit}
            setCurrentPage={setPage}
            tableDataLength={flyers?.length}
            showPagination={true}
          />
        </div>
      )}

      {/* Modals */}
      {showModal === true && (
         <Suspense fallback={<div className="text-center p-4">Loading Flyer...</div>}>
           <FlyerModal open={showModal} onClose={() => setShowModal(false)} />
         </Suspense>
      )}
    </div>
  );
}
