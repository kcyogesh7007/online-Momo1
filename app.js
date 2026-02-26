const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./database/database");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
  });
});

//register user

app.post("/register", async (req, res) => {
  const { email, password, phoneNumber, userName } = req.body;
  if (!email || !password || !phoneNumber || !userName) {
    return res.status(400).json({
      message: "Please provide email,password,phoneNumber and userName",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (userExist) {
    return res.status(400).json({
      message: "User already exist with that email",
    });
  }
  await User.create({
    userEmail: email,
    userPassword: await bcrypt.hash(password, 10),
    userName,
    userPhoneNumber: phoneNumber,
  });
  res.status(201).json({
    messag: "User registered successfully",
  });
});

//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "User doesnot exist with that email",
    });
  }
  const isPasswordMatch = await bcrypt.compare(
    password,
    userExist.userPassword,
  );
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.status(200).json({
    message: "User loggedIn successfully",
    token,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
