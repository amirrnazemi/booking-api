// src/services/bookingService.js
const prisma = require("../config/prisma");

// Helper to compute end time based on service duration
function computeEndTime(startTime, durationMin) {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMin * 60 * 1000);
  return end;
}

// Create new booking
async function createBooking({ userId, serviceId, startTime }) {
  const service = await prisma.service.findUnique({
    where: { id: Number(serviceId) },
  });

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  const start = new Date(startTime);
  const end = computeEndTime(start, service.durationMin);

  // Optional simple overlap check
  const overlapping = await prisma.booking.findFirst({
    where: {
      serviceId: service.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { lt: end  },
      endTime: { gt: start },
    },
  });

  if (overlapping) {
    const error = new Error("Time slot is already booked for this service");
    error.statusCode = 409;
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      serviceId: service.id,
      startTime: start,
      endTime: end,
      status: "PENDING",
    },
    include: {
      service: true,
    },
  });

  return booking;
}

// Get bookings for a specific user
async function getUserBookings(userId) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    include: {
      service: true,
    },
  });
}

// Get all bookings (for admin)
async function getAllBookings() {
  return prisma.booking.findMany({
    orderBy: { startTime: "desc" },
    include: {
      service: true,
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });
}

// Update status of a booking
async function updateBookingStatus(id, status) {
  return prisma.booking.update({
    where: { id: Number(id) },
    data: { status },
    include: {
      service: true,
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });
}

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
};
