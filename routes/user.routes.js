import express from "express";
import {
    registerController,
    loginController,
    logoutController,
    getProfileController,
    updateProfileController,
} from "../controllers/auth.controller.js";
import {
    getUsersController,
    createUserController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    getUsersByRoleController,
} from "../controllers/user.controller.js";
import {
    authenticateToken,
    authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================
   Authentication Routes
===================== */

// Public routes
router.post("/auth/register", registerController);
router.post("/auth/login", loginController);
router.post("/auth/logout", authenticateToken, logoutController);

// Protected profile routes
router.get("/auth/profile", authenticateToken, getProfileController);
router.put("/auth/profile", authenticateToken, updateProfileController);

/* =====================
   User Management Routes
===================== */

// Get all users - Admin only
router.get("/users", authenticateToken, authorizeRole("admin"), getUsersController);

// Create user - Admin only
router.post("/users", authenticateToken, authorizeRole("admin"), createUserController);

// Get users by role - Admin only
router.get("/users/role/:role", authenticateToken, authorizeRole("admin"), getUsersByRoleController);

// Get user by ID - Protected
router.get("/users/:id", authenticateToken, getUserByIdController);

// Update user - Admin or own user
router.put("/users/:id", authenticateToken, updateUserController);

// Delete user - Admin only
router.delete("/users/:id", authenticateToken, authorizeRole("admin"), deleteUserController);

// Legacy route for backward compatibility
router.get("/", createUserController);

export default router;
