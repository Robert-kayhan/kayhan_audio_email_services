"use client";

import React, { useState } from "react";
import { CreditCard, Wallet, Banknote, DollarSign, Clock } from "lucide-react";
import { useUpdatePaymentMutation } from "@/store/api/booking/BookingApi";
import toast from "react-hot-toast";

type Payment = {
  method: string;
  amount: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
};

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, bookingId }) => {
  const [payment, setPayment] = useState<Payment>({
    method: "",
    amount: "0",
  });

  const [updatePayment] = useUpdatePaymentMutation();

  const paymentMethods = [
    { label: "Paypal", icon: <Wallet size={18} /> },
    { label: "Cash", icon: <DollarSign size={18} /> },
    { label: "EFTPOS", icon: <CreditCard size={18} /> },
    { label: "Bank Transfer", icon: <Banknote size={18} /> },
    { label: "Zip Pay", icon: <CreditCard size={18} /> },
              { label: "After Pay", icon: <Clock size={18} /> },
  ];

  const selectMethod = (method: string) => {
    setPayment({ ...payment, method });
  };

  const handleSavePayment = async () => {
    if (!payment.method) {
      toast.error("Please select a payment method.");
      return;
    }

    if (!payment.amount || parseFloat(payment.amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      await updatePayment({
        bookingId,
        data: {
          methods: [payment.method], // API expects an array
          paidAmount: parseFloat(payment.amount),
        },
      }).unwrap();

      toast.success("Payment updated successfully.");
      onClose();
    } catch (err:any) {
      console.error(err);
      toast.error(err?.data?.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-800 p-6 rounded-2xl max-w-lg w-full space-y-6">
        <h2 className="text-xl font-bold mb-4">💳 Payment</h2>

        {/* Payment Methods */}
        <div>
          <h3 className="font-semibold mb-2">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((m) => (
              <div
                key={m.label}
                onClick={() => selectMethod(m.label)}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition
                  ${
                    payment.method === m.label
                      ? "bg-green-600 border-green-500 text-white"
                      : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <h3 className="font-semibold mb-2">Amount Paid</h3>
          <input
            type="number"
            placeholder="Enter amount"
            value={payment.amount}
            onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
          >
            Close
          </button>
          <button
            onClick={handleSavePayment}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
};
