const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const path = require("path")

// Load environment variables from the backend directory
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") })

// User schema (simplified version)
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    barangay: { type: String, required: true },
    municipality: { type: String, required: true },
    province: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ["youth", "sk_official", "admin"], default: "youth" },
    isVerified: { type: Boolean, default: false },
    dateOfBirth: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model("User", userSchema)

async function createAdminUser() {
  try {
    // Check if MONGODB_URI is available
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.error("MONGODB_URI environment variable is not set!")
      console.log("Please check your .env file in the backend directory")
      console.log("Expected format: MONGODB_URI=mongodb://localhost:27017/skconnect")
      return
    }

    console.log("Connecting to MongoDB...")
    console.log("URI:", mongoUri.replace(/\/\/.*@/, "//***:***@")) // Hide credentials in log

    // Connect to MongoDB
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB successfully!")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@skconnect.com" })
    if (existingAdmin) {
      console.log("✅ Admin user already exists!")
      console.log("📧 Email: admin@skconnect.com")
      console.log("🔑 Use your existing password or reset it")
      console.log("👤 Role:", existingAdmin.role)
      return
    }

    // Create admin user
    console.log("Creating admin user...")
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@skconnect.com",
      password: "admin123456", // This will be hashed automatically
      age: 25,
      barangay: "Admin Barangay",
      municipality: "Admin Municipality",
      province: "Admin Province",
      phoneNumber: "+639123456789",
      role: "admin",
      isVerified: true,
      dateOfBirth: new Date("1999-01-01"),
      isActive: true,
    })

    await adminUser.save()
    console.log("🎉 Admin user created successfully!")
    console.log("")
    console.log("📋 Login credentials:")
    console.log("📧 Email: admin@skconnect.com")
    console.log("🔑 Password: admin123456")
    console.log("")
    console.log("⚠️  IMPORTANT: Please change the password after first login!")
    console.log("🌐 Access admin dashboard at: /admin")
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message)
    if (error.code === 11000) {
      console.log("User with this email already exists!")
    }
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the script
createAdminUser()
