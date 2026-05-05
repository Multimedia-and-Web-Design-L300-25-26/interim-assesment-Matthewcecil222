const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const token = req.cookies.token || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in first",
        path: req.originalUrl,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found for this token",
        path: req.originalUrl,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      path: req.originalUrl,
    });
  }
};

module.exports = protect;
