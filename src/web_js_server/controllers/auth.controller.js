const userService = require('../services/user.service');

/**
 * Auth Controller.
 * Handles authentication and token generation endpoints.
 */
class AuthController {
    
    /**
     * Handles the login request.
     */
    login(req, res) {
        const { username, password } = req.body;

        // Ensure both fields are present
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Delegate the verification logic to the User Service
        const userId = userService.verifyCredentials(username, password);

        // If invalid - return Error 400
        if (!userId) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Returns the id of the user as the token with 201
        return res.status(201).json({ authorization: userId });
    }
}

module.exports = new AuthController();