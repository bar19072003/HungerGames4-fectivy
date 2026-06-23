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

        const stringFields = ['username', 'password', 'name', 'phone', 'picture'];
        const numberFields = ['addressX', 'addressY'];
        const allowedFields = [...stringFields, ...numberFields];

        if (!isUpdate) {
            // For creation: all required fields must be present
            for (const field of stringFields) {
                if (typeof data[field] !== 'string' || data[field].trim() === '') {
                    return false;
                }
            }
            for (const field of numberFields) {
                if (typeof data[field] !== 'number' || isNaN(data[field])) {
                    return false;
                }
            }
        } else {
            // For update: only validate fields that are provided
            for (const field of Object.keys(data)) {
                if (!allowedFields.includes(field)) {
                    continue;
                }
                if (stringFields.includes(field)) {
                    if (data[field] === null || typeof data[field] !== 'string' || data[field].trim() === '') {
                        return false;
                    }
                } else if (numberFields.includes(field)) {
                    if (data[field] === null || typeof data[field] !== 'number' || isNaN(data[field])) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
    
    /**
     * Creates a new user with validation.
     * @param {Object} userData - The user data (username, password, name, phone, addressX, addressY, picture).
     * @returns {Object} The newly created user.
     * @throws {Error} If validation fails.
     */
    createUser(userData) {
        // Validate user data before creation
        if (!this._validateUserData(userData, false)) {
            throw new Error('Invalid user data: username, password, name, phone, picture (strings) and addressX, addressY (numbers) are required');
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

    /**
     * Validates and updates user profile data.
     * @param {string} userId - The user ID.
     * @param {Object} updatedFields - The fields to update.
     * @returns {Object} The updated user.
     * @throws {Error} If validation fails or user is not found.
     */
    updateUser(userId, updatedFields) {
        if (!this._validateUserData(updatedFields, true)) {
            throw new Error('Invalid user update data');
        }
        const updated = userModel.updateUser(userId, updatedFields);
        if (!updated) {
            throw new Error('User not found');
        }
        return updated;
    }
}

module.exports = new UserService();