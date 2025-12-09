const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

/**
 * Sales API Routes
 * 
 * @route GET /api/sales
 * @description Retrieves sales records with support for search, filtering, sorting, and pagination
 * @query {string} search - Text search across multiple fields
 * @query {string} customerRegion - Comma-separated list of regions
 * @query {string} gender - Comma-separated list of genders
 * @query {number} ageMin - Minimum age filter
 * @query {number} ageMax - Maximum age filter
 * @query {string} productCategory - Comma-separated list of categories
 * @query {string} tags - Comma-separated list of tags
 * @query {string} paymentMethod - Comma-separated list of payment methods
 * @query {string} dateStart - Start date for date range filter
 * @query {string} dateEnd - End date for date range filter
 * @query {string} sortBy - Sort field (date, quantity, customerName)
 * @query {number} page - Page number for pagination
 * @query {number} pageSize - Number of records per page
 */
router.get("/", salesController.getSales);

/**
 * @route GET /api/sales/filter-options
 * @description Returns unique values available for each filter type
 * @returns {Object} Object containing arrays of unique values for each filter field
 */
router.get("/filter-options", salesController.getFilterOptions);

module.exports = router;
