const SupplierModel = require("../Schemas/supplierSchema");

class Supplier {
  constructor() {}

  async addSupplier(req, res) {
    try {
      const savedSupplier = await SupplierModel.create(req.body);
      console.log(`Supplier added successfully. ID: ${savedSupplier._id}`);
      return res.status(201).json(savedSupplier);
    } catch (error) {
      console.error(`Error adding supplier: ${error.message}`);
      return res.status(500).json({ error: "Error adding supplier" });
    }
  }

  async getSuppliers(req, res) {
    try {
      const query = req.query && req.query.query ? req.query.query : {};
      const suppliers = await SupplierModel.find(query);
      if (!suppliers.length) {
        console.log(`No suppliers found matching the query.`);
        return res.status(404).json({ message: "No suppliers found" });
      }
      return res.status(200).json(suppliers);
    } catch (error) {
      console.error(`Error fetching suppliers: ${error.message}`);
      return res.status(500).json({ error: "Error fetching suppliers" });
    }
  }

  async getSupplierById(req, res) {
    try {
      const supplierId = req.params.id;
      const supplier = await SupplierModel.findById(supplierId);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      return res.status(200).json(supplier);
    } catch (error) {
      console.error(`Error fetching supplier by ID: ${error.message}`);
      return res.status(500).json({ error: "Error fetching supplier" });
    }
  }

  async updateSupplier(req, res) {
    try {
      const supplierId = req.params.id;
      const updatedData = req.body;
      const updatedSupplier = await SupplierModel.findByIdAndUpdate(
        supplierId,
        updatedData,
        { new: true }
      );
      if (!updatedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      console.log(`Supplier updated successfully. ID: ${updatedSupplier._id}`);
      return res.status(200).json(updatedSupplier);
    } catch (error) {
      console.error(`Error updating supplier: ${error.message}`);
      return res.status(500).json({ error: "Error updating supplier" });
    }
  }

  async deleteSupplier(req, res) {
    try {
      const supplierId = req.params.id;
      const deletedSupplier = await SupplierModel.findByIdAndDelete(supplierId);
      if (!deletedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      console.log(`Supplier deleted successfully. ID: ${deletedSupplier._id}`);
      return res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
      console.error(`Error deleting supplier: ${error.message}`);
      return res.status(500).json({ error: "Error deleting supplier" });
    }
  }
}

const supplierInstance = new Supplier();

module.exports = supplierInstance;
