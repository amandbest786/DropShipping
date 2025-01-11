const mongoose = require("mongoose");
const ProductModel = require("../Schemas/productSchema");
const SupplierModel = require("../Schemas/supplierSchema");
const OrderModel = require("../Schemas/orderSchema");
const invoiceInstance = require("./invoice");
const AggregateQuery = require("../Utils/AggregateQuery");

class Order {
  constructor() {}

  // Use an arrow function to preserve the context of 'this'
  placeOrder = async (req, res) => {
    try {
      const orderDetails = req.body;
      const response = { productNotFound: [], supplierNotFound: [] };

      const processedOrders = await Promise.all(
        orderDetails.map(async (order) => {
          const sku = order["Lineitem sku"];
          const aggregationResult = await AggregateQuery.getBestSupplier(sku);
          console.log(aggregationResult);
          const supplierDetails = await SupplierModel.findById(
            aggregationResult[0].supplierId
          );
          return { order, supplier: supplierDetails };
        })
      );

      // Filter out unsuccessful orders (product not found, supplier not found)
      const successfulOrders = processedOrders.filter(Boolean);

      // Group successful orders by supplier GSTIN
      const groupedOrders = successfulOrders.reduce((acc, curr) => {
        const gstin = curr.supplier.gstin;
        if (acc[gstin]) {
          acc[gstin].orderDetails.push(curr.order);
        } else {
          acc[gstin] = {
            supplierDetails: curr.supplier,
            orderDetails: [curr.order],
          };
        }
        return acc;
      }, {});

      const finalResponse = Object.values(groupedOrders);
      if (!finalResponse.length) {
        return res
          .status(400)
          .json(`Order can't be processed. No Suppliers present.`);
      }

      // Create invoice by calling the class method
      const invoiceDetails = await invoiceInstance.createSellerInvoice(
        finalResponse
      );

      for (let ele of invoiceDetails) {
        const savedOrder = await OrderModel.create(ele);
        console.log(`Order added successfully. ID: ${savedOrder._id}`);
      }

      return res.status(201).json(response);
    } catch (error) {
      console.error(`Error placing order: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Error placing order: ${error.message}` });
    }
  };
}

module.exports = new Order();
