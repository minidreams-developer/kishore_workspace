const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../routes/adminRout");
const adminModel = require("../models/adminSchema");
const FormModel = require("../models/formSchema");
const dotenv = require("dotenv");
dotenv.config();

// Email validation function
function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

// Password complexity validation function
function isPasswordComplex(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/;
  return passwordRegex.test(password);
}

// Admin Register
const adminRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password complexity
    if (!isPasswordComplex(password)) {
      return res.status(400).json({ message: "Invalid password format" });
    }

    const existingUser = await adminModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new adminModel({
      email: email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(200).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(503).json({ message: "Incorrect password" });
    }

    const token = await jwt.sign({ role: admin.role }, process.env.SECRET_KEY);

    res.status(200).json({ message: "Login successfully", token });
  } catch (error) {
    console.error("Invalid email or password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Forms
const userForms = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "admin") {
      const formDetails = await FormModel.find();
      res.status(200).json({ formDetails });
    } else {
      res.status().json({ message: "Not an admin" });
    }
  } catch (error) {
    console.error("Error getting form details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { adminRegister, adminLogin, userForms };
