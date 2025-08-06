"use client";
import React, { useState } from "react";
import {
  User,
  FileText,
  DollarSign,
  ShoppingCart,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { useCreateLeadMutation } from "@/store/api/lead/leadFollowApi";
import { useRouter } from "next/navigation";
const steps = [
  { title: "Contact Info", icon: User },
  { title: "Lead Details", icon: FileText },
  { title: "Sales Tracking", icon: DollarSign },
  { title: "Customer Status", icon: ShoppingCart },
  { title: "Communication", icon: ClipboardList },
];

const LeadCustomerDetail = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(steps.length).fill(false)
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    leadSource: "",
    interest: "",
    // leadStatus: "",
    saleStatus : "",
    quoteGiven: "",
    expectedValue: "",
    expectedCloseDate: "",
    isActiveCustomer: "",
    purchaseHistory: "",
    supportNotes: "",
    communicationType: "",
    communicationDate: "",
    followUpDate: "",
    communicationNotes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.phone &&
          formData.email
        );
      case 1:
        return formData.leadSource && formData.interest ;
      case 2:
        return (
          formData.quoteGiven &&
          formData.expectedValue 
          // formData.expectedCloseDate
        );
      case 3:
        return formData.isActiveCustomer && formData.purchaseHistory;
      case 4:
        return formData.communicationType && formData.communicationDate;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const valid = validateStep();
    if (valid) {
      const updated = [...completedSteps];
      updated[currentStep] = true;
      setCompletedSteps(updated);
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      alert("Please fill required fields.");
    }
  };
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const router = useRouter()
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        expectedValue: parseFloat(formData.expectedValue), // ensure number
      };

      await createLead(payload).unwrap();
      alert("Lead submitted successfully!");
      router.push("/dashboard/lead-folow-up")
    } catch (error: any) {
      console.error("Lead creation failed:", error);
      alert("Failed to submit lead. Please check all inputs and try again.");
    }
  };

  return (
    <div className=" h-screen bg-black overflow-x-hidden w-full text-white flex flex-col">
      {/* Step Navigation */}
      <div className="flex overflow-auto justify-center border-b border-gray-700">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === index;
          const isComplete = completedSteps[index];
          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 px-4 py-3 text-md font-medium border-b-2 transition-all ${
                isActive
                  ? "border-blue-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }  ${isComplete ? "text-green-400" : ""}`}
            >
              <Icon size={16} className={isComplete ? "text-green-400" : ""} />
              {step.title}
            </button>
          );
        })}
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 p-6 flex flex-col">
        <form className="space-y-6 w-10/12 mx-auto flex-1 overflow-y-auto pr-2">
          {currentStep === 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(val: any) => handleChange("firstName", val)}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(val: any) => handleChange("lastName", val)}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(val: any) => handleChange("phone", val)}
              />
              <Input
                label="Email"
                value={formData.email}
                type ={"email"}
                onChange={(val: any) => handleChange("email", val)}
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(val: any) => handleChange("address", val)}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Lead Source"
                value={formData.leadSource}
                options={["Website", "FaceBook","tik tok", "Instagram", "YouTube", "Walk-in", "Referral"]}
                onChange={(val: any) => handleChange("leadSource", val)}
              />
              <Input
                label="Product Interest"
                value={formData.interest}
                onChange={(val: any) => handleChange("interest", val)}
              />
              {/* <Select
                label="Lead Status"
                value={formData.leadStatus}
                options={["New", "In Progress", "Won", "Lost"]}
                onChange={(val: any) => handleChange("leadStatus", val)}
              /> */}
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Select
                label="Quote Given?"
                value={formData.quoteGiven}
                options={["Yes", "No"]}
                onChange={(val: any) => handleChange("quoteGiven", val)}
              />
              <Input
                label="Expected Value ($)"
                type="number"
                value={formData.expectedValue}
                onChange={(val: any) => handleChange("expectedValue", val)}
              />
              {/* <Input
                label="Expected Close Date"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(val: any) => handleChange("expectedCloseDate", val)}
              /> */}
            </div>
          )}

          {currentStep === 3 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Active Customer"
                  value={formData.isActiveCustomer}
                  options={["Yes", "No"]}
                  onChange={(val: any) => handleChange("isActiveCustomer", val)}
                />
                <Input
                  label="Purchase History"
                  value={formData.purchaseHistory}
                  onChange={(val: any) => handleChange("purchaseHistory", val)}
                />
              </div>
              <Textarea
                label="Support Notes"
                value={formData.supportNotes}
                onChange={(val: any) => handleChange("supportNotes", val)}
              />
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Communication Type"
                  value={formData.communicationType}
                  options={["Call", "Email", "In-Person"]}
                  onChange={(val: any) =>
                    handleChange("communicationType", val)
                  }
                />
                <Input
                  label="Date"
                  type="date"
                  value={formData.communicationDate}
                  onChange={(val: any) =>
                    handleChange("communicationDate", val)
                  }
                />
                 <Select
                label="Sale Status"
                value={formData.saleStatus}
                options={["Sale done" , "Sale not done"]}
                onChange={(val: any) => handleChange("saleStatus", val)}
              />
                {formData.saleStatus === "Sale not done" &&<Input
                  label="Next Follow-up Date"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(val: any) => handleChange("followUpDate", val)}
                />}
              </div>
              <Textarea
                label="Notes / Summary"
                value={formData.communicationNotes}
                onChange={(val: any) => handleChange("communicationNotes", val)}
              />
            </>
          )}
        </form>

        {/* Sticky Button Area */}
        <div className="max-w-4xl mx-auto w-full pt-6 border-t border-gray-800 flex justify-end sticky bottom-0 bg-black z-10">
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {currentStep < steps.length - 1
              ? "Next"
              : isLoading
                ? "Submitting..."
                : "Submit"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="text-sm text-white  block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div>
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt: any) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-sm text-gray-300 block mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default LeadCustomerDetail;
