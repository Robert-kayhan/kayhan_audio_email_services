"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import {
  useGetTemplateByIdQuery,
  useUpdateTemplateMutation,
} from "@/store/api/templateApi";
import toast from "react-hot-toast";
import { parseAndLoadDesign } from "@/util/ComanFuction";
const EmailEditor = dynamic(() => import("react-email-editor"), {
  ssr: false,
});

const EditTemplatePage = () => {
  const { id } = useParams();
  const editorRef = useRef<any>(null);

  const { data, isLoading, isError } = useGetTemplateByIdQuery(id as string);
  const [updateTemplate, { isLoading: isUpdating }] =
    useUpdateTemplateMutation();

  // Load design into editor
  useEffect(() => {
    if (data && editorRef.current?.editor) {
      console.log(data.design, "this is desgin ");
      parseAndLoadDesign(data.design, editorRef);
      // editorRef.current.editor.loadDesign(data.design);
    }
  }, [data]);

  // Update Template Function
  const handleUpdate = () => {
    if (!editorRef.current?.editor) {
      toast.error("Editor not ready");
      return;
    }

    editorRef.current.editor.exportHtml((htmlData: any) => {
      // editorRef.current.editor.exportDesign((designData: any) => {
      updateTemplate({
        id: id as string,
        name: data?.name || "Untitled",
        html: htmlData.html,
        design: htmlData.design,
      })
        .unwrap()
        .then(() => toast.success(" Template updated successfully"))
        .catch(() => toast.error("❌ Failed to update template"));
    });
    // });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading template</p>;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#121212",
        color: "#fff",
      }}
    >
      <div
        style={{
          padding: "10px",
          background: "#1e1e1e",
          borderBottom: "1px solid #333",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          style={{
            backgroundColor: isUpdating ? "#555" : "#333",
            color: "#fff",
            padding: "6px 12px",
            border: "1px solid #555",
            borderRadius: "4px",
          }}
        >
          {isUpdating ? "Updating..." : "Update Template"}
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <EmailEditor
          ref={editorRef}
          style={{ height: "100vh", width: "100%" }}
          onLoad={() => {
            if (data) parseAndLoadDesign(data.design, editorRef);
          }}
        />
      </div>
    </div>
  );
};

export default EditTemplatePage;
