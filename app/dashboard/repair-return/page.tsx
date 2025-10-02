"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  useGetAllRepairReportQuery,
  useDeleteRepairReportMutation,
} from "@/store/api/repair-return/repairApi";
// 📦 Type for Repair Report
type RepairReport = {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  billing_address: any;
  shipping_address: any;
  products: any[];
  user_tracking_number: string | null;
  user_post_method: string | null;
  admin_tracking_number: string | null;
  admin_post_method: string | null;
  status: string;
  createdAt: string;
};

// 🧾 Table Columns
const columns: Column<RepairReport>[] = [
  { header: "Order ID", accessor: "order_id", sortable: true },
  { header: "Customer", accessor: "customer_name", sortable: true },
  { header: "Email", accessor: "customer_email" },
  { header: "Phone", accessor: "customer_phone" },
  { header: "user tracking number", accessor: "user_tracking_number" },
  { header: "user Post Method", accessor: "user_post_method" },

  { header: "Status", accessor: "status" },
  {
    header: "Created",
    accessor: "createdAt",
    // render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

export default function RepairReportTablePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // 🔍 Search state and debounce
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
   useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useGetAllRepairReportQuery(
  {
    page: currentPage,
    limit,
    search,
  },
  {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  }
);


  const [deleteRepairReport] = useDeleteRepairReportMutation();

  const reports: RepairReport[] = data?.data?.result ?? [];
  const pagination = {
    totalItems: data?.data?.total ?? 0,
    currentPage: data?.data?.page ?? 1,
    totalPages: Math.ceil((data?.data?.total ?? 0) / limit),
  };

  const showPagination = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  );

  const handleDelete = async (row: RepairReport) => {
    try {
      await deleteRepairReport(row.id).unwrap();
      toast.success("Repair report deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete report");
      console.error(error);
    }
  };


  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Repair Reports</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* 🔍 Search Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by customer, email, or order id"
              className="px-3 py-1 rounded-md bg-black text-white border border-gray-700 focus:outline-none text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearchInput("")}
                className="text-red-400 text-sm hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Page Size Selector */}
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* Create Button */}
          <div className="relative inline-block text-left">
                           <Link
                  href="/dashboard/repair-return/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create
              <ChevronDown className="rotate-[265deg]" size={16} />
            </Link>

          </div>
        </div>
      </div>

      {/* Table or State */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading reports...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch reports.
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No repair reports found.
        </div>
      ) : (
        <>
          <CustomTable
            pageSize={limit}
            columns={columns}
            data={reports}
            showActions
            onDelete={handleDelete}
            customActions={[
              {
                label: "View",
                onClick: (row) =>
                  (window.location.href = `/dashboard/repair-return/${row.id}`),
                className:
                  "text-purple-600 dark:text-purple-400 hover:underline",
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalRecords={pagination.totalItems}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={reports.length}
          />
        </>
      )}
    </div>
  );
}
