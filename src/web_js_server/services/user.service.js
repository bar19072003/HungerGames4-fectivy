const userModel = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');

/**
 * User Service.
 * Handles the business logic and ID generation for user operations.
 */
class UserService {
    
    /**
     * Validates user data for creation or update operations.
     * @param {Object} data - The user data to validate.
     * @param {boolean} isUpdate - If true, validates only provided fields; if false, validates all required fields.
     * @returns {boolean} True if validation passes, false otherwise.
     * @private
     */
    _validateUserData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        const requiredFields = ['username', 'password', 'name', 'phone', 'address', 'picture'];
        const allowedFields = requiredFields;

        if (!isUpdate) {
            // For creation: all required fields must be present and non-empty strings
            for (const field of requiredFields) {
                if (typeof data[field] !== 'string' || data[field].trim() === '') {
                    return false;
                }
            }
        } else {
            // For update: only validate fields that are provided
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    continue;
                }
                if (data[field] === null || (typeof data[field] !== 'string' || data[field].trim() === '')) {
                    return false;
                }
            }
        }

        return true;
    }
    
    /**
     * Creates a new user with validation.
     * @param {Object} userData - The user data (username, password, name, phone, address, picture).
     * @returns {Object} The newly created user.
     * @throws Error if validation fails.
     */
    createUser(userData) {
        // Validate user data before creation
        if (!this._validateUserData(userData, false)) {
            throw new Error('Invalid user data: username, password, name, phone, address, and picture are required and must be non-empty strings');
        }

        // Generate UUID for the new user
        const userId = uuidv4();
        const newUser = userModel.createUser({ id: userId, ...userData });
        return newUser;
    }

    getUserById(id) {
        return userModel.getUserById(id);
    }
    
    getUserByUsername(username) {
        return userModel.getUserByUsername(username);
    }
    
    // For Login - verify username and password, return user ID if valid, else null
    verifyCredentials(username, password) {
        const user = this.getUserByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        return user.id;
    }

    getUserRole(userId) {
        const user = this.getUserById(userId);
        return user ? user.role : null;
    }
}

module.exports = new UserService();