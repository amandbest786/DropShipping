require("dotenv").config();
const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE_URL,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
});

class Shopify {
  constructor() {}

  async fetchProducts() {
    try {
      const products = await shopify.product.list();
      console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
}

module.exports = new Shopify();
