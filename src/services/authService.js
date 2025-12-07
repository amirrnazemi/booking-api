// src/services/authService.js
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const {
  signAccessToken,
  signRefreshToken,
} = require("../utils/jwt");

const SALT_ROUNDS = 10;

// Register new user
async function registerUser({ email, password, name, role = 'USER' }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const error = new Error("Email is already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

// Login user
async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};
