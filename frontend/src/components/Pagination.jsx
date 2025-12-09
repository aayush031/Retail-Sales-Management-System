import React from "react";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  if (!total || total === 0) {
    return null;
  }
  
  const itemsPerPage = Math.max(1, pageSize || 10);
  const pageCount = Math.max(1, Math.ceil(total / itemsPerPage));
  const activePage = Math.min(Math.max(1, page || 1), pageCount);
  const maxPageButtons = 6;

  // Determines which page numbers should be displayed
  let firstVisiblePage = Math.max(1, activePage - 2);
  let lastVisiblePage = Math.min(pageCount, firstVisiblePage + maxPageButtons - 1);
  if (lastVisiblePage - firstVisiblePage < maxPageButtons - 1) {
    firstVisiblePage = Math.max(1, lastVisiblePage - maxPageButtons + 1);
  }

  const pageNumbers = [];
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(Math.max(1, activePage - 1))}
        disabled={activePage <= 1}
        className={`px-4 py-2 rounded transition border border-gray-300 ${activePage <= 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
      >
        Previous
      </button>

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-4 py-2 rounded transition ${pageNum === activePage
              ? "bg-gray-800 text-white font-semibold"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(pageCount, activePage + 1))}
        disabled={activePage >= pageCount}
        className={`px-4 py-2 rounded transition border border-gray-300 ${activePage >= pageCount
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
      >
        Next
      </button>
    </div>
  );
}
