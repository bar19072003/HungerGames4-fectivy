const orderModel = require('../models/order.model');
const restaurantModel = require('../models/restaurant.model');
const productService = require('../services/product.service');
const userService = require('../services/user.service');
const { v4: uuidv4 } = require('uuid');

class OrderService {

    /**
     * Validates order data for creation or update operations.
     * @param {Object} data - The order data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateOrderData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['restaurantId', 'items', 'address'];
        const optionalFields = ['tip'];
        const allowedFields = [...requiredFields, ...optionalFields];

        if (!isUpdate) {
            // For creation: validate all required fields are present and properly typed
            
            // Validate restaurantId
            if (typeof data.restaurantId !== 'string' || data.restaurantId.trim() === '') {
                return false;
            }

            // Validate items array
            if (!Array.isArray(data.items) || data.items.length === 0) {
                return false;
            }
            for (const item of data.items) {
                if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') {
                    return false;
                }
                const quantity = Number(item.quantity) || 1;
                if (quantity <= 0 || !Number.isInteger(quantity)) {
                    return false;
                }
            }

            // Validate address
            if (typeof data.address !== 'string' || data.address.trim() === '') {
                return false;
            }

            // Validate tip if provided (optional)
            if (data.tip !== undefined && data.tip !== null) {
                const tip = Number(data.tip);
                if (isNaN(tip) || tip < 0) {
                    return false;
                }
            }
        } else {
            // For update: only validate fields that are provided
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    continue;
                }

                if (data[field] === null) {
                    return false;
                }

                if (field === 'tip') {
                    const tip = Number(data[field]);
                    if (isNaN(tip) || tip < 0) {
                        return false;
                    }
                } else if (field === 'address') {
                    if (typeof data[field] !== 'string' || data[field].trim() === '') {
                        return false;
                    }
                } else if (field === 'items') {
                    if (!Array.isArray(data[field]) || data[field].length === 0) {
                        return false;
                    }
                    for (const item of data[field]) {
                        if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') {
                            return false;
                        }
                        const quantity = Number(item.quantity) || 1;
                        if (quantity <= 0 || !Number.isInteger(quantity)) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    /**
     * Creates a new order for a user with the provided order data.
     * @param {*} userId - the ID of the user placing the order
     * @param {*} orderData - the data for the order, must include restaurantId, items array, and address, tip is optional
     * @throws Error with appropriate status code in message if validation fails (e.g. missing fields, product not found, product not in restaurant)
     */
    createOrder(userId, orderData) {
        // Validate order data before creation
        if (!this._validateOrderData(orderData, false)) {
            throw new Error('Invalid order data: restaurantId, items array (with positive integer quantities), and address are required');
        }

        const totalPrice = this._validateAndCalculateOrder(orderData)
        const newOrder = {
            id: uuidv4(),
            userId: userId,
            restaurantId: orderData.restaurantId,
            items: orderData.items,
            totalPrice: totalPrice,
            status: 'pending',
            createdAt: new Date(),
            tip: orderData.tip || 0,
            address: orderData.address
        }
        orderModel.saveOrder(newOrder)

        return newOrder;
    }
        
    /**
     * validates the order data by checking if all products exist and belong to the specified restaurant, and calculates the total price of the order.
     * @param {*} orderData - data for the order, including restaurantId and items array
     * @returns totalPrice of the order
     * @throws Error if any product is not found or does not belong to the specified restaurant with appropriate status codes in the error message
     */
    _validateAndCalculateOrder(orderData) {
        let totalPrice = 0

        for (const item of orderData.items) {
            // Validate that the product exists and belongs to the specified restaurant
            const realProduct = productService.getProductById(orderData.restaurantId, item.productId)
            if (!realProduct) {
                const error = new Error('Products or Restaurant not found')
                error.statusCode = 404
                throw error
            }
            const price = Number(realProduct.price)
            // Calculate total price by summing up the price of each item multiplied by its quantity (default to 1 if not specified)
            totalPrice += (price * (Number(item.quantity) || 1))
        }
        return totalPrice
    }

    getOrdersByUserId(userId) {
        return orderModel.findAllOrders().filter(order => order.userId === userId);
    }

   getOrderById(orderId, userId) {
        const order = orderModel.findOrderById(orderId);
        
        if (!order || order.userId !== userId) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }
        
        return order;
    }

    /**
     * Updates an existing order safely based on user input.
     * @param {string} orderId - The unique ID of the order.
     * @param {string} userId - The ID of the requesting user.
     * @param {Object} updateData - The partial data containing fields to update.
     * @throws Error if validation fails.
     */
    updateOrder(orderId, userId, updateData) {
        const existingOrder = this.getOrderById(orderId, userId);
        
        if (!existingOrder) {
            return null;
        }

        // Validate update data before applying changes
        if (!this._validateOrderData(updateData, true)) {
            throw new Error('Invalid order data provided for update');
        }

        const mergedOrder = { ...existingOrder };

        const allowedUpdates = ['tip', 'address', 'items']; 

        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                mergedOrder[field] = updateData[field];
            }
        });

        if (updateData.items !== undefined) {
            try {
                const newTotalPrice = this._validateAndCalculateOrder(mergedOrder);
                mergedOrder.totalPrice = newTotalPrice;
            } catch (error) {
                throw error; 
            }
        }

        orderModel.saveOrder(mergedOrder);
        
        return mergedOrder;
    }

    /**
     * Cancels/Deletes an order safely.
     * @param {string} orderId - The unique ID of the order.
     * @param {string} userId - The ID of the requesting user.
     */
    deleteOrder(orderId, userId) {
        this.getOrderById(orderId, userId);
        
        orderModel.deleteOrder(orderId);
        
        return true;
    }
}

module.exports = new OrderService();
