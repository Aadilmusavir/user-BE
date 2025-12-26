import User from "../models/user.model.js";

/**
 * Get all users (Admin only)
 */
export const getUsersController = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: "Error retrieving users" });
    }
};

/**
 * Create a new user (Admin only)
 */
export const createUserController = async (req, res) => {
    try {
        const { name, email, password, age, gender, role } = req.body;

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

        const user = await User.create({
            name,
            email,
            password,
            age,
            gender,
            role: role || "user",
        });

        console.log("👤 User created:", user._id);

        res.status(201).json({
            message: "User created successfully",
            data: user.toJSON(),
        });
    } catch (err) {
        console.error("❌ Error creating user:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message,
        });
    }
};

/**
 * Get user by ID
 */
export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user.toJSON());
    } catch (err) {
        console.error("❌ Error fetching user:", err);
        res.status(500).json({ message: "Error fetching user" });
    }
};

/**
 * Update user (Admin can update any, user can update own)
 */
export const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, role, isActive } = req.body;

        // Check authorization
        if (req.user.role !== "admin" && req.user.userId !== id) {
            return res.status(403).json({
                message: "Not authorized to update this user",
            });
        }

        // Prepare update data
        const updateData = { name, age, gender };

        // Only admin can update role and isActive
        if (req.user.role === "admin") {
            if (role) updateData.role = role;
            if (isActive !== undefined) updateData.isActive = isActive;
        }

        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        console.log("✅ User updated:", id);

        res.status(200).json({
            message: "User updated successfully",
            data: user.toJSON(),
        });
    } catch (err) {
        console.error("❌ Error updating user:", err);
        res.status(500).json({
            message: "Error updating user",
            error: err.message,
        });
    }
};

/**
 * Delete user (Admin only)
 */
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        console.log("✅ User deleted:", id);

        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (err) {
        console.error("❌ Error deleting user:", err);
        res.status(500).json({
            message: "Error deleting user",
            error: err.message,
        });
    }
};

/**
 * Get users by role (Admin only)
 */
export const getUsersByRoleController = async (req, res) => {
    try {
        const { role } = req.params;

        const validRoles = ["user", "admin", "moderator"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        const users = await User.find({ role });

        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Error fetching users by role:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
};
