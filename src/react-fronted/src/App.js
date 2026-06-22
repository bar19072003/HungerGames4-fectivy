import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProductTestPage from './pages/ProductTestPage';

/**
 * Main Application Component.
 * Handles the routing and global layout of the application.
 */
function App() {
    return (
        <Router>
            <Routes>
                {/* Product Modal Fictitious Test Page (Entry Point) */}
                <Route path="/product-test" element={<ProductTestPage />} />

                {/* Routes for login and registration with smooth transitions */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                
                {/* Redirect any unknown route or the root route directly to the product test page */}
                <Route path="*" element={<Navigate to="/product-test" replace />} />
            </Routes>
        </Router>
    );
}

export default App;