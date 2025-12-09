import axios from "axios";

// Fetches sales records from the API endpoint
export async function getSales(requestParams) {
  // Removes empty values to keep query string clean
  const queryString = Object.entries(requestParams || {})
    .filter(([key, val]) => val !== undefined && val !== "" && val !== null && !(Array.isArray(val) && val.length === 0))
    .map(([key, val]) =>
      Array.isArray(val)
        ? `${key}=${val.join(",")}`
        : `${key}=${encodeURIComponent(val)}`
    ).join("&");
  const endpoint = `/api/sales${queryString ? `?${queryString}` : ""}`;
  const response = await axios.get(endpoint);
  return response.data;
}
