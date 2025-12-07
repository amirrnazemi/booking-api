// src/controllers/authController.js
const { registerUser, loginUser } = require("../services/authService");
const prisma = require("../config/prisma");


async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await registerUser({ email, password, name });

    return res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error) {
    console.error("Register error:", error);

    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Internal server error" });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error("Login error:", error);

    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Internal server error" });
  }
}

async function me(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  me,
};
