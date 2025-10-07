"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useGetAllBookingQuery,
  useDeleteBookingMutation,
} from "@/store/api/booking/BookingApi";
import Link from "next/link";
import {
  useCreateJobMutation,
  useCancelJobMutation,
  useRescheduleJobMutation,
} from "@/store/api/booking/JobReportApi";
// Columns definition
const columns: Column<any>[] = [
  { header: "#", accessor: "id", sortable: true },
  {
    header: "Customer",
    accessor: "User",
    render: (_: any, row: any) => (
      <Link href={`/dashboard/booking/${row.id}`} className="flex flex-col">
        <span className="font-medium">{`${row.User?.firstname || ""} ${row.User?.lastname || ""}`}</span>
        <span className="text-xs text-gray-400">{row.User?.email}</span>
      </Link>
    ),
  },
  {
    header: "Phone",
    accessor: "User",
    render: (_: any, row: any) => (
      <span className="text-sm">{row.User?.phone}</span>
    ),
  },
  {
    header: "Vehicle",
    accessor: "Vehicle",
    render: (_: any, row: any) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.Vehicle?.make || ""} {row.Vehicle?.model || ""}
        </span>
        <span className="text-xs text-gray-400">{row.Vehicle?.year}</span>
      </div>
    ),
  },
  {
    header: "Type",
    accessor: "type",
    render: (_: any, row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.type === "In-Store"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            : row.type === "Mobile"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
        }`}
      >
        {row.type}
      </span>
    ),
  },

  { header: "Date", accessor: "date" },
  { header: "Time", accessor: "time" },
  {
    header: "Payment status",
    accessor: "payment",
    render: (_: any, row: any) => {
      let paymentStatus = row.payment?.status || "";

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
    header: "Status",
    accessor: "status",
    render: (_: any, row: any) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === "Pending"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
            : row.status === "In Progress"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
              : row.status === "Completed"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : row.status === "Cancelled"
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                  : row.status === "Rescheduled"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

export default function BookingTablePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const [rescheduleTime, setRescheduleTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetAllBookingQuery({
    page: currentPage,
    limit,
    search,
    status,
    type,
    startDate,
    endDate,
  } ,{
    // pollingInterval : 10000,
    refetchOnFocus : true,
    refetchOnMountOrArgChange: true, 
  });

  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, totalPages: 1 };
  console.log(data?.bookings, "this is data");
  const [deleteBooking] = useDeleteBookingMutation();

  const handleEdit = (row: any) => {
    router.push(`/dashboard/booking/edit/${row.id}`);
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteBooking(row.id).unwrap();
      toast.success("Booking deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    }
  };

  const [rescheduleJob] = useRescheduleJobMutation();
  const [cancelJob] = useCancelJobMutation();

  const handleRescheduleJob = async () => {
    if (!rescheduleTime) return toast.error("Please select a date and time.");
    if (!selectedBooking) return toast.error("No booking selected.");

    setIsRescheduling(true);
    try {
      await rescheduleJob({
        id: selectedBooking.id,
        rescheduleTime: rescheduleTime,
      }).unwrap();

      toast.success("Booking rescheduled successfully");
      setShowRescheduleModal(false);
      refetch(); // refresh table
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule booking");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelJob = async () => {
    if (!cancelReason) return toast.error("Please provide a reason.");
    if (!selectedBooking) return toast.error("No booking selected.");

    setIsCancelling(true);
    try {
      await cancelJob({
        id: selectedBooking.id,
        cancelReason: cancelReason,
      }).unwrap();

      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      refetch(); // refresh table
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="p-4">
      {/* header bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center px-3 py-2 gap-4">
        <h2 className="text-2xl font-serif font-bold">Bookings</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="text-sm px-3 py-1 rounded-md bg-white dark:bg-neutral-800 dark:text-white border border-gray-300 dark:border-neutral-700 focus:outline-none"
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
          <Link
            href="/dashboard/booking/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:opacity-90"
          >
            + Create Booking
          </Link>
        </div>
      </div>

      {/* filter card */}
      <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by customer/invoice..."
            className="border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded-md bg-white dark:bg-neutral-800 dark:text-white flex-1"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded-md bg-white dark:bg-neutral-800 dark:text-white"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            className="border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded-md bg-white dark:bg-neutral-800 dark:text-white"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Types</option>
            <option value="Mobile">Mobile</option>
            <option value="In-Store">In-Store</option>
          </select>
          <input
            type="date"
            className="border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded-md bg-white dark:bg-neutral-800 dark:text-white"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
          />
          <input
            type="date"
            className="border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded-md bg-white dark:bg-neutral-800 dark:text-white"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => {
              setSearch("");
              setStatus("");
              setType("");
              setStartDate("");
              setEndDate("");
              setCurrentPage(1);
            }}
            className="px-3 py-1 bg-gray-200 dark:bg-neutral-700 rounded-md hover:opacity-80"
          >
            Reset
          </button>
        </div>
      </div>

      {/* table */}
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
            showPagination={true}
            tableDataLength={bookings.length}
          />
        </>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-2xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reschedule Job</h2>
            <input
              type="datetime-local"
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 mb-4 outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={handleRescheduleJob}
                disabled={isRescheduling}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400"
              >
                {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 p-6 rounded-2xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Cancel Job</h2>
            <textarea
              placeholder="Enter reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 mb-4 outline-none"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={handleCancelJob}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
