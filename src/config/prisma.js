// src/config/prisma.js
const { PrismaClient } = require("@prisma/client");

// Create a single PrismaClient instance
const prisma = new PrismaClient({
  // Enable useful logs in development
  log: ["query", "error", "warn"],
});

// Export the instance to use it across the app
module.exports = prisma;
