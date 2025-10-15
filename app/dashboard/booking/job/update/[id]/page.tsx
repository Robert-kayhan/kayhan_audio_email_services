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
  Loader2,
} from "lucide-react";
import FileUpload from "@/components/global/FileUpload";
import {
  useGetJobByBookingIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useTimeApiMutation,
} from "@/store/api/booking/JobReportApi";
import { useParams, useRouter } from "next/navigation";
import FullPageLoader from "@/components/global/FullPageLoader";

export default function JobReportPage() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ All hooks should always be declared at the top
  const {
    data: existingJob,
    isLoading: isJobLoading,
    refetch,
  } = useGetJobByBookingIdQuery(id);

  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [timeApi] = useTimeApiMutation();

  // ✅ Component state
  const [formData, setFormData] = useState({
    bookingId: id,
    techName: "",
    beforePhotos: [] as string[],
    afterPhotos: [] as string[],
    notes: "",
    tips: "",
    difficulty: "",
    customerRating: 0,
    // arrivalTime: "",
    startTime: "",
    completionTime: "",
    totalDurationMins: 0,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isExisting = !!existingJob?.report;
  const isJobRunning = isRunning && !formData.completionTime;
  const hasAfterPhotos =
    Array.isArray(formData.afterPhotos) && formData.afterPhotos.length > 0;

  // ✅ Load existing job data
  useEffect(() => {
    if (existingJob?.report) {
      const report = existingJob.report;
      setFormData((prev) => ({ ...prev, ...report }));

      // Resume timer if the job is still in progress
      if (report.startTime && !report.completionTime) {
        setIsRunning(true);
        const diff = Math.floor(
          (Date.now() - new Date(report.startTime).getTime()) / 1000
        );
        setElapsedSeconds(diff);
      } else {
        setIsRunning(false);
        setElapsedSeconds((report.totalDurationMins || 0) * 60);
      }
    }
  }, [existingJob]);

  // ✅ Auto-update total duration when start/completion times change
  useEffect(() => {
    if (formData.startTime && formData.completionTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.completionTime);
      if (end > start) {
        const diffSecs = Math.floor((end.getTime() - start.getTime()) / 1000);
        setFormData((prev) => ({
          ...prev,
          totalDurationMins: Math.floor(diffSecs / 60),
        }));
        setElapsedSeconds(diffSecs);
        setIsRunning(false);
      }
    }
  }, [formData.startTime, formData.completionTime]);

  // ✅ Live timer when job is running
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && formData.startTime) {
      timer = setInterval(() => {
        const start = new Date(formData.startTime).getTime();
        const now = Date.now();
        const diffSeconds = Math.floor((now - start) / 1000);
        setElapsedSeconds(diffSeconds);
        setFormData((prev) => ({
          ...prev,
          totalDurationMins: Math.floor(diffSeconds / 60),
        }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, formData.startTime]);

  // ✅ Handlers
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
  console.log(formData.afterPhotos)
  const handleStart = async () => {
    const now = new Date().toISOString();
    setFormData((prev) => ({
      ...prev,
      startTime: now,
      completionTime: "",
    }));
    setElapsedSeconds(0);
    setIsRunning(true);

    try {
      await timeApi({ id, data: { startTime: now } }).unwrap();
    } catch (err) {
      console.error("Failed to start job:", err);
      alert("Failed to update start time on server");
    }
  };

  const handleComplete = async () => {
    const now = new Date().toISOString();
    setFormData((prev) => ({ ...prev, completionTime: now }));
    setIsRunning(false);

    try {
      await timeApi({ id, data: { completionTime: now } }).unwrap();
      // alert("Job completed successfully!");
      // refetch();
    } catch (err) {
      console.error("Failed to complete job:", err);
      alert("Failed to update completion time on server");
    }
  };

  const handleSubmit = async () => {
    if (
      // !formData.arrivalTime ||
      !formData.startTime ||
      !formData.completionTime
    ) {
      alert("Arrival, start and completion times are required.");
      return;
    }

    try {
      if (isExisting) {
        console.log(formData , "this is form data")
        await updateJob({
          id,
          data: {
            techName: formData.techName,
            afterPhotos: formData.afterPhotos,
            notes: formData.notes,
            tips: formData.tips,
            difficulty: formData.difficulty,
            customerRating: formData.customerRating,
            // arrivalTime: formData.arrivalTime,
            startTime: formData.startTime,
            completionTime: formData.completionTime,
            totalDurationMins: formData.totalDurationMins,
            status: "Completed",
          },
        }).unwrap();
        alert("Job Report Updated Successfully!");
      } else {
        await createJob(formData).unwrap();
        alert("Job Report Created Successfully!");
      }
      refetch();
      router.push(`/dashboard/booking/job/${id}`);
    } catch (err: any) {
      console.error(err);
      alert(
        "Failed to save job report: " + (err?.data?.message || err.message)
      );
    }
  };

  // ✅ Loader overlay
  if (isJobLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 text-white z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Loading job report...</p>
        </div>
      </div>
    );
  }

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}m ${secs
      .toString()
      .padStart(2, "0")}s`;
  };

  // ✅ Main UI
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

          {isJobRunning && (
            <div className="flex items-center gap-3 text-green-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <div className="text-sm">
                Running — {formatElapsed(elapsedSeconds)}
              </div>
            </div>
          )}
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
              disabled={isExisting || isJobRunning}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-60"
            >
              <option value="">Select Technician</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Ali Khan">Ali Khan</option>
            </select>
          </div>

          {/* Time controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Arrival Time
              </label>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={formData.arrivalTime ?? ""}
                onChange={handleChange}
                disabled={isJobRunning}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-60"
              />
            </div> */}

            <div className="flex flex-col">
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Start Time
              </label>
              <button
                type="button"
                onClick={handleStart}
                disabled={isRunning || !!formData.startTime}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white disabled:opacity-60"
              >
                {isRunning ? "Running..." : "Start"}
              </button>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm mb-2 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Completion Time
              </label>
              <button
                type="button"
                onClick={handleComplete}
                disabled={!isRunning || !hasAfterPhotos}
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white disabled:opacity-60"
              >
                Complete
              </button>
              {isRunning && !hasAfterPhotos && (
                <p className="mt-2 text-xs text-amber-300">
                  Please upload at least one <strong>After Photo</strong> to
                  enable completion.
                </p>
              )}
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
              disabled={isJobRunning}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-60"
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
              disabled={isJobRunning}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-60"
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
                    disabled={isJobRunning}
                    onClick={() =>
                      setFormData({ ...formData, difficulty: level })
                    }
                    className={`px-4 py-2 rounded-lg border text-sm transition ${
                      formData.difficulty === level
                        ? "bg-blue-600 border-blue-500"
                        : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    } disabled:opacity-60`}
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
                  disabled={isJobRunning}
                  onClick={() => handleRating(n)}
                  className="w-10 h-10 flex items-center justify-center disabled:opacity-60"
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

          {/* Total Duration */}
          <div>
            <label className="block text-sm mb-2 font-semibold">
              Total Duration
            </label>
            <input
              type="text"
              value={
                isRunning
                  ? formatElapsed(elapsedSeconds)
                  : formData.totalDurationMins
                    ? `${formData.totalDurationMins}m`
                    : ""
              }
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
              <FullPageLoader
                show={isCreating || isUpdating}
                message="Updating, please wait..."
              />
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
