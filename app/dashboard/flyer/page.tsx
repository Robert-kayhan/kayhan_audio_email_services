"use client";

import React, { useState , useEffect } from "react";
import Link from "next/link";
import {
  useGetAllFlyersQuery,
  useDeleteFlyerMutation,
} from "@/store/api/flyer/FlyerApi";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import Pagination from "@/components/global/Pagination";

export default function FlyersTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useGetAllFlyersQuery({
    page,
    limit,
  });
  console.log(data)
  const [deleteFlyer] = useDeleteFlyerMutation();
useEffect(()=>{
  refetch()
},[data])
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

  // if (!data || !data.data.length) {
  //   return <div className="p-4 text-center">No flyers found.</div>;
  // }

  const flyers = data?.data;
  const pagination  = (data as any).pagination;

  return (
    <div className="overflow-x-auto p-4">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-3xl font-medium font-serif">Flyers</h2>
        <Link
          href="/dashboard/flyer/create"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create Flyer
        </Link>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
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
            <tr key={flyer.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{flyer.id}</td>
              <td className="px-4 py-2 border-b">{flyer.title}</td>
              <td className="px-4 py-2 border-b">{flyer.description}</td>
              <td className="px-4 py-2 border-b">
                {new Date(flyer.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border-b space-x-2">
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
                <Link
                  href={`/dashboard/flyer/edit/${flyer.id}`}
                  className="inline-flex items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition text-sm"
                >
                  <Pencil size={16} className="mr-1" /> Edit
                </Link>

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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalRecords={pagination.total}
            totalPages={pagination.totalPages}
            limit={limit}
            setCurrentPage={setPage}
            tableDataLength={ flyers?.length}
            showPagination={true} 
          />
        </div>
      )}
    </div>
  );
}
