"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  User,
  FileImage,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import FileUpload from "@/components/global/FileUpload";
import {
  useGetJobByBookingIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
} from "@/store/api/booking/JobReportApi";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
export default function JobReportPage() {
  const { id } = useParams();

  // get existing job by bookingId
  const {
    data: existingJob,
    isLoading: isJobLoading,
    refetch,
  } = useGetJobByBookingIdQuery(id);

  const [formData, setFormData] = useState({
    bookingId: id,
    techName: "",
    beforePhotos: [] as string[],
    afterPhotos: [] as string[],
    notes: "",
    tips: "",
    difficulty: "",
    customerRating: 0,
    arrivalTime: "",
    startTime: "",
    completionTime: "",
    totalDurationMins: 0,
  });

  // live timer state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMins, setElapsedMins] = useState(0);

  // mutations
  const router = useRouter()
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const isExisting = !!existingJob?.report;

  // preload when existing job arrives
  useEffect(() => {
    if (existingJob?.report) {
      setFormData((prev) => ({
        ...prev,
        ...existingJob.report,
      }));
      setIsRunning(false);
      setElapsedMins(existingJob.report.totalDurationMins || 0);
    }
  }, [existingJob]);

  // Auto-calc total duration if start & completion filled
  useEffect(() => {
    if (formData.startTime && formData.completionTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.completionTime);
      if (end > start) {
        const diffMins = Math.floor((end.getTime() - start.getTime()) / 60000);
        setFormData((prev) => ({ ...prev, totalDurationMins: diffMins }));
        setElapsedMins(diffMins);
        setIsRunning(false);
      } else {
        setFormData((prev) => ({ ...prev, totalDurationMins: 0 }));
        setElapsedMins(0);
      }
    }
  }, [formData.startTime, formData.completionTime]);

  // timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && formData.startTime) {
      timer = setInterval(() => {
        const start = new Date(formData.startTime).getTime();
        const now = Date.now();
        const diffMins = Math.floor((now - start) / 60000);
        setElapsedMins(diffMins);
        setFormData((prev) => ({ ...prev, totalDurationMins: diffMins }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, formData.startTime]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rating: number) => {
    setFormData({ ...formData, customerRating: rating });
  };

  const handleStart = () => {
    const now = new Date().toISOString();
    setFormData((prev) => ({
      ...prev,
      startTime: now,
      completionTime: "",
    }));
    setElapsedMins(0);
    setIsRunning(true);
  };

  const handleComplete = () => {
    const now = new Date().toISOString();
    setFormData((prev) => ({
      ...prev,
      completionTime: now,
    }));
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.arrivalTime ||
      !formData.startTime ||
      !formData.completionTime
    ) {
      alert(
        "Arrival, start and completion times are required for a completed job"
      );
      return;
    }
    if (formData.totalDurationMins && Number(formData.totalDurationMins) <= 0) {
      alert("Total duration must be greater than 0");
      return;
    }
    if (formData.afterPhotos && !Array.isArray(formData.afterPhotos)) {
      alert("After photos must be an array");
      return;
    }
    try {
      console.log(id);
      if (isExisting) {
        await updateJob({
          id: id,
          data: {
            techName: formData.techName,
            afterPhotos: formData.afterPhotos,
            notes: formData.notes,
            tips: formData.tips,
            difficulty: formData.difficulty,
            customerRating: formData.customerRating,
            arrivalTime: formData.arrivalTime,
            startTime: formData.startTime,
            completionTime: formData.completionTime,
            totalDurationMins: formData.totalDurationMins,
            status: "Completed",
          },
        }).unwrap();
        alert("Job Report Updated Successfully!");
      }
      refetch();
      router.push(`/dashboard/booking/job/${id}`)
    } catch (err: any) {
      console.error(err);
      alert(
        "Failed to save job reportss: " + (err?.data?.message || err.message)
      );
    }
  };

  if (isJobLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading job report...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg"
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-blue-500" /> Job Report
          </h1>
        </div>

        <div className="space-y-6">
          {/* Technician */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Technician
            </label>
            <select
              name="techName"
              value={formData.techName}
              onChange={handleChange}
              disabled={isExisting}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-60"
            >
              <option value="">Select Technician</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Ali Khan">Ali Khan</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Arrival Time
              </label>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={formData.arrivalTime ?? ""}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Start Time
              </label>
              {/* <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                readOnly
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              /> */}
              <button
                type="button"
                onClick={handleStart}
                disabled={isRunning}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white disabled:opacity-60"
              >
                Start
              </button>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Completion Time
              </label>
              {/* <input
                type="datetime-local"
                name="completionTime"
                value={formData.completionTime}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              /> */}
              <button
                type="button"
                onClick={handleComplete}
                disabled={!isRunning}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white disabled:opacity-60"
              >
                Complete
              </button>
            </div>
          </div>
          {/* After Photos */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <FileImage className="w-4 h-4 text-green-400" /> After Photos
            </label>
            <FileUpload
              files={formData.afterPhotos}
              setFiles={(urls) =>
                setFormData({ ...formData, afterPhotos: urls })
              }
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" /> Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes ?? ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              rows={3}
            />
          </div>

          {/* Tips */}
          <div>
            <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Tips & Tricks
            </label>
            <textarea
              name="tips"
              value={formData.tips}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              rows={2}
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm mb-2 font-semibold">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-3">
              {["Very Easy", "Easy", "Medium", "Hard", "Very Hard"].map(
                (level) => (
                  <motion.button
                    key={level}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setFormData({ ...formData, difficulty: level })
                    }
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      formData.difficulty === level
                        ? "bg-blue-600 border-blue-500"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    }`}
                  >
                    {level}
                  </motion.button>
                )
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm mb-2 font-semibold">
              Customer Rating
            </label>
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

          {/* Times */}

          {/* Auto Duration */}
          <div>
            <label className="block text-sm mb-2 font-semibold">
              Total Duration (mins)
            </label>
            <input
              type="text"
              value={isRunning ? elapsedMins : formData.totalDurationMins ?? ""}
              readOnly
              className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-gray-300"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isCreating || isUpdating}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
                isCreating || isUpdating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {isCreating || isUpdating
                ? "Saving..."
                : isExisting
                  ? "Update Report"
                  : "Save Report"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
