"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import UploadExcelModal from "@/components/leads/UploadExcelModal";
import { useGetAllUserQuery, useDeleteUserMutation } from "@/store/api/UserApi";
import Pagination from "@/components/global/Pagination";
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
  { header: "ID", accessor: "id", sortable: true },
  { header: "Name", accessor: "name", sortable: true },
  { header: "Email", accessor: "email", sortable: true },
  { header: "Role", accessor: "role" },
  { header: "Phone", accessor: "phone" },
  { header: "Status", accessor: "status" },
];

export default function TablePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [updateuserShowModal, setUpdateuserShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [user, setUser] = useState<any>();

  // 🔍 Search state and debounce
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500); // debounce delay

    return () => clearTimeout(delay);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useGetAllUserQuery({
    page: currentPage,
    limit,
    search,
    role: 3,
  });

  const [deleteUser] = useDeleteUserMutation();

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
      address: row.address || "",
      isSubscribed: row.isSubscribed || true,
    });
    setUpdateuserShowModal(true);
  };

  const handleDelete = async (row: any) => {
    try {
      await deleteUser(row.email).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  // ✅ Call create-user API on first render
  useEffect(() => {
    const createUser = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/users/create-user", {
          method: "GET",
        });
        refetch();
      } catch (err) {
        console.error("Failed to create user:", err);
      }
    };

    createUser();
  }, [refetch]);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">WholeSale User</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* 🔍 Search Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search name, email or phone"
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
        </div>
      </div>

      {/* Table or State */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading users...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">Failed to fetch users.</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No leads found.</div>
      ) : (
        <>
          <CustomTable
            pageSize={limit}
            columns={columns}
            data={users}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            customActions={[
              {
                label: "View",
                onClick: (row) => console.log("Viewing", row),
                className: "text-purple-600 dark:text-purple-400 hover:underline",
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
      <UserForUpdate
        user={user}
        isOpen={updateuserShowModal}
        refetch={refetch}
        onClose={() => setUpdateuserShowModal(false)}
      />
    </div>
  );
}
