const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verify user still exists and is active
    const user = await User.findById(decoded.userId).select("-password")
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid token. User not found or inactive." })
    }

    req.user = {
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    }

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error in authentication." })
  }
}

// Admin only middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." })
  }
  next()
}

module.exports = auth
module.exports.adminAuth = adminAuth
