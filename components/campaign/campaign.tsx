"use client";

import { useState } from "react";

export interface CampaignDetails {
  campaignName: string;
  subject: string;
  fromEmail: string;
  senderName: string;
  description?: string;
}

interface Props {
  details: CampaignDetails;
  setDetails: (details: CampaignDetails) => void;
  onNext: () => void;
}

const CampaignDetailsForm = ({ details, setDetails, onNext }: Props) => {
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSubmit = () => {
    const { campaignName, subject, fromEmail, senderName } = details;
    if (!campaignName || !subject || !fromEmail || !senderName) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-900 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4">Campaign Details</h2>

      {error && (
        <div className="bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 px-4 py-2 mb-4 rounded border border-red-400 dark:border-red-500">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Campaign Name *</label>
          <input
            type="text"
            name="campaignName"
            value={details.campaignName}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Email Subject *</label>
          <input
            type="text"
            name="subject"
            value={details.subject}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">From Email *</label>
          <input
            type="email"
            name="fromEmail"
            value={details.fromEmail}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Sender Name *</label>
          <input
            type="text"
            name="senderName"
            value={details.senderName}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Description</label>
          <textarea
            name="description"
            value={details.description || ""}
            onChange={handleChange}
            rows={3}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-medium"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CampaignDetailsForm;
