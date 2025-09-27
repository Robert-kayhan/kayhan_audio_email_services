"use client";

import { useState } from "react";
import { useGetAllUserQuery } from "@/store/api/UserApi";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { User } from "@/util/interface";
import { CheckSquare, Square } from "lucide-react";

interface Props {
  selectedUserIds: any;
  setSelectedUserIds: any;
  onNext: any;
  role : any
}

export default function AddRecipients({
  selectedUserIds,
  setSelectedUserIds,
  onNext,
  role
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAllUserQuery({
    page: currentPage,
    limit,
    search,
    role
  });

  const users: User[] = data?.data || [];
  const pagination = data?.pagination || {};
  const totalItems = pagination.totalItems || 0;
  const totalPages = pagination.totalPages || 1;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const allUserIdsOnCurrentPage = users.map((user) => user.id);

  const isUserSelected = (id: number) => selectedUserIds.includes(id);

  const toggleUser = (id: number) => {
    setSelectedUserIds((prev:any) =>
      prev.includes(id) ? prev.filter((uid:any) => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAllCurrentPage = () => {
    const areAllSelected = allUserIdsOnCurrentPage.every((id) =>
      selectedUserIds.includes(id)
    );

    if (areAllSelected) {
      // Unselect all users from the current page
      setSelectedUserIds((prev:any) =>
        prev.filter((id:any) => !allUserIdsOnCurrentPage.includes(id))
      );
    } else {
      // Select all users from the current page
      setSelectedUserIds((prev:any) => [
        ...new Set([...prev, ...allUserIdsOnCurrentPage]),
      ]);
    }
  };

  const columns: Column<User>[] = [
    {
      header: (
        <button onClick={toggleSelectAllCurrentPage}>
          {allUserIdsOnCurrentPage.length > 0 &&
          allUserIdsOnCurrentPage.every((id) =>
            selectedUserIds.includes(id)
          ) ? (
            <CheckSquare className="text-blue-500" size={18} />
          ) : (
            <Square className="text-gray-400 dark:text-gray-500" size={18} />
          )}
        </button>
      ),
      accessor: "id",
      render: (_, row:any) => (
        <button onClick={() => toggleUser(row.id)} className="flex items-center">
          {isUserSelected(row.id) ? (
            <CheckSquare className="text-blue-500" size={18} />
          ) : (
            <Square className="text-gray-400 dark:text-gray-500" size={18} />
          )}
        </button>
      ),
    },
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <div className="p-6 min-h-screen rounded-lg shadow bg-white text-black dark:bg-gray-950 dark:text-white">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Select Recipients</h2>
        
        <select
          className="text-sm px-3 py-1 rounded-md border focus:outline-none bg-white text-black border-gray-300 dark:bg-black dark:text-white dark:border-gray-700"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[5, 10, 25, 50,100,200,500].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded-md border bg-white text-black border-gray-300 dark:bg-black dark:text-white dark:border-gray-700 text-sm focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-red-400 text-sm hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <CustomTable columns={columns} data={users} pageSize={limit} />
      )}

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
          onClick={onNext}
          disabled={selectedUserIds.length === 0}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
