import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import SortDropdown from "./SortDropdown";
import SummaryCards from "./SummaryCards";
import SalesTable from "./SalesTable";
import Pagination from "./Pagination";
import { getSales } from "../services/salesService";

// Default filter configuration
const DEFAULT_FILTER_STATE = {
  customerRegion: [],
  gender: [],
  ageMin: '',
  ageMax: '',
  productCategory: [],
  brand: [],
  tags: [],
  paymentMethod: [],
  dateStart: '',
  dateEnd: ''
};

export default function App() {
  const [userSearchInput, setUserSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTER_STATE);
  const [sortField, setSortField] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesData, setSalesData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Implements search debouncing to reduce API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(userSearchInput);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [userSearchInput]);

  // Retrieves sales records when dependencies change
  useEffect(() => {
    async function loadSalesData() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const requestParams = {
          search: debouncedSearchTerm ? debouncedSearchTerm.trim() : "",
          customerRegion: Array.isArray(activeFilters.customerRegion) ? activeFilters.customerRegion.filter(Boolean) : [],
          gender: Array.isArray(activeFilters.gender) ? activeFilters.gender.filter(Boolean) : [],
          ageMin: activeFilters.ageMin && !isNaN(Number(activeFilters.ageMin)) ? Number(activeFilters.ageMin) : undefined,
          ageMax: activeFilters.ageMax && !isNaN(Number(activeFilters.ageMax)) ? Number(activeFilters.ageMax) : undefined,
          productCategory: Array.isArray(activeFilters.productCategory) ? activeFilters.productCategory.filter(Boolean) : [],
          brand: Array.isArray(activeFilters.brand) ? activeFilters.brand.filter(Boolean) : [],
          tags: Array.isArray(activeFilters.tags) ? activeFilters.tags.filter(Boolean) : [],
          paymentMethod: Array.isArray(activeFilters.paymentMethod) ? activeFilters.paymentMethod.filter(Boolean) : [],
          dateStart: activeFilters.dateStart || undefined,
          dateEnd: activeFilters.dateEnd || undefined,
          sortBy: sortField || "date",
          page: Math.max(1, Number(currentPage) || 1),
          pageSize: 10
        };
        
        const response = await getSales(requestParams);
        setSalesData(response.sales || []);
        setTotalRecords(response.total || 0);
        
        if (response.total === 0 && currentPage > 1) {
          setCurrentPage(1);
        }
      } catch (err) {
        setErrorMessage(err.message || "Failed to load sales data. Please retry.");
        setSalesData([]);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    }
    loadSalesData();
  }, [debouncedSearchTerm, activeFilters, sortField, currentPage]);

  const updateFilters = (updatedFilters) => {
    setActiveFilters(prev => ({ ...prev, ...updatedFilters }));
    setCurrentPage(1);
  };
  
  const onSearchInputChange = (inputValue) => {
    setUserSearchInput(inputValue);
  };
  
  const clearSearch = () => {
    setUserSearchInput("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales Management System</h1>
          <div className="w-80">
            <SearchBar value={userSearchInput} onChange={onSearchInputChange} onClear={clearSearch} />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <FilterPanel filters={activeFilters} onChange={updateFilters} onClearSearch={clearSearch} />
          <SortDropdown value={sortField} onChange={setSortField} />
        </div>

        <SummaryCards sales={salesData} />

        <div className="mb-6">
          {isLoading ? (
            <div className="text-center text-blue-500 py-8">Loading…</div>
          ) : errorMessage ? (
            <div className="text-center text-red-500 py-8">{errorMessage}</div>
          ) : (
            <SalesTable sales={salesData} />
          )}
        </div>

        <Pagination
          page={currentPage}
          pageSize={10}
          total={totalRecords}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
