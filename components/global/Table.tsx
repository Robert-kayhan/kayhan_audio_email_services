"use client";
import React, { useState } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type CustomAction<T> = {
  label: string;
  onClick: (row: T) => void;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: CustomAction<T>[]; // <-- support for extra actions
  showActions?: boolean;
  pageSize?: number;
  rowKey?: keyof T;
};

export default function CustomTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  customActions = [],
  showActions = false,
  pageSize = 10,
  rowKey,
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
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
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
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border  border-gray-300 dark:border-gray-700 rounded-md">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                onClick={() => col.sortable && handleSort(col.accessor)}
                className={`p-3 text-left font-medium text-sm text-gray-800 dark:text-gray-200 cursor-pointer select-none ${
                  col.sortable ? "hover:text-blue-600 dark:hover:text-blue-400" : ""
                }`}
              >
                {col.header}
                {sortBy === col.accessor && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
            ))}
            {showActions && (
              <th className="p-3 text-left font-medium text-sm text-gray-800 dark:text-gray-200">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => {
            const key = rowKey ? String(row[rowKey]) : index;
            return (
              <tr
                key={key}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    className="p-3 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : String(row[col.accessor])}
                  </td>
                ))}
                {showActions && (
                  <td className="p-3 text-sm space-x-2 whitespace-nowrap">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                    {customActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => action.onClick(row)}
                        className={action.className || "text-green-600 dark:text-green-400 hover:underline"}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm px-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
