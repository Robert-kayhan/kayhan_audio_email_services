"use client";

import React from "react";
import { OptionBtn, ScrollArea, SearchInput, SkipBtn, StepCard } from "./ui";

type Item = { id: number; name: string };

export default function SubmodelStep({
  step,
  show,
  left,
  loading,
  items,
  search,
  onSearch,
  activeId,
  onPick,
  onSkip,
}: {
  step: number;
  show: boolean;
  left?: React.ReactNode;
  loading: boolean;
  items: Item[];
  search: string;
  onSearch: (v: string) => void;
  activeId: number | null;
  onPick: (id: number) => void;
  onSkip: () => void;
}) {
  if (!show) return null;

  return (
    <StepCard
      step={step}
      title="Submodel (optional)"
      subtitle="Pick a submodel or skip"
      left={left}
      right={
        <div className="flex items-center gap-2">
          <SkipBtn onClick={onSkip} />
          <SearchInput value={search} onChange={onSearch} widthClass="w-36" />
        </div>
      }
    >
      {loading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      ) : (
        <ScrollArea>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map((sm) => (
              <OptionBtn
                key={sm.id}
                active={activeId === sm.id}
                label={sm.name}
                onClick={() => onPick(sm.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </StepCard>
  );
}