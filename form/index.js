const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt"); 

const app = express();
app.use(cors());

const PORT = 5000;
SECRET_KEY = 'qazwsxedc'

app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String }
})

const model = new mongoose.model('model',userSchema);

const formSchema = new mongoose.Schema({
    name: String,
    description: String,
    teamName: String,
    numMembers: Number,
    location: String,
    college: String,
    phoneNumber: String,
  });
  
  const FormModel = mongoose.model("Form", formSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied token required')
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = decoded;
        // console.log(decoded);
        next();
    } catch (error) {
        res.status(400).send('invalid token' + error.message)
    }
}

//User Register---------------------------------------------------------------------------------------------------------------
app.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: "Please enter username and password" });
      }
  
      // Check if the username already exists
      const existingUser = await model.findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // If the username doesn't exist, proceed to create the new user
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new model({
        username: username,
        email: email,
        password: hashedPassword,
      });
  
      await user.save();
  
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

//User Login--------------------------------------------------------------------------------------------------------------
app.post('/login',async(req,res) => {
    const {email, password} = req.body;

    const user = await model.findOne({ email });

    if(!user){
        return res.status(401).json({ message: "Invalid credentials" });
    }
// Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch){
        return  res.status(503).json({message:"Incorrect Password"})
    }
// If the password matches, generate a JWT token
    const token = jwt.sign({ email: user.email }, SECRET_KEY);

    res.status(200).json({message: 'Login successfully', token})
})

// Form endpoint----------------------------------------------------------------------------------------------------------
app.post("/form",[auth], async (req, res) => {
    try {
      const {name,description,teamName,numMembers,location,college,phoneNumber} = req.body;
      console.log(req.user.email);

      const formData = new FormModel({
        name,
        description,
        teamName,
        numMembers,
        location,
        college,
        phoneNumber
      });
  
      await formData.save();
  
      res.json({message: "Form submitted successfully and data saved to MongoDB",});
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

//get form details
app.get('/form',[auth], async (req,res) => {
try{
     const email = req.user.email;
     const userDetail = await model.findOne({ email })
     
     const formDetails = await FormModel.findOne({ name: userDetail.username });

     if(userDetail){
       res.json(formDetails)
     }

}catch (error) {
    console.error("Error getting form details:", error);
    res.status(500).json({ message: "Internal server error" });
}
});


app.listen(PORT,(req,res) => {
    console.log(`Port running on ${PORT}` );
});


