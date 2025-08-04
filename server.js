const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const eventRoutes = require("./routes/events")
const registrationRoutes = require("./routes/registrations")
const suggestionRoutes = require("./routes/suggestions")
const feedbackRoutes = require("./routes/feedback")
const adminRoutes = require("./routes/admin")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/registrations", registrationRoutes)
app.use("/api/suggestions", suggestionRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/admin", adminRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "SKConnect API is running!" })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skconnect")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
