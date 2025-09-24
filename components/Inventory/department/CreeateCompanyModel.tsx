"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  useCreatecompanyMutation,
  useUpdatecompanyMutation,
} from "@/store/api/Inventory/comapnyApi";
import { useGetDepartmentQuery } from "@/store/api/Inventory/DepartmentAPi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId?: number; // for updating
  name?: string;
  description?: string;
  department_id?: number; // prefill if updating
  onSave?: (data: {
    name: string;
    description: string;
    department_id: string | number;
  }) => void;
}

export default function CreateModel({
  isOpen,
  onClose,
  categoryId,
  name = "",
  description = "",
  department_id = 0,
  onSave,
}: Props) {
  const [values, setValues] = React.useState({
    name,
    description,
    department_id: department_id || "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [createcompany] = useCreatecompanyMutation();
  const [updatecompany] = useUpdatecompanyMutation();
  const { data } = useGetDepartmentQuery({});
  console.log(data?.data, "this is data");

  React.useEffect(() => {
    setValues({
      name,
      description,
      department_id: department_id || "",
    });
  }, [name, description, department_id, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!values.department_id) {
      setErrors({ department_id: "Department is required" });
      return;
    }

    try {
      if (categoryId) {
        await updatecompany({ id: categoryId, data: values }).unwrap();
      } else {
        await createcompany(values).unwrap();
      }

      onSave?.(values);
      onClose();
    } catch (error) {
      console.error("Failed to save company:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-xl mx-4 rounded-2xl bg-gradient-to-b from-black/90 to-gray-900/95 border border-gray-800 shadow-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {categoryId ? "Update Company" : "Create Company"}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Fill company details with department
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-md p-2 text-gray-300 hover:bg-white/5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Department Select */}
              <div>
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="department_id"
                >
                  Department
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={values.department_id}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Department</option>
                  {data?.data?.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department_id}
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="mt-2 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Enter a short description"
                  className="mt-2 w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  {categoryId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
