"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetAllBookingQuery ,useDeleteBookingMutation } from "@/store/api/booking/BookingApi";
import Link from "next/link";

const columns: Column<any>[] = [
  { header: "ID", accessor: "id", sortable: true },
  {
    header: "Customer",
    accessor: "User",
    render: (_: any, row: any) =>
      `${row.User?.firstname} ${row.User?.lastname}`,
  },
  {
    header: "Email",
    accessor: "User",
    render: (_: any, row: any) => row.User?.email,
  },
  {
    header: "Phone",
    accessor: "User",
    render: (_: any, row: any) => row.User?.phone,
  },
  {
    header: "Vehicle",
    accessor: "Vehicle",
    render: (_: any, row: any) =>
      `${row.Vehicle?.make || ""} ${row.Vehicle?.model || ""}`,
  },
  { header: "Type", accessor: "type" },
  { header: "Date", accessor: "date" },
  { header: "Time", accessor: "time" },
  { header: "Status", accessor: "status" },
];

export default function BookingTablePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useGetAllBookingQuery({
    page: currentPage,
    limit,
  });
  console.log(data, "This is data");
  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    totalPages: 1,
  };

  const totalPages = pagination.totalPages;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEdit = (row: any) => {
    router.push(`/dashboard/booking/edit/${row.id}`);
  };

  const [deleteBooking] = useDeleteBookingMutation()
  // For now no delete API — but keeping hook ready
  const handleDelete = async (row: any) => {
    try {
      await deleteBooking(row.id).unwrap(); // <- implement in BookingApi if needed
      toast.success("Booking deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Bookings</h2>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* Create Button */}
          <Link
            href="/dashboard/booking/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Create
          </Link>
        </div>
      </div>

      {/* Table or State */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading bookings...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch bookings.
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No bookings found.</div>
      ) : (
        <>
          <CustomTable
            columns={columns}
            data={bookings}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalRecords={pagination.total}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={bookings.length}
          />
        </>
      )}
    </div>
  );
}
