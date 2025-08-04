const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("age").isInt({ min: 15, max: 30 }).withMessage("Age must be between 15 and 30"),
    body("barangay").trim().notEmpty().withMessage("Barangay is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { firstName, lastName, email, password, age, barangay, phoneNumber } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        age,
        barangay,
        phoneNumber,
      })

      await user.save()

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: user.toJSON(),
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error during registration" })
    }
  },
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(400).json({ message: "Account is deactivated" })
      }

      // Verify password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.json({
        message: "Login successful",
        token,
        user: user.toJSON(),
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error during login" })
    }
  },
)

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user: user.toJSON() })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update profile
router.put(
  "/profile",
  auth,
  [
    body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty"),
    body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty"),
    body("phoneNumber").optional().trim(),
    body("interests").optional().isArray(),
    body("skills").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const updates = req.body
      delete updates.email // Prevent email updates
      delete updates.password // Prevent password updates
      delete updates.role // Prevent role updates

      const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        message: "Profile updated successfully",
        user: user.toJSON(),
      })
    } catch (error) {
      console.error("Profile update error:", error)
      res.status(500).json({ message: "Server error during profile update" })
    }
  },
)

// Change password
router.put(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { currentPassword, newPassword } = req.body

      const user = await User.findById(req.userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      // Update password
      user.password = newPassword
      await user.save()

      res.json({ message: "Password changed successfully" })
    } catch (error) {
      console.error("Password change error:", error)
      res.status(500).json({ message: "Server error during password change" })
    }
  },
)

module.exports = router
