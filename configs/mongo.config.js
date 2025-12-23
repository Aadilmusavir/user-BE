import mongoose from "mongoose";
import config from "../configs/env.config.js";

const connectDB = async () => {
    const { dbConnectionString } = config;
    console.log(dbConnectionString)
    try {
        if (dbConnectionString)
            await mongoose.connect(config.nodeEnv === 'development' ? "mongodb://localhost:27017/school-1" : dbConnectionString);
        console.log(`🍀 MongoDB connected to localhost`);
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await mongoose.disconnect();
};

const mongodb = mongoose.connection;

export { connectDB, mongodb, disconnectDB };