"use client";

import React, { useMemo, useState } from "react";
import {
  useGetAllVersionsQuery,
  useCreateVersionMutation,
  useUpdateVersionMutation,
  useDeleteVersionMutation,
} from "@/store/api/Inventory/VirsonAPi";

type Version = {
  id: number;
  name: string;
  description?: string | null;
  status?: number;
  created_at?: string;
};

type ModalMode = "create" | "edit";

export default function VersionsPage() {
  const [page] = useState(1);
  const [limit] = useState(50);
  const [search, setSearch] = useState("");

  const { data, isLoading, isFetching, error, refetch } =
    useGetAllVersionsQuery({
      page,
      limit,
      search: search.trim() || undefined,
    });

  const versions: Version[] = useMemo(() => data?.data ?? [], [data]);

  // modal
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<Version | null>(null);

  // form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createVersion, { isLoading: isCreating }] = useCreateVersionMutation();
  const [updateVersion, { isLoading: isUpdating }] = useUpdateVersionMutation();
  const [deleteVersion, { isLoading: isDeleting }] = useDeleteVersionMutation();

  const busy = isCreating || isUpdating || isDeleting;

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelected(null);
    setMode("create");
  };

  const openCreate = () => {
    resetForm();
    setMode("create");
    setOpen(true);
  };

  const openEdit = (v: Version) => {
    setSelected(v);
    setMode("edit");
    setName(v.name || "");
    setDescription(v.description || "");
    setOpen(true);
  };

  const onSubmit = async () => {
    const n = name.trim();
    if (!n) return;

    try {
      if (mode === "create") {
        await createVersion({
          name: n,
          description: description.trim() || undefined,
          status: 1,
          created_by: 1,
        }).unwrap();
      } else {
        if (!selected?.id) return;

        await updateVersion({
          id: selected.id,
          body: {
            name: n,
            description: description.trim() || undefined,
            status: 1,
            edit_by: 1,
          },
        }).unwrap();
      }

      setOpen(false);
      resetForm();
      refetch();
    } catch (e) {
      console.error(e);
      alert(`Failed to ${mode === "create" ? "create" : "update"} version.`);
    }
  };

  const onDelete = async (v: Version) => {
    const ok = confirm(`Delete version "${v.name}"?`);
    if (!ok) return;

    try {
      await deleteVersion(v.id).unwrap();
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to delete version.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Versions
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage headunit versions (create / update / delete).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search version..."
            className="w-64 max-w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800"
          />

          <button
            onClick={openCreate}
            className="rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            + Create Version
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {isLoading ? "Loading..." : `${versions.length} versions`}
            {isFetching ? " (refreshing...)" : ""}
          </div>

          <button
            onClick={() => refetch()}
            className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="p-4 text-sm text-red-600 dark:text-red-400">
            Failed to load versions.
          </div>
        ) : isLoading ? (
          <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
            Loading versions...
          </div>
        ) : versions.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-400">
            No versions found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {versions.map((v) => (
                  <tr
                    key={v.id}
                    className="border-t border-gray-100 dark:border-gray-900 text-gray-800 dark:text-gray-200"
                  >
                    <td className="px-4 py-3">{v.id}</td>
                    <td className="px-4 py-3 font-medium">{v.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {v.description || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          (v.status ?? 1) === 1
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {(v.status ?? 1) === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(v)}
                        className="text-blue-600 dark:text-blue-400 hover:underline mr-3"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(v)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal (Create / Edit) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!busy) {
                setOpen(false);
                resetForm();
              }
            }}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {mode === "create" ? "Create Version" : `Edit Version #${selected?.id}`}
              </h2>

              <button
                onClick={() => {
                  if (!busy) {
                    setOpen(false);
                    resetForm();
                  }
                }}
                className="rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Name *
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. V6"
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={4}
                  className="mt-1 w-full resize-none rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => {
                  if (!busy) {
                    setOpen(false);
                    resetForm();
                  }
                }}
                className="rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-60"
                disabled={busy}
              >
                Cancel
              </button>

              <button
                onClick={onSubmit}
                disabled={!name.trim() || busy}
                className="rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
              >
                {mode === "create"
                  ? isCreating
                    ? "Creating..."
                    : "Create"
                  : isUpdating
                  ? "Updating..."
                  : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}