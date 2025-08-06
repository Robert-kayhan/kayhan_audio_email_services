"use client";

import { useState } from "react";
import { useGetAllUserQuery } from "@/store/api/UserApi";
import CustomTable, { Column } from "@/components/global/Table";
import Pagination from "@/components/global/Pagination";
import { User } from "@/util/interface";
import { CheckSquare, Square } from "lucide-react";

interface Props {
  selectedUserIds: any;
  setSelectedUserIds: (ids: any) => void;
  onNext: () => void;
}

export default function AddRecipients({
  selectedUserIds,
  setSelectedUserIds,
  onNext,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [selectData , setSelectData] = useState<any>()
  const { data, isLoading } = useGetAllUserQuery({
    page: currentPage,
    limit,
  });
  console.log(data , "this is data")
  const users: User[] = data?.data || [];
  const pagination = data?.pagination || {};
  const totalItems = pagination.totalItems || 0;
  const totalPages = pagination.totalPages || 1;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const isUserSelected = (id: number) => selectedUserIds.includes(id);
  const allUserIdsOnCurrentPage = users.map((user) => user.id);
  const toggleUser = (id: number) => {
    setSelectedUserIds((prev: any) =>
      prev.includes(id) ? prev.filter((uid: any) => uid !== id) : [...prev, id]
    );
  };
  
  const toggleSelectAllCurrentPage = () => {
    const areAllSelected = allUserIdsOnCurrentPage.every((id) =>
      selectedUserIds.includes(id)
    );
    const allData = [...data]
    setSelectData(allData)
    console.log(selectData , "this is data")
    if (areAllSelected) {
      setSelectedUserIds((prev: number[]) =>
        prev.filter((id: any) => !allUserIdsOnCurrentPage.includes(id))
      );
    } else {
      const newSelected = Array.from(
        new Set([...selectedUserIds, ...allUserIdsOnCurrentPage])
      );
      setSelectedUserIds(newSelected);
    }
  };

 const columns: Column<User>[] = [
  {
    header: (
      <button onClick={toggleSelectAllCurrentPage}>
        {allUserIdsOnCurrentPage.every((id) => selectedUserIds.includes(id)) ? (
          <CheckSquare className="text-blue-500" size={18} />
        ) : (
          <Square className="text-gray-400 dark:text-gray-500" size={18} />
        )}
      </button>
    ),
    accessor: "id",
    render: (_, row: any) => (
      <button
        onClick={() => toggleUser(row.id)}
        className="flex items-center"
      >
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
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div>
          <button
            className="border-b border-gray-300 dark:border-gray-700 my-2 text-black dark:text-white"
            onClick={toggleSelectAllCurrentPage}
          >
            Select All Users
          </button>
          <CustomTable columns={columns} data={users} pageSize={limit} />
        </div>
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
