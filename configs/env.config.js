import dotenv from "dotenv";
import { validateEnvVar } from "../utils/commonUtils.js";

const result = dotenv.config();
if (result.error) {
    console.log("Error loading .env file");
    process.exit(1);
}

const rawConfig = {
    dbHost: process.env.DB_HOST,
    dbConnectionString: process.env.DB_CONNECTION_STRING,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    serverPort: process.env.SERVER_PORT,
    nodeEnv: process.env.NODE_ENV,
};

const config = new Proxy(rawConfig, {
    get(target, prop) {
        if (prop in target) {
            return validateEnvVar(target[prop], prop);
        }
        throw new Error(`Configuration key ${String(prop)} is not defined`);
    },
});

export default config;
