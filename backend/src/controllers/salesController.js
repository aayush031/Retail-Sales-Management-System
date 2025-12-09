const salesService = require("../services/salesService");

// Handles incoming sales data requests
exports.getSales = async (req, res) => {
  try {
    const requestParams = {
      search: req.query.search ? String(req.query.search).trim() : "",
      customerRegion: req.query.customerRegion
        ? req.query.customerRegion.split(",")
        : [],
      gender: req.query.gender ? req.query.gender.split(",") : [],
      ageMin: req.query.ageMin ? Number(req.query.ageMin) : undefined,
      ageMax: req.query.ageMax ? Number(req.query.ageMax) : undefined,
      productCategory: req.query.productCategory
        ? req.query.productCategory.split(",")
        : [],
      brand: req.query.brand ? req.query.brand.split(",") : [],
      tags: req.query.tags ? req.query.tags.split(",") : [],
      paymentMethod: req.query.paymentMethod
        ? req.query.paymentMethod.split(",")
        : [],
      dateStart: req.query.dateStart,
      dateEnd: req.query.dateEnd,
      sortBy: req.query.sortBy || "date",
      page: req.query.page || 1,
      pageSize: req.query.pageSize || 10,
    };
    
    const result = await salesService.getSales(requestParams);
    res.json({ total: result.total, sales: result.sales });
  } catch (err) {
    console.error("Sales retrieval failed:", err);
    res.status(500).json({ error: err.message || "Server encountered an error" });
  }
};

// Retrieves available filter selections
exports.getFilterOptions = async (req, res) => {
  try {
    // Get selected categories from query params for subfilter (brands)
    const selectedCategories = req.query.categories
      ? req.query.categories.split(",").filter(Boolean)
      : [];
    
    const filterData = await salesService.getFilterOptions(selectedCategories);
    res.json(filterData);
  } catch (err) {
    console.error("Filter options retrieval failed:", err);
    res.status(500).json({ error: err.message || "Server encountered an error" });
  }
};

