import React from "react";

export default function SortDropdown({ value, onChange }) {
  const sortingChoices = {
    date: "Date (Newest First)",
    quantity: "Quantity",
    customerName: "Customer Name (A-Z)"
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="date">{sortingChoices.date}</option>
        <option value="quantity">{sortingChoices.quantity}</option>
        <option value="customerName">{sortingChoices.customerName}</option>
      </select>
    </div>
  );
}
