"use client";
import React, { useState } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  showActions?: boolean;
  pageSize?: number;
};

export default function CustomTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  showActions = false,
  pageSize = 10,
}: TableProps<T>) {
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (accessor: keyof T) => {
    if (sortBy === accessor) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(accessor);
      setSortOrder("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }, [data, sortBy, sortOrder]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-md">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                onClick={() => col.sortable && handleSort(col.accessor)}
                className={`text-left p-2 cursor-pointer text-gray-800 dark:text-gray-200 ${
                  col.sortable ? "hover:text-blue-600 dark:hover:text-blue-400" : ""
                }`}
              >
                {col.header}
                {sortBy === col.accessor && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
            {showActions && <th className="p-2 text-gray-800 dark:text-gray-200">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              {columns.map((col) => (
                <td key={String(col.accessor)} className="p-2 text-gray-900 dark:text-gray-100">
                  {String(row[col.accessor])}
                </td>
              ))}
              {showActions && (
                <td className="p-2 space-x-2">
                  {onEdit && (
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="text-red-600 dark:text-red-400 hover:underline"
                      onClick={() => onDelete(row)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-end mt-2 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-gray-800 dark:text-gray-200">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
