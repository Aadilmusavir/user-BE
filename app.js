import express from "express";
import userRoutes from "./routes/user.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use("/", userRoutes);

export default app;
