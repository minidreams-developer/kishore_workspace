const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const router = require("./routes/user");
const adminRouter = require("./routes/adminRout");
 

const app = express();
app.use(cors());
app.use(bodyParser.json());


const PORT = 5000;

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", router)
app.use("/api", adminRouter)

app.listen(PORT,(req,res) => {
    console.log(`Port running on ${PORT}` );
});

