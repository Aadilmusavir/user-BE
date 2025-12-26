import jwt from "jsonwebtoken";
import config from "../configs/env.config.js";

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRY = config.jwtExpiry;

export const generateToken = (userId, email, role) => {
    return jwt.sign({ userId, email, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};
