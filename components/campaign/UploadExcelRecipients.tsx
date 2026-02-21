"use client";

import React, { useMemo, useState } from "react";
import { UploadCloud, FileSpreadsheet, X } from "lucide-react";

type Props = {
  file: File | null;
  setFile: (f: File | null) => void;
  onUploaded: (count: number) => void;
};

export default function UploadExcelRecipients({
  file,
  setFile,
  onUploaded,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>("");

  const fileMeta = useMemo(() => {
    if (!file) return null;
    const sizeKB = Math.round(file.size / 1024);
    const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB} KB`;
    return { name: file.name, sizeLabel, type: file.type || "Excel/CSV" };
  }, [file]);

  const validateFile = (f: File) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "application/vnd.ms-excel", // xls
      "text/csv", // csv
    ];

    const ext = f.name.split(".").pop()?.toLowerCase();
    const allowedExt = ["xlsx", "xls", "csv"];

    if (!allowed.includes(f.type) && !allowedExt.includes(ext || "")) {
      return "Only .xlsx, .xls, or .csv files are allowed.";
    }

    // optional limit
    const maxMB = 10;
    if (f.size > maxMB * 1024 * 1024) {
      return `File is too large. Max ${maxMB}MB allowed.`;
    }

    return "";
  };

  const setSelectedFile = (f: File | null) => {
    setError("");
    if (!f) {
      setFile(null);
      return;
    }
    const err = validateFile(f);
    if (err) {
      setFile(null);
      setError(err);
      return;
    }
    setFile(f);
  };

  const handleNext = async () => {
    if (!file) {
      setError("Please select an Excel/CSV file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: call your real API here
      const fakeCount = 100;
      onUploaded(fakeCount);
    } catch (e) {
      console.log(e);
      setError("Failed to upload excel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upload Excel
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload a .xlsx / .xls / .csv file. We’ll use it to add recipients automatically.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Dropzone */}
        <label
          className={[
            "group relative flex flex-col items-center justify-center",
            "rounded-xl border-2 border-dashed p-6 sm:p-8 text-center",
            "transition cursor-pointer",
            dragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600",
          ].join(" ")}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
            const dropped = e.dataTransfer.files?.[0];
            setSelectedFile(dropped ?? null);
          }}
        >
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          />

          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800">
            <UploadCloud className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </div>

          <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
            Drag & drop your file here, or{" "}
            <span className="text-blue-600 dark:text-blue-400">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Supported: .xlsx, .xls, .csv (max 10MB)
          </p>
        </label>

        {/* File preview */}
        {fileMeta && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/30">
                <FileSpreadsheet className="w-5 h-5 text-green-700 dark:text-green-400" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {fileMeta.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {fileMeta.sizeLabel} • {fileMeta.type}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleNext}
            disabled={loading || !file}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold
              bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}