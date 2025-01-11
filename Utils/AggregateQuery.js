const productModel = require("../Schemas/productSchema");
class AggregateQuery {
  constructor(productSku) {
    this.productSku = productSku;
  }
  async getBestSupplier(productSku) {
    const aggregation = await productModel.aggregate([
      {
        $lookup: {
          from: "suppliers",
          localField: "sku",
          foreignField: "sellingProducts.sku",
          as: "supplierDetails",
        },
      },
      {
        $unwind: "$supplierDetails",
      },
      {
        $unwind: "$supplierDetails.sellingProducts",
      },
      {
        $match: {
          $and: [
            { "supplierDetails.sellingProducts.sku": productSku },
            {
              $expr: {
                $gte: ["$supplierDetails.sellingProducts.quantity", 2], //need to change this dynamically
              },
            },
            //MOQ logic will be written on the sum of all ordered quantity to the specefic suppler.
          ],
        },
      },
      {
        $addFields: {
          totalPrice: {
            $add: [
              "$supplierDetails.sellingProducts.price",
              "$supplierDetails.packagingCharges",
            ],
          },
        },
      },
      {
        $sort: {
          totalPrice: 1,
          rating: -1,
        },
      },
      {
        $limit: 1
      },
      {
        $project: {
          supplierId: "$supplierDetails._id",
          _id: 0
        }
      }
    ]);
    return aggregation;
  }
}

module.exports = new AggregateQuery();
