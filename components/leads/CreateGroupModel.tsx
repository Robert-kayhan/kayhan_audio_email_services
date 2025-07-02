"use client";

import { useEffect, useState } from "react";
import { useGetAllUserQuery } from "@/store/api/UserApi";
import { CheckCircle, Circle } from "lucide-react";

interface User {
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AssignUsersToGroupModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 25;

  const { data, isLoading, isError } = useGetAllUserQuery({
    page: currentPage,
    limit,
  });

  const users: User[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) {
      setGroupName("");
      setSelectedUserIds([]);
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  const toggleUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const selectAllUsers = () => {
    const allIds = users.map((u) => u.id);
    setSelectedUserIds(allIds);
  };

  const clearSelection = () => {
    setSelectedUserIds([]);
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUserIds.length === 0) {
      alert("Please enter a group name and select at least one user.");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch("/api/lead-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupName, userIds: selectedUserIds }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create group.");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 text-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto relative p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Create & Assign Users to Group
        </h3>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full px-4 py-2 mb-5 rounded-md border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">Select Users</h4>
            <div className="flex gap-2">
              <button
                onClick={selectAllUsers}
                className="text-sm text-blue-400 hover:underline"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-red-400 hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full px-3 py-2 mb-3 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {isLoading ? (
            <p className="text-sm text-gray-400">Loading users...</p>
          ) : isError ? (
            <p className="text-sm text-red-400">Failed to fetch users.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {filteredUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className={`flex items-center justify-between p-3 rounded-md border transition ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    }`}
                  >
                    <span>{user.name}</span>
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
