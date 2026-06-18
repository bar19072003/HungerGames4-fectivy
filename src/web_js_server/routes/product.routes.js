const express = require('express');

const router = express.Router({ mergeParams: true });
const productController = require('../controllers/product.controller');

/**
 * Product Routes.
 * Base path: /api/restaurants/:id/products
 */

router.route('/')
    .get(productController.getProductsByRestaurant.bind(productController))
    .post(productController.createProduct.bind(productController));

router.route('/:pId')
    .get(productController.getProductById.bind(productController))
    .patch(productController.updateProduct.bind(productController))
    .delete(productController.deleteProduct.bind(productController));

module.exports = router;