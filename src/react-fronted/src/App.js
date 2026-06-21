import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

/**
 * Main Application Component.
 * Handles the routing and global layout of the application.
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Routes for login and registration with smooth transitions */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                
                {/* Redirect any unknown route or the root route directly to login for now */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;