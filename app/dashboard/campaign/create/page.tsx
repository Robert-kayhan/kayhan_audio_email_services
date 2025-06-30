"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreateCampaignPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    content: "",
    status: "Draft",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with API call later
    toast.success("Campaign created (mock)");

    // Reset form and navigate
    setForm({ name: "", subject: "", content: "", status: "Draft" });
    router.push("/campaigns");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-semibold mb-6">Create New Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-lg shadow border dark:border-gray-700">
        <div>
          <label className="block text-sm font-medium mb-1">Campaign Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignPage;
