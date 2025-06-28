"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateMultipleUserMutation } from "@/store/api/UserApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadExcelModal({ isOpen, onClose }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [createMultipleUser] = useCreateMultipleUserMutation();

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const res = await createMultipleUser(formData).unwrap();
      toast.success(res.message || "Users uploaded successfully");
      setSelectedFile(null);
      setFileName("");
      onClose();
    } catch (error) {
      toast.error(
        (error as any)?.data?.message ||
          (error as any)?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload size={20} /> Upload Excel File
        </h2>

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedFile(file);
              setFileName(file.name);
            }
          }}
          className="w-full border border-zinc-700 rounded p-2 bg-zinc-800 text-sm text-white"
        />

        {fileName && (
          <p className="mt-3 text-sm text-gray-400">Selected: {fileName}</p>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
