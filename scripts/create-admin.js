const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

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
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@skconnect.com" })
    if (existingAdmin) {
      console.log("Admin user already exists!")
      console.log("Email: admin@skconnect.com")
      console.log("You can update the password if needed.")
      return
    }

    // Create admin user
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
    console.log("Admin user created successfully!")
    console.log("Login credentials:")
    console.log("Email: admin@skconnect.com")
    console.log("Password: admin123456")
    console.log("")
    console.log("Please change the password after first login!")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the script
createAdminUser()
