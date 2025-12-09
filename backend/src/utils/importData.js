/**
 * CSV Data Import Utility
 * 
 * Imports sales transaction data from CSV file into MongoDB.
 * Optimized for large datasets using batch processing.
 * 
 * Usage: node backend/src/utils/importData.js
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const Sales = require("../models/Sales");

// Load environment variables so the importer uses the same connection string as the server
require("dotenv").config();

// Configuration
// Default matches the API server fallback to avoid importing into a different DB
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://test:0f8pNzjFItIFRJ8O@test.n8vably.mongodb.net/retail_sales?retryWrites=true&w=majority";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 5000;

// Allow overriding CSV path via env; default to project root CSV
const CSV_FILE_PATH =
  process.env.CSV_FILE_PATH ||
  path.join(process.cwd(), "truestate_assignment_dataset.csv");

// State tracking
const batch = [];
let totalProcessed = 0;
let totalInserted = 0;
let totalErrors = 0;

/**
 * Establishes MongoDB connection
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

/**
 * Inserts a batch of records into the database
 * @param {Array} batchData - Array of sales record objects
 */
async function insertBatch(batchData) {
  if (batchData.length === 0) return;
  
  try {
    await Sales.insertMany(batchData, { ordered: false });
    totalInserted += batchData.length;
    console.log(
      `Batch inserted: ${batchData.length} records | Total inserted: ${totalInserted}`
    );
  } catch (error) {
    totalErrors += batchData.length;
    console.error(`Batch insertion error:`, error.message);
  }
}

/**
 * Converts CSV row data to database record format
 * @param {Object} csvRow - Raw CSV row data
 * @returns {Object} Formatted sales record
 */
function transformCsvRow(csvRow) {
  const parseNumber = (value, defaultValue = 0) => {
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const parseDate = (value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };

  // Helper to get CSV value with multiple possible column name variations
  const getCsvValue = (possibleNames) => {
    for (const name of possibleNames) {
      const value = csvRow[name];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return String(value).trim();
      }
    }
    return null;
  };

  return {
    customerId: getCsvValue(["Customer ID", "CustomerID", "customer_id"]) || null,
    customerName: getCsvValue(["Customer Name", "CustomerName", "customer_name"]) || null,
    phoneNumber: getCsvValue(["Phone Number", "PhoneNumber", "phone_number"]) || null,
    gender: getCsvValue(["Gender", "gender"]) || null,
    age: parseNumber(csvRow["Age"] || csvRow["age"], 0),
    customerRegion: getCsvValue(["Customer Region", "CustomerRegion", "customer_region"]) || null,
    customerType: getCsvValue(["Customer Type", "CustomerType", "customer_type"]) || null,
    productId: getCsvValue(["Product ID", "ProductID", "product_id"]) || null,
    productName: getCsvValue(["Product Name", "ProductName", "product_name"]) || null,
    brand: getCsvValue(["Brand", "brand"]) || null,
    productCategory: getCsvValue(["Product Category", "ProductCategory", "product_category", "Product_Category"]) || null,
    tags: getCsvValue(["Tags", "tags"]) || null,
    quantity: parseNumber(csvRow["Quantity"] || csvRow["quantity"], 0),
    pricePerUnit: parseNumber(csvRow["Price per Unit"] || csvRow["PricePerUnit"] || csvRow["price_per_unit"], 0),
    discountPercentage: parseNumber(csvRow["Discount Percentage"] || csvRow["DiscountPercentage"] || csvRow["discount_percentage"], 0),
    totalAmount: parseNumber(csvRow["Total Amount"] || csvRow["TotalAmount"] || csvRow["total_amount"], 0),
    finalAmount: parseNumber(csvRow["Final Amount"] || csvRow["FinalAmount"] || csvRow["final_amount"], 0),
    date: parseDate(csvRow["Date"] || csvRow["date"]),
    paymentMethod: getCsvValue(["Payment Method", "PaymentMethod", "payment_method"]) || null,
    orderStatus: getCsvValue(["Order Status", "OrderStatus", "order_status"]) || null,
    deliveryType: getCsvValue(["Delivery Type", "DeliveryType", "delivery_type"]) || null,
    storeId: getCsvValue(["Store ID", "StoreID", "store_id"]) || null,
    storeLocation: getCsvValue(["Store Location", "StoreLocation", "store_location"]) || null,
    salespersonId: getCsvValue(["Salesperson ID", "SalespersonID", "salesperson_id"]) || null,
    employeeName: getCsvValue(["Employee Name", "EmployeeName", "employee_name"]) || null,
  };
}

/**
 * Main import execution function
 */
async function executeImport() {
  await connectToDatabase();

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`CSV file not found at: ${CSV_FILE_PATH}`);
    console.error(
      "Set CSV_FILE_PATH env var to the full path of your CSV (e.g., C:\\data\\truestate_assignment_dataset.csv)"
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log("Starting CSV import process...");
  console.log(`Source file: ${CSV_FILE_PATH}`);
  console.log(`Batch size: ${BATCH_SIZE} records\n`);

  const startTime = Date.now();

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on("data", async (csvRow) => {
      const record = transformCsvRow(csvRow);
      batch.push(record);
      totalProcessed++;

      if (batch.length >= BATCH_SIZE) {
        const batchToInsert = batch.splice(0, BATCH_SIZE);
        await insertBatch(batchToInsert);
      }
    })
    .on("end", async () => {
      if (batch.length > 0) {
        await insertBatch(batch);
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log("\nImport process completed!");
      console.log(`Records processed: ${totalProcessed}`);
      console.log(`Records inserted: ${totalInserted}`);
      console.log(`Duration: ${duration} seconds`);

      if (totalErrors > 0) {
        console.log(`Errors encountered: ${totalErrors}`);
      }

      await mongoose.disconnect();
      process.exit(0);
    })
    .on("error", async (error) => {
      console.error("CSV file read error:", error.message);
      await mongoose.disconnect();
      process.exit(1);
    });
}

// Execute import if run directly
if (require.main === module) {
  executeImport();
}

module.exports = { executeImport, transformCsvRow };
