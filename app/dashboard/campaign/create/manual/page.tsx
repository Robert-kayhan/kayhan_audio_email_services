"use client";

import { useState } from "react";
import { ClipboardList, UploadCloud, Send, Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";
import ChooseTemplate from "@/components/campaign/ChooseTemplate";
import CampaignDetailsForm, { CampaignDetails } from "@/components/campaign/campaign";
import UploadExcelRecipients from "@/components/campaign/UploadExcelRecipients";
import { useSendUsingExcelMutation } from "@/store/api/campaignApi";

const steps = [
  { id: "form", label: "Campaign Details", icon: Megaphone },
  { id: "template", label: "Choose Template", icon: ClipboardList },
  { id: "upload", label: "Upload Excel", icon: UploadCloud },
  { id: "send", label: "Send Campaign", icon: Send },
];

export default function CampaignStepperAutomatic() {
  const [currentStep, setCurrentStep] = useState("form");
  const [completedStepIndex, setCompletedStepIndex] = useState(0);

  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>({
    campaignName: "",
    subject: "",
    fromEmail: "",
    senderName: "",
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<any>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const [sendUsingExcel, { isLoading }] = useSendUsingExcelMutation();
  const router = useRouter();

  const handleCreateAndSend = async () => {
    try {
      if (
        !campaignDetails.campaignName ||
        !campaignDetails.subject ||
        !campaignDetails.fromEmail ||
        !campaignDetails.senderName ||
        !selectedTemplateId?.id ||
        !excelFile
      ) {
        alert("Missing required data (details/template/excel).");
        return;
      }

      // ✅ call your excel endpoint
      await sendUsingExcel({
        campaignName: campaignDetails.campaignName,
        campaignSubject: campaignDetails.subject,
        fromEmail: campaignDetails.fromEmail,
        senderName: campaignDetails.senderName,
        templateId: Number(selectedTemplateId.id),
        file: excelFile,
      }).unwrap();

      alert("✅ Campaign created & sent successfully!");
      router.push("/dashboard/campaign");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to create/send campaign");
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
              setCompletedStepIndex(1);
              setCurrentStep("template");
            }}
          />
        );

      case "template":
        return (
          <ChooseTemplate
            type={"Retail"}
            onSelect={(id: any) => {
              setSelectedTemplateId(id);
              setCompletedStepIndex(2);
              setCurrentStep("upload");
            }}
          />
        );

      case "upload":
        return (
          <UploadExcelRecipients
            file={excelFile}
            setFile={setExcelFile}
            onUploaded={() => {
              setCompletedStepIndex(3);
              setCurrentStep("send");
            }}
          />
        );

      case "send":
        return (
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold">Ready to Send</h3>

            <div className="text-sm space-y-1">
              <p>
                <b>Campaign:</b> {campaignDetails.campaignName}
              </p>
              <p>
                <b>Subject:</b> {campaignDetails.subject}
              </p>
              <p>
                <b>From:</b> {campaignDetails.fromEmail} ({campaignDetails.senderName})
              </p>
              <p>
                <b>Template:</b> {selectedTemplateId?.name ?? selectedTemplateId?.id}
              </p>
              <p>
                <b>Excel:</b> {excelFile?.name}
              </p>
            </div>

            <button
              disabled={isLoading}
              onClick={handleCreateAndSend}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            >
              {isLoading ? "Processing..." : "Create & Send Campaign"}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Automatic Campaign Builder</h2>

      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const currentIndex = steps.findIndex((s) => s.id === currentStep);
          const isActive = currentStep === step.id;
          const isCompleted = index < currentIndex;

          return (
            <div
              key={step.id}
              className={`flex-1 flex flex-col items-center text-center relative ${
                index <= completedStepIndex ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onClick={() => {
                if (index <= completedStepIndex) setCurrentStep(step.id);
              }}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center border-2 rounded-full mb-2 ${
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
}