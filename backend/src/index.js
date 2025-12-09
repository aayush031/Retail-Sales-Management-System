const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const salesRoutes = require("./routes/salesRoutes");

require("dotenv").config(); // To load environment variables

const app = express();

// MongoDB Connection String (Secure using .env)
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://test:0f8pNzjFItIFRJ8O@test.n8vably.mongodb.net/retail_sales?retryWrites=true&w=majority";

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/sales", salesRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Retail Sales API Running...",
    status: "success",
    time: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
