"use client";
import React, { useState } from "react";
import {
  useGetAllInvoicesQuery,
  useDeleteInvoiceMutation,
} from "@/store/api/booking/InvoiceApi";
import { Search, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const statusColors:any = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const InvoiceList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data, isLoading } = useGetAllInvoicesQuery({
    page,
    limit: 10,
    search,
  });
  const [deleteInvoice, { isLoading: isDeleting }] =
    useDeleteInvoiceMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete invoice?")) {
      await deleteInvoice(id);
    }
  };

  const handleView = (id: number) => {
    // navigate to your invoice view page or campaign page
    router.push(`/invoices/${id}`);
  };

  const totalPages = Math.ceil((data?.total || 0) / 10);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Invoices
        </h1>
        <div className="flex space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setPage(1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-1 hover:bg-indigo-700"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Booking ID</th>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">User Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">URL</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Loading…
                </td>
              </tr>
            ) : data?.invoices?.length > 0 ? (
              data.invoices.map((inv: any) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{inv.id}</td>
                  <td className="px-6 py-4">{inv.bookingId}</td>
                  <td className="px-6 py-4">
                    {inv.User?.firstname} {inv.User?.lastname}
                  </td>
                  <td className="px-6 py-4 break-all">
                    {inv.User?.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[inv.bookingStatus] || ""
                      }`}
                    >
                      {inv.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 break-all">
                    <a
                      href={inv.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View PDF
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleView(inv.id)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center space-x-1"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={isDeleting}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 inline-flex items-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Page {page} of {totalPages || 1}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
