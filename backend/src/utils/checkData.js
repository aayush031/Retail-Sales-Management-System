/**
 * Data Verification Utility
 * 
 * Verifies that CSV data was successfully imported into MongoDB.
 * Displays statistics and sample records for validation.
 * 
 * Usage: node backend/src/utils/checkData.js
 */

const mongoose = require("mongoose");
const Sales = require("../models/Sales");

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/retail_sales";

/**
 * Establishes MongoDB connection
 */
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB\n");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

/**
 * Formats currency value for display
 */
function formatCurrency(amount) {
  return `₹${(amount || 0).toLocaleString("en-IN")}`;
}

/**
 * Formats date for display
 */
function formatDate(dateValue) {
  if (!dateValue) return "N/A";
  return new Date(dateValue).toLocaleDateString("en-IN");
}

/**
 * Main verification function
 */
async function verifyData() {
  try {
    await connectToDatabase();

    const totalCount = await Sales.countDocuments();
    console.log(`Total records in database: ${totalCount.toLocaleString()}\n`);

    if (totalCount === 0) {
      console.log("No data found! CSV import may not have completed.");
      await mongoose.disconnect();
      return;
    }

    // Display sample records
    const sampleRecords = await Sales.find().limit(5).lean();
    console.log("Sample records (first 5):\n");
    sampleRecords.forEach((record, index) => {
      console.log(`${index + 1}. Customer: ${record.customerName || "N/A"}`);
      console.log(`   Product: ${record.productName || "N/A"}`);
      console.log(`   Amount: ${formatCurrency(record.finalAmount)}`);
      console.log(`   Date: ${formatDate(record.date)}\n`);
    });

    // Calculate statistics
    const [uniqueCustomers, uniqueProducts, revenueResult] = await Promise.all([
      Sales.distinct("customerName").then((arr) => arr.filter(Boolean).length),
      Sales.distinct("productName").then((arr) => arr.filter(Boolean).length),
      Sales.aggregate([
        { $group: { _id: null, total: { $sum: "$finalAmount" } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    console.log("Database Statistics:");
    console.log(`   Unique Customers: ${uniqueCustomers.toLocaleString()}`);
    console.log(`   Unique Products: ${uniqueProducts.toLocaleString()}`);
    console.log(`   Total Revenue: ${formatCurrency(totalRevenue)}\n`);

    console.log("Data verification completed successfully!\n");
  } catch (error) {
    console.error("Verification error:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
  }
}

// Execute verification if run directly
if (require.main === module) {
  verifyData();
}

module.exports = { verifyData };

