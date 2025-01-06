const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  length: {
    type: Number,
    default: 1,
    min: [0, "Length cannot be negative"],
  },
  width: {
    type: Number,
    default: 1,
    min: [0, "Width cannot be negative"],
  },
  height: {
    type: Number,
    default: 1,
    min: [0, "Height cannot be negative"],
  },
  weight: {
    type: Number,
    default: 1,
    min: [0, "Weight cannot be negative"],
    required: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  category: {
    type: String,
    required: false,
    trim: true,
  },
  colour: {
    type: String,
    required: false,
    trim: true,
  },
  stockQuantity: {
    type: Number,
    default: 1000,
    min: [0, "Stock quantity cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the schema
module.exports = mongoose.model('Product', productSchema);
