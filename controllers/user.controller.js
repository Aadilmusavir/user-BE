import * as userService from "../services/user.service.js";

export const createUserController = async (req, res) => {
    try {
        const userData = {
            name: "John Doe",
            age: 25,
            email: `user_${Date.now()}@example.com`,
            gender: "male",
        };

        const user = await userService.createUser(userData);

        console.log("👤 User created:", user._id);
        res.status(201).json({
            message: "User created successfully",
            data: user,
        });
    } catch (err) {
        console.error("❌ Error creating user:", err);
        res.status(500).json({ message: "Error creating user" });
    }
};

export const getUsersController = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: "Error retrieving users" });
    }
};
