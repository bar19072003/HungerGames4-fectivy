const userService = require('../services/user.service');

/**
 * User Controller.
 * Handles incoming HTTP requests, validates input, and formats HTTP responses for users.
 */
class UserController {
    
    /**
     * Handles the creation of a new user (Registration).
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    createUser(req, res) {
        const { username, password, name, phone, address ,role, picture } = req.body;
        
        // Check if username is already taken
        const existingUser = userService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        
        try {
            // Create the new user using the service (validation handled by service)
            const newUser = userService.createUser({ username, password, name, phone, address, role, picture });
            // Return 201 Created with Location header pointing to the new resource
            return res.status(201).location(`/api/users/${newUser.id}`).end();
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    /**
     * Retrieves a single user by their ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getUserById(req, res) {
        const userIdFromToken = req.user.id;
        const requestedUserId = req.params.id;

        // Ensure users can only fetch their own profile
        if( requestedUserId !== userIdFromToken) { 
            return res.status(403).json({ error: "Forbidden: You can only access your own user data" });
        }

        const user = userService.getUserById(requestedUserId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }   
        return res.status(200).json(user);
    }

    /**
     * Retrieves a single user by their user name. (Will be needed later for login)
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    getUserByUsername(req, res) {
        const username = req.params.username;
        const user = userService.getUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }   
        return res.status(200).json(user);
    }

}

// Export a singleton instance of the controller
module.exports = new UserController();