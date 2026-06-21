const express = require('express');

const router = express.Router({ mergeParams: true });
const productController = require('../controllers/product.controller');
const { requireAuth, optionalAuth, requireAdmin }  = require('../middlewares/auth.middleware');

/**
 * Product Routes.
 * Base path: /api/restaurants/:id/products
 */

router.route('/')
    .get(productController.getProductsByRestaurant.bind(productController)) // evryone can view products of a restaurant
    .post(requireAuth, requireAdmin, productController.createProduct.bind(productController)); // only admins can add products to a restaurant

router.route('/:pId')
    .get(optionalAuth, productController.getProductById.bind(productController))  // evryone can view a product, but if they are authenticated we will send them a notification in the background about the product they viewed
    .patch(optionalAuth, requireAdmin, productController.updateProduct.bind(productController)) // only admins can update products of a restaurant
    .delete(optionalAuth, requireAdmin, productController.deleteProduct.bind(productController)); // only admins can delete products of a restaurant

module.exports = router;