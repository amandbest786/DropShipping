const ProductModel = require("../Schemas/productSchema");

class Product {
  constructor() {}

  async addProduct(req, res) {
    try {
      const savedProduct = await ProductModel.create(req.body);
      console.log(`Product added successfully. ID: ${savedProduct._id}`);
      return res.status(201).json(savedProduct);
    } catch (error) {
      console.error(`Error adding product: ${error.message}`);
      return res.status(500).json({ error: "Error adding product" });
    }
  }

  async getProducts(req, res) {
    try {
      const query = JSON.parse(req.query.query) || {};
      const products = await ProductModel.find(query);
      if (!products.length) {
        console.log(`No products found matching the query.`);
        return res.status(404).json({ message: "No products found" });
      }
      return res.status(200).json(products);
    } catch (error) {
      console.error(`Error fetching products: ${error.message}`);
      return res.status(500).json({ error: "Error fetching products" });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.error(`Error fetching product by ID: ${error.message}`);
      return res.status(500).json({ error: "Error fetching product" });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updatedData = req.body;
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        updatedData,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log(`Product updated successfully. ID: ${updatedProduct._id}`);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(`Error updating product: ${error.message}`);
      return res.status(500).json({ error: "Error updating product" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log(`Product deleted successfully. ID: ${deletedProduct._id}`);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(`Error deleting product: ${error.message}`);
      return res.status(500).json({ error: "Error deleting product" });
    }
  }
}

module.exports = new Product();
