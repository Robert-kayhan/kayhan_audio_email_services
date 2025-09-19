"use client";
import React from "react";

type Item = { name: string; charge: number };

type ItemsState = {
  list: Item[];
  newItem: string;
  newCharge: string;
  discountType: "amount" | "percentage";
  discountValue: number;
  totalAmount: number;
  discountAmount: number;
};

type Props = {
  items: any;
  setItems: (items: ItemsState) => void;
};

export const ItemsStep: React.FC<Props> = ({ items, setItems }) => {
  // Add new item
  const addItem = () => {
    if (items.newItem.trim() && items.newCharge.trim()) {
      const updatedList = [
        ...items.list,
        { name: items.newItem.trim(), charge: parseFloat(items.newCharge) },
      ];

      const subtotal = updatedList.reduce((sum, item) => sum + item.charge, 0);
      const discountAmount =
        items.discountType === "amount"
          ? items.discountValue
          : (subtotal * items.discountValue) / 100;
      const total = Math.max(subtotal - discountAmount, 0);

      setItems({
        ...items,
        list: updatedList,
        newItem: "",
        newCharge: "",
        totalAmount: total,
        discountAmount,
      });
    }
  };

  // Remove item
  const removeItem = (index: number) => {
    const updatedList = items.list.filter((_: any, i: any) => i !== index);

    const subtotal = updatedList.reduce(
      (sum: any, item: any) => sum + item.charge,
      0
    );
    const discountAmount =
      items.discountType === "amount"
        ? items.discountValue
        : (subtotal * items.discountValue) / 100;
    const total = Math.max(subtotal - discountAmount, 0);

    setItems({
      ...items,
      list: updatedList,
      totalAmount: total,
      discountAmount,
    });
  };

  // Update discount
  const updateDiscount = (value: number, type: "amount" | "percentage") => {
    const subtotal = items.list.reduce(
      (sum: any, item: any) => sum + item.charge,
      0
    );
    const discountAmount = type === "amount" ? value : (subtotal * value) / 100;
    const total = Math.max(subtotal - discountAmount, 0);

    setItems({
      ...items,
      discountType: type,
      discountValue: value,
      discountAmount,
      totalAmount: total,
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          placeholder="Item Name"
          value={items.newItem}
          onChange={(e) => setItems({ ...items, newItem: e.target.value })}
        />
        <input
          type="number"
          className="w-40 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          placeholder="Charge"
          value={items.newCharge}
          onChange={(e) => setItems({ ...items, newCharge: e.target.value })}
        />
        <button
          type="button"
          className="px-5 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all"
          onClick={addItem}
        >
          Add
        </button>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border-b border-gray-700">#</th>
              <th className="p-3 border-b border-gray-700">Item</th>
              <th className="p-3 border-b border-gray-700">Charge ($)</th>
              <th className="p-3 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.list.map((item: any, index: any) => (
              <tr key={index} className="hover:bg-gray-700 transition">
                <td className="p-3 border-b border-gray-700">{index + 1}</td>
                <td className="p-3 border-b border-gray-700">{item.name}</td>
                <td className="p-3 border-b border-gray-700 text-green-400 font-medium">
                  {item.charge.toFixed(2)}
                </td>
                <td className="p-3 border-b border-gray-700">
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-400 font-semibold"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {items.list.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-400">
                  No items added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary & Discount */}
      <div className="bg-gray-900 p-5 rounded-lg shadow-md space-y-4">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal:</span>
          <span className="text-green-400 font-semibold">
            $
            {items.list
              .reduce((sum: any, item: any) => sum + item.charge, 0)
              .toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
          <span className="text-gray-300 font-medium">Discount:</span>
          <input
            type="number"
            className="w-full md:w-32 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-500"
            min={0}
            value={items.discountValue === 0 ? "" : items.discountValue}
            onChange={(e) => {
              const val = e.target.value;
              // Allow blank field but treat it as 0 internally
              const parsed = val === "" ? 0 : Math.max(parseFloat(val), 0);
              updateDiscount(parsed, items.discountType);
            }}
          />

          <select
            className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={items.discountType}
            onChange={(e) =>
              updateDiscount(
                items.discountValue,
                e.target.value as "amount" | "percentage"
              )
            }
          >
            <option value="amount">Dollar ($)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>

        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
          <span className="text-lg font-semibold text-gray-200">Total:</span>
          <span className="text-xl font-bold text-green-400">
            ${items.totalAmount?.toFixed(2) ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};
