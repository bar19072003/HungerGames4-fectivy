import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

/**
 * Main Application Component.
 * Handles the routing and global layout of the application.
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Route for the login page */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Redirect any unknown route or the root route directly to login for now */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;