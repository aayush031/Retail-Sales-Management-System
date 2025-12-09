const mongoose = require("mongoose");

/**
 * Sales Transaction Schema
 * 
 * Represents a single sales transaction record with customer,
 * product, and transaction details.
 */
const salesSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    customerRegion: {
      type: String,
      trim: true,
    },
    customerType: {
      type: String,
      trim: true,
    },
    productId: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    productCategory: {
      type: String,
      trim: true,
    },
    tags: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    pricePerUnit: {
      type: Number,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
    finalAmount: {
      type: Number,
      min: 0,
    },
    date: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    orderStatus: {
      type: String,
      trim: true,
    },
    deliveryType: {
      type: String,
      trim: true,
    },
    storeId: {
      type: String,
      trim: true,
    },
    storeLocation: {
      type: String,
      trim: true,
    },
    salespersonId: {
      type: String,
      trim: true,
    },
    employeeName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
    collection: "sales",
  }
);

// Indexes for improved query performance
salesSchema.index({ date: -1 });
salesSchema.index({ customerRegion: 1 });
salesSchema.index({ productCategory: 1 });
salesSchema.index({ customerName: 1 });

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
