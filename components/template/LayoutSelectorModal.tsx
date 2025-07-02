"use client";

import { useEffect } from "react";
import { predefinedLayouts } from "@/util/layout";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (design: any) => void;
}

const LayoutSelectorModal = ({ open, onClose, onSelect }: Props) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#111] rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Select a Layout
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {predefinedLayouts.map((layout, idx) => (
            <div
              key={idx}
              className="p-3 rounded border cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 text-black dark:text-white flex flex-col items-center"
              onClick={() => {
                onSelect(layout.design);
                onClose();
              }}
            >
              <Image
              height={200}
              width={200}
                src={layout.icon}
                alt={layout.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-sm text-center">{layout.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayoutSelectorModal;
