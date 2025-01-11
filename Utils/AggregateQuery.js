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
            { "allSellerDetails.sellingProducts.sku": productSku }, 
            { $gt: ["allSellerDetails.sellingProducts.quantity", 0] },
          ],
        },
      },
      {
        $addFields: {
          totalPrice: { $add: ["$allSellerDetails.sellingProducts.price", "$allSellerDetails.packagingCharges"] },
        },
      },
      {
        $sort:1
      },
      {
        $limit:1
      }
    ]);

    console.log(aggregation);
  }
}

module.exports = new AggregateQuery();
