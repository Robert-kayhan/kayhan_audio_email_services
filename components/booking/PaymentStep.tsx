"use client";
import React from "react";
import { CreditCard, Clock, Wallet, Banknote, DollarSign } from "lucide-react";

type Props = {
  formData: any;
  handleChange: (section: string, field: string, value: any) => void;
};

export const PaymentStep: React.FC<Props> = ({ formData, handleChange }) => {
  const payment = formData.payment || {
    category: "Instant",
    methods: [],
    type: "Full",
    partialAmount: "",
  };

  const orderType = formData.order_type || "retail";

  const instantMethods = [
    { label: "Paypal Pay", icon: <Wallet size={18} /> },
    { label: "Cash", icon: <DollarSign size={18} /> },
    { label: "EFTPOS", icon: <CreditCard size={18} /> },
    { label: "Credit", icon: <Banknote size={18} /> },
  ];

  const laterMethods = [
    ...(orderType === "retail" || orderType === "walk_in"
      ? [
          { label: "Zip Pay", icon: <CreditCard size={18} /> },
          { label: "After Pay", icon: <Clock size={18} /> },
        ]
      : []),
    { label: "Paypal Pay", icon: <Wallet size={18} /> },
    { label: "Bank", icon: <Banknote size={18} /> },
  ];

  const methodsToShow =
    payment.category === "Instant" ? instantMethods : laterMethods;

  const toggleInstantMethod = (method: string) => {
    // ✅ Only one can be selected
    handleChange("payment", "methods", [method]);
  };

  const toggleLaterMethod = (method: string) => {
    const exists = payment.methods.includes(method);
    const newMethods = exists
      ? payment.methods.filter((m: string) => m !== method)
      : [...payment.methods, method];
    handleChange("payment", "methods", newMethods);
  };

  return (
    <div className="space-y-6">
      {/* Payment Category */}
      <div className="bg-gray-900 p-5 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
          💳 Payment Category
        </h3>
        <div className="flex gap-6">
          {["Instant", "Later"].map((cat) => (
            <label
              key={cat}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition
                ${
                  payment.category === cat
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              <input
                type="radio"
                className="hidden"
                name="category"
                checked={payment.category === cat}
                onChange={() => handleChange("payment", "category", cat)}
              />
              {cat === "Instant" ? "⚡ Instant Pay" : "🕒 Pay Later"}
            </label>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      {methodsToShow.length > 0 && (
        <div className="bg-gray-900 p-5 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-3 text-lg">💰 Payment Methods</h3>

          {/* "Select All" for Later */}
          {/* "Select All" for Later */}
          {payment.category === "Later" && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Quick Actions</span>
              <button
                type="button"
                onClick={() => {
                  const allSelected = methodsToShow.every((m) =>
                    payment.methods.includes(m.label)
                  );
                  handleChange(
                    "payment",
                    "methods",
                    allSelected ? [] : methodsToShow.map((m) => m.label)
                  );
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
        ${
          methodsToShow.every((m) => payment.methods.includes(m.label))
            ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
              >
                {methodsToShow.every((m) => payment.methods.includes(m.label))
                  ? "✅ Deselect All"
                  : "✨ Select All"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {methodsToShow.map((m) => (
              <div
                key={m.label}
                onClick={() =>
                  payment.category === "Instant"
                    ? toggleInstantMethod(m.label)
                    : toggleLaterMethod(m.label)
                }
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition 
                  ${
                    payment.methods.includes(m.label)
                      ? "bg-green-600 border-green-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Type (Only for Instant) */}
      {payment.category === "Instant" && (
        <div className="bg-gray-900 p-5 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-3 text-lg">🧾 Payment Type</h3>
          <div className="flex gap-6">
            {["Full", "Partial", "Already Paid"].map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition
        ${
          payment.type === type
            ? "bg-green-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
              >
                <input
                  type="radio"
                  name="type"
                  className="hidden"
                  checked={payment.type === type}
                  onChange={() => handleChange("payment", "type", type)}
                />
                {type === "Full"
                  ? "✅ Full Payment"
                  : type === "Partial"
                    ? "✂️ Partial Payment"
                    : "💵 Already Paid"}
              </label>
            ))}
          </div>

          {/* Show partial amount input if Partial */}
          {payment.type === "Partial" && (
            <div className="mt-4">
              <input
                type="number"
                placeholder="Enter partial amount"
                value={payment.partialAmount || ""}
                onChange={(e) =>
                  handleChange("payment", "partialAmount", e.target.value)
                }
                className="w-64 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white"
              />
            </div>
          )}

          {payment.type === "Already Paid" && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter Invoice Number"
                value={formData.booking.invoiceNumber || ""}
                onChange={(e) =>
                  handleChange("booking", "invoiceNumber", e.target.value)
                }
                className="w-64 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white"
              />
              <input
                type="number"
                placeholder="Enter Amount"
                // value={payment.invoiceNumber || ""}
                value={payment.partialAmount || ""}
                onChange={(e) =>
                  handleChange("payment", "partialAmount", e.target.value)
                }
                className="w-64 p-3 rounded-xl mx-2 bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white"
              />
            </div>
          )}

          {/* {payment.type === "Partial" && (
            <div className="mt-4">
              <input
                type="number"
                placeholder="Enter partial amount"
                value={payment.partialAmount}
                onChange={(e) =>
                  handleChange("payment", "partialAmount", e.target.value)
                }
                className="w-64 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500 text-white"
              />
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};
