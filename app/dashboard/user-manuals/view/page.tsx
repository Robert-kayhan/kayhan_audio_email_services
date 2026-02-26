// app/dashboard/manual-tree/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import { useGetcompanyQuery } from "@/store/api/Inventory/comapnyApi";
import { useGetCarModelsQuery } from "@/store/api/Inventory/carModelAPi";
import { useGetAllVersionsQuery } from "@/store/api/Inventory/VirsonAPi";
import { useGetManualTypesQuery } from "@/store/api/Inventory/usermannulTypesApi";
import { useGetAllUserManualsQuery } from "@/store/api/Inventory/userMannul";

type NodeItem = { id: number; name: string };
type Manual = { id: number; title: string; slug: string; status: number };

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function StepCard({
  step,
  title,
  subtitle,
  right,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-900">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-gray-100 dark:text-gray-900">
            {step}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function OptionBtn({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
        active
          ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
          : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
      )}
    >
      <div className="font-medium">{label}</div>
    </button>
  );
}

export default function Page() {
  // ✅ selected values
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [subModelId, setSubModelId] = useState<number | null>(null); // optional
  const [versionId, setVersionId] = useState<number | null>(null); // optional
  const [manualTypeId, setManualTypeId] = useState<number | null>(null);

  // ✅ searches per step
  const [companySearch, setCompanySearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [versionSearch, setVersionSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  // ✅ companies
  const { data: companyRes, isLoading: companyLoading } = useGetcompanyQuery(
    { page: 1, limit: 500, search: companySearch } as any,
    { refetchOnMountOrArgChange: true } as any
  );
  const companies: NodeItem[] = useMemo(() => companyRes?.data ?? [], [companyRes]);

  // ✅ models (parent_id = null)
  const { data: modelRes, isLoading: modelLoading } = useGetCarModelsQuery(
    {
      page: 1,
      limit: 500,
      search: modelSearch,
      company_id: companyId || undefined,
      parent_id: null,
    } as any,
    { skip: !companyId, refetchOnMountOrArgChange: true } as any
  );
  const models: NodeItem[] = useMemo(() => modelRes?.data ?? [], [modelRes]);

  // ✅ submodels (parent_id = modelId)
  const { data: subRes, isLoading: subLoading } = useGetCarModelsQuery(
    {
      page: 1,
      limit: 500,
      search: subSearch,
      company_id: companyId || undefined,
      parent_id: modelId || undefined,
    } as any,
    { skip: !companyId || !modelId, refetchOnMountOrArgChange: true } as any
  );
  const subModels: NodeItem[] = useMemo(() => subRes?.data ?? [], [subRes]);

  // ✅ versions (global)
  const { data: versionRes, isLoading: versionLoading } = useGetAllVersionsQuery(
    { page: 1, limit: 500, search: versionSearch } as any,
    { refetchOnMountOrArgChange: true } as any
  );
  const versions: NodeItem[] = useMemo(() => versionRes?.data ?? [], [versionRes]);

  // ✅ types (global)
  const { data: typeRes, isLoading: typeLoading } = useGetManualTypesQuery(
    { page: 1, search: typeSearch } as any,
    { refetchOnMountOrArgChange: true } as any
  );
  const manualTypes: NodeItem[] = useMemo(() => typeRes?.data ?? [], [typeRes]);

  // ✅ manuals
  const { data: manualsRes, isLoading: manualsLoading } = useGetAllUserManualsQuery(
    {
      page: 1,
      limit: 100,
      company_id: companyId || undefined,
      model_id: modelId || undefined,
      sub_model_id: subModelId || undefined,
      version_id: versionId || undefined,
      manual_type_id: manualTypeId || undefined,
    } as any,
    {
      skip: !companyId || !modelId || !manualTypeId, // version optional
      refetchOnMountOrArgChange: true,
    } as any
  );

  const manuals: Manual[] = useMemo(() => (manualsRes?.data ?? []) as Manual[], [manualsRes]);

  // ✅ selection handlers (reset next steps)
  const pickCompany = (id: number) => {
    setCompanyId(id);
    setModelId(null);
    setSubModelId(null);
    setVersionId(null);
    setManualTypeId(null);
  };

  const pickModel = (id: number) => {
    setModelId(id);
    setSubModelId(null);
    setVersionId(null);
    setManualTypeId(null);
  };

  const pickSubModel = (id: number | null) => {
    setSubModelId(id);
    setVersionId(null);
    setManualTypeId(null);
  };

  const pickVersion = (id: number | null) => {
    setVersionId(id);
    setManualTypeId(null);
  };

  const pickType = (id: number) => {
    setManualTypeId(id);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-5 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manual Tree (Step-by-step)</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Select one option, then the next step will appear.
          </p>
        </div>

        <Link
          href="/dashboard/user-manuals/create"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          + Create Manual
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT: Tree Steps */}
        <div className="space-y-4">
          {/* 1) Company */}
          <StepCard
            step={1}
            title="Company"
            subtitle="Pick a company"
            right={
              <input
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Search..."
                className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-950"
              />
            }
          >
            {companyLoading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
            ) : companies.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">No companies found.</div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {companies.map((c) => (
                  <OptionBtn
                    key={c.id}
                    active={companyId === c.id}
                    label={c.name}
                    onClick={() => pickCompany(c.id)}
                  />
                ))}
              </div>
            )}
          </StepCard>

          {/* 2) Model (only after company selected) */}
          {companyId ? (
            <StepCard
              step={2}
              title="Model"
              subtitle="Pick a model"
              right={
                <input
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-950"
                />
              }
            >
              {modelLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              ) : models.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No models found.</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {models.map((m) => (
                    <OptionBtn
                      key={m.id}
                      active={modelId === m.id}
                      label={m.name}
                      onClick={() => pickModel(m.id)}
                    />
                  ))}
                </div>
              )}
            </StepCard>
          ) : null}

          {/* 3) Submodel (only after model selected) */}
          {companyId && modelId ? (
            <StepCard
              step={3}
              title="Submodel (optional)"
              subtitle="Pick a submodel or skip"
              right={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => pickSubModel(null)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs",
                      "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                    )}
                  >
                    Skip
                  </button>
                  <input
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-36 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
              }
            >
              {subLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              ) : subModels.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No submodels found. You can continue.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {subModels.map((sm) => (
                    <OptionBtn
                      key={sm.id}
                      active={subModelId === sm.id}
                      label={sm.name}
                      onClick={() => pickSubModel(sm.id)}
                    />
                  ))}
                </div>
              )}
            </StepCard>
          ) : null}

          {/* 4) Version (only after model selected) */}
          {companyId && modelId ? (
            <StepCard
              step={4}
              title="Version (optional)"
              subtitle="Pick a version or skip"
              right={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => pickVersion(null)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs",
                      "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                    )}
                  >
                    Skip
                  </button>
                  <input
                    value={versionSearch}
                    onChange={(e) => setVersionSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-36 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-950"
                  />
                </div>
              }
            >
              {versionLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              ) : versions.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No versions found.</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {versions.map((v) => (
                    <OptionBtn
                      key={v.id}
                      active={versionId === v.id}
                      label={v.name}
                      onClick={() => pickVersion(v.id)}
                    />
                  ))}
                </div>
              )}
            </StepCard>
          ) : null}

          {/* 5) Manual Type (only after model selected) */}
          {companyId && modelId ? (
            <StepCard
              step={5}
              title="Manual Type"
              subtitle="Pick type to show manuals"
              right={
                <input
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-950"
                />
              }
            >
              {typeLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              ) : manualTypes.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">No manual types found.</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {manualTypes.map((t) => (
                    <OptionBtn
                      key={t.id}
                      active={manualTypeId === t.id}
                      label={t.name}
                      onClick={() => pickType(t.id)}
                    />
                  ))}
                </div>
              )}
            </StepCard>
          ) : null}
        </div>

        {/* RIGHT: Manuals list (only after company+model+type selected) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-2 text-sm font-semibold">Manuals</div>

            {!companyId || !modelId || !manualTypeId ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Select Company → Model → Manual Type to load manuals.
              </div>
            ) : manualsLoading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading manuals...</div>
            ) : manuals.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No manuals found for this selection.
              </div>
            ) : (
              <div className="space-y-2">
                {manuals.map((m) => (
                  <Link
                    key={m.id}
                    href={`/dashboard/user-manuals/${m.slug}`}
                    className="block rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                  >
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {m.slug} • {m.status === 1 ? "Active" : "Inactive"}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Optional info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
            Submodel and Version are optional. If you skip them, it will show manuals
            without filtering by those fields.
          </div>
        </div>
      </div>
    </main>
  );
}