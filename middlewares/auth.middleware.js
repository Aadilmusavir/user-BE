import { verifyToken } from "../utils/jwt.utils.js";

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided. Please login first.",
            });
        }

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: error.message || "Invalid token",
        });
    }
};

/**
 * Middleware to authorize based on roles
 * Usage: authorizeRole("admin", "moderator")
 */
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
            });
        }

        next();
    };
};

/**
 * Middleware to check if user is active
 */
export const isUserActive = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    // You can add additional checks here like checking user.isActive
    next();
};
