// src/services/serviceService.js
const prisma = require("../config/prisma");

// Create service
async function createService(data) {
  return await prisma.service.create({ data });
}

// Get all services
async function getAllServices() {
  return await prisma.service.findMany({
    orderBy: { id: "desc" },
  });
}

// Get service by ID
async function getServiceById(id) {
  return await prisma.service.findUnique({
    where: { id: Number(id) },
  });
}

// Update service
async function updateService(id, data) {
  return await prisma.service.update({
    where: { id: Number(id) },
    data,
  });
}

// Delete service
async function deleteService(id) {
  return await prisma.service.delete({
    where: { id: Number(id) },
  });
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
