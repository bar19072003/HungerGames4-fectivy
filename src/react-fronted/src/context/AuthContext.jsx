import React, { createContext, useState, useEffect } from 'react';

/**
 * Global Authentication Context.
 * Manages the current user session and exposes login/logout functionalities.
 */
export const AuthContext = createContext();

/**
 * Authentication Provider Component.
 * Wraps the application to provide access to the user state and authentication methods.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume this context.
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    /**
     * Effect to check for an existing session on initial component mount.
     * Looks into localStorage for a JWT token and user ID to restore the session.
     */
    useEffect(() => {
        const token = localStorage.getItem('jwt_token') || localStorage.getItem('token') || localStorage.getItem('userToken');
        const userId = localStorage.getItem('user_id');
        const userName = localStorage.getItem('user_name');
        const userPicture = localStorage.getItem('user_picture');

        if (token && userId) {
            // Restore session if token and user ID exist
            setCurrentUser({ 
                id: userId, 
                token: token,
                name: userName || null,
                picture: userPicture || null
            });
        }
    }, []);

    /**
     * Logs the user into the application context.
     * Stores the session in localStorage and updates the state.
     * 
     * @param {Object} userData - The authentication data returned from the API.
     * @param {string} userData.authorization - The JWT token.
     * @param {string} userData.user_id - The unique user ID.
     * @param {Object} [userData.user] - The lightweight user object.
     */
    const login = (userData) => {
        localStorage.setItem('jwt_token', userData.authorization);
        localStorage.setItem('token', userData.authorization);
        localStorage.setItem('userToken', userData.authorization);
        localStorage.setItem('user_id', userData.user_id);
        
        let userDetails = null;
        if (userData.user) {
            userDetails = userData.user;
            localStorage.setItem('user_name', userDetails.name || '');
            localStorage.setItem('user_picture', userDetails.picture || '');
        }

        setCurrentUser({ 
            id: userData.user_id, 
            token: userData.authorization,
            name: userDetails?.name || null,
            picture: userDetails?.picture || null,
            role: userDetails?.role || null,
            addressX: userDetails?.addressX || null,
            addressY: userDetails?.addressY || null
        });
    };

    /**
     * Logs the user out of the application context.
     * Clears the session from localStorage and resets the state to null.
     */
    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_picture');
        setCurrentUser(null);
    };

    /**
     * Dynamically updates the active user session details in state and localStorage.
     * @param {Object} updatedFields - The fields that were modified.
     */
    const updateUserSession = (updatedFields) => {
        setCurrentUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...updatedFields };
            if (updatedFields.name !== undefined) {
                localStorage.setItem('user_name', updatedFields.name);
            }
            if (updatedFields.picture !== undefined) {
                localStorage.setItem('user_picture', updatedFields.picture);
            }
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, updateUserSession }}>
            {children}
        </AuthContext.Provider>
    );
};
