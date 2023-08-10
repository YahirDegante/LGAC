const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "8h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new Error("");
    const verificadedToken = verifyToken(token, secret);
    req.token = verificadedToken;
    next();
  } catch (error) {
    res.status(401).json({ Unauthorized: "Access denied" });
  }
};

const verifyRoles = (roles) => {
  return (req, res, next) => {
    try {
      const { role } = req.token;
      if (role === "admin") return next();
      if (!roles.includes(role)) throw new Error("");
      next();
    } catch (error) {
      res.status(403).json({ Forbidden : "You are not authorized to perform this action" });
    }
  };
};

module.exports = {
  generateToken,
  verifyToken,
  auth,
  verifyRoles,
};
