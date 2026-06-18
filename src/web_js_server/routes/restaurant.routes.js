const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const productRoutes = require('./product.routes');

router.use('/:id/products', productRoutes);
/**
 * Restaurant Routes.
 * Base path: /api/restaurants
 */

router.route('/')
    .get(restaurantController.getAllRestaurants.bind(restaurantController))
    .post(restaurantController.createRestaurant.bind(restaurantController));
router.route('/:id')
    .get(restaurantController.getRestaurantById.bind(restaurantController))
    .patch(restaurantController.updateRestaurant.bind(restaurantController))
    .delete(restaurantController.deleteRestaurant.bind(restaurantController));

module.exports = router;
