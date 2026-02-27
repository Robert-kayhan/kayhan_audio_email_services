"use client";

import React, { useMemo } from "react";
import { OptionBtn, ScrollArea, SearchInput, StepCard } from "./ui";

export default function YearStep({
  step,
  show,
  left,
  loading,
  years,
  search,
  onSearch,
  activeYear,
  onPick,
}: {
  step: number;
  show: boolean;
  left?: React.ReactNode;
  loading: boolean;
  years: number[];
  search: string;
  onSearch: (v: string) => void;
  activeYear: number | null;
  onPick: (y: number) => void;
}) {
  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return years;
    return years.filter((y) => String(y).includes(q));
  }, [years, search]);

  if (!show) return null;

  return (
    <StepCard
      step={step}
      title="Year (required)"
      subtitle="Pick a year to continue"
      left={left}
      right={<SearchInput value={search} onChange={onSearch} widthClass="w-28" />}
    >
      {loading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      ) : years.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No years found for this selection.
        </div>
      ) : (
        <ScrollArea maxH="max-h-[220px]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {filtered.map((y) => (
              <OptionBtn
                key={y}
                active={activeYear === y}
                label={String(y)}
                onClick={() => onPick(y)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </StepCard>
  );
}