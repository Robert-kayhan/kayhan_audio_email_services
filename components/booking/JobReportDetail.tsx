"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Star,
  User,
  FileImage,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import FileUpload from "../global/FileUpload";

interface JobReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function JobReportModal({
  isOpen,
  onClose,
  onSubmit,
}: JobReportModalProps) {
  const [formData, setFormData] = useState({
    techName: "",
    beforePhotos: [] as string[], // store uploaded URLs
    afterPhotos: [] as string[],
    notes: "",
    difficulty: "",
    customerRating: 0,
    arrivalTime: "",
    startTime: "",
    completionTime: "",
    totalDurationMins: 0,
  });

  // 🔹 Auto-calculate duration
  useEffect(() => {
    if (formData.startTime && formData.completionTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.completionTime);

      if (end > start) {
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        setFormData((prev) => ({ ...prev, totalDurationMins: diffMins }));
      } else {
        setFormData((prev) => ({ ...prev, totalDurationMins: 0 }));
      }
    }
  }, [formData.startTime, formData.completionTime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rating: number) => {
    setFormData({ ...formData, customerRating: rating });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-5xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-blue-500" /> Create Job Report
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Technician */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Technician
            </label>
            <select
              name="techName"
              value={formData.techName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
            >
              <option value="">Select Technician</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Ali Khan">Ali Khan</option>
            </select>
          </div>

          {/* Before Photos */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <FileImage className="w-4 h-4 text-purple-400" /> Before Photos
            </label>
            <FileUpload
              files={formData.beforePhotos}
              setFiles={(urls) => setFormData({ ...formData, beforePhotos: urls })}
            />
          </div>

          {/* After Photos */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <FileImage className="w-4 h-4 text-green-400" /> After Photos
            </label>
            <FileUpload
              files={formData.afterPhotos}
              setFiles={(urls) => setFormData({ ...formData, afterPhotos: urls })}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" /> Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              rows={3}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm mb-2 font-semibold">Difficulty</label>
            <div className="flex flex-wrap gap-3">
              {["Very Easy", "Easy", "Medium", "Hard", "Very Hard"].map((level) => (
                <motion.button
                  key={level}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    formData.difficulty === level
                      ? "bg-blue-600 border-blue-500"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Customer Rating */}
          <div>
            <label className="block text-sm mb-2 font-semibold">Customer Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRating(n)}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <Star
                    className={`w-8 h-8 cursor-pointer transition ${
                      n <= formData.customerRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Times + Auto Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Completion Time
              </label>
              <input
                type="datetime-local"
                name="completionTime"
                value={formData.completionTime}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Auto Duration */}
          <div>
            <label className="block text-sm mb-2 font-semibold">Total Duration (mins)</label>
            <input
              type="text"
              value={formData.totalDurationMins || ""}
              readOnly
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Save Report
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
