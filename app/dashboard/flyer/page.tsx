"use client";

import React from "react";
import Link from "next/link";  // import Link from Next.js
import { useGetAllFlyersQuery } from "@/store/api/flyer/FlyerApi";

type Flyer = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export default function FlyersTable() {
  const { data, isLoading, isError, error } = useGetAllFlyersQuery();
  console.log(data);

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

  if (!data) {
    return <div className="p-4 text-center">No flyers found.</div>;
  }

  const datas = data.data;

  return (
    <div className="overflow-x-auto p-4">
      {/* Create Flyer Link */}
      <div className="mb-4">
        <Link
          href="/dashboard/flyer/create"  // Change this path to your flyer create page URL
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create Flyer
        </Link>
      </div>

      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {datas.map((flyer: any) => (
            <tr key={flyer.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{flyer.id}</td>
              <td className="px-4 py-2 border-b">{flyer.title}</td>
              <td className="px-4 py-2 border-b">{flyer.description}</td>
              <td className="px-4 py-2 border-b">
                {new Date(flyer.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
