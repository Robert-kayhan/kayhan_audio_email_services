"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useGetcompanyQuery } from "@/store/api/Inventory/comapnyApi";
import { useGetCarModelsQuery } from "@/store/api/Inventory/carModelAPi";
import { useGetAllVersionsQuery } from "@/store/api/Inventory/VirsonAPi";
import { useGetManualTypesQuery } from "@/store/api/Inventory/usermannulTypesApi";
import {
  useGetAllUserManualsQuery,
  useGetManualYearsQuery,
} from "@/store/api/Inventory/userMannul";

/**
 * ✅ SIDEBAR EXPAND LIKE YOUR SCREENSHOT
 * - Left sidebar: Company list (accordion)
 * - Click company -> expand models
 * - Click model -> if submodels exist: expand submodels, else show years directly
 * - NO SKIP BUTTONS (no skipping allowed)
 *   Only special case: if submodels do not exist -> submodel step is not shown
 *   If versions list is empty -> version step is not shown (auto move to types)
 * - Right side: Manuals result
 */

type NodeItem = { id: number; name: string };
type Manual = { id: number; title: string; slug: string; status: number };

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function SidebarItem({
  active,
  indent = 0,
  leftIcon,
  label,
  right,
  onClick,
}: {
  active?: boolean;
  indent?: number;
  leftIcon?: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm transition",
        "hover:bg-white/10",
        active ? "bg-white/10" : ""
      )}
      style={{ paddingLeft: 12 + indent * 14 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {leftIcon ? <span className="opacity-80">{leftIcon}</span> : null}
          <span className="truncate">{label}</span>
        </div>
        {right ? <span className="shrink-0 opacity-80">{right}</span> : null}
      </div>
    </button>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-white/60">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="px-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <span className="text-xs text-white/60">🔎</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-900">
        <div className="text-sm font-semibold">{title}</div>
        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function Page() {
  // selection (final)
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [modelId, setModelId] = useState<number | null>(null);
  const [subModelId, setSubModelId] = useState<number | null>(null); // only used if submodels exist
  const [year, setYear] = useState<number | null>(null);
  const [versionId, setVersionId] = useState<number | null>(null); // required only if versions exist
  const [manualTypeId, setManualTypeId] = useState<number | null>(null);

  // sidebar expand states
  const [openCompanyId, setOpenCompanyId] = useState<number | null>(null);
  const [openModelId, setOpenModelId] = useState<number | null>(null);

  // searches
  const [companySearch, setCompanySearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [yearSearch, setYearSearch] = useState("");
  const [versionSearch, setVersionSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  /* =========================
     FETCH: companies
  ========================= */
  const { data: companyRes, isLoading: companyLoading } = useGetcompanyQuery(
    { page: 1, limit: 500, search: companySearch } as any,
    { refetchOnMountOrArgChange: true } as any
  );
  const companies: NodeItem[] = useMemo(() => companyRes?.data ?? [], [companyRes]);

  /* =========================
     FETCH: models (only for open company)
  ========================= */
  const { data: modelRes, isLoading: modelLoading } = useGetCarModelsQuery(
    {
      page: 1,
      limit: 500,
      search: modelSearch,
      company_id: openCompanyId || undefined,
      parent_id: null,
    } as any,
    { skip: !openCompanyId, refetchOnMountOrArgChange: true } as any
  );
  const models: NodeItem[] = useMemo(() => modelRes?.data ?? [], [modelRes]);

  /* =========================
     FETCH: submodels (only for open company+model)
  ========================= */
  const { data: subRes, isLoading: subLoading } = useGetCarModelsQuery(
    {
      page: 1,
      limit: 500,
      search: subSearch,
      company_id: openCompanyId || undefined,
      parent_id: openModelId || undefined,
    } as any,
    { skip: !openCompanyId || !openModelId, refetchOnMountOrArgChange: true } as any
  );
  const subModels: NodeItem[] = useMemo(() => subRes?.data ?? [], [subRes]);

  const hasSubModels = !!(openCompanyId && openModelId && !subLoading && subModels.length > 0);

  /* =========================
     FETCH: years (depends on selected company+model; include submodel if exists)
  ========================= */
  const yearsArgs = useMemo(() => {
    if (!companyId || !modelId) return null;
    return {
      company_id: companyId,
      model_id: modelId,
      sub_model_id: hasSubModels ? subModelId || undefined : undefined,
    };
  }, [companyId, modelId, hasSubModels, subModelId]);

  const { data: yearsRes, isLoading: yearsLoading } = useGetManualYearsQuery(yearsArgs as any, {
    skip: !yearsArgs,
    refetchOnMountOrArgChange: true,
  } as any);

  const years: number[] = useMemo(() => (yearsRes?.years ?? []) as number[], [yearsRes]);

  const filteredYears = useMemo(() => {
    const q = yearSearch.trim();
    if (!q) return years;
    return years.filter((y) => String(y).includes(q));
  }, [years, yearSearch]);

  /* =========================
     FETCH: versions (global)
     - If your API should be filtered by company/model/year, add args here.
  ========================= */
  const { data: versionRes, isLoading: versionLoading } = useGetAllVersionsQuery(
    { page: 1, limit: 500, search: versionSearch } as any,
    { refetchOnMountOrArgChange: true } as any
  );
  const versions: NodeItem[] = useMemo(() => versionRes?.data ?? [], [versionRes]);
  const hasVersions = versions.length > 0;

  /* =========================
     FETCH: types (global)
  ========================= */
  const { data: typeRes, isLoading: typeLoading } = useGetManualTypesQuery(
    { page: 1, search: typeSearch } as any,
    { refetchOnMountOrArgChange: true } as any
  );
  const manualTypes: NodeItem[] = useMemo(() => typeRes?.data ?? [], [typeRes]);

  /* =========================
     MANUALS (requires Year + Type; and Version if versions exist)
  ========================= */
  const mustPickVersion = hasVersions; // "no skipping"
  const canFetchManuals =
    !!companyId &&
    !!modelId &&
    !!year &&
    !!manualTypeId &&
    (!mustPickVersion || (mustPickVersion && versionId !== null));

  const { data: manualsRes, isLoading: manualsLoading } = useGetAllUserManualsQuery(
    {
      page: 1,
      limit: 100,
      company_id: companyId || undefined,
      model_id: modelId || undefined,
      sub_model_id: hasSubModels ? subModelId || undefined : undefined,
      year: year || undefined,
      version_id: mustPickVersion ? versionId || undefined : undefined,
      manual_type_id: manualTypeId || undefined,
    } as any,
    { skip: !canFetchManuals, refetchOnMountOrArgChange: true } as any
  );

  const manuals: Manual[] = useMemo(() => (manualsRes?.data ?? []) as Manual[], [manualsRes]);

  /* =========================
     CLICK HANDLERS (no skip)
  ========================= */
  const clearFromCompany = () => {
    setCompanyId(null);
    setModelId(null);
    setSubModelId(null);
    setYear(null);
    setVersionId(null);
    setManualTypeId(null);
    setOpenCompanyId(null);
    setOpenModelId(null);
  };

  const clearAfterCompany = () => {
    setModelId(null);
    setSubModelId(null);
    setYear(null);
    setVersionId(null);
    setManualTypeId(null);
    setOpenModelId(null);
  };

  const clearAfterModel = () => {
    setSubModelId(null);
    setYear(null);
    setVersionId(null);
    setManualTypeId(null);
  };

  const clearAfterSubmodel = () => {
    setYear(null);
    setVersionId(null);
    setManualTypeId(null);
  };

  const clearAfterYear = () => {
    setVersionId(null);
    setManualTypeId(null);
  };

  const clearAfterVersion = () => {
    setManualTypeId(null);
  };

  const onClickCompany = (id: number) => {
    const willOpen = openCompanyId === id ? null : id;
    setOpenCompanyId(willOpen);

    if (willOpen === null) {
      clearFromCompany();
      return;
    }

    // select company and reset rest
    setCompanyId(id);
    clearAfterCompany();
  };

  const onClickModel = (id: number) => {
    const willOpen = openModelId === id ? null : id;
    setOpenModelId(willOpen);

    if (willOpen === null) {
      setModelId(null);
      clearAfterModel();
      return;
    }

    setModelId(id);
    clearAfterModel();
  };

  const onPickSubmodel = (id: number) => {
    setSubModelId(id);
    clearAfterSubmodel();
  };

  const onPickYear = (y: number) => {
    setYear(y);
    clearAfterYear();
  };

  const onPickVersion = (id: number) => {
    setVersionId(id);
    clearAfterVersion();
  };

  const onPickType = (id: number) => {
    setManualTypeId(id);
  };

  /**
   * ✅ Auto-behavior:
   * - If no submodels => subModelId forced to null (submodel step disappears)
   */
  useEffect(() => {
    if (!companyId || !modelId) return;
    if (subLoading) return;
    if (!hasSubModels) {
      // no submodels for this model
      setSubModelId(null);
    }
  }, [companyId, modelId, subLoading, hasSubModels]);

  /* =========================
     LABELS for right panel
  ========================= */
  const companyLabel = useMemo(
    () => companies.find((c) => c.id === companyId)?.name,
    [companies, companyId]
  );
  const modelLabel = useMemo(
    () => models.find((m) => m.id === modelId)?.name,
    [models, modelId]
  );
  const subLabel = useMemo(
    () => subModels.find((s) => s.id === subModelId)?.name,
    [subModels, subModelId]
  );
  const versionLabel = useMemo(
    () => versions.find((v) => v.id === versionId)?.name,
    [versions, versionId]
  );
  const typeLabel = useMemo(
    () => manualTypes.find((t) => t.id === manualTypeId)?.name,
    [manualTypes, manualTypeId]
  );

  /* =========================
     UI
  ========================= */
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Top header */}
      <div className="border-b border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold">Manual Tree</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sidebar expand like your screenshot (no skip; submodel only shows if exists).
            </p>
          </div>

          <Link
            href="/dashboard/user-manuals/create"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            + Create Manual
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-5 lg:grid-cols-12">
        {/* LEFT SIDEBAR (like screenshot) */}
        <aside className="lg:col-span-4">
          <div className="rounded-2xl bg-neutral-950 p-3 text-white shadow-sm">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                📄 <span>Companies</span>
              </div>

              <button
                type="button"
                onClick={clearFromCompany}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
              >
                Reset
              </button>
            </div>

            <SidebarSearch
              value={companySearch}
              onChange={setCompanySearch}
              placeholder="Search company..."
            />

            <SidebarSection title="List">
              {companyLoading ? (
                <div className="px-3 py-2 text-sm text-white/60">Loading...</div>
              ) : companies.length === 0 ? (
                <div className="px-3 py-2 text-sm text-white/60">No companies found.</div>
              ) : (
                companies.map((c) => {
                  const open = openCompanyId === c.id;

                  return (
                    <div key={c.id} className="space-y-1">
                      <SidebarItem
                        active={companyId === c.id}
                        label={c.name}
                        right={<span className="text-xs">{open ? "▾" : "▸"}</span>}
                        onClick={() => onClickCompany(c.id)}
                      />

                      {/* MODELS */}
                      {open ? (
                        <div className="space-y-1">
                          <div className="px-3 pt-1">
                            <SidebarSearch
                              value={modelSearch}
                              onChange={setModelSearch}
                              placeholder="Search model..."
                            />
                          </div>

                          {modelLoading ? (
                            <div className="px-3 py-2 text-sm text-white/60">
                              Loading models...
                            </div>
                          ) : models.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-white/60">No models.</div>
                          ) : (
                            models.map((m) => {
                              const mOpen = openModelId === m.id;

                              return (
                                <div key={m.id} className="space-y-1">
                                  <SidebarItem
                                    indent={1}
                                    active={modelId === m.id}
                                    label={m.name}
                                    right={<span className="text-xs">{mOpen ? "▾" : "▸"}</span>}
                                    onClick={() => onClickModel(m.id)}
                                  />

                                  {/* SUBMODEL OR YEAR */}
                                  {mOpen ? (
                                    <div className="space-y-2">
                                      {/* SUBMODELS (ONLY IF EXISTS) */}
                                      {subLoading ? (
                                        <div className="px-3 py-2 text-sm text-white/60">
                                          <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                            Loading submodels...
                                          </span>
                                        </div>
                                      ) : hasSubModels ? (
                                        <div className="space-y-1">
                                          <div className="px-3 pt-1">
                                            <SidebarSearch
                                              value={subSearch}
                                              onChange={setSubSearch}
                                              placeholder="Search submodel..."
                                            />
                                          </div>

                                          <div className="space-y-1">
                                            {subModels.map((sm) => (
                                              <SidebarItem
                                                key={sm.id}
                                                indent={2}
                                                active={subModelId === sm.id}
                                                label={sm.name}
                                                onClick={() => onPickSubmodel(sm.id)}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      ) : null}

                                      {/* YEARS (required) */}
                                      {/* Show years if:
                                          - no submodels (auto) OR submodel selected
                                       */}
                                      {(!hasSubModels || (hasSubModels && !!subModelId)) ? (
                                        <div className="space-y-1">
                                          <div className="px-3 pt-2">
                                            <SidebarSearch
                                              value={yearSearch}
                                              onChange={setYearSearch}
                                              placeholder="Search year..."
                                            />
                                          </div>

                                          {yearsLoading ? (
                                            <div className="px-3 py-2 text-sm text-white/60">
                                              <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                                Loading years...
                                              </span>
                                            </div>
                                          ) : filteredYears.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-white/60">
                                              <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                                No years.
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              {filteredYears.map((y) => (
                                                <SidebarItem
                                                  key={y}
                                                  indent={2}
                                                  active={year === y}
                                                  label={String(y)}
                                                  onClick={() => onPickYear(y)}
                                                />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="px-3 py-2 text-xs text-white/50">
                                          <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                            Select submodel to see years
                                          </span>
                                        </div>
                                      )}

                                      {/* VERSION (NO SKIP: only show if versions exist) */}
                                      {year ? (
                                        hasVersions ? (
                                          <div className="space-y-1">
                                            <div className="px-3 pt-2">
                                              <SidebarSearch
                                                value={versionSearch}
                                                onChange={setVersionSearch}
                                                placeholder="Search version..."
                                              />
                                            </div>

                                            {versionLoading ? (
                                              <div className="px-3 py-2 text-sm text-white/60">
                                                <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                                  Loading versions...
                                                </span>
                                              </div>
                                            ) : (
                                              <div className="space-y-1">
                                                {versions.map((v) => (
                                                  <SidebarItem
                                                    key={v.id}
                                                    indent={2}
                                                    active={versionId === v.id}
                                                    label={v.name}
                                                    onClick={() => onPickVersion(v.id)}
                                                  />
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ) : null
                                      ) : null}

                                      {/* TYPE (required) */}
                                      {year && (!mustPickVersion || (mustPickVersion && !!versionId)) ? (
                                        <div className="space-y-1">
                                          <div className="px-3 pt-2">
                                            <SidebarSearch
                                              value={typeSearch}
                                              onChange={setTypeSearch}
                                              placeholder="Search type..."
                                            />
                                          </div>

                                          {typeLoading ? (
                                            <div className="px-3 py-2 text-sm text-white/60">
                                              <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                                Loading types...
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              {manualTypes.map((t) => (
                                                <SidebarItem
                                                  key={t.id}
                                                  indent={2}
                                                  active={manualTypeId === t.id}
                                                  label={t.name}
                                                  onClick={() => onPickType(t.id)}
                                                />
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ) : year ? (
                                        mustPickVersion ? (
                                          <div className="px-3 py-2 text-xs text-white/50">
                                            <span style={{ paddingLeft: 12 + 2 * 14 }}>
                                              Select version to see types
                                            </span>
                                          </div>
                                        ) : null
                                      ) : null}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </SidebarSection>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <section className="lg:col-span-8 space-y-4">
          <Card
            title="Selected"
            right={
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {canFetchManuals ? "Ready" : "Incomplete"}
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs text-gray-500">Company</div>
                <div className="font-semibold">{companyLabel || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Model</div>
                <div className="font-semibold">{modelLabel || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Submodel</div>
                <div className="font-semibold">
                  {hasSubModels ? subLabel || "-" : "No submodels"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Year</div>
                <div className="font-semibold">{year || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Version</div>
                <div className="font-semibold">
                  {mustPickVersion ? versionLabel || "-" : "No versions"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Type</div>
                <div className="font-semibold">{typeLabel || "-"}</div>
              </div>
            </div>
          </Card>

          <Card
            title="Manuals"
            right={
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                {manualsLoading ? "Loading…" : `${manuals.length} found`}
              </span>
            }
          >
            {!companyId || !modelId ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Select Company → Model from sidebar.
              </div>
            ) : hasSubModels && !subModelId ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                This model has submodels. Select Submodel.
              </div>
            ) : !year ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Select Year.</div>
            ) : mustPickVersion && !versionId ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Select Version.</div>
            ) : !manualTypeId ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Select Manual Type.</div>
            ) : manualsLoading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading manuals...</div>
            ) : manuals.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No manuals found for this selection.
              </div>
            ) : (
              <div className="max-h-[640px] overflow-auto space-y-2 pr-1">
                {manuals.map((m) => (
                  <Link
                    key={m.id}
                    href={`/dashboard/user-manuals/${m.slug}`}
                    className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold">{m.title}</div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          m.status === 1
                            ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                        )}
                      >
                        {m.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {m.slug} • Year: {year}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}