// File: components/template/PredefinedTemplateModal.tsx
"use client";

import React from "react";
import Oneproduct from "./Prebuild/Ecommerce/Oneproduct";
// Use Unlayer-compatible design JSON
const predefinedTemplates: any[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    design: {
      schemaVersion: 1,
      counters: { u_row: 1, u_column: 1, u_content: 1 },
      body: {
        rows: [
          {
            cells: [1],
            columns: [
              {
                contents: [
                  {
                    type: "text",
                    values: {
                      text: "<h1>Welcome to our platform!</h1><p>We’re excited to have you.</p>",
                      fontSize: 16,
                      padding: "10px",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "product",
    name: "Product Component",
    component: <Oneproduct />,
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (design: Record<string, any>) => void;
}

const PredefinedTemplateModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg p-6 w-[90%] max-w-xl max-h-[80vh] overflow-y-auto border border-[#333] text-white">
        <h3 className="text-lg font-semibold mb-4">Choose a Predefined Template</h3>

        <div className="grid gap-3">
          {predefinedTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelect(tpl.design);
                onClose();
              }}
              className="bg-[#2a2a2a] hover:bg-[#333] transition-colors duration-200 cursor-pointer border border-[#444] rounded-md px-4 py-3 flex justify-between items-center"
            >
              <span>{tpl.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-[#333] hover:bg-[#444] transition-colors border border-[#555] text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PredefinedTemplateModal;
