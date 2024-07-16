const express = require('express')
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET products
router.get('/products', productController.getProducts)
// GET product by ID
// POST products
// DELETE products (ID)
// PUT products (ID)

module.exports = router;
