"use client";

import React from "react";
import { OptionBtn, ScrollArea, StepCard } from "./ui";

type Item = { id: number; name: string };

export default function StepList({
  step,
  title,
  subtitle,
  left,
  right,
  loading,
  items,
  emptyText,
  activeId,
  onPick,
  colsClass = "grid-cols-1 sm:grid-cols-2",
  maxH,
}: {
  step: number;
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  loading?: boolean;
  items: Item[];
  emptyText: string;
  activeId?: number | null;
  onPick: (id: number) => void;
  colsClass?: string;
  maxH?: string;
}) {
  return (
    <StepCard step={step} title={title} subtitle={subtitle} left={left} right={right}>
      {loading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</div>
      ) : (
        <ScrollArea maxH={maxH}>
          <div className={`grid ${colsClass} gap-2`}>
            {items.map((it) => (
              <OptionBtn
                key={it.id}
                active={activeId === it.id}
                label={it.name}
                onClick={() => onPick(it.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </StepCard>
  );
}