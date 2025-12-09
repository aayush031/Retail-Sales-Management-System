import React from "react";

export default function SummaryCards({ sales }) {
  if (!sales || !Array.isArray(sales) || sales.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total units sold</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Amount</div>
          <div className="text-2xl font-bold">₹0</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Discount</div>
          <div className="text-2xl font-bold">₹0</div>
        </div>
      </div>
    );
  }

  // Aggregates sales metrics from the dataset
  const calculateTotalUnits = () => {
    return sales.reduce((accumulator, record) => {
      const quantity = record?.quantity;
      return accumulator + (quantity !== undefined && quantity !== null && !isNaN(Number(quantity)) ? Number(quantity) : 0);
    }, 0);
  };
  
  const calculateTotalRevenue = () => {
    return sales.reduce((accumulator, record) => {
      const revenue = record?.finalAmount;
      return accumulator + (revenue !== undefined && revenue !== null && !isNaN(Number(revenue)) ? Number(revenue) : 0);
    }, 0);
  };
  
  const calculateTotalSavings = () => {
    return sales.reduce((accumulator, record) => {
      const originalPrice = record?.totalAmount || 0;
      const discountedPrice = record?.finalAmount || 0;
      return accumulator + (Math.max(0, originalPrice - discountedPrice));
    }, 0);
  };
  
  const totalUnits = calculateTotalUnits();
  const totalAmount = calculateTotalRevenue();
  const totalDiscount = calculateTotalSavings();
  const uniqueSRs = new Set(sales.map(record => record?.salespersonId).filter(Boolean)).size;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Total units sold */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total units sold</div>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">({uniqueSRs} SRs)</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Total Discount */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Discount</div>
            <div className="text-2xl font-bold">₹{totalDiscount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">({uniqueSRs} SRs)</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

