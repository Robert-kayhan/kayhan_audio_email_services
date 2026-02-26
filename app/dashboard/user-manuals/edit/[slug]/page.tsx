"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";

import FileUpload from "@/components/global/FileUpload";

import { useGetcompanyQuery } from "@/store/api/Inventory/comapnyApi";
import { useGetCarModelsQuery } from "@/store/api/Inventory/carModelAPi";
import { useGetAllVersionsQuery } from "@/store/api/Inventory/VirsonAPi";
import { useGetManualTypesQuery } from "@/store/api/Inventory/usermannulTypesApi"; // ✅ NEW

import {
  useGetUserManualBySlugQuery,
  useUpdateUserManualMutation,
} from "@/store/api/Inventory/userMannul";

export default function EditUserManualPage() {
  const router = useRouter();
  const params = useParams();

  const slug = String(params?.slug || "");

  // ✅ fetch manual by slug
  const {
    data: manualRes,
    isLoading: loadingManual,
    isError: manualError,
    refetch,
  } = useGetUserManualBySlugQuery(slug, { skip: !slug } as any);

  const manual = manualRes?.data ?? manualRes;

  const [updateManual, { isLoading: updating }] = useUpdateUserManualMutation();

  // ✅ form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");

  // ✅ cover images (uploaded urls)
  const [coverImages, setCoverImages] = useState<string[]>([]);

  const [fromYear, setFromYear] = useState<number>(2020);
  const [toYear, setToYear] = useState<number>(2024);
  const [status, setStatus] = useState<number>(1);

  // ✅ select state
  const [companyId, setCompanyId] = useState<number>(0);
  const [modelId, setModelId] = useState<number>(0);
  const [subModelId, setSubModelId] = useState<number>(0);
  const [versionId, setVersionId] = useState<number | "">("");

  // ✅ NEW: manual type
  const [manualTypeId, setManualTypeId] = useState<number | "">("");

  // ✅ companies
  const { data: companyRes, isLoading: companyLoading } = useGetcompanyQuery(
    { page: 1, limit: 500, search: "" },
    { refetchOnMountOrArgChange: true } as any
  );
  const companies = useMemo(() => companyRes?.data ?? [], [companyRes]);

  // ✅ models by company (parent_id = null)
  const { data: modelRes, isLoading: modelLoading } = useGetCarModelsQuery(
    {
      page: 1,
      limit: 500,
      search: "",
      company_id: companyId || undefined,
      parent_id: null,
    } as any,
    { skip: !companyId, refetchOnMountOrArgChange: true } as any
  );
  const models = useMemo(() => modelRes?.data ?? [], [modelRes]);

  // ✅ submodels by modelId
  const { data: subModelRes, isLoading: subModelLoading } = useGetCarModelsQuery(
    {
      page: 1,
      limit: 500,
      search: "",
      company_id: companyId || undefined,
      parent_id: modelId || undefined,
    } as any,
    { skip: !companyId || !modelId, refetchOnMountOrArgChange: true } as any
  );
  const subModels = useMemo(() => subModelRes?.data ?? [], [subModelRes]);

  // ✅ versions
  const { data: versionRes, isLoading: versionLoading } = useGetAllVersionsQuery(
    {
      page: 1,
      limit: 500,
      search: "",
    }
  );
  const versions = useMemo(() => versionRes?.data ?? [], [versionRes]);

  // ✅ NEW: manual types
  const { data: typeRes, isLoading: typeLoading } = useGetManualTypesQuery({
    page: 1,
    search: "",
  } as any);
  const manualTypes = useMemo(() => typeRes?.data ?? [], [typeRes]);

  // ✅ prefill once manual loads
  useEffect(() => {
    if (!manual) return;

    setTitle(manual.title ?? "");
    setContent(manual.content ?? "");

    setCompanyId(Number(manual.company_id || 0));
    setModelId(Number(manual.model_id || 0));
    setSubModelId(Number(manual.sub_model_id || 0));

    setFromYear(Number(manual.from_year || 2020));
    setToYear(Number(manual.to_year || 2024));

    setVersionId(manual.version_id ? Number(manual.version_id) : "");

    // ✅ NEW
    setManualTypeId(manual.manual_type_id ? Number(manual.manual_type_id) : "");

    setStatus(typeof manual.status === "number" ? manual.status : 1);

    if (manual.cover_image) setCoverImages([manual.cover_image]);
    else setCoverImages([]);
  }, [manual]);

  // ✅ Optional reset logic (keep if you want)
  // useEffect(() => {
  //   setModelId(0);
  //   setSubModelId(0);
  // }, [companyId]);

  // useEffect(() => {
  //   setSubModelId(0);
  // }, [modelId]);

  const canSubmit = useMemo(() => {
    const validYears = fromYear >= 1950 && toYear <= 2100 && fromYear <= toYear;

    return (
      title.trim().length > 0 &&
      content.trim().length > 0 &&
      companyId > 0 &&
      modelId > 0 &&
      validYears &&
      manualTypeId !== "" // ✅ required (remove if optional)
    );
  }, [title, content, companyId, modelId, fromYear, toYear, manualTypeId]);

  const onSubmit = async () => {
    if (!manual?.id) {
      toast.error("Manual ID not found.");
      return;
    }

    if (!canSubmit) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      await updateManual({
        id: Number(manual.id),
        data: {
          company_id: companyId,

          model_id: modelId,
          sub_model_id: subModelId || null,

          from_year: fromYear,
          to_year: toYear,
          version_id: versionId === "" ? null : Number(versionId),

          // ✅ NEW
          manual_type_id: manualTypeId === "" ? null : Number(manualTypeId),

          title: title.trim(),
          content,

          cover_image: coverImages?.[0] || null,

          status,
          edit_by: 1,
        },
      }).unwrap();

      toast.success("Manual updated successfully!");
      router.push("/dashboard/user-manuals");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to update manual.");
    }
  };

  if (loadingManual) {
    return (
      <div className="p-6 text-sm text-gray-600 dark:text-gray-400">
        Loading manual...
      </div>
    );
  }

  if (manualError || !manual) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load manual.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Edit User Manual
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Update manual content, years, model/submodel, manual type, version & cover image.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/user-manuals")}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          Back
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Manual title"
              className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
            />
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Content *
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                TinyMCE Editor
              </span>
            </div>

            <div className="mt-2">
              <Editor
                value={content}
                onEditorChange={(val) => setContent(val)}
                apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR}
                init={{
                  height: 520,
                  menubar: false,
                  plugins: ["lists", "link", "code", "table", "wordcount", "autolink"],
                  toolbar:
                    "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table | code",
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4">
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Company *
              </label>
              <select
                value={companyId || ""}
                onChange={(e) => setCompanyId(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
              >
                <option value="">
                  {companyLoading ? "Loading companies..." : "Select company"}
                </option>
                {companies.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Model *
              </label>
              <select
                value={modelId || ""}
                onChange={(e) => setModelId(Number(e.target.value))}
                disabled={!companyId}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none disabled:opacity-60"
              >
                <option value="">
                  {!companyId
                    ? "Select company first"
                    : modelLoading
                    ? "Loading models..."
                    : "Select model"}
                </option>
                {models.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submodel */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Submodel (optional)
              </label>
              <select
                value={subModelId || ""}
                onChange={(e) => setSubModelId(Number(e.target.value))}
                disabled={!companyId || !modelId}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none disabled:opacity-60"
              >
                <option value="">
                  {!modelId
                    ? "Select model first"
                    : subModelLoading
                    ? "Loading submodels..."
                    : subModels.length
                    ? "Select submodel"
                    : "No submodels"}
                </option>
                {subModels.map((sm: any) => (
                  <option key={sm.id} value={sm.id}>
                    {sm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ NEW: Manual Type */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Manual Type *
              </label>
              <select
                value={manualTypeId}
                onChange={(e) =>
                  setManualTypeId(e.target.value ? Number(e.target.value) : "")
                }
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
              >
                <option value="">
                  {typeLoading ? "Loading types..." : "Select manual type"}
                </option>
                {manualTypes.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  From Year *
                </label>
                <input
                  type="number"
                  value={fromYear}
                  onChange={(e) => setFromYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  To Year *
                </label>
                <input
                  type="number"
                  value={toYear}
                  onChange={(e) => setToYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>
            </div>

            {/* Version */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Version (optional)
              </label>
              <select
                value={versionId}
                onChange={(e) => setVersionId(e.target.value ? Number(e.target.value) : "")}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
              >
                <option value="">
                  {versionLoading ? "Loading versions..." : "No version"}
                </option>
                {versions.map((v: any) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Cover Image
              </label>

              <div className="mt-2">
                <FileUpload files={coverImages} setFiles={setCoverImages} />
              </div>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                First image will be saved as cover_image.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={!canSubmit || updating}
            className="w-full rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
          >
            {updating ? "Updating..." : "Update Manual"}
          </button>
        </div>
      </div>
    </div>
  );
}