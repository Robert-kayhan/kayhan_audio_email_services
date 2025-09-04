"use client";

import { useState, useEffect } from "react";
import CustomTable, { Column } from "@/components/global/Table";
import { ChevronDown } from "lucide-react";
import Pagination from "@/components/global/Pagination";
import toast from "react-hot-toast";
import Link from "next/link";

// RTK Query hooks (update these paths as per your project)
import {
  useGetAllTemplatesQuery,
  useDeleteTemplateMutation,
  useUpdateTemplateMutation,
} from "@/store/api/templateApi";

type Template = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

const columns: Column<Template>[] = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Description", accessor: "description" },
  { header: "Created At", accessor: "createdAt" },
];

export default function TemplateTablePage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Search state with debounce
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Edit state
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchInput]);

  // Fetch templates
  const { data, isLoading, isError, refetch } = useGetAllTemplatesQuery({
    page: currentPage,
    limit,
    search,
  });

  const [deleteTemplate] = useDeleteTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();

  const templates = data?.data ?? [];
  const pagination = data?.meta ?? {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    perPage: limit,
  };

  const totalPages = pagination.totalPages;
  const showPagination = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDelete = async (row: Template) => {
    try {
      await deleteTemplate(row.id).unwrap();
      toast.success("Template deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete template");
      console.error(error);
    }
  };

  const handleEdit = (row: Template) => {
    setEditingTemplate(row);
    setEditName(row.name);
  };

  const handleSaveEdit = async () => {
    if (!editingTemplate) return;
    try {
      await updateTemplate({ id: editingTemplate.id, name: editName }).unwrap();
      toast.success("Template updated successfully");
      setEditingTemplate(null);
      refetch();
    } catch (error) {
      toast.error("Failed to update template");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center px-3 py-2 gap-4 flex-wrap">
        <h2 className="text-2xl font-serif font-bold">Templates</h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search templates..."
              className="px-3 py-1 rounded-md bg-black text-white border border-gray-700 focus:outline-none text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearchInput("")}
                className="text-red-400 text-sm hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Page Size Selector */}
          <select
            className="text-sm px-3 py-1 rounded-md bg-black text-white focus:outline-none"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select> 

          {/* Create Button */}
          <div className="relative inline-block text-left">
          <Link
                  href="/dashboard/template/create"
                  className="block bg-blue-800 w-full rounded-sm shadow-2xl text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Create Template
                </Link>

            {/* {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-200 rounded shadow z-50 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                <Link
                  href="/dashboard/templates/create"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Create Template
                </Link>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Table or State */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading templates...
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Failed to fetch templates.
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No templates found.
        </div>
      ) : (
        <>
          <CustomTable
            pageSize={limit}
            columns={columns}
            data={templates}
            showActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            customActions={[
              {
                label: "View",
                onClick: (row) => console.log("Viewing", row),
                className:
                  "text-purple-600 dark:text-purple-400 hover:underline",
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalRecords={pagination.totalItems}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={showPagination}
            tableDataLength={templates.length}
          />
        </>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setEditingTemplate(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>

            {/* Header */}
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Edit Template
            </h3>

            {/* Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Template Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                placeholder="Enter template name..."
              />
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
