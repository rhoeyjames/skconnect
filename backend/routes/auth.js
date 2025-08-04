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
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2-100 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("age").isInt({ min: 13, max: 30 }).withMessage("Age must be between 13-30"),
    body("barangay").trim().notEmpty().withMessage("Barangay is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { name, email, password, age, barangay } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        age,
        barangay,
      })

      await user.save()

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          barangay: user.barangay,
          role: user.role,
        },
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
    body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ email, isActive: true })
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" })
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          barangay: user.barangay,
          role: user.role,
        },
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
    const user = await User.findById(req.user.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user })
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
    body("name").optional().trim().isLength({ min: 2, max: 100 }),
    body("age").optional().isInt({ min: 13, max: 30 }),
    body("barangay").optional().trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const updates = req.body
      delete updates.email // Prevent email updates
      delete updates.password // Prevent password updates
      delete updates.role // Prevent role updates

      const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true, runValidators: true }).select(
        "-password",
      )

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        message: "Profile updated successfully",
        user,
      })
    } catch (error) {
      console.error("Profile update error:", error)
      res.status(500).json({ message: "Server error during profile update" })
    }
  },
)

module.exports = router
