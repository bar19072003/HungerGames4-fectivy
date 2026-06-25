const restaurantModel = require('../models/restaurant.model');
const productModel = require('../models/product.model');
const { v4: uuidv4 } = require('uuid');

/**
 * Restaurant Service.
 * Handles the business logic and ID generation for restaurant operations.
 */
class RestaurantService {
    
    /**
     * Validates restaurant data for creation or update operations.
     * @param {Object} data - The restaurant data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateRestaurantData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['name', 'address', 'phone', 'kosher', 'working_hours', 'lat','lng'];
        const optionalFields = ['description','categories', 'image'];
        const allowedFields = [...requiredFields, ...optionalFields];

        if (!isUpdate) {
            // For creation: validate all required fields are present and properly typed
            for (const field of requiredFields) {
                if (data[field] === undefined || data[field] === null) {
                    return false;
                }

                // Type-specific validation
                if (field === 'kosher') {
                    if (typeof data[field] !== 'boolean') {
                        return false;
                    }
                } else if (field === 'working_hours') {
                    if (typeof data[field] !== 'string' && typeof data[field] !== 'object') {
                        return false;
                    }
                } else if (['name', 'address', 'phone'].includes(field)) {
                    if (typeof data[field] !== 'string' || data[field].trim() === '') {
                        return false;
                    }
                } else if (['lat', 'lng'].includes(field)) {
                    if (typeof data[field] !== 'number') {
                        return false;
                    }
                }
            }
        } else {
            // For update: only validate fields that are provided and are in the allowed list
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    continue;
                }

                if (data[field] === null) {
                    return false;
                }

                // Type-specific validation for provided fields
                if (field === 'kosher') {
                    if (typeof data[field] !== 'boolean') {
                        return false;
                    }
                } else if (field === 'working_hours') {
                    if (typeof data[field] !== 'string' && typeof data[field] !== 'object') {
                        return false;
                    }
                } else if (['lat', 'lng'].includes(field)) {
                    if (typeof data[field] !== 'number') {
                        return false;
                    }
                } else if (['name', 'address', 'phone', 'description'].includes(field)) {
                    if (typeof data[field] !== 'string') {
                        return false;
                    }
                    if ((field !== 'description' && data[field].trim() === '')) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    
    /**
     * Creates a new restaurant with validation.
     * @param {Object} restaurantData - The restaurant data to create.
     * @returns {Object} The newly created restaurant.
     * @throws Error if validation fails.
     */
    createRestaurant(restaurantData) {
        // Validate restaurant data before creation
        if (!this._validateRestaurantData(restaurantData, false)) {
            throw new Error('Invalid restaurant data: name, address, phone, kosher, working_hours, lat, and lng are required');
        }

        // Generate a unique UUID for the new restaurant
        const id = uuidv4();
        // Create the new Restaurant object and store it using the Model
        const newRes = restaurantModel.createRestaurant({id , ...restaurantData});
        return newRes;
    }
        
    // TODO: Implement getAllRestaurants()
    getAllRestaurants() {
        const restaurantsMap = restaurantModel.getAllRestaurants();
        // Convert the Map to Array and return it.
        return Array.from(restaurantsMap.values());
    }
    
    getRestaurantById(id) {
		return restaurantModel.getRestaurantById(id);
	}

    /**
     * Updates an existing restaurant with validation.
     * @param {string} id - The restaurant ID to update.
     * @param {Object} updateData - The data to update (partial update).
     * @returns {boolean} True if successful, false if restaurant not found.
     * @throws Error if validation fails.
     */
    updateRestaurant(id, updateData) {
        const resForUpdate = this.getRestaurantById(id);
        if (!resForUpdate) {
            return false;
        }

        // Validate update data before applying changes
        if (!this._validateRestaurantData(updateData, true)) {
            throw new Error('Invalid restaurant data provided for update');
        }

        // Create a copy of the original restaurant
        const mergedRestaurant = { ...resForUpdate };

        // Define a strict whitelist of fields the user is allowed to modify
        const allowedUpdates = ['name', 'description', 'address', 'phone', 'kosher', 'working_hours', 'categories', 'image', 'lat', 'lng'];

        // Iterate and apply only the permitted and provided fields
        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                mergedRestaurant[field] = updateData[field];
            }
        });

        // Update using Model
        restaurantModel.updateRestaurant(id, mergedRestaurant);
        return true;
    }
	
	
    deleteRestaurant(id) {
		if (!this.getRestaurantById(id)) {
			return false
		}
		restaurantModel.deleteRestaurant(id);
		return true
	}
}

module.exports = new RestaurantService();
