// src/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/bookingController");
const { auth } = require("../middlewares/authMiddleware");

// User routes
router.post("/", auth(), controller.create);
router.get("/my", auth(), controller.myBookings);

// Admin routes
router.get("/", auth("ADMIN"), controller.all);
router.patch("/:id/status", auth("ADMIN"), controller.updateStatus);

module.exports = router;
