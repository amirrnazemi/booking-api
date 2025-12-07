const express = require("express");
const router = express.Router();

const controller = require("../controllers/serviceController");
const { auth } = require("../middlewares/authMiddleware");

// Public
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Admin only
router.post("/", auth("ADMIN"), controller.create);
router.put("/:id", auth("ADMIN"), controller.update);
router.delete("/:id", auth("ADMIN"), controller.remove);

module.exports = router;
