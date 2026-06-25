const userModel = require('./models/user.model');
const restaurantModel = require('./models/restaurant.model');
const productModel = require('./models/product.model');

/**
 * Initializes the application with mock data.
 * Seeds a regular user, a restaurant owner, a restaurant, and some products.
 */
function seedMockData() {
    // 1. Seed Users
    const mockUser = {
        id: 'mock-user-id-1',
        username: 'user',
        password: '1234',
        name: 'Regular User',
        phone: '0501234567',
        addressX: 12.34,
        addressY: 56.78,
        role: 'user',
        picture: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%2300c2e8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="white">U</text></svg>'
    };

    const mockOwner = {
        id: 'mock-owner-id-2',
        username: 'admin',
        password: '1234',
        name: 'Restaurant Owner',
        phone: '0507654321',
        addressX: 34.56,
        addressY: 78.90,
        role: 'restaurant_owner',
        picture: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23e800c2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="white">O</text></svg>'
    };

    userModel.users.set(mockUser.id, mockUser);
    userModel.users.set(mockOwner.id, mockOwner);

    // 2. Seed Restaurant
    const mockRestaurant = restaurantModel.createRestaurant({
        id: "1234",
        name: "Wolt Burger Station",
        description: "The best premium burgers in town with fresh ingredients.",
        addressX: 0,
        addressY: 0,
        phone: "555-0192",
        kosher: false,
        ownerId: mockOwner.id, // Linking restaurant to the owner
        working_hours: "10:00 - 23:00"
    });

    // 3. Seed Products
    const mockProduct1 = productModel.createProduct({
        name: "Classic Cheeseburger",
        price: 15.99,
        description: "Our signature beef patty with cheddar cheese, lettuce, and secret sauce."
    }, "p1");
    mockProduct1.imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60";
    mockRestaurant.products.set(mockProduct1.id, mockProduct1);

    const mockProduct2 = productModel.createProduct({
        name: "Truffle Fries",
        price: 6.50,
        description: "Crispy fries tossed in truffle oil and parmesan."
    }, "p2");
    mockProduct2.imageUrl = "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=60";
    mockRestaurant.products.set(mockProduct2.id, mockProduct2);

    console.log('[MockData] Mock users, restaurant, and products have been seeded successfully.');
}

module.exports = { seedMockData };
