const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const salesRoutes = require("./routes/salesRoutes");

const app = express();

// Configuration constants
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/retail_sales";
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with error handling
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection established successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

// API route registration
app.use("/api/sales", salesRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "operational",
    service: "Retail Sales Management System API",
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Application error:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "An unexpected error occurred",
    status: "error",
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    status: "error",
  });
});

// Server initialization
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/sales`);
});
