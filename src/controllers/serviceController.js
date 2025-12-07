// src/controllers/serviceController.js
const serviceService = require("../services/serviceService");

async function create(req, res) {
  try {
    const { name, description, durationMin } = req.body;

    if (!name || !durationMin) {
      return res.status(400).json({ message: "name and durationMin are required" });
    }

    const service = await serviceService.createService({
      name,
      description,
      durationMin,
    });

    return res.status(201).json({ service });
  } catch (error) {
    console.error("Create service error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAll(req, res) {
  try {
    const services = await serviceService.getAllServices();
    return res.json({ services });
  } catch (error) {
    console.error("Get services error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getOne(req, res) {
  try {
    const service = await serviceService.getServiceById(req.params.id);

    if (!service) return res.status(404).json({ message: "Service not found" });

    return res.json({ service });
  } catch (error) {
    console.error("Get service error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function update(req, res) {
  try {
    const { name, description, durationMin } = req.body;

    const service = await serviceService.updateService(req.params.id, {
      name,
      description,
      durationMin,
    });

    return res.json({ service });
  } catch (error) {
    console.error("Update service error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    await serviceService.deleteService(req.params.id);
    return res.json({ message: "Service deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};
