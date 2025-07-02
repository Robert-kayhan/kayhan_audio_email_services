import React, { useState } from "react";
import {
  useGetAllTemplatesQuery,
  useDeleteTemplateMutation,
} from "@/store/api/templateApi";
import Pagination from "@/components/global/Pagination";
import { Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
interface Template {
  id: string;
  name: string;
  design: Record<string, any>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (design: Record<string, any>) => void;
}

const TemplateSelectorModal: React.FC<Props> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, refetch } = useGetAllTemplatesQuery({
    page: currentPage,
    limit,
  });
  console.log("this is data ", data);
  const [deleteTemplate] = useDeleteTemplateMutation();

  const templates = data?.data || [];
  const pagination = data?.meta;

  const pageNumbers =
    pagination?.totalPages && pagination.totalPages > 1
      ? Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
      : [];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering onSelect
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

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          borderRadius: "8px",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          color: "#f0f0f0",
          border: "1px solid #333",
        }}
      >
        <h3>Select a Template</h3>

        {isLoading ? (
          <p>Loading templates...</p>
        ) : isError ? (
          <p>Error loading templates</p>
        ) : (
          <>
            <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
              {templates.map((tpl:any) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    onSelect(tpl.design);
                    onClose();
                  }}
                  style={{
                    padding: "12px",
                    border: "1px solid #444",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: "#2a2a2a",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column", // Changed to column layout
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <strong>{tpl.name}</strong>

                    <div
                      style={{ display: "flex", gap: "10px" }}
                      onClick={(e) => e.stopPropagation()} // prevent triggering onSelect
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

                  {/* HTML Preview */}
                  <div
                    style={{
                      marginTop: "4px",
                      padding: "8px",
                      background: "#fff",
                      color: "#000",
                      borderRadius: "4px",
                      maxHeight: "150px",
                      overflowY: "auto",
                      fontSize: "14px",
                    }}
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
              <Pagination
                currentPage={pagination.currentPage}
                totalRecords={pagination.totalItems}
                totalPages={pagination.totalPages}
                setCurrentPage={setCurrentPage}
                limit={limit}
                showPagination={pageNumbers}
                tableDataLength={templates.length}
              />
            )}
          </>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            background: "#333",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #555",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TemplateSelectorModal;
