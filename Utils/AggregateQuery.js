const productModel = require("../Schemas/productSchema");
class AggregateQuery {
  constructor(productSku) {
    this.productSku = productSku;
  }
  async getBestSupplier(productSku) {
    const aggregation = await productModel.aggregate([
      {
        $match: {
          sku: productSku,
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "sku",
          foreignField: "sellingProducts.sku",
          as: "allSellerDetails",
        },
      },
      {
        $unwind: "allSellerDetails",
        $unwind: "allSellerDetails.sellingProducts",
      },
      {
        $match: {
          $and: [
            { "allSellerDetails.sellingProducts.sku": productSku }, // Filters documents where "sku" is "11111"
            { $gt: ["allSellerDetails.sellingProducts.quantity", 0] }, // Ensures the "quantity" is greater than 0
          ],
        },
      },
      {
        $addFields: {
          // Calculates total price including packaging charges
          totalPrice: { $add: ["$allSellerDetails.sellingProducts.price", "$allSellerDetails.packagingCharges"] },
        },
      },
      {
        $group: {
          // Groups by supplier ID and gets the minimum total price
          _id: "$_id",
          minPrice: { $min: "$totalPrice" },
        },
      },
      {
        $lookup: {
          // Joins back with the original supplier details
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $unwind: "$supplierDetails", // Deconstructs the "supplierDetails" array
      },
      {
        $match: {
          // Filters suppliers with the minimum total price
          minPrice: { $eq: "$supplierDetails.totalPrice" },
        },
      },
      {
        $project: {
          // Selects desired fields
          _id: 0, // Excludes "_id" field from the output
          supplierName: "$supplierDetails.supplierName",
          alternateName: "$supplierDetails.alternateName",
          gstin: "$supplierDetails.gstin",
          packagingCharges: "$supplierDetails.packagingCharges",
          moq: "$supplierDetails.moq",
          sellingProducts: {
            sku: "$sellingProducts.sku",
            quantity: "$sellingProducts.quantity",
            price: "$sellingProducts.price",
          },
          city: "$supplierDetails.city",
          state: "$supplierDetails.state",
          phone: "$supplierDetails.phone",
          email: "$supplierDetails.email",
          isActive: "$supplierDetails.isActive",
          minPrice: "$minPrice",
        },
      },
    ]);

    db.collection("suppliers").aggregate([
      {
        $unwind: "$sellingProducts", // Deconstructs the "sellingProducts" array
      },
      {
        $match: {
          $and: [
            { "sellingProducts.sku": "11111" }, // Filters documents where "sku" is "11111"
            { $gt: ["sellingProducts.quantity", 0] }, // Ensures the "quantity" is greater than 0
          ],
        },
      },
      {
        $addFields: {
          // Calculates total price including packaging charges
          totalPrice: { $add: ["$sellingProducts.price", "$packagingCharges"] },
        },
      },
      {
        $group: {
          // Groups by supplier ID and gets the minimum total price
          _id: "$_id",
          minPrice: { $min: "$totalPrice" },
        },
      },
      {
        $lookup: {
          // Joins back with the original supplier details
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $unwind: "$supplierDetails", // Deconstructs the "supplierDetails" array
      },
      {
        $match: {
          // Filters suppliers with the minimum total price
          minPrice: { $eq: "$supplierDetails.totalPrice" },
        },
      },
      {
        $project: {
          // Selects desired fields
          _id: 0, // Excludes "_id" field from the output
          supplierName: "$supplierDetails.supplierName",
          alternateName: "$supplierDetails.alternateName",
          gstin: "$supplierDetails.gstin",
          packagingCharges: "$supplierDetails.packagingCharges",
          moq: "$supplierDetails.moq",
          sellingProducts: {
            sku: "$sellingProducts.sku",
            quantity: "$sellingProducts.quantity",
            price: "$sellingProducts.price",
          },
          city: "$supplierDetails.city",
          state: "$supplierDetails.state",
          phone: "$supplierDetails.phone",
          email: "$supplierDetails.email",
          isActive: "$supplierDetails.isActive",
          minPrice: "$minPrice",
        },
      },
    ]);

    console.log(aggregation);
  }
}

module.exports = new AggregateQuery();
