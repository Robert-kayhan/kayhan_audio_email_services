"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  limit: number;
  showPagination: number[];
  tableDataLength: number;
}

export default function Pagination({
  currentPage,
  totalRecords,
  totalPages,
  setCurrentPage,
  limit,
  showPagination,
  tableDataLength,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between  pt-4 px-2">
      <div className="flex flex-1 flex-col-reverse gap-2 md:flex-row items-center justify-between w-full">
        {/* Info */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing{" "}
          <span className="font-medium">
            {tableDataLength !== 0 ? (currentPage - 1) * limit + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min((currentPage - 1) * limit + tableDataLength, totalRecords)}
          </span>{" "}
          of <span className="font-medium">{totalRecords}</span> results
        </p>

        {/* Pagination Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Dropdown */}
          {/* <div className="block md:hidden">
            <select
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              value={currentPage}
              className="px-3 py-1 border rounded-md text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm"
            >
              <option disabled>Go to Page</option>
              {showPagination.map((pageNumber) => (
                <option key={pageNumber} value={pageNumber}>
                  Page {pageNumber}
                </option>
              ))}
            </select>
          </div> */}

          {/* Arrows + Page Numbers */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {showPagination.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
