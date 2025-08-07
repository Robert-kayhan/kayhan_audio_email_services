"use client";

import { useState, useEffect } from "react";
import { useGetAllUserQuery } from "@/store/api/UserApi";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { User } from "@/util/interface";
import { CheckSquare, Square } from "lucide-react";
import { useCreateLeadGroupMutation } from "@/store/api/lead/leadAPi";

export default function CreateLeadGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const { data, isLoading, refetch } = useGetAllUserQuery({
    page: currentPage,
    limit,
    search,
  });

  const users: User[] = data?.data || [];
  const pagination = data?.pagination || {};
  const totalItems = pagination.totalItems || 0;
  const totalPages = pagination.totalPages || 1;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [createLeadGroup, { isLoading: creating }] =
    useCreateLeadGroupMutation();

  const isUserSelected = (id: number) => selectedUserIds.includes(id);

  const toggleUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUserIds.length === 0) {
      alert("Enter group name and select at least one user");
      return;
    }

    try {
      await createLeadGroup({ groupName, userIds: selectedUserIds }).unwrap();
      alert("Group created!");
      setGroupName("");
      setSelectedUserIds([]);
      setSearchInput("");
      refetch();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "",
      accessor: "id",
      render: (_, row: any) => (
        <button
          onClick={() => toggleUser(row.id)}
          className="flex items-center focus:outline-none"
        >
          {isUserSelected(row.id) ? (
            <CheckSquare className="text-blue-500" size={18} />
          ) : (
            <Square className="text-gray-400 dark:text-gray-600" size={18} />
          )}
        </button>
      ),
    },
    { header: "ID", accessor: "id" },
    { header: "First Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <div className="p-6 min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white transition-colors">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Create Lead Group</h1>
      </div>

      {/* Group Name Input */}
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full mb-6 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Search + Page Size Select */}
      <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-800 text-white text-sm focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearchInput("")}
              className="text-red-600 dark:text-red-400 text-sm hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <select
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
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
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <CustomTable columns={columns} data={users} pageSize={limit} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalRecords={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        limit={limit}
        showPagination={showPagination}
        tableDataLength={users.length}
      />

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={creating}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
}
