const API_URL = 'http://localhost:3000/api';

/**
 * Fetches the user profile by ID.
 * @param {string} userId - The unique identifier of the user.
 * @param {string} token - The user's JWT authentication token.
 * @returns {Promise<Object>} The user profile data.
 */
export const getUserProfile = async (userId, token) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
    }

    return await response.json();
};

/**
 * Updates the user's profile details.
 * @param {Object} payload - The fields that were modified.
 * @param {string} token - The user's JWT authentication token.
 * @returns {Promise<Object>} The updated user profile data.
 */
export const updateUserProfile = async (payload, token) => {
    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile details');
    }

    return await response.json();
};
