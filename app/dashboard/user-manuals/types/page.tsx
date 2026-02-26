// app/dashboard/manual-types/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  useGetManualTypesQuery,
  useCreateManualTypeMutation,
  useUpdateManualTypeMutation,
  useDeleteManualTypeMutation,
} from "@/store/api/Inventory/usermannulTypesApi";

type ManualType = {
  id: number;
  name: string;
  slug: string;
  status: number;
  created_at?: string;
  updated_at?: string;
};

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            className="rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-900"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit] = useState(15);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState(""); // optional now
  const [formStatus, setFormStatus] = useState<number>(1);
  const [editId, setEditId] = useState<number | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetManualTypesQuery({
    page,
    search,
  });

  const [createManualType, { isLoading: creating }] =
    useCreateManualTypeMutation();
  const [updateManualType, { isLoading: updating }] =
    useUpdateManualTypeMutation();
  const [deleteManualType, { isLoading: deleting }] =
    useDeleteManualTypeMutation();

  const rows: ManualType[] = useMemo(() => {
    return (data?.data ?? []) as ManualType[];
  }, [data]);

  const total = Number(data?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setFormStatus(1);
    setEditId(null);
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (item: ManualType) => {
    setEditId(item.id);
    setFormName(item.name);
    setFormSlug(item.slug);
    setFormStatus(item.status ?? 1);
    setEditOpen(true);
  };

  const handleCreate = async () => {
    const name = formName.trim();
    const slug = formSlug.trim(); // optional

    if (!name) {
      alert("Name is required");
      return;
    }

    const payload: any = { name, status: formStatus };
    if (slug) payload.slug = slug;

    try {
      await createManualType(payload).unwrap();
      setCreateOpen(false);
      resetForm();
    } catch (e: any) {
      alert(e?.data?.message || "Failed to create");
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;

    const name = formName.trim();
    const slug = formSlug.trim(); // optional

    if (!name) {
      alert("Name is required");
      return;
    }

    const payload: any = { id: editId, name, status: formStatus };
    if (slug) payload.slug = slug;

    try {
      await updateManualType(payload).unwrap();
      setEditOpen(false);
      resetForm();
    } catch (e: any) {
      alert(e?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    const ok = confirm("Are you sure you want to delete this manual type?");
    if (!ok) return;

    try {
      await deleteManualType(id).unwrap();
    } catch (e: any) {
      alert(e?.data?.message || "Failed to delete");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manual Types</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage manual types (create, edit, delete)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
            type="button"
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={openCreate}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
            type="button"
          >
            + Create
          </button>
        </div>
      </div>

      {/* Search + Stats */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or slug..."
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-gray-700"
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? "Loading..." : `${total} total`}
          {isFetching ? " • updating" : ""}
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-400" colSpan={5}>
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-gray-600 dark:text-gray-400" colSpan={5}>
                    No manual types found.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-950/40"
                  >
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {item.slug}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          item.status === 1
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {item.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                          type="button"
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm dark:border-gray-800">
          <div className="text-gray-600 dark:text-gray-400">
            Page <span className="font-medium text-gray-900 dark:text-gray-100">{page}</span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {totalPages}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              type="button"
            >
              Prev
            </button>
            <button
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        open={createOpen}
        title="Create Manual Type"
        onClose={() => setCreateOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
              Name *
            </label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-gray-700"
              placeholder="e.g. Installation Manual"
            />
          </div>

      

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
              Status
            </label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-gray-700"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setCreateOpen(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
              type="button"
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              type="button"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        title="Update Manual Type"
        onClose={() => setEditOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
              Name *
            </label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-gray-700"
            />
          </div>

      

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
              Status
            </label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-gray-700"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
              type="button"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              type="button"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}