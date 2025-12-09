import React, { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select...",
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleExternalClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleExternalClick);
    return () => document.removeEventListener("mousedown", handleExternalClick);
  }, []);

  const handleOptionToggle = (optionValue) => {
    const updatedSelection = selected.includes(optionValue)
      ? selected.filter((item) => item !== optionValue)
      : [...selected, optionValue];
    onChange(updatedSelection);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] text-left flex items-center justify-between"
      >
        <span className={selected.length === 0 ? "text-gray-400" : ""}>
          {selected.length === 0 ? placeholder : `${selected.length} selected`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {selected.length > 0 && (
          <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {selected.length}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((optionValue) => (
              <label
                key={optionValue}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(optionValue)}
                  onChange={() => handleOptionToggle(optionValue)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{optionValue}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

