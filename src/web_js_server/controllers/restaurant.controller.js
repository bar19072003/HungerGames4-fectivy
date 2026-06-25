const restaurantService = require('../services/restaurant.service');
const userModel = require('../models/user.model');

/**
 * Restaurant Controller.
 * Handles incoming HTTP requests, validates input, and formats HTTP responses.
 */
class RestaurantController {
    /**
     * For all the controller methods, we will:
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */

     // Handles the creation of a new restaurant.
    createRestaurant(req, res) {
        const { name, description, addressX, addressY, phone, kosher , working_hours } = req.body;

        try {
            // Create the restaurant using the service layer (validation handled by service)
            const newRestaurant = restaurantService.createRestaurant({
                name,
                description,
                addressX,
                addressY,
                phone,
                kosher,
                working_hours,
                ownerId: req.user.id
            });

            // Return 201 Created with the Location header pointing to the new resource
            return res.status(201).location(`/api/restaurants/${newRestaurant.id}`).end();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Retrieves all restaurants.
    getAllRestaurants(req, res) {
        // Fetch the list of restaurants from the Service layer
        const restaurants = restaurantService.getAllRestaurants();

        // Iterate over the array and remove the 'products' field from each restaurant object
        const cleanRestaurants = restaurants.map(restaurant => {
            const { products, ...restaurantInfo } = restaurant;
            return restaurantInfo;
        });

        // Return 200 OK with the array (will naturally be [] if empty)
        return res.status(200).json(cleanRestaurants);    
    }

    // Retrieves a single restaurant by its ID.
    getRestaurantById(req, res) {
        const resById = restaurantService.getRestaurantById(req.params.id);
		if(!resById){
			return res.status(404).json({ error: "Restaurant not found" })
		}

        // Remove the 'products' field from the restaurant object before sending the response
        const { products, ...restaurantWithoutProducts } = resById;

        // Calculate estimated delivery time if user is authenticated
        if (req.user) {
            const user = userModel.getUserById(req.user.id);
            if (user && typeof user.addressX === 'number' && typeof user.addressY === 'number') {
                const dx = user.addressX - resById.addressX;
                const dy = user.addressY - resById.addressY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                restaurantWithoutProducts.estimatedDeliveryTime = Math.ceil(distance * 5) + 15;
            }
        }

        return res.status(200).json(restaurantWithoutProducts);
    }


    // Updates an existing restaurant.
    updateRestaurant(req, res) {
		const id = req.params.id;
		const updateData = req.body;
		
		try {
			if(!restaurantService.updateRestaurant(id, updateData)) {
                return res.status(404).json({ error: "Restaurant not found" });
            }
			return res.status(204).end();
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
    }


    // Deletes a restaurant by its ID.
    deleteRestaurant(req, res) {
		const id = req.params.id;
	
		if(!restaurantService.deleteRestaurant(id)){
			return res.status(404).json({ error: "Restaurant not found" });
		}
		return res.status(204).end();
    }
}

// Export a singleton instance of the controller
module.exports = new RestaurantController();