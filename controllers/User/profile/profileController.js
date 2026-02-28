const User = require("../../../models/userModel");
const bcrypt = require("bcryptjs");

//get my profile
exports.getMyProfile = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("-userPassword");
  res.status(200).json({
    message: "Profile fetched successfully",
    data: user,
  });
};
//update my profile
exports.updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { email, username, phoneNumber } = req.body;
  const updatedData = await User.findByIdAndUpdate(
    userId,
    {
      userEmail: email,
      userName: username,
      userPhoneNumbre: phoneNumber,
    },
    {
      runValidators: true,
      new: true,
    },
  );
  res.status(200).json({
    message: "Profile updated successfully",
    data: updatedData,
  });
};

//delete my profile
exports.deleteProfile = async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "Profile deleted successfully",
  });
};
//change password
exports.changePassword = async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide oldPassword,confirmPassword and new Password",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm Password didnt match",
    });
  }
  const user = await User.findById(userId);
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.userPassword);
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }
  user.userPassword = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.status(200).json({
    message: "password changed successfully",
  });
};
