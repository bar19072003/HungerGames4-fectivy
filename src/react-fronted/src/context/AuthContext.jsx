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

        if (token && userId) {
            // Restore session if both token and user ID exist
            setCurrentUser({ id: userId, token: token });
        }
    }, []);

    /**
     * Logs the user into the application context.
     * Stores the session in localStorage and updates the state.
     * 
     * @param {Object} userData - The authentication data returned from the API.
     * @param {string} userData.authorization - The JWT token.
     * @param {string} userData.user_id - The unique user ID.
     */
    const login = (userData) => {
        localStorage.setItem('jwt_token', userData.authorization);
        localStorage.setItem('token', userData.authorization);
        localStorage.setItem('userToken', userData.authorization);
        localStorage.setItem('user_id', userData.user_id);
        setCurrentUser({ id: userData.user_id, token: userData.authorization });
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
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
