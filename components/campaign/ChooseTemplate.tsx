import React, { useState } from "react";
import {
  useGetAllTemplatesQuery,
  useDeleteTemplateMutation,
} from "@/store/api/templateApi";
import Pagination from "@/components/global/Pagination";
import { Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Props {
  onSelect: (template: { id: string; design: Record<string, any> }) => void;
}

const ChooseTemplate: React.FC<Props> = ({ onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isError, refetch } = useGetAllTemplatesQuery({
    page: currentPage,
    limit,
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
    <div className="min-h-screen text-gray-100">
      <h3 className="text-lg font-semibold mb-6">Select a Template</h3>

      {isLoading ? (
        <p>Loading templates...</p>
      ) : isError ? (
        <p>Error loading templates</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl: any) => (
              <div
                key={tpl.id}
                onClick={() => {
                  onSelect({ id: tpl.id, design: tpl.design });
                }}
                className="bg-[#2a2a2a] border border-[#444] rounded-lg p-4 text-white cursor-pointer hover:border-blue-500 shadow hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <strong className="truncate max-w-[70%]">{tpl.name}</strong>

                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={`/dashboard/template/edit/${tpl.id}`}>
                      <Pencil
                        size={18}
                        className="text-blue-400 hover:text-blue-500 cursor-pointer"
                      />
                    </Link>
                    <Trash2
                      size={18}
                      onClick={(e) => handleDelete(e, tpl.id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div
                  className="bg-white text-black p-2 rounded text-sm overflow-y-auto border border-gray-300"
                  dangerouslySetInnerHTML={{
                    __html:
                      tpl.html ||
                      "<p style='color:gray;'>No preview available</p>",
                  }}
                />
              </div>
            ))}
          </div>

          {pageNumbers.length > 1 && pagination && (
            <div className="mt-8">
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
