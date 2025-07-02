"use client";

import { useState } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import UploadExcelModal from "@/components/leads/UploadExcelModal";
import UserFormModal from "@/components/leads/UserFormModal";
import { useGetAllUserQuery } from "@/store/api/UserApi";
import Pagination from "@/components/global/Pagination";
import { useDeleteUserMutation } from "@/store/api/UserApi";
import toast from "react-hot-toast";
import UserForUpdate from "@/components/leads/UpdateUserModel";
type User = {
  name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
};

const columns: Column<User>[] = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Email", accessor: "email", sortable: true },
  { header: "Role", accessor: "role" },
  { header: "Phone", accessor: "phone" },
  { header: "Status", accessor: "status" },
];

export default function TablePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userShowModal, setUserShowModal] = useState(false);
  const [updateuserShowModal, setUpdateuserShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [user, setUser] = useState<any>();
  const { data, isLoading, isError, refetch } = useGetAllUserQuery({
    page: currentPage,
    limit,
  });
  const [deleteUser] = useDeleteUserMutation();
  // Destructure safely
  const users = data?.data ?? [];
  const pagination = data?.pagination ?? {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  };

  const totalPages = pagination.totalPages;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEdit = (row: any) => {
    const [firstname, ...rest] = row.name.split(" ");
    const lastname = rest.join(" ");

    setUser({
      firstname,
      lastname,
      email: row.email,
      phone: row.phone,
      address: row.address || "", // If available, else fallback to ""
    });

    setUpdateuserShowModal(true);
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteUser(row.email).unwrap();
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
        <h2 className="text-2xl font-serif font-bold">User</h2>

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
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-200 rounded shadow z-50 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setUserShowModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Create Single Lead
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setShowModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Create Multiple Leads
                </button>
              </div>
            )}
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
            customActions={[
              {
                label: "View",
                onClick: (row) => console.log("Viewing", row),
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
            tableDataLength={users.length}
          />
        </>
      )}

      {/* Modals */}
      <UploadExcelModal
        refetch={refetch}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <UserFormModal
        refetch={refetch}
        isOpen={userShowModal}
        onClose={() => setUserShowModal(false)}
      />
      <UserForUpdate
        user={user}
        isOpen={updateuserShowModal}
        refetch={refetch}
        onClose={() => setUpdateuserShowModal(false)}
      />
    </div>
  );
}
