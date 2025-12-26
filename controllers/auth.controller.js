import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";

/**
 * Register a new user
 */
export const registerController = async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;

        // Validation
        if (!name || !email || !password || !age || !gender) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            age,
            gender,
            role: "admin", // Default role
        });

        // Save user (triggers password hashing)
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.email, user.role);

        console.log("✅ User registered:", user._id);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("❌ Error registering user:", error.message || error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message || error,
        });
    }
};

/**
 * Login user
 */
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                message: "User account is inactive",
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.email, user.role);

        console.log("✅ User logged in:", user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("❌ Error logging in:", error.message);
        res.status(500).json({
            message: "Error logging in",
            error: error.message,
        });
    }
};

/**
 * Logout user (client-side token removal, server-side can be extended with blacklist)
 */
export const logoutController = async (req, res) => {
    try {
        // In a real app, you might want to:
        // 1. Add token to blacklist
        // 2. Invalidate refresh tokens
        // 3. Clear sessions

        console.log("✅ User logged out");

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("❌ Error logging out:", error.message);
        res.status(500).json({
            message: "Error logging out",
        });
    }
};

/**
 * Get current user profile
 */
export const getProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("❌ Error fetching profile:", error.message);
        res.status(500).json({
            message: "Error fetching profile",
        });
    }
};

/**
 * Update user profile
 */
export const updateProfileController = async (req, res) => {
    try {
        const { name, age, gender } = req.body;
        const userId = req.user.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, age, gender },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        console.log("✅ User profile updated:", userId);

        res.status(200).json({
            message: "Profile updated successfully",
            user: user.toJSON(),
        });
    } catch (error) {
        console.error("❌ Error updating profile:", error.message);
        res.status(500).json({
            message: "Error updating profile",
        });
    }
};
