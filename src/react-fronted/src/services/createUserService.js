/**
 * User Registration Service.
 * Handles the creation of a new user, including file uploads for the profile picture.
 */

const API_URL = 'http://localhost:3000/api';

/**
 * Sends user registration data to the server.
 * Uses FormData to handle the profile picture file upload alongside text fields.
 * * @param {Object} userData - An object containing user details.
 * @param {File} imageFile - The profile picture file selected by the user.
 * @returns {Promise<Object>} The server response.
 * @throws {Error} If registration fails (e.g., username already exists).
 */
export const registerUser = async (userData, imageFile) => {
    // We use FormData instead of JSON because we are transmitting a file
    const formData = new FormData();
    
    // Append all text fields
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('name', userData.name);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);
    // Role is defaulted to 'user' as requested, keeping it hidden from the UI
    formData.append('role', 'user'); 

    // Append the image file if it exists
    if (imageFile) {
        formData.append('picture', imageFile);
    }

    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        // Note: When using FormData, we DO NOT set the 'Content-Type' header.
        // The browser automatically sets it to 'multipart/form-data' with the correct boundary.
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        // This will catch the "Username already exists" error from your server
        throw new Error(errorData.error || 'Registration failed');
    }

    return await response.json();
};