const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routeRoutes = require("./routes/routeRoutes");

const app = express();

// ===============================
// CORS
// ===============================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://safe-routes-eight.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===============================
// JSON Middleware
// ===============================
app.use(express.json());

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SafeRoutes API is running",
  });
});

// ===============================
// Route API
// ===============================
app.use("/api/routes", routeRoutes);

// ===============================
// Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: err.message,
  });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SafeRoutes backend running on port ${PORT}`);
});