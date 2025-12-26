import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Routes
app.use("/api", userRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "Server is running" });
});

// Error handler (must be after all routes)
app.use((err, req, res, next) => {
    console.error("🔴 Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

// 404 handler (must be last)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;
