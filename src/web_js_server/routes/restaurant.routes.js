const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const productRoutes = require('./product.routes');
const { requireAuth , requireAdmin } = require('../middlewares/auth.middleware');

router.use('/:id/products', productRoutes);
/**
 * Restaurant Routes.
 * Base path: /api/restaurants
 */

router.route('/')
    .get(restaurantController.getAllRestaurants.bind(restaurantController))
    .post(requireAuth, requireAdmin, restaurantController.createRestaurant.bind(restaurantController));
router.route('/:id')
    .get(restaurantController.getRestaurantById.bind(restaurantController))
    .patch(requireAuth, requireAdmin, restaurantController.updateRestaurant.bind(restaurantController))
    .delete(requireAuth, requireAdmin, restaurantController.deleteRestaurant.bind(restaurantController));

module.exports = router;
