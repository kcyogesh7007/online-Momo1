const User = require("../../../models/userModel");

exports.getUsers = async (req, res) => {
  const users = await User.find().select("-userPassword");
  if (users.length < 1) {
    return res.status(404).json({
      message: "User collection is empty",
    });
  }
  res.status(200).json({
    message: "User fetched successfully",
    data: users,
  });
};
