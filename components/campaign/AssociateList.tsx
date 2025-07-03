"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import {
  useDeleteLeadGroupMutation,
  useGetAllLeadGroupQuery,
  useCreateLeadGroupMutation,
} from "@/store/api/leadAPi";
import toast from "react-hot-toast";
import { CheckSquare, Square } from "lucide-react";

interface Props {
  selectedUserIds: any; // FIX: Explicit typing
  onSelectGroupId: (groupId: any) => void;
}

const AssociateList = ({ selectedUserIds, onSelectGroupId }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<any>(null);
  console.log(selectedUserIds, "this is usersid");
  const { data, isLoading, isError, refetch } = useGetAllLeadGroupQuery({
    page: currentPage,
    limit,
  });

  const [createLeadGroup, { isLoading: creating }] =
    useCreateLeadGroupMutation();

  const groups = data?.data ?? [];
  const pagination = data?.pagination ?? {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
  };

  const toggleGroup = (id: number) => {
    const newSelection = selectedGroupId === id ? null : id;
    setSelectedGroupId(newSelection);
    onSelectGroupId(newSelection!);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return toast.error("Group name is required");
    if (selectedUserIds.length === 0) return toast.error("No users selected");

    try {
      const res = await createLeadGroup({
        groupName,
        userIds: selectedUserIds,
      }).unwrap();

      toast.success("Group created successfully");
      setGroupName("");
      setIsModalOpen(false);
      refetch();

      if (res?.id) {
        setSelectedGroupId(res.id);
        onSelectGroupId(res.id);
      }
    } catch (err) {
      toast.error("Failed to create group");
      console.error("Create group error", err);
    }
  };

  const columns: Column<any>[] = [
    {
      header: "",
      accessor: "id",
      render: (_, row: any) => (
        <button
          onClick={() => toggleGroup(row.id)}
          className="flex items-center"
        >
          {selectedGroupId === row.id ? (
            <CheckSquare className="text-blue-500" size={18} />
          ) : (
            <Square className="text-gray-400" size={18} />
          )}
        </button>
      ),
    },
    { header: "ID", accessor: "id", sortable: true },
    { header: "Group Name", accessor: "groupName", sortable: true },
    { header: "Created At", accessor: "createdAt", sortable: true },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-xl font-semibold">Choose Lead Group</h2>

        <div className="flex items-center gap-3">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading groups...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch groups.
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No groups found.</div>
      ) : (
        <>
          <CustomTable columns={columns} data={groups} showActions={false} />
          <Pagination
            currentPage={currentPage}
            totalRecords={pagination.totalItems}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={Array.from(
              { length: pagination.totalPages },
              (_, i) => i + 1
            )}
            tableDataLength={groups.length}
          />
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Create New Group
            </h3>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={creating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssociateList;
