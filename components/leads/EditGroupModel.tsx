"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
};

interface AssignUsersModalProps {
  isOpen: boolean;
  users: User[];
  selectedUsers: number[];
  setSelectedUsers: (users: number[]) => void;
  groupName: string;
  onClose: () => void;
  onAssign: () => void;
}

export default function AssignUsersModal({
  isOpen,
  users,
  selectedUsers,
  setSelectedUsers,
  groupName,
  onClose,
  onAssign,
}: AssignUsersModalProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  //   const toggleUser = (id: number) => {
  //     setSelectedUsers((prev) =>
  //       prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
  //     );
  //   };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center px-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold mb-4">
          Assign Users to <span className="text-blue-600">"{groupName}"</span>
        </h3>

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-full p-2 mb-4 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 border-t border-b py-4 dark:border-gray-700">
          {paginatedUsers.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                // onChange={() => toggleUser(user.id)}
                className="form-checkbox accent-blue-600"
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onAssign}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign Users
          </button>
        </div>
      </div>
    </div>
  );
}
