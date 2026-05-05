const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const validateEnv = require("./config/validateEnv");

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
