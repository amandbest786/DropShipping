const express = require("express");
const router = express.Router();
const supplier = require('./Controllers/supplier');
const product = require('./Controllers/product');
const order = require('./Controllers/order');

//Product Routes
router.post('/Add-Product', product.addProduct);
router.get('/Get-Products', product.getProducts);
router.get('/Get-Product-Byid/:id', product.getProductById);
router.patch('/Update-Product/:id', product.updateProduct);
router.delete('/Delete-Product/:id', product.deleteProduct);

//Supplier Routes
router.post('/Add-Supplier', supplier.addSupplier);
router.get('/Get-Supplier', supplier.getSuppliers);
router.get('/Get-Supplier-Byid/:id', supplier.getSupplierById);
router.patch('/Update-Supplier/:id', supplier.updateSupplier);
router.delete('/Delete-Supplier/:id', supplier.deleteSupplier);

//Order Routes
router.post('/Place-Order', order.placeOrder);

//Shopify Routes
router.post('/Place-Order', order.placeOrder);

module.exports = router;