const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routeRoutes = require("./routes/routeRoutes");
console.log("routeRoutes is:", typeof routeRoutes, routeRoutes);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SafeRoutes API is running",
  });
});

app.use("/api/routes", routeRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SafeRoutes backend running on http://localhost:${PORT}`);
});