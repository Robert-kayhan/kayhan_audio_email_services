"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetAllUserManualsQuery,
  useDeleteUserManualMutation,
} from "@/store/api/Inventory/userMannul";

type Manual = {
  id: number;
  title: string;
  slug: string;
  from_year: number;
  to_year: number;
  company_id: number;
  car_model_id: number;
  version_id?: number | null;
  status?: number;
};

export default function UserManualsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, error, refetch } =
    useGetAllUserManualsQuery({
      page,
      limit,
      search: search.trim() || undefined,
    });

  const [deleteManual] = useDeleteUserManualMutation();

  const manuals: Manual[] = useMemo(() => data?.data ?? [], [data]);
  const totalPages = useMemo(() => data?.pagination?.totalPages ?? 1, [data]);

  // ✅ Delete handler
  const handleDelete = async (id: number) => {
    const ok = confirm("Are you sure you want to delete this manual?");
    if (!ok) return;

    try {
      await deleteManual(id).unwrap();
      toast.success("Manual deleted");
      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            User Manuals
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage manuals (blog-style content).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search manual..."
            className="w-72 max-w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
          />

          <button
            onClick={() => router.push("/dashboard/user-manuals/create")}
            className="rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            + Create Manual
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {isLoading ? "Loading..." : `${manuals.length} manuals`}
            {isFetching ? " (refreshing...)" : ""}
          </div>
        </div>

        {error ? (
          <div className="p-4 text-sm text-red-600 dark:text-red-400">
            Failed to load manuals.
          </div>
        ) : isLoading ? (
          <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
            Loading manuals...
          </div>
        ) : manuals.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-400">
            No manuals found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {manuals.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t border-gray-100 dark:border-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3">{m.id}</td>
                    <td className="px-4 py-3 font-medium">{m.title}</td>
                    <td className="px-4 py-3">{m.slug}</td>
                    <td className="px-4 py-3">
                      {m.from_year} - {m.to_year}
                    </td>
                    <td className="px-4 py-3">{m.company_id}</td>
                    <td className="px-4 py-3">{m.car_model_id}</td>
                    <td className="px-4 py-3">{m.version_id ?? "-"}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          (m.status ?? 1) === 1
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {(m.status ?? 1) === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ✅ ACTIONS */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/user-manuals/edit/${m.slug}`)
                          }
                          className="text-xs px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm"
        >
          Previous
        </button>

        <div className="text-sm">
          Page {page} of {totalPages}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}