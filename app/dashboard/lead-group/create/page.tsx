"use client";

import { useState } from "react";
import { useGetAllUserQuery } from "@/store/api/UserApi";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { User } from "@/util/interface";
import { CheckSquare, Square } from "lucide-react";
import { useCreateLeadGroupMutation } from "@/store/api/leadAPi";

export default function CreateLeadGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data, isLoading, refetch } = useGetAllUserQuery({
    page: currentPage,
    limit,
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
          className="flex items-center"
        >
          {isUserSelected(row.id) ? (
            <CheckSquare className="text-blue-500" size={18} />
          ) : (
            <Square className="text-gray-400" size={18} />
          )}
        </button>
      ),
    },
    { header: "ID", accessor: "id" },
    { header: "First Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen">
     <div className="flex justify-between">
       <h1 className="text-2xl font-bold mb-4">Create Lead Group</h1>
      
     </div>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full mb-6 px-4 py-2 rounded-md border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading ? (
        <p>Loading users...</p>
      ) : (

      <div>
          <select
        className="text-sm px-3 py-1 float-end my-1 rounded-md bg-black border text-white focus:outline-none"
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
        <CustomTable
          columns={columns}
          data={users}
          pageSize={limit}
          rowKey="id"
        />
      </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalRecords={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        limit={limit}
        showPagination={showPagination}
        tableDataLength={users.length}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={creating}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          {creating ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
}
