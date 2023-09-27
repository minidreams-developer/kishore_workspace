const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../models/userSchema");
const FormModel = require("../models/formSchema");
const dotenv = require("dotenv");
dotenv.config();
// console.log(dotenv);

//User Register---------------------------------------------------------------------------------------------------------------
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please enter username and password" });
    }

    const existingUser = await model.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new model({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//User Login--------------------------------------------------------------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await model.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(503).json({ message: "Incorrect Password" });
  }
  // If the password matches, generate a JWT token
  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);

  res.status(200).json({ message: "Login successfully", token });
};

// Form endpoint----------------------------------------------------------------------------------------------------------
const form = async (req, res) => {
  try {
    const {
      name,
      description,
      teamName,
      numMembers,
      location,
      college,
      phoneNumber,
    } = req.body;
    console.log(req.user.email);

    const formData = new FormModel({
      name,
      description,
      teamName,
      numMembers,
      location,
      college,
      phoneNumber,
    });

    await formData.save();

    res.json({
      message: "Form submitted successfully and data saved to MongoDB",
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get form details
const getForm = async (req, res) => {
  try {
    const email = req.user.email;
    const userDetail = await model.findOne({ email });

    const formDetails = await FormModel.findOne({ name: userDetail.username });

    if (userDetail) {
      res.json(formDetails);
    }
  } catch (error) {
    console.error("Error getting form details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, form, getForm };
