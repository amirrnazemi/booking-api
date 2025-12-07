// src/controllers/bookingController.js
const bookingService = require("../services/bookingService");

// POST /bookings
// Create new booking for logged in user
async function create(req, res) {
  try {
    const userId = req.user.id;
    const { serviceId, startTime } = req.body;

    if (!serviceId || !startTime) {
      return res
        .status(400)
        .json({ message: "serviceId and startTime are required" });
    }

    const booking = await bookingService.createBooking({
      userId,
      serviceId,
      startTime,
    });

    return res.status(201).json({ booking });
  } catch (error) {
    console.error("Create booking error:", error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message });
  }
}

// GET /bookings/my
// Get bookings for logged in user
async function myBookings(req, res) {
  try {
    const userId = req.user.id;

    const bookings = await bookingService.getUserBookings(userId);

    return res.json({ bookings });
  } catch (error) {
    console.error("My bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// GET /bookings
// Get all bookings (admin only)
async function all(req, res) {
  try {
    const bookings = await bookingService.getAllBookings();

    return res.json({ bookings });
  } catch (error) {
    console.error("All bookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// PATCH /bookings/:id/status
// Update booking status (admin only)
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      status
    );

    return res.json({ booking });
  } catch (error) {
    console.error("Update booking status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  create,
  myBookings,
  all,
  updateStatus,
};
