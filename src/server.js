// src/server.js
const express = require("express");
const cors = require("cors");
const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;


// Middlewares
app.use(cors());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);

// Simple health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (req, res) => {
  try {
    // Simple raw query to check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "up" });
  } catch (error) {
    console.error("DB health check failed:", error);
    res.status(500).json({ status: "error", db: "down" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
