const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/fileDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String }
});

const Model = new mongoose.model("model", userSchema);

// Secret key for signing JWT tokens
const SECRET_KEY = "qwertyuiop"; 

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); 

  const user = new Model({
    username: username,
    password: hashedPassword, // Store the hashed password
  });

  await user.save();

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  res.send(user);
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = await Model.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // If the password matches, generate a JWT token
  const token = jwt.sign({ username: user.username }, SECRET_KEY);

  res.status(200).json({ message: "Login successfully", token });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
