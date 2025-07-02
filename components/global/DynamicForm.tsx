"use client";
import React, { useState } from "react";
import { FormField } from "@/util/interface";

type Props = {
  fields: FormField[];
  onSubmit: (formData: Record<string, any>) => void;
  submitLabel?: string;
  initialValues?: Record<string, any>;
};

export default function DynamicForm({
  fields,
  onSubmit,
  submitLabel = "Submit",
  initialValues = {},
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>(
    () =>
      fields.reduce((acc, field) => {
        acc[field.name] = initialValues[field.name] ?? "";
        return acc;
      }, {} as Record<string, any>)
  );

  const handleChange = (
    name: string,
    value: any,
    type: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? !prev[name] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name]}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value, field.type)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name]}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value, field.type)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="">Select</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name]}
              onChange={() => handleChange(field.name, null, field.type)}
              className="h-4 w-4"
            />
          ) : field.type === "radio" ? (
            <div className="flex flex-wrap gap-4">
              {field.options?.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={field.name}
                    value={opt}
                    checked={formData[field.name] === opt}
                    onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value, field.type)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
