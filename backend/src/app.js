const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const openApiDocument = require("./docs/openapi.json");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const publicRoutes = require("./routes/publicRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigin = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigin.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Coinbase Clone Backend API",
    docs: {
      openApi: "/api/docs",
      health: "/health",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/docs", (req, res) => {
  res.status(200).json(openApiDocument);
});

app.get("/docs", (req, res) => {
  res.status(200).json(openApiDocument);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/", publicRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
