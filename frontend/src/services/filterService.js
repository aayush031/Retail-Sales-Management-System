import axios from "axios";

// Retrieves available filter selections from the API
export async function getFilterOptions(selectedCategories = []) {
  const queryParams = selectedCategories.length > 0
    ? `?categories=${selectedCategories.join(",")}`
    : "";
  const response = await axios.get(`/api/sales/filter-options${queryParams}`);
  return response.data;
}
