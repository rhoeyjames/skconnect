const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/events", require("./routes/events"))
app.use("/api/registrations", require("./routes/registrations"))
app.use("/api/suggestions", require("./routes/suggestions"))
app.use("/api/feedback", require("./routes/feedback"))
app.use("/api/admin", require("./routes/admin"))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SKConnect Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "SKConnect Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      events: "/api/events",
      registrations: "/api/registrations",
      suggestions: "/api/suggestions",
      feedback: "/api/feedback",
      admin: "/api/admin",
    },
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/skconnect", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB")

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed")
    process.exit(0)
  })
})

module.exports = app
