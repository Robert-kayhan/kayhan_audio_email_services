"use client";

import { useState } from "react";
import { ClipboardList, Users, List, Send, Megaphone } from "lucide-react";

import ChooseTemplate from "@/components/campaign/ChooseTemplate";
import AddRecipients from "@/components/campaign/AddRecipient";
import AssociateList from "@/components/campaign/AssociateList";
import CampaignDetailsForm, {
  CampaignDetails,
} from "@/components/campaign/campaign";
import { useCreateCampaignMutation ,useSendComgainMutation} from "@/store/api/campaignApi";
const steps = [
  { id: "form", label: "Campaign Details", icon: Megaphone },
  { id: "template", label: "Choose Template", icon: ClipboardList },
  { id: "recipients", label: "Add Recipients", icon: Users },
  { id: "list", label: "Associate List", icon: List },
  { id: "review", label: "Send For Review", icon: Send },
  { id: "send", label: "Send Campaign", icon: Megaphone },
];

const CampaignStepper = () => {
  const [currentStep, setCurrentStep] = useState("form");

  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>({
    campaignName: "",
    subject: "",
    fromEmail: "",
    senderName: "",
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<any>(null);

  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(
    []
  );
  const [campgainId, setCampgainId] = useState<any>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [createCampaign] = useCreateCampaignMutation();
  console.log(selectedTemplateId, "this is template id");
  const handleCreateComgain = async () => {
    try {
      if (
        !campaignDetails.campaignName ||
        !campaignDetails.fromEmail ||
        !campaignDetails.senderName ||
        !selectedTemplateId ||
        !selectedListId
      ) {
        alert("Missing required campaign data.");
        return;
      }

      const payload = {
        campaignName: campaignDetails.campaignName,
        campaignSubject : campaignDetails.subject,
        fromEmail: campaignDetails.fromEmail,
        senderName: campaignDetails.senderName,
        templateId: parseInt(selectedTemplateId.id),
        leadGroupId: parseInt(selectedListId),
      };
      console.log(payload, "this is payload");
      const res = await createCampaign(payload).unwrap();
      alert("Campaign created successfully!");
      setCampgainId(res.data.id)
      console.log("Created:", res.data.id);
      setCurrentStep("send");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
  };
  const [sendComgain] = useSendComgainMutation()
  const handlesendComgain = async()=>{
    try {
      const res = await sendComgain(campgainId).unwrap()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
    
  }
  const renderContent = () => {
    switch (currentStep) {
      case "form":
        return (
          <CampaignDetailsForm
            details={campaignDetails}
            setDetails={setCampaignDetails}
            onNext={() => setCurrentStep("template")}
          />
        );

      case "template":
        return (
          <ChooseTemplate
            // selectedTemplateId={selectedTemplateId}
            onSelect={(id: any) => {
              setSelectedTemplateId(id);
              setCurrentStep("recipients");
            }}
          />
        );

      case "recipients":
        return (
          <AddRecipients
            selectedUserIds={selectedRecipientIds}
            setSelectedUserIds={setSelectedRecipientIds}
            onNext={() => setCurrentStep("list")}
          />
        );

      case "list":
        return (
          <AssociateList
            selectedUserIds={selectedRecipientIds}
            onSelectGroupId={(id: string) => {
              setSelectedListId(id);
              setCurrentStep("review");
            }}
          />
        );

      case "review":
        return (
          <div className="p-4 text-gray-100 space-y-3">
            <h3 className="text-lg font-semibold">Review Summary</h3>
            <p>
              🧾 <b>Campaign Name:</b> {campaignDetails.campaignName}
            </p>
            <p>
              ✉️ <b>Subject:</b> {campaignDetails.subject}
            </p>
            <p>
              📧 <b>From:</b> {campaignDetails.fromEmail} (
              {campaignDetails.senderName})
            </p>
            <p>
              🗂 <b>Associated List ID:</b> {selectedListId}
            </p>
            <button
              onClick={handleCreateComgain}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm and Proceed
            </button>
          </div>
        );

      case "send":
        return (
          <div className="p-4 text-gray-100 space-y-4">
            <h3 className="text-lg font-semibold">Send Campaign</h3>
            <p>📬 Campaign will be sent using:</p>
            {/* <ul className="list-disc ml-5">
              <li>Campaign: {campaignDetails.campaignName}</li>
              <li>Template ID: {selectedTemplateId}</li>
              <li>Recipient IDs: {selectedRecipientIds.join(", ")}</li>
              <li>List ID: {selectedListId}</li>
            </ul> */}
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => {
               handlesendComgain()
              }}
            >
              Send Campaign
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-xl font-semibold mb-6 text-white">
        Campaign Builder
      </h2>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          return (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center text-center relative cursor-pointer"
              onClick={() => setCurrentStep(step.id)}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center border-2 rounded-full mb-2 transition-all duration-200 ${
                  isActive
                    ? "border-blue-400 text-blue-400"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p
                className={`text-sm font-medium ${
                  isActive ? "text-blue-300" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div className="absolute top-5 right-[-50%] w-full h-0.5 border-t border-dashed border-gray-600 z-[-1]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-md shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default CampaignStepper;
