import React, { useEffect, useState } from "react";
import { getFilterOptions } from "../services/filterService";
import MultiSelectDropdown from "./MultiSelectDropdown";

export default function FilterPanel({ filters, onChange, onClearSearch }) {
  const [availableOptions, setAvailableOptions] = useState({
    customerRegion: [],
    gender: [],
    productCategory: [],
    brand: [],
    tags: [],
    paymentMethod: [],
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Loads available filter selections when component mounts or when categories change
  useEffect(() => {
    async function fetchFilterSelections() {
      try {
        const selectedCategories = filters.productCategory || [];
        const selections = await getFilterOptions(selectedCategories);
        setAvailableOptions(selections);
      } catch (err) {
        console.error("Failed to load filter options:", err);
        // Set default options on error
        setAvailableOptions({
          customerRegion: [],
          gender: ["Male", "Female"],
          productCategory: [],
          brand: [],
          tags: [],
          paymentMethod: [],
        });
      } finally {
        setIsLoadingOptions(false);
      }
    }
    fetchFilterSelections();
  }, [filters.productCategory]);

  // Validates and updates age range inputs
  const updateAgeRange = (boundary, inputValue) => {
    const numericValue = inputValue === "" ? "" : Number(inputValue);
    
    if (inputValue !== "" && (isNaN(numericValue) || numericValue < 0 || numericValue > 150)) {
      return;
    }

    const updatedMin = boundary === "min" ? inputValue : filters.ageMin;
    const updatedMax = boundary === "max" ? inputValue : filters.ageMax;

    if (updatedMin && updatedMax && Number(updatedMin) > Number(updatedMax)) {
      console.warn("Minimum age exceeds maximum. No results will be returned.");
    }

    onChange({
      ageMin: updatedMin,
      ageMax: updatedMax,
    });
  };

  // Validates and updates date range inputs
  const updateDateRange = (boundary, inputValue) => {
    const updatedStart = boundary === "start" ? inputValue : filters.dateStart;
    const updatedEnd = boundary === "end" ? inputValue : filters.dateEnd;

    if (updatedStart && updatedEnd && new Date(updatedStart) > new Date(updatedEnd)) {
      console.warn("Start date is later than end date. No results will be returned.");
    }

    onChange({
      dateStart: updatedStart,
      dateEnd: updatedEnd,
    });
  };

  // Resets all filter selections
  const resetAllFilters = () => {
    onChange({
      customerRegion: [],
      gender: [],
      ageMin: "",
      ageMax: "",
      productCategory: [],
      brand: [],
      tags: [],
      paymentMethod: [],
      dateStart: "",
      dateEnd: "",
    });
    if (onClearSearch) {
      onClearSearch();
    }
  };

  if (isLoadingOptions) {
    return <div className="text-sm text-gray-500">Loading filters...</div>;
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={resetAllFilters}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Clear all filters"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <MultiSelectDropdown
        label="Customer Region"
        options={availableOptions.customerRegion}
        selected={filters.customerRegion || []}
        onChange={(selected) => onChange({ customerRegion: selected })}
        placeholder="Customer Region"
      />

      <MultiSelectDropdown
        label="Gender"
        options={availableOptions.gender}
        selected={filters.gender || []}
        onChange={(selected) => onChange({ gender: selected })}
        placeholder="Gender"
      />

      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min Age"
          min="0"
          max="150"
          value={filters.ageMin || ""}
          onChange={(e) => updateAgeRange("min", e.target.value)}
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 ${
            filters.ageMin && filters.ageMax && Number(filters.ageMin) > Number(filters.ageMax)
              ? "border-red-300"
              : "border-gray-300"
          }`}
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder="Max Age"
          min="0"
          max="150"
          value={filters.ageMax || ""}
          onChange={(e) => updateAgeRange("max", e.target.value)}
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 ${
            filters.ageMin && filters.ageMax && Number(filters.ageMin) > Number(filters.ageMax)
              ? "border-red-300"
              : "border-gray-300"
          }`}
        />
      </div>

      <MultiSelectDropdown
        label="Product Category"
        options={availableOptions.productCategory}
        selected={filters.productCategory || []}
        onChange={(selected) => {
          onChange({ 
            productCategory: selected,
            brand: [] // Clear brand filter when categories change
          });
        }}
        placeholder="Product Category"
      />

      {/* Brand subfilter - only shows when product categories are selected */}
      {filters.productCategory && filters.productCategory.length > 0 && (
        <MultiSelectDropdown
          label="Brand"
          options={availableOptions.brand || []}
          selected={filters.brand || []}
          onChange={(selected) => onChange({ brand: selected })}
          placeholder="Brand"
        />
      )}

      <MultiSelectDropdown
        label="Tags"
        options={availableOptions.tags}
        selected={filters.tags || []}
        onChange={(selected) => onChange({ tags: selected })}
        placeholder="Tags"
      />

      <MultiSelectDropdown
        label="Payment Method"
        options={availableOptions.paymentMethod}
        selected={filters.paymentMethod || []}
        onChange={(selected) => onChange({ paymentMethod: selected })}
        placeholder="Payment Method"
      />

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.dateStart || ""}
          onChange={(e) => updateDateRange("start", e.target.value)}
          max={filters.dateEnd || undefined}
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            filters.dateStart && filters.dateEnd && new Date(filters.dateStart) > new Date(filters.dateEnd)
              ? "border-red-300"
              : "border-gray-300"
          }`}
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={filters.dateEnd || ""}
          onChange={(e) => updateDateRange("end", e.target.value)}
          min={filters.dateStart || undefined}
          className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            filters.dateStart && filters.dateEnd && new Date(filters.dateStart) > new Date(filters.dateEnd)
              ? "border-red-300"
              : "border-gray-300"
          }`}
        />
      </div>
    </div>
  );
}
