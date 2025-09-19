"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  FileImage,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useGetJobByBookingIdQuery } from "@/store/api/booking/JobReportApi";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function JobReportViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: existingJob, isLoading } = useGetJobByBookingIdQuery(id);

  const report = existingJob?.report;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100">
        Loading job report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100">
        No job report found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            Job Report
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Technician */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" /> Technician
          </h2>
          <p className="text-gray-200">{report.techName || "—"}</p>
        </section>

        {/* Before / After Photos */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-purple-400" /> Before Photos
            </h2>
            {report.beforePhotos?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.beforePhotos.map((url: string, i: number) => (
                  <Image
                  height={100}
                  width={200}
                    key={i}
                    src={url}
                    alt={`before-${i}`}
                    className="w-full h-40 object-cover rounded-xl shadow-md border border-gray-800"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No before photos</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileImage className="w-5 h-5 text-green-400" /> After Photos
            </h2>
            {report.afterPhotos?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.afterPhotos.map((url: string, i: number) => (
                  <Image
                  height={100}
                  width={200}
                    key={i}
                    src={url}
                    alt={`after-${i}`}
                    className="w-full h-40 object-cover rounded-xl shadow-md border border-gray-800"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No after photos</p>
            )}
          </div>
        </section>

        {/* Notes / Tips */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" /> Notes
            </h2>
            <p className="text-gray-200 whitespace-pre-line">
              {report.notes || "—"}
            </p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" /> Tips & Tricks
            </h2>
            <p className="text-gray-200 whitespace-pre-line">
              {report.tips || "—"}
            </p>
          </div>
        </section>

        {/* Difficulty & Rating */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Difficulty</h2>
            <p className="text-gray-200">{report.difficulty || "—"}</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Customer Rating</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-8 h-8 ${
                    n <= report.customerRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Times */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 grid md:grid-cols-4 gap-6">
          <div>
            <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Arrival Time
            </h2>
            <p className="text-gray-200">{report.arrivalTime || "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Start Time
            </h2>
            <p className="text-gray-200">{report.startTime || "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Completion Time
            </h2>
            <p className="text-gray-200">{report.completionTime || "—"}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-1">Total Duration (mins)</h2>
            <p className="text-gray-200">{report.totalDurationMins || "—"}</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
