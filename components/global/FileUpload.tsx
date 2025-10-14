"use client";

import Image from "next/image";
import React, { useState } from "react";

type FileUploadProps = {
  files: string[]; // already uploaded file URLs
  setFiles: (urls: string[]) => void; // parent controls state
};

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  const [previews, setPreviews] = useState<string[]>(files || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => formData.append("photos", file));

    // Upload to backend
    fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.urls) {
          const newUrls = [...previews, ...data.urls];
          setPreviews(newUrls);
          setFiles(newUrls);
        }
      })
      .catch((err) => console.error("Upload failed", err));
  };

  const removeFile = (index: number) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    setFiles(updated);
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800">
      {/* Upload box */}
      <label className="flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-700 rounded-lg transition">
        <span className="text-gray-300 mb-2">📷 Upload Photos</span>
        <span className="text-sm text-gray-500">Drag & Drop or Click</span>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Preview Grid */}
      { Array.isArray(previews) && previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div
              key={index}
              className="relative group border border-gray-600 rounded-lg overflow-hidden"
            >
              <Image 
              height={100}
              width={200}
                src={url}
                alt={`uploaded-${index}`}
                className="object-cover w-full h-32"
              />

              {/* Main label for first image */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                  Main
                </span>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;