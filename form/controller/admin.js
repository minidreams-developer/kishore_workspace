const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const model = require("../routes/adminRout");
const adminModel = require("../models/adminSchema");
const FormModel = require("../models/formSchema");
const dotenv = require("dotenv");
dotenv.config();



// admin register 

const adminRegister = async(req,res) => {
try {
    const { email, password } = req.body;

    if(!email||!password){
        res.status(404).json({ message: 'please enter username and password'});
    }
 
    const existingUser = await adminModel.findOne({ email });

    if(existingUser){
        res.status().json({ message: 'user already exists'})
    }

    const hashedPassword = await bcrypt.hash(password,10)
    
    const admin = new adminModel({
        email: email,
        password: hashedPassword,
    });

    await admin.save();
    res.status(200).json({ message: 'admin registered successfully'});
  } catch(error){
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });  }
}

// admin login

const adminLogin = async(req,res) =>{
try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });

    if(!admin){
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
        return res.status(503).json({ message: "Incorrect password" });
    }
    const token = await jwt.sign({ role: admin.role }, process.env.SECRET_KEY);

    res.status(200).json({message: 'Login successfully', token})
 }catch(error){
    console.error("Invalid email or password:", error);
    res.status(500).json({ message: "user not found" });
 }
}

// userForms

const userForms = async (req, res) => {
    try {
      const role = req.user.role;
    //   const adminDetail = await adminModel.findOne({ role });
  
      if(role==='admin'){
        const formDetails = await FormModel.find();
        console.log(formDetails);
        res.status(200).json({formDetails})
    }else{
        res.status().json({message: 'Not a admin'})
    }
    } catch (error) {
      console.error("Error getting form details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { adminRegister, adminLogin, userForms };