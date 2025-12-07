// src/utils/jwt.js
const jwt = require("jsonwebtoken");

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function signAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
