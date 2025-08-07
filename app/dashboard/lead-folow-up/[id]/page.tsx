"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
} from "@/store/api/lead/leadFollowApi";
import FollowUpStageForm from "@/components/leads/FollowUpStageForm";
import NoteModal from "@/components/leads/NoteModal";
import { useGetNotesQuery } from "@/store/api/lead/leadFollowApi";
const UpdateLeadBasic: React.FC = () => {
  const { id } = useParams();
  const { data: lead, isLoading, refetch } = useGetLeadByIdQuery(id as string);
  console.log(lead);
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });
  const router = useRouter()
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const { data: LeadData } = useGetNotesQuery(id);
  useEffect(() => {
    if (lead) {
      setFormData({
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        phone: lead.phone || "",
        email: lead.email || "",
        address: lead.address || "",
      });
    }
    refetch();
  }, [lead]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLead({ id, data: formData }).unwrap();
      alert("Lead updated");
      // router.push("/dashboard/lead-folow-up");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (isLoading) return <div className="p-6 text-white">Loading...</div>;
  if (!lead) return <div className="p-6 text-white">No data found</div>;
  console.log(LeadData, "this is ");
  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-8">
  <button
      onClick={() => router.back()}
      className="inline-flex items-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition"
    >
      ← Back
    </button>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Update Lead </h1>
        <button
          onClick={() => setNoteModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Note
        </button>
      </div>

      {/* Editable Section */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(v) => handleChange("firstName", v)}
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(v) => handleChange("lastName", v)}
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(v) => handleChange("phone", v)}
        />
        <Input
          label="Email"
          value={formData.email}
          onChange={(v) => handleChange("email", v)}
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(v) => handleChange("address", v)}
        />
        <div className="md:col-span-2 text-right pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>

      <hr className="border-gray-700" />

      {/* Notes Section */}

      {/* Note Modal */}
      <NoteModal
        leadId={lead.id}
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        notes={notes}
        setNotes={setNotes}
      />

      {/* View-only Section */}
      <div className="space-y-6">
        <ViewSection title="Lead Details">
          <ReadOnly label="Lead Source" value={lead.leadSource} />
          <ReadOnly label="Interest" value={lead.interest} />
          <ReadOnly label="Lead Status" value={lead.leadStatus} />
        </ViewSection>

        <ViewSection title="Sales Info">
          <ReadOnly label="Quote Given" value={lead.quoteGiven} />
          <ReadOnly label="Expected Value" value={lead.expectedValue} />
          <ReadOnly
            label="Expected Close Date"
            value={lead.expectedCloseDate}
          />
        </ViewSection>

        <ViewSection title="Customer Info">
          <ReadOnly label="Active Customer" value={lead.isActiveCustomer} />
          <ReadOnly label="Purchase History" value={lead.purchaseHistory} />
          <ReadOnly label="Support Notes" value={lead.supportNotes} multiline />
        </ViewSection>

        <ViewSection title="Communication">
          <ReadOnly label="Type" value={lead.communicationType} />
          <ReadOnly label="Date" value={lead.communicationDate} />
          <ReadOnly label="Follow-up Date" value={lead.followUpDate} />
          <ReadOnly label="Notes" value={lead.communicationNotes} multiline />
        </ViewSection>

        {/* Follow-Up Sections */}
        {lead.firstFollowUpDate &&
          lead.firstFollowUpType &&
          lead.firstFollowUpNotes && (
            <ViewSection title="1st Follow-Up">
              <ReadOnly label="Date" value={lead.firstFollowUpDate} />
              <ReadOnly label="Type" value={lead.firstFollowUpType} />
              <ReadOnly
                label="Notes"
                value={lead.firstFollowUpNotes}
                multiline
              />
            </ViewSection>
          )}

        {lead.secondFollowUpType && lead.secondFollowUpNotes && (
          <ViewSection title="2nd Follow-Up">
            <ReadOnly label="Date" value={lead.secondFollowUpDate} />
            <ReadOnly label="Type" value={lead.secondFollowUpType} />
            <ReadOnly
              label="Notes"
              value={lead.secondFollowUpNotes}
              multiline
            />
          </ViewSection>
        )}

        {lead.thirdFollowUpType && lead.thirdFollowUpNotes && (
          <ViewSection title="3rd Follow-Up">
            <ReadOnly label="Date" value={lead.thirdFollowUpDate} />
            <ReadOnly label="Type" value={lead.thirdFollowUpType} />
            <ReadOnly label="Notes" value={lead.thirdFollowUpNotes} multiline />
          </ViewSection>
        )}

        {lead.finalFollowUpType && lead.finalFollowUpNotes && (
          <ViewSection title="Final Follow-Up">
            <ReadOnly label="Date" value={lead.finalFollowUpDate} />
            <ReadOnly label="Type" value={lead.finalFollowUpType} />
            <ReadOnly label="Notes" value={lead.finalFollowUpNotes} multiline />
          </ViewSection>
        )}

        {/* Editable Follow-Up Forms */}
        {lead?.saleStatus !== "Sale done" && (
          <div>
            {!lead.firstFollowUpType && !lead.firstFollowUpNotes ? (
              <FollowUpStageForm
                stage="first"
                leadId={id as string}
                defaultData={{
                  FollowUpDate: lead.firstFollowUpDate,
                  FollowUpType: lead.firstFollowUpType,
                  FollowUpNotes: lead.firstFollowUpNotes,
                  NextFollowUpDate: lead.firstNextFollowUpDate,
                }}
              />
            ) : null}

            {lead.firstFollowUpType &&
            lead.firstFollowUpNotes &&
            !lead.secondFollowUpType &&
            !lead.secondFollowUpNotes ? (
              <FollowUpStageForm
                stage="second"
                leadId={id as string}
                defaultData={{
                  FollowUpDate: lead.secondFollowUpDate,
                  FollowUpType: lead.secondFollowUpType,
                  FollowUpNotes: lead.secondFollowUpNotes,
                  NextFollowUpDate: lead.secondNextFollowUpDate,
                }}
              />
            ) : null}

            {lead.secondFollowUpType &&
            lead.secondFollowUpNotes &&
            !lead.thirdFollowUpType &&
            !lead.thirdFollowUpNotes ? (
              <FollowUpStageForm
                stage="third"
                leadId={id as string}
                defaultData={{
                  FollowUpDate: lead.thirdFollowUpDate,
                  FollowUpType: lead.thirdFollowUpType,
                  FollowUpNotes: lead.thirdFollowUpNotes,
                  NextFollowUpDate: lead.thirdNextFollowUpDate,
                }}
              />
            ) : null}

            {lead.thirdFollowUpType &&
            lead.thirdFollowUpNotes &&
            !lead.finalFollowUpType &&
            !lead.finalFollowUpNotes ? (
              <FollowUpStageForm
                stage="final"
                leadId={id as string}
                defaultData={{
                  FollowUpDate: lead.finalFollowUpDate,
                  FollowUpType: lead.finalFollowUpType,
                  FollowUpNotes: lead.finalFollowUpNotes,
                  NextFollowUpDate: lead.finalNextFollowUpDate,
                }}
              />
            ) : null}
          </div>
        )}
        {Array.isArray(LeadData) && LeadData.length > 0 && (
          <ul className="space-y-2">
            {LeadData.map(({ id, note }: any) => (
              <li
                key={id}
                className="bg-gray-800 border border-gray-700 p-3 rounded text-white"
              >
                <div className="text-sm text-gray-400 mb-1">Note #{id}</div>
                <div className="whitespace-pre-line">{note}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UpdateLeadBasic;

// Input Component
const Input = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) => (
  <div>
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
    />
  </div>
);

// ReadOnly Component
const ReadOnly = ({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) => (
  <div>
    <label className="text-sm text-gray-400 block mb-1">{label}</label>
    <div className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white whitespace-pre-line">
      {value || "-"}
    </div>
  </div>
);

// ViewSection Component
const ViewSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-300 mb-2">{title}</h2>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);
