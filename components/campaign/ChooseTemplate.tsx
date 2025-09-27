import React, { useState } from "react";
import {
  useGetAllTemplatesQuery,
  useDeleteTemplateMutation,
} from "@/store/api/templateApi";
import Pagination from "@/components/global/Pagination";
import { LucideView } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  onSelect: (template: { id: string; design: Record<string, any> }) => void;
  type : any
}

const ChooseTemplate: React.FC<Props> = ({ onSelect , type }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, refetch } = useGetAllTemplatesQuery({
    page: currentPage,
    limit,
    type 
  });

  const [deleteTemplate] = useDeleteTemplateMutation();

  const templates = data?.data || [];
  const pagination = data?.meta;

  const pageNumbers =
    pagination?.totalPages && pagination.totalPages > 1
      ? Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
      : [];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this template?")) {
      try {
        await deleteTemplate(id).unwrap();
        toast.success("Template deleted");
        refetch();
      } catch (error) {
        toast.error("Failed to delete template");
        console.error("Delete error:", error);
      }
    }
  };

  return (
  <div className="min-h-screen px-4 py-8 bg-white text-gray-900 dark:bg-[#1e1e1e] dark:text-gray-100">
  <h3 className="text-2xl font-bold mb-8 text-black dark:text-white">
    📄 Select a Template
  </h3>

  {isLoading ? (
    <p className="text-gray-600 dark:text-gray-300">Loading templates...</p>
  ) : isError ? (
    <p className="text-red-600 dark:text-red-400">Error loading templates</p>
  ) : (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl: any) => (
          <div
            key={tpl.id}
            onClick={() => onSelect({ id: tpl.id, design: tpl.design })}
            className="bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            {/* Header with name and view icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-black dark:text-white truncate max-w-[70%]">
                {tpl.name}
              </span>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <LucideView
                  size={18}
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-500 transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: open view modal
                  }}
                />
              </div>
            </div>

            {/* Template preview */}
            <div className="flex-1 overflow-hidden rounded border border-gray-300 dark:border-gray-400 bg-white dark:bg-gray-100 text-black">
              <div
                className="p-2 h-[420px] overflow-y-auto text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    tpl.html ||
                    "<p style='color:gray;'>No preview available</p>",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pageNumbers.length > 1 && pagination && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalRecords={pagination.totalItems}
            totalPages={pagination.totalPages}
            setCurrentPage={setCurrentPage}
            limit={limit}
            showPagination={pageNumbers}
            tableDataLength={templates.length}
          />
        </div>
      )}
    </>
  )}
</div>

  );
};

export default ChooseTemplate;
