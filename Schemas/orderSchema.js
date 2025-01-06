const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 }, 
  subtotal: { type: Number, required: true },
  taxes: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  billingName: { type: String, required: true },
  billingAddress: { type: String, required: true },
  customerName: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
});

module.exports = mongoose.model('Order', orderSchema);