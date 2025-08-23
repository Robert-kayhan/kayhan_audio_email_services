"use client";

import React, { useState } from "react";
import {
  useUpdateFollowUpStageMutation,
  useUpdateSaleStatusMutation,
} from "@/store/api/lead/leadFollowApi";
import { useRouter } from "next/navigation";

type FollowUpProps = {
  stage: "first" | "second" | "third" | "final";
  leadId: string;
  defaultData?: Partial<{
    FollowUpDate: string;
    FollowUpType: string;
    FollowUpNotes: string;
    NextFollowUpDate: string;
    SaleStatus: string;
    QuotationNumber: string;
    QuotationSentDate: string;
    InvoiceNumber: string;
    InvoiceSentDate: string;

  }>;
};

const FollowUpStageForm: React.FC<FollowUpProps> = ({
  stage,
  leadId,
  defaultData = {},
}) => {
  const [FollowUpDate, setDate] = useState(defaultData.FollowUpDate || "");
  const [FollowUpType, setType] = useState(defaultData.FollowUpType || "");
  const [FollowUpNotes, setNotes] = useState(defaultData.FollowUpNotes || "");
  const [NextFollowUpDate, setNextDate] = useState(
    defaultData.NextFollowUpDate || ""
  );

  const [saleStatus, setSaleStatus] = useState(defaultData.SaleStatus || "");
  const [quotationStatus, setQuotationStatus] = useState(
    defaultData.QuotationSentDate ? "Sent" : "Not sent"
  );
  const [quotationNumber, setQuotationNumber] = useState(
    defaultData.QuotationNumber || ""
  );
  const [quotationSentDate, setQuotationSentDate] = useState(
    defaultData.QuotationSentDate || ""
  );

  const [invoiceStatus, setInvoiceStatus] = useState(
    defaultData.InvoiceSentDate ? "Sent" : "Not sent"
  );
  const [invoiceNumber, setInvoiceNumber] = useState(
    defaultData.InvoiceNumber || ""
  );
  const [invoiceSentDate, setInvoiceSentDate] = useState(
    defaultData.InvoiceSentDate || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [updateFollowUpStage] = useUpdateFollowUpStageMutation();
  const [updateSaleStatus] = useUpdateSaleStatusMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Follow-up stage update
      const payload: Record<string, string> = {};
      if (FollowUpDate) payload[`${stage}FollowUpDate`] = FollowUpDate;
      if (FollowUpType) payload[`${stage}FollowUpType`] = FollowUpType;
      if (FollowUpNotes) payload[`${stage}FollowUpNotes`] = FollowUpNotes;
      if (NextFollowUpDate)
        payload[`${stage}NextFollowUpDate`] = NextFollowUpDate;

      await updateFollowUpStage({
        id: leadId,
        stage,
        data: payload,
      }).unwrap();

      // 2. Sale status + quotation + invoice update
      const salePayload = {
        saleStatus,
        quotationNumber: quotationNumber || null,
        quotationSentDate:
          quotationStatus === "Sent" ? quotationSentDate : null,
        invoiceNumber: invoiceNumber || null,
        invoiceSentDate: invoiceStatus === "Sent" ? invoiceSentDate : null,
      };

      await updateSaleStatus({
        id: leadId,
        data: salePayload,
      }).unwrap();

      alert(`${stage} follow-up updated successfully`);
      router.push("/dashboard/lead-folow-up");
    } catch (err) {
      console.error(err);
      alert("Failed to update follow-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border border-gray-700 rounded-md bg-gray-900 space-y-4 text-white"
    >
      <h2 className="text-lg font-bold capitalize">{stage} Follow-Up</h2>

      {/* Follow-Up Date */}
      <div>
        <label className="block text-sm text-gray-300">Follow-Up Date</label>
        <input
          type="date"
          value={FollowUpDate}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      {/* Follow-Up Type */}
      <div>
        <label className="block text-sm text-gray-300">Follow-Up Type</label>
        <select
          value={FollowUpType}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">Select Type</option>
          <option value="Over the Phone">Call</option>
          <option value="Email">Email</option>
          <option value="Visit">In Person</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Text Message">Text Message</option>

        </select>
      </div>

      {/* Follow-Up Notes */}
      <div>
        <label className="block text-sm text-gray-300">Follow-Up Notes</label>
        <textarea
          value={FollowUpNotes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
        />
      </div>

      {/* Sale Status */}
      <Select
        label="Sale Status"
        value={saleStatus}
        options={["Sale done", "Sale not done"]}
        onChange={setSaleStatus}
      />

      {/* Next Follow-Up if sale not done */}
      {saleStatus === "Sale not done" && (
        <div>
          <label className="block text-sm text-gray-300">
            Next Follow-Up Date
          </label>
          <input
          required
            type="date"
            value={NextFollowUpDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
      )}

      {/* Quotation & Invoice if sale done */}
      {saleStatus === "Sale not done" && !defaultData.QuotationNumber && (
        <>
          {/* Quotation */}
          <Select
            label="Quotation"
            value={quotationStatus}
            options={["Sent", "Not sent"]}
            onChange={setQuotationStatus}
          />
          {quotationStatus === "Sent" && (
            <>
              <input
              required
                type="text"
                placeholder="Quotation Number"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1"
              />
              {/* <input
                type="date"
                placeholder="Quotation Sent Date"
                value={quotationSentDate}
                onChange={(e) => setQuotationSentDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1"
              /> */}
            </>
          )}

          {/* Invoice */}
        </>
      )}
      {saleStatus === "Sale done" && (
        <>
          {/* <Select
            label="Invoice"
            value={invoiceStatus}
            options={["Sent", "Not sent"]}
            onChange={setInvoiceStatus}
          /> */}
          <input
          required
            type="text"
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1"
          />
          {/* <input
            type="date"
            placeholder="Invoice Sent Date"
            value={invoiceSentDate}
            onChange={(e) => setInvoiceSentDate(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 mt-1"
          /> */}
        </>
      )}
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          {isSubmitting ? "Saving..." : "Save Follow-Up"}
        </button>
      </div>
    </form>
  );
};

export default FollowUpStageForm;

// Reusable Select Component
const Select = ({
  label,
  value,
  options,
  onChange,
  // isRequired
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  // isRequired : boolean
}) => (
  <div>
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
