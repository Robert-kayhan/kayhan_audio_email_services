"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { useCreateTemplateMutation } from "@/store/api/templateApi";
import toast from "react-hot-toast";
import TemplateSelectorModal from "@/components/template/TemplateSelectorModal";
import PredefinedTemplateModal from "@/components/template/PredefinedTemplateModal";
const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });
import { parseAndLoadDesign } from "@/util/ComanFuction";

interface Template {
  id: string;
  name: string;
  design: Record<string, any>;
}

const EmailBuilderPage = () => {
  const editorRef = useRef<any>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  // const [showPredefined, setShowPredefined] = useState(false);
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

    editor.exportHtml((htmlData: any) => {
      const name = prompt("Enter your Template name");
      if (!name) return;

      try {
        createTemplate({
          name,
          html: htmlData.html,
          design: htmlData.design,
        });
        toast.success("Template created successfully");
      } catch (error) {
        console.error("Error saving template:", error);
        toast.error("❌ Failed to save template");
      }
    });
  };

  return (
    <div className="h-screen flex flex-col ">
      <div className="flex gap-3 p-4">
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
        {/* <button
          className="text-white bg-[#333] p-2 px-3 rounded border-[#555] border"
          onClick={() => setShowPredefined(true)}
        >
          Pre difine Template
        </button> */}
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <EmailEditor
          ref={editorRef}
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
          }}
          onLoad={() => console.log("Editor loaded", editorRef.current?.editor)}
        />
      </div>

      <TemplateSelectorModal
        open={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={(design) => {
          // editorRef.current?.editor.loadDesign(design);
          parseAndLoadDesign(design, editorRef);
        }}
      />
      {/* <PredefinedTemplateModal
        open={showPredefined}
        onClose={() => setShowPredefined(false)}
        onSelect={(design) => editorRef.current?.editor.loadDesign(design)}
      /> */}
    </div>
  );
};

export default EmailBuilderPage;
