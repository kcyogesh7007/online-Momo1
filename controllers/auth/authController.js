const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
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
};

exports.loginUser = async (req, res) => {
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
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "User doesnot exist with that email",
    });
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  await sendEmail({
    email,
    subject: "Your Otp for Online Momo:",
    message: `Your Otp for Online Momo is ${otp}. Don't share with anyone.`,
  });
  userExist.otp = otp;
  await userExist.save();
  res.status(200).json({
    message: "Otp sent successfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide email and otp",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "User doesnot exist with that email",
    });
  }
  if (userExist.otp !== otp) {
    return res.status(400).json({
      message: "Invalid otp",
    });
  }
  ((userExist.otp = undefined), (userExist.isOtpVerified = true));
  await userExist.save();
  res.status(200).json({
    message: "Otp Verified successfully",
  });
};
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email,newPassword and confirmPassword",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm password didnt match",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "User doesnot exist with that email",
    });
  }
  if (userExist.isOtpVerified !== true) {
    return res.status(403).json({
      message: "You cannot perform this action",
    });
  }

  userExist.isOtpVerified = false;
  userExist.userPassword = await bcrypt.hash(newPassword, 10);
  await userExist.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
};
