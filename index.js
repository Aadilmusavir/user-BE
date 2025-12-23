import app from "./app.js";
import config from "./configs/env.config.js";
import { connectDB, disconnectDB } from "./configs/mongo.config.js";


/* =========================
   Server Bootstrap
========================= */

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception! 🛑 Shutting down...");
    console.error(err);
    process.exit(1);
});

(async () => {
    let server;

    try {
        await connectDB();

        server = app.listen(config.serverPort, () => {
            console.log(`🚀 Server running at http://localhost:${config.serverPort}`);
        });

        process.on("unhandledRejection", async (err) => {
            console.error("Unhandled Rejection! 🛑 Shutting down...");
            console.error(err);

            server.close(async () => {
                await disconnectDB();
                process.exit(1);
            });
        });

        process.on("SIGINT", async () => {
            console.log("SIGINT received. Closing server...");
            server.close(async () => {
                await disconnectDB();
                process.exit(0);
            });
        });

        process.on("SIGTERM", async () => {
            console.log("SIGTERM received. Closing server...");
            server.close(async () => {
                await disconnectDB();
                process.exit(0);
            });
        });
    } catch (error) {
        console.error("❌ Error during server startup:", error);
        process.exit(1);
    }
})();
