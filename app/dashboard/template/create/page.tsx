"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useCreateTemplateMutation } from "@/store/api/templateApi";
import toast from "react-hot-toast";
import TemplateSelectorModal from "@/components/template/TemplateSelectorModal";
import { parseAndLoadDesign } from "@/util/ComanFuction";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

interface Template {
  id: string;
  name: string;
  design: Record<string, any>;
}

const EmailBuilderPage = () => {
  const editorRef = useRef<any>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // ✅ new state for template type
  const [templateType, setTemplateType] = useState<"Retail" | "wholeSale">(
    "Retail"
  );

  const [createTemplate, { isLoading }] = useCreateTemplateMutation();

  const exportHtml = () => {
    editorRef.current?.editor.exportHtml((data: any) => {
      console.log("HTML Output:", data);
      alert("HTML exported to console");
    });
  };

  const saveTemplate = () => {
    const editor = editorRef.current?.editor;
    if (!editor) {
      alert("Editor is not ready");
      return;
    }

    editor.exportHtml(async (htmlData: any) => {
      const name = prompt("Enter your Template name");
      if (!name) return;

      try {
        await createTemplate({
          name,
          type: templateType, // ✅ include template type
          html: htmlData.html,
          design: htmlData.design,
        }).unwrap();
        toast.success("✅ Template created successfully");
      } catch (error) {
        console.error("Error saving template:", error);
        toast.error("❌ Failed to save template");
      }
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Controls */}
      <div className="flex items-center gap-3 p-4">
        {/* Template Type Selector */}
        <select
          className="bg-[#333] text-white p-2 rounded border border-[#555]"
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value as any)}
        >
          <option value="Retail">Retail</option>
          <option value="wholeSale">Wholesale</option>
        </select>

        <button
          className="text-white bg-[#333] p-2 px-3 rounded border-[#555] border"
          onClick={exportHtml}
        >
          Export HTML
        </button>

        <button
          className="text-white bg-[#333] p-2 px-3 rounded border-[#555] border"
          onClick={saveTemplate}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Template"}
        </button>

        <button
          className="text-white bg-[#333] p-2 px-3 rounded border-[#555] border"
          onClick={() => setShowTemplates(true)}
        >
          Load Template
        </button>
      </div>

      {/* Email Editor */}
      <div style={{ flex: 1, position: "relative" }}>
        <EmailEditor
          ref={editorRef}
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
          }}
          onLoad={() =>
            console.log("Editor loaded", editorRef.current?.editor)
          }
        />
      </div>

      {/* Template Selector Modal */}
      <TemplateSelectorModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={(design) => {
          parseAndLoadDesign(design, editorRef);
        }}
      />
    </div>
  );
};

export default EmailBuilderPage;
