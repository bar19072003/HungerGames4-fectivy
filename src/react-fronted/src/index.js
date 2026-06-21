import React from 'react';
import ReactDOM from 'react-dom/client';

// CRITICAL: Import Bootstrap CSS so the UI components look correct
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

/**
 * Application Entry Point.
 * Renders the root App component into the browser's DOM.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);