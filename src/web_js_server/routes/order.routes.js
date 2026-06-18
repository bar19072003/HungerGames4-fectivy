const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')

/**
 * Order Routes.
 * Base path: /api/orders
 */
router.route('/')
    .post(orderController.createOrder.bind(orderController))
    .get(orderController.getOrders.bind(orderController));

router.route('/:id')
    .get(orderController.getOrderById.bind(orderController))
    .patch(orderController.updateOrder.bind(orderController))
    .delete(orderController.deleteOrder.bind(orderController));

module.exports = router;