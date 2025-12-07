// src/middlewares/authMiddleware.js
const { verifyAccessToken } = require("../utils/jwt");

function auth(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authorization header is missing or invalid" });
    }

    try {
      const payload = verifyAccessToken(token);

      // Attach user info to request
      req.user = {
        id: payload.sub,
        role: payload.role,
      };

      // Optional role check
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      return next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

module.exports = {
  auth,
};
