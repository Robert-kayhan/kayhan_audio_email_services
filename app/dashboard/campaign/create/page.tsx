"use client";

import { useState } from "react";
import { ClipboardList, Users, List, Send, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import ChooseTemplate from "@/components/campaign/ChooseTemplate";
import AddRecipients from "@/components/campaign/AddRecipient";
import AssociateList from "@/components/campaign/AssociateList";
import CampaignDetailsForm, {
  CampaignDetails,
} from "@/components/campaign/campaign";
import {
  useCreateCampaignMutation,
  useSendComgainMutation,
} from "@/store/api/campaignApi";

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
  const [completedStepIndex, setCompletedStepIndex] = useState(0);
  const [sendComgains, setSendComgains] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>({
    campaignName: "",
    subject: "",
    fromEmail: "",
    senderName: "",
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<any>(null);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [campgainId, setCampgainId] = useState<any>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [createCampaign] = useCreateCampaignMutation();
  const [sendComgain , {isLoading}] = useSendComgainMutation();
  const router = useRouter()
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
        campaignSubject: campaignDetails.subject,
        fromEmail: campaignDetails.fromEmail,
        senderName: campaignDetails.senderName,
        templateId: parseInt(selectedTemplateId.id),
        leadGroupId: parseInt(selectedListId),
      };

      const res = await createCampaign(payload).unwrap();
      alert("Campaign created successfully!");
      setCampgainId(res.data.id);
      setCompletedStepIndex(Math.max(completedStepIndex, 5));
      setCurrentStep("send");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
  };

  const handlesendComgain = async () => {
    try {
      setSendComgains(true)
      const res = await sendComgain(campgainId).unwrap();
      router.push("/dashboard/campaign")
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case "form":
        return (
          <CampaignDetailsForm
            details={campaignDetails}
            setDetails={setCampaignDetails}
            onNext={() => {
              setCompletedStepIndex(Math.max(completedStepIndex, 1));
              setCurrentStep("template");
            }}
          />
        );
      case "template":
        return (
          <ChooseTemplate
            onSelect={(id: any) => {
              setSelectedTemplateId(id);
              setCompletedStepIndex(Math.max(completedStepIndex, 2));
              setCurrentStep("recipients");
            }}
          />
        );
      case "recipients":
        return (
          <AddRecipients
            selectedUserIds={selectedRecipientIds}
            setSelectedUserIds={setSelectedRecipientIds}
            onNext={() => {
              setCompletedStepIndex(Math.max(completedStepIndex, 3));
              setCurrentStep("list");
            }}
          />
        );
      case "list":
        return (
          <AssociateList
            selectedUserIds={selectedRecipientIds}
            onSelectGroupId={(id: string) => {
              setSelectedListId(id);
              setCompletedStepIndex(Math.max(completedStepIndex, 4));
              setCurrentStep("review");
            }}
          />
        );
      case "review":
        return (
          <div className="p-4 dark:text-gray-100 space-y-3">
            <h3 className="text-lg font-semibold">Review Summary</h3>
            <p><b>Campaign Name:</b> {campaignDetails.campaignName}</p>
            <p><b>Subject:</b> {campaignDetails.subject}</p>
            <p><b>From:</b> {campaignDetails.fromEmail} ({campaignDetails.senderName})</p>
            <p><b>Associated List ID:</b> {selectedListId}</p>
            <button
              onClick={handleCreateComgain}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Confirm and Proceed
            </button>
          </div>
        );
      case "send":
        return sendComgains ? <>
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
          ✅ Campaign is sent!
        </div>
        </>: (
          <div className="p-4 dark:text-gray-100 space-y-4">
            <h3 className="text-lg font-semibold">Send Campaign</h3>
            <p>📬 Campaign will be sent using selected settings.</p>
            <button
            disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handlesendComgain}
            >
            {isLoading? "Processing":  "Send Campaign"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

return (
  <div className="p-6 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <h2 className="text-xl font-semibold mb-6">Campaign Builder</h2>

    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const stepIndex = index;
        const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
        const isActive = currentStep === step.id;
        const isCompleted = stepIndex < currentStepIndex;

        return (
          <div
            key={step.id}
            className={`flex-1 flex flex-col items-center text-center relative ${
              stepIndex <= completedStepIndex ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={() => {
              if (stepIndex <= completedStepIndex) {
                setCurrentStep(step.id);
              }
            }}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center border-2 rounded-full mb-2 transition-all duration-200 ${
                isActive
                  ? "border-blue-400 text-blue-400"
                  : isCompleted
                  ? "border-green-500 text-green-500"
                  : "border-gray-400 dark:border-gray-600 text-gray-500 dark:text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p
              className={`text-sm font-medium ${
                isActive
                  ? "text-blue-500"
                  : isCompleted
                  ? "text-green-500"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {step.label}
            </p>
            {index < steps.length - 1 && (
              <div className="absolute top-5 right-[-50%] w-full h-0.5 border-t border-dashed border-gray-300 dark:border-gray-600 z-[-1]" />
            )}
          </div>
        );
      })}
    </div>

    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm">
      {renderContent()}
    </div>
  </div>
);

};

export default CampaignStepper;