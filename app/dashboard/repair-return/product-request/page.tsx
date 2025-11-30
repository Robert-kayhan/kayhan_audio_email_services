"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import Link from "next/link";



import { useGetAllTechRepairQuery ,useDeleteTechReportMutation } from "@/store/api/repair-return/tech-repair-returnApi";

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
const columns: Column<any>[] = [
  { header: "Order No", accessor: "orderNo", sortable: true },
  {
    header: "Customer",
    accessor: "BookingCustmour",
    render: (_: any, row: any) => (
      <Link href={`/dashboard/repair-return/product-request/${row.id}`} className="flex flex-col">
        <span className="font-medium">{`${row.user?.firstname || ""} ${row.user?.lastname || ""}`}</span>
        <span className="text-xs text-gray-400">{row.user?.email}</span>
      </Link>
    ),
  },
  {
    header: "Phone",
    accessor: "user",
    render: (_: any, row: any) => (
      <Link href={`/dashboard/repair-return/product-request/${row.id}`} className="flex flex-col">
        <span className="font-medium">{`${row.user?.phone || "N/A"}`}</span>
      </Link>
    ),
  },
  {
    header: "postMethod",
    accessor: "postMethod",
    render: (_: any, row: any) => (
      <Link href={`/dashboard/repair-return/product-request/${row.id}`} className="flex flex-col">
        <span className="font-medium">{`${row?.postMethod || "N/A"}`}</span>
      </Link>
    ),
  },
  {
    header: "Tracking Number",
    accessor: "postMethod",
    render: (_: any, row: any) => (
      <Link href={`/dashboard/repair-return/product-request/${row.id}`} className="flex flex-col">
        <span className="font-medium">{`${row?.trackingNumber || "N/A"}`}</span>
      </Link>
    ),
  },
  //   { header: "Post Method", accessor: "postMethod" },
  {
    header: "status",
    accessor: "payment",
    render: (_: any, row: any) => {
      let paymentStatus = row.status || "";

      // assign classes based on status
      let statusClasses = "";
      switch (paymentStatus) {
        case "Paid":
        case "Completed":
          statusClasses =
            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200";
          break;
        case "Pending":
          statusClasses =
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200";
          break;
        case "Failed":
          statusClasses =
            "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200";
          break;
        default:
          statusClasses =
            "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200";
      }

      return (
        // <div className="flex flex-col">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses}`}
        >
          {paymentStatus}
        </span>
        // </div>
      );
    },
  },
  {
  header: "Created At",
  accessor: "createdAt",
  render: (_value, row) => {
    if (!row?.createdAt) return "N/A";

    return new Date(row.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },
}

];

export default function RepairReportTablePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // 🔍 Search and debounce
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // 🔎 Status Filter
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  // 🔥 API Call
  const { data, isLoading, isError, refetch } = useGetAllTechRepairQuery(
    {
      page: currentPage,
      limit,
      search,
      status,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteTechReport] = useDeleteTechReportMutation();
  console.log(data);
  const reports: RepairReport[] = data?.data ?? [];

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
      await  deleteTechReport(row.id).unwrap();
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
        <h2 className="text-2xl font-serif font-bold">Product Requests</h2>

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

          {/* 🔽 Status Filter */}
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
          </select>

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
          <Link
            href="/dashboard/repair-return/product-request/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Create
            <ChevronDown className="rotate-[265deg]" size={16} />
          </Link>
        </div>
      </div>

      {/* Table / Loading / Error States */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reports...</div>
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
