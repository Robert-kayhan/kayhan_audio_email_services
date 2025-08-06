"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import { useDeleteUserMutation } from "@/store/api/UserApi";
import toast from "react-hot-toast";
import { useGetAllLeadGroupQuery , useDeleteLeadGroupMutation } from "@/store/api/lead/leadAPi";
import Link from "next/link";
import { useRouter } from "next/navigation";


const columns: Column<any>[] = [
  { header: "id", accessor: "id", sortable: true },
  { header: "groupName", accessor: "groupName", sortable: true },
];

export default function TablePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [user, setUser] = useState<any>();
  const { data, isLoading, isError, refetch } = useGetAllLeadGroupQuery({
    page: currentPage,
    limit,
  });
  const [deleteLeadGroup] = useDeleteLeadGroupMutation();
  // Destructure safely
  const users = data?.data ?? [];
  const pagination = data?.pagination ?? {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  };

  const totalPages = pagination.totalPages;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);
const router = useRouter()
  const handleEdit = (row: any) => {
   router.push(`/dashboard/lead-group/edit/${row.id}`)
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteLeadGroup(row.id).unwrap();
      toast.success("User deleted successfully");
      refetch(); // Refetch user list
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Lead Group</h2>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none "
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>

          {/* Create Button */}
          <div className="relative inline-block text-left">
            <Link
              href="/dashboard/lead-group/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create
            </Link>       
          </div>
        </div>
      </div>

      {/* Table or State */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading users...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch users.
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No leads found.</div>
      ) : (
        <>
          <CustomTable
            columns={columns}
            data={users}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
           
          />
          <Pagination
            currentPage={currentPage}
            totalRecords={pagination.totalItems}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={users.length}
          />
        </>
      )}

    </div>
  );
}
