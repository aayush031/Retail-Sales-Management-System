const Sales = require("../models/Sales");

// Constructs MongoDB filter conditions from request parameters
function constructMongoFilter(filters) {
  const mongoFilter = {};

  // Process array-based filters
  const regionList = filters.customerRegion && Array.isArray(filters.customerRegion) && filters.customerRegion.length > 0;
  const genderList = filters.gender && Array.isArray(filters.gender) && filters.gender.length > 0;
  const categoryList = filters.productCategory && Array.isArray(filters.productCategory) && filters.productCategory.length > 0;
  const brandList = filters.brand && Array.isArray(filters.brand) && filters.brand.length > 0;

  if (regionList) {
    mongoFilter.customerRegion = { $in: filters.customerRegion.filter(Boolean) };
  }
  if (genderList) {
    mongoFilter.gender = { $in: filters.gender.filter(Boolean) };
  }
  if (categoryList) {
    mongoFilter.productCategory = { $in: filters.productCategory.filter(Boolean) };
  }
  if (brandList) {
    mongoFilter.brand = { $in: filters.brand.filter(Boolean) };
  }

  // Text search implementation across relevant fields
  if (filters.search && filters.search.trim()) {
    const searchText = filters.search.trim();
    // Sanitize input to prevent regex injection attacks
    const sanitizedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fieldMatches = [
      { customerName: { $regex: sanitizedSearch, $options: "i" } },
      { phoneNumber: { $regex: sanitizedSearch, $options: "i" } },
      { customerRegion: { $regex: sanitizedSearch, $options: "i" } },
      { gender: { $regex: sanitizedSearch, $options: "i" } },
      { productCategory: { $regex: sanitizedSearch, $options: "i" } }
    ];
    
    mongoFilter.$or = fieldMatches;
  }
  
  // Age filtering with bounds checking
  if (filters.ageMin !== undefined && filters.ageMin !== null && filters.ageMin !== "") {
    const minimumAge = Number(filters.ageMin);
    if (!isNaN(minimumAge) && minimumAge >= 0 && minimumAge <= 150) {
      if (filters.ageMax !== undefined && filters.ageMax !== null && filters.ageMax !== "") {
        const maximumAge = Number(filters.ageMax);
        if (!isNaN(maximumAge) && maximumAge >= 0 && maximumAge <= 150) {
          if (minimumAge <= maximumAge) {
            mongoFilter.age = { $gte: minimumAge, $lte: maximumAge };
          } else {
            mongoFilter.age = { $gte: 999, $lte: 0 };
          }
        } else {
          mongoFilter.age = { $gte: minimumAge };
        }
      } else {
        mongoFilter.age = { $gte: minimumAge };
      }
    }
  } else if (filters.ageMax !== undefined && filters.ageMax !== null && filters.ageMax !== "") {
    const maximumAge = Number(filters.ageMax);
    if (!isNaN(maximumAge) && maximumAge >= 0 && maximumAge <= 150) {
      mongoFilter.age = { $lte: maximumAge };
    }
  }

  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    mongoFilter.tags = { $in: filters.tags.filter(Boolean) };
  }
  if (filters.paymentMethod && Array.isArray(filters.paymentMethod) && filters.paymentMethod.length > 0) {
    mongoFilter.paymentMethod = { $in: filters.paymentMethod.filter(Boolean) };
  }
  
  // Date filtering with range validation
  if (filters.dateStart || filters.dateEnd) {
    mongoFilter.date = {};
    if (filters.dateStart) {
      const startDateTime = new Date(filters.dateStart);
      if (!isNaN(startDateTime.getTime())) {
        mongoFilter.date.$gte = startDateTime;
      }
    }
    if (filters.dateEnd) {
      const endDateTime = new Date(filters.dateEnd);
      if (!isNaN(endDateTime.getTime())) {
        endDateTime.setHours(23, 59, 59, 999);
        mongoFilter.date.$lte = endDateTime;
      }
    }
    if (mongoFilter.date.$gte && mongoFilter.date.$lte && mongoFilter.date.$gte > mongoFilter.date.$lte) {
      mongoFilter.date = { $gte: new Date("2099-12-31"), $lte: new Date("2000-01-01") };
    }
  }
  
  return mongoFilter;
}

exports.getSales = async function (filters) {
  try {
    const dbFilter = constructMongoFilter(filters);
    
    // Determine sort order based on user selection
    let sortCriteria = {};
    if (filters.sortBy === "date") {
      sortCriteria.date = -1;
      sortCriteria._id = -1;
    } else if (filters.sortBy === "quantity") {
      sortCriteria.quantity = -1;
      sortCriteria._id = -1;
    } else if (filters.sortBy === "customerName") {
      sortCriteria.customerName = 1;
      sortCriteria._id = 1;
    } else {
      sortCriteria.date = -1;
      sortCriteria._id = -1;
    }

    // Calculate pagination offsets
    const currentPage = Math.max(1, Math.floor(Number(filters.page)) || 1);
    const itemsPerPage = Math.min(100, Math.max(1, Math.floor(Number(filters.pageSize)) || 10));
    const offset = (currentPage - 1) * itemsPerPage;

    // Execute database queries
    let recordCount, salesRecords;
    try {
      [recordCount, salesRecords] = await Promise.all([
        Sales.countDocuments(dbFilter),
        Sales.find(dbFilter)
          .sort(sortCriteria)
          .skip(offset)
          .limit(itemsPerPage)
          .lean()
      ]);
    } catch (dbErr) {
      console.error("Database operation failed:", dbErr);
      return {
        total: 0,
        sales: [],
      };
    }

    // Normalize response data structure
    const normalizedRecords = salesRecords.map(record => ({
      customerId: record.customerId || null,
      customerName: record.customerName || null,
      phoneNumber: record.phoneNumber || null,
      gender: record.gender || null,
      age: record.age !== undefined && record.age !== null ? record.age : null,
      customerRegion: record.customerRegion || null,
      customerType: record.customerType || null,
      productId: record.productId || null,
      productName: record.productName || null,
      brand: record.brand || null,
      productCategory: record.productCategory || null,
      tags: record.tags || null,
      quantity: record.quantity !== undefined && record.quantity !== null ? record.quantity : 0,
      pricePerUnit: record.pricePerUnit !== undefined && record.pricePerUnit !== null ? record.pricePerUnit : 0,
      discountPercentage: record.discountPercentage !== undefined && record.discountPercentage !== null ? record.discountPercentage : 0,
      totalAmount: record.totalAmount !== undefined && record.totalAmount !== null ? record.totalAmount : 0,
      finalAmount: record.finalAmount !== undefined && record.finalAmount !== null ? record.finalAmount : 0,
      date: record.date || null,
      paymentMethod: record.paymentMethod || null,
      orderStatus: record.orderStatus || null,
      deliveryType: record.deliveryType || null,
      storeId: record.storeId || null,
      storeLocation: record.storeLocation || null,
      salespersonId: record.salespersonId || null,
      employeeName: record.employeeName || null,
    }));

    return {
      total: recordCount,
      sales: normalizedRecords,
    };
  } catch (err) {
    console.error("Sales retrieval service error:", err);
    throw err;
  }
};

// Fetches distinct values for filter dropdowns
exports.getFilterOptions = async function (selectedCategories = []) {
  try {
    const [regions, categories, tags, paymentMethods] =
      await Promise.all([
        Sales.distinct("customerRegion"),
        Sales.distinct("productCategory"), // Product categories from CSV data
        Sales.distinct("tags"),
        Sales.distinct("paymentMethod"),
      ]);

    // Filter out null, undefined, empty strings, and whitespace-only values
    const cleanCategories = categories
      .filter(cat => cat !== null && cat !== undefined && String(cat).trim() !== "")
      .map(cat => String(cat).trim())
      .filter((cat, index, self) => self.indexOf(cat) === index) // Remove duplicates
      .sort();

    // Log for debugging if no categories found
    if (cleanCategories.length === 0) {
      console.warn("No product categories found in database. Ensure CSV data has been imported with 'Product Category' column.");
      console.warn("Raw categories from database:", categories);
    }

    // Get brands - if categories are selected, filter brands by those categories
    let brands = [];
    if (selectedCategories && selectedCategories.length > 0) {
      const categoryFilter = { productCategory: { $in: selectedCategories } };
      brands = await Sales.distinct("brand", categoryFilter);
    } else {
      brands = await Sales.distinct("brand");
    }

    const cleanBrands = brands
      .filter(brand => brand !== null && brand !== undefined && String(brand).trim() !== "")
      .map(brand => String(brand).trim())
      .filter((brand, index, self) => self.indexOf(brand) === index) // Remove duplicates
      .sort();

    return {
      customerRegion: regions.filter(Boolean).sort(),
      gender: ["Male", "Female"],
      productCategory: cleanCategories, // Returns unique product categories from imported CSV data
      brand: cleanBrands, // Returns brands filtered by selected categories
      tags: tags.filter(Boolean).sort(),
      paymentMethod: paymentMethods.filter(Boolean).sort(),
    };
  } catch (err) {
    console.error("Filter options service error:", err);
    throw err;
  }
};
