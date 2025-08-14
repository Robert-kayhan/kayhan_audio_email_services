"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  limit: number;
  showPagination: any;
  tableDataLength: any;
}

export default function Pagination({
  currentPage,
  totalRecords,
  totalPages,
  setCurrentPage,
  limit,
  tableDataLength,
}: PaginationProps) {
  const maxVisiblePages = 7;
  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between pt-4 px-2">
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
          <nav className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* First page */}
            {startPage > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  1
                </button>
                {startPage > 2 && <span className="px-2">...</span>}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers.map((pageNumber) => (
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

            {/* Last page */}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="px-2">...</span>}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1.5 text-sm rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
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
