const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware (Strict).
 * Intercepts incoming requests to verify the JWT token.
 * If invalid or missing, returns a 401/403 error and stops the request.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware or controller.
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
    }
    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    try {
        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.user = { 
            id: decoded.id,
            role: decoded.role 
        };

        next();

    } catch (error) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
};

/**
 * Optional Authentication Middleware (Soft).
 * Checks for a JWT token. If valid, attaches user to req.
 * If missing or invalid, it simply proceeds as a guest (req.user = null) without throwing an error.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware or controller.
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the header exists and is formatted correctly
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        try {
            // Attempt to verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
            req.user = { 
                id: decoded.id,
                role: decoded.role 
            };
        } catch (error) {
            // Token is invalid/expired, but we don't block the request. Treat as guest.
            req.user = null;
        }
    } else {
        // No token provided at all. Treat as guest.
        req.user = null;
    }
    // Always proceed to the next step
    next();
};


/** 
 * Admin Authorization Middleware.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware or controller.
 */
const requireAdmin = (req, res, next) => {
    // req.user was attached by the previous requireAuth middleware
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, let them proceed
    } else {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
};

// Export both middlewares as an object
module.exports = {
    requireAuth,
    optionalAuth,
    requireAdmin
};