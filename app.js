const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173'
}));

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnect();

// Middleware to parse JSON request bodies
app.use(express.json());

// register endpoint
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      userName: req.body.userName
    });
    const result = await user.save();
    res.status(201).send({
      message: "User Created Successfully !!",
      result
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: "Error when creating user !",
      error
    });
  }
});

// login endpoint
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        message: "Email not found"
      });
    }
    const passwordCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({
        message: "Password doesn't match !!"
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h" }
    );
    res.status(200).send({
      message: "Login Successful",
      email: user.email,
      token
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).send({
      message: "Error when logging in!",
      error
    });
  }
});

// Start listening for incoming HTTP requests
app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
