"use client"
import { useState } from "react";
import { Check, ClipboardList, Users, List, Send, Megaphone } from "lucide-react";

const steps = [
  { id: "template", label: "Choose Template", icon: ClipboardList },
  { id: "recipients", label: "Add Recipients", icon: Users },
  { id: "list", label: "Associate List", icon: List },
  { id: "review", label: "Send For Review", icon: Send },
  { id: "send", label: "Send Campaign", icon: Megaphone },
];

const CampaignStepper = () => {
  const [currentStep, setCurrentStep] = useState("template");

  const renderContent = () => {
    switch (currentStep) {
      case "template":
        return <div className="p-4 text-gray-100">Template selection content goes here</div>;
      case "recipients":
        return <div className="p-4 text-gray-100">Recipient selection content goes here</div>;
      case "list":
        return <div className="p-4 text-gray-100">Associate list content goes here</div>;
      case "review":
        return <div className="p-4 text-gray-100">Send for review content goes here</div>;
      case "send":
        return <div className="p-4 text-gray-100">Send campaign content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-xl font-semibold mb-6 text-white">What's Next</h2>
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
                  isActive ? "border-blue-400 text-blue-400" : "border-gray-600 text-gray-400"
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
      <div className="bg-gray-800 border border-gray-700 rounded-md shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default CampaignStepper;
