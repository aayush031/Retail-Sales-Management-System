import React from "react";

export default function SalesTable({ sales }) {
  if (!sales || sales.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sales found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters to find results.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    return new Date(dateValue).toISOString().split('T')[0];
  };

  const formatQuantity = (qty) => {
    return String(qty || 0).padStart(2, '0');
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transaction ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Age</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((record, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.customerId || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatDate(record.date)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.customerId || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.customerName || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                <span className="flex items-center">
                  {record.phoneNumber || 'N/A'}
                  <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.gender || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.age || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{record.productCategory || 'N/A'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatQuantity(record.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
