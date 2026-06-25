/**
 * Restaurant Data Model.
 */
class RestaurantModel {
    constructor() {
        /**
         * Internal Map to store all restaurants.
         * Key: Restaurant ID (UUID)
         * Value: Restaurant Object
         */
        this.restaurants = new Map();
        this._injectMockData();
    }

    _injectMockData() {
        const mockRestaurants = [
            { "id": "res-1", "name": "Vitra Sushi", "description": "Premium Asian Fusion", "address": "רוטשילד 22, תל אביב", "phone": "03-1111111", "kosher": false, "working_hours": "12:00-23:00", "rating": 9.6, "lat": 32.0626, "lng": 34.7712, "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", "categories": ["Asian"] },
            { "id": "res-2", "name": "Burger Station", "description": "Smash Burgers & Fries", "address": "דיזנגוף 90, תל אביב", "phone": "03-2222222", "kosher": true, "working_hours": "11:30-00:00", "rating": 8.9, "lat": 32.0781, "lng": 34.7744, "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", "categories": ["Meat", "Fast Food"] },
            { "id": "res-3", "name": "Pasta Basta", "description": "Fresh Handmade Pasta", "address": "אלנבי 43, תל אביב", "phone": "03-3333333", "kosher": true, "working_hours": "11:00-22:00", "rating": 7.4, "lat": 32.0694, "lng": 34.7702, "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", "categories": ["Italian"] },
            { "id": "res-4", "name": "Green Salad Bar", "description": "Healthy Bowls", "address": "אבן גבירול 60, תל אביב", "phone": "03-4444444", "kosher": true, "working_hours": "09:00-19:00", "rating": 8.2, "lat": 32.0812, "lng": 34.7811, "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", "categories": ["Healthy"] },
            { "id": "res-5", "name": "Sweet Box", "description": "Gourmet Desserts & Cakes", "address": "בן יהודה 120, תל אביב", "phone": "03-5555555", "kosher": false, "working_hours": "10:00-22:30", "rating": 9.1, "lat": 32.0885, "lng": 34.7731, "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", "categories": ["Desserts"] },
            { "id": "res-6", "name": "The Meat House", "description": "Premium Steaks", "address": "ז'בוטינסקי 45, רמת גן", "phone": "03-6666666", "kosher": true, "working_hours": "12:00-23:00", "rating": 9.4, "lat": 32.0831, "lng": 34.8021, "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", "categories": ["Meat"] },
            { "id": "res-7", "name": "Wok & Roll", "description": "Street Food Noodles", "address": "ביאליק 12, רמת גן", "phone": "03-7777777", "kosher": true, "working_hours": "11:00-23:00", "rating": 6.8, "lat": 32.0815, "lng": 34.8055, "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500", "categories": ["Asian", "Fast Food"] },
            { "id": "res-8", "name": "Falafel Kings", "description": "Best Falafel in Town", "address": "כצנלסון 80, גבעתיים", "phone": "03-8888888", "kosher": true, "working_hours": "10:00-20:00", "rating": 8.5, "lat": 32.0754, "lng": 34.8112, "image": "https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=500", "categories": ["Fast Food"] },
            { "id": "res-9", "name": "Pizza Prego", "description": "Family Pizza & Garlic Bread", "address": "ויצמן 30, גבעתיים", "phone": "03-9999999", "kosher": true, "working_hours": "12:00-01:00", "rating": 7.1, "lat": 32.0681, "lng": 34.8105, "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", "categories": ["Fast Food"] },
            { "id": "res-10", "name": "Hummus Eliah", "description": "Warm Israeli Hummus", "address": "חזון איש 10, בני ברק", "phone": "03-1010101", "kosher": true, "working_hours": "08:00-16:00", "rating": 8.7, "lat": 32.0822, "lng": 34.8314, "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500", "categories": ["Healthy"] },
            { "id": "res-11", "name": "Bnei Brak Bakery", "description": "Challah & Jewish Pastries", "address": "רבי עקיבא 50, בני ברק", "phone": "03-1212121", "kosher": true, "working_hours": "06:00-22:00", "rating": 9.3, "lat": 32.0855, "lng": 34.8291, "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500", "categories": ["Desserts"] },
            { "id": "res-12", "name": "Jaffa Fish Market", "description": "Fresh Sea Food", "address": "נמל יפו, תל אביב", "phone": "03-1313131", "kosher": false, "working_hours": "12:00-23:30", "rating": 9.5, "lat": 32.0511, "lng": 34.7491, "image": "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=500", "categories": ["Seafood"] },
            { "id": "res-13", "name": "Aroma Casual", "description": "Coffee & Sandwiches", "address": "מנחם בגין 150, תל אביב", "phone": "03-1414141", "kosher": true, "working_hours": "07:00-21:00", "rating": 7.0, "lat": 32.0768, "lng": 34.7925, "image": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500", "categories": ["Healthy"] },
            { "id": "res-14", "name": "Taco Loco", "description": "Mexican Tacos & Burritos", "address": "קינג ג'ורג' 30, תל אביב", "phone": "03-1515151", "kosher": false, "working_hours": "12:00-02:00", "rating": 8.0, "lat": 32.0729, "lng": 34.7733, "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500", "categories": ["Fast Food"] },
            { "id": "res-15", "name": "Ice Cream Paradiso", "description": "Gelato & Waffles", "address": "שפרינצק 4, תל אביב", "phone": "03-1616161", "kosher": true, "working_hours": "10:00-00:00", "rating": 8.8, "lat": 32.0718, "lng": 34.7852, "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500", "categories": ["Desserts"] },
            { "id": "res-16", "name": "The Schnitzel Joint", "description": "Crispy Chicken Schnitzel", "address": "הירקון 70, תל אביב", "phone": "03-1717171", "kosher": true, "working_hours": "11:00-19:00", "rating": 7.9, "lat": 32.0762, "lng": 34.7661, "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500", "categories": ["Meat", "Fast Food"] },
            { "id": "res-17", "name": "Vegan Delight", "description": "100% Plant Based", "address": "פלורנטין 15, תל אביב", "phone": "03-1818181", "kosher": true, "working_hours": "12:00-22:00", "rating": 8.4, "lat": 32.0565, "lng": 34.7739, "image": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500", "categories": ["Healthy"] },
            { "id": "res-18", "name": "Thai House Mock", "description": "Authentic Thai Spices", "address": "בן יהודה 40, תל אביב", "phone": "03-1919191", "kosher": false, "working_hours": "12:30-23:00", "rating": 9.7, "lat": 32.0792, "lng": 34.7691, "image": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500", "categories": ["Asian"] },
            { "id": "res-19", "name": "Soup Station", "description": "Winter Warm Soups", "address": "אלנבי 110, תל אביב", "phone": "03-2020202", "kosher": true, "working_hours": "11:00-21:00", "rating": 7.2, "lat": 32.0621, "lng": 34.7735, "image": "https://images.unsplash.com/photo-1547592165-e1d17f373555?w=500", "categories": ["Healthy"] },
            { "id": "res-20", "name": "Peking Duck", "description": "Classic Chinese Dishes", "address": "הבנים 5, רמת גן", "phone": "03-2121212", "kosher": false, "working_hours": "12:00-22:00", "rating": 6.5, "lat": 32.0911, "lng": 34.8061, "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500", "categories": ["Asian"] },
            { "id": "res-21", "name": "The Grill", "description": "Israeli Charcoal BBQ", "address": "בן גוריון 100, רמת גן", "phone": "03-2323232", "kosher": true, "working_hours": "11:00-23:00", "rating": 8.6, "lat": 32.0691, "lng": 34.8211, "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500", "categories": ["Meat"] },
            { "id": "res-22", "name": "Cinnabon Heaven", "description": "Warm Cinnamon Rolls", "address": "קניון עזריאלי, תל אביב", "phone": "03-2424242", "kosher": true, "working_hours": "09:30-22:00", "rating": 9.0, "lat": 32.0745, "lng": 34.7921, "image": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500", "categories": ["Desserts"] },
            { "id": "res-23", "name": "Boker Tov Café", "description": "Israeli Breakfasts", "address": "ריינס 2, תל אביב", "phone": "03-2525252", "kosher": false, "working_hours": "07:30-16:00", "rating": 8.3, "lat": 32.0799, "lng": 34.7762, "image": "https://images.unsplash.com/photo-1496042399014-dc73c4f2bde1?w=500", "categories": ["Healthy"] },
            { "id": "res-24", "name": "Sushia Bar", "description": "Fast Delivery Sushi", "address": "סוקולוב 40, רמת גן", "phone": "03-2626262", "kosher": true, "working_hours": "11:00-00:00", "rating": 7.6, "lat": 32.0844, "lng": 34.7995, "image": "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500", "categories": ["Asian"] },
            { "id": "res-25", "name": "The Kebab Master", "description": "Handmade Lamb Kebabs", "address": "שלמה המלך 12, בני ברק", "phone": "03-2727272", "kosher": true, "working_hours": "11:00-22:30", "rating": 8.1, "lat": 32.0919, "lng": 34.8361, "image": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500", "categories": ["Meat"] }
        ];

        mockRestaurants.forEach(restaurant => {
            // אנחנו מוסיפים לכל אחת את ה-Map הריק של ה-products כדי שהמבנה יהיה זהה למה שה-Service מצפה
            this.restaurants.set(restaurant.id, {
                ...restaurant,
                products: new Map() 
            });
        });
        
        console.log(`[🚀 Mock Data] Successfully injected ${this.restaurants.size} restaurants for testing!`);
    }
    

    /**
     * Creates a new restaurant entity and stores it in the map.
     * @param {Object} restaurantData - The verified data for the new restaurant.
     * @param {string} restaurantData.id - The unique UUID generated by the service.
     * @param {string} restaurantData.name - The name of the restaurant.
     * @param {string} restaurantData.description - A short description for search queries.
     * @param {string} restaurantData.address - The physical address of the restaurant.
     * @param {string} restaurantData.phone - The contact phone number for the restaurant.
     * @param {boolean} restaurantData.kosher - Kosher certification status.
     * @param {string} restaurantData.ownerId - The UUID of the user who owns the restaurant.
     * @returns {Object} The newly created restaurant object.
     */
    createRestaurant(restaurantData) {
        // Constructing the exact Restaurant object structure
        const newRestaurant = {
            id: restaurantData.id,
            name: restaurantData.name,
            description: restaurantData.description,
            address: restaurantData.address,
            phone: restaurantData.phone,
            kosher: restaurantData.kosher,
            ownerId: restaurantData.ownerId,
            working_hours: restaurantData.working_hours,
            rating: 0, // Initial rating is set to 0
            lat: restaurantData.lat,
            lng: restaurantData.lng,
            image: restaurantData.image,
            categories: restaurantData.categories,

            /**
             * Internal Map to store the menu products for this specific restaurant.
             * Key: Product ID (UUID)
             * Value: Product Object
             */
            products: new Map()
        };

        // Store the newly created restaurant in our main in-memory Map
        this.restaurants.set(newRestaurant.id, newRestaurant);
        
        return newRestaurant;
    }

   getAllRestaurants() {
        return this.restaurants;
    }
	
	getRestaurantById(id) {
		return this.restaurants.get(id)
	}
	
	updateRestaurant(id, updatedRestaurant) {
        this.restaurants.set(id, updatedRestaurant);
        return updatedRestaurant;
    }
	
	deleteRestaurant(id){
		this.restaurants.delete(id);
	}
}

module.exports = new RestaurantModel();