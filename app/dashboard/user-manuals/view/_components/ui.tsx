"use client";

import React from "react";

export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function StepCard({
  step,
  title,
  subtitle,
  left,
  right,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
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

        <div className="flex items-center gap-2">
          {left}
          {right}
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}

export function OptionBtn({
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

export function ScrollArea({
  children,
  maxH = "max-h-[320px]",
}: {
  children: React.ReactNode;
  maxH?: string;
}) {
  return <div className={cn(maxH, "overflow-auto pr-1")}>{children}</div>;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  widthClass = "w-40",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  widthClass?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        widthClass,
        "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-gray-800 dark:bg-gray-950"
      )}
    />
  );
}

export function BackBtn({
  onClick,
  label = "Back",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs",
        "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
      )}
    >
      ← {label}
    </button>
  );
}

export function SkipBtn({
  onClick,
  label = "Skip",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs",
        "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
      )}
    >
      {label}
    </button>
  );
}