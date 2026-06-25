import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SeeAllPage from './pages/SeeAllPages';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import  ProductTestPage from './pages/ProductTestPage';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
/**
 * Main Application Component.
 * Handles the routing and global layout of the application.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/see-all/:type" element={<SeeAllPage />} />
            <Route path="/category/:category" element={<SeeAllPage />} />
          </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router> 
    </AuthProvider>
  );
}

export default App;