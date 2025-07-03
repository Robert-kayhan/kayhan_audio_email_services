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
    <div className="p-6 text-white space-y-6">
      <h2 className="text-2xl font-semibold text-white">📋 Campaign Details</h2>

      {error && (
        <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded border border-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative">
          <input
            name="campaignName"
            id="campaignName"
            value={details.campaignName}
            onChange={handleChange}
            className="peer w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="campaignName"
            className="absolute left-3 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all"
          >
            Campaign Name *
          </label>
        </div>

        <div className="relative">
          <input
            name="subject"
            id="subject"
            value={details.subject}
            onChange={handleChange}
            className="peer w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="subject"
            className="absolute left-3 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all"
          >
            Email Subject *
          </label>
        </div>

        <div className="relative">
          <input
            name="fromEmail"
            id="fromEmail"
            type="email"
            value={details.fromEmail}
            onChange={handleChange}
            className="peer w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="fromEmail"
            className="absolute left-3 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all"
          >
            From Email *
          </label>
        </div>

        <div className="relative">
          <input
            name="senderName"
            id="senderName"
            value={details.senderName}
            onChange={handleChange}
            className="peer w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=" "
          />
          <label
            htmlFor="senderName"
            className="absolute left-3 top-2.5 text-gray-400 text-sm peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all"
          >
            Sender Name *
          </label>
        </div>

      
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded text-white font-medium"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CampaignDetailsForm;
