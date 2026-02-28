const User = require("../../../models/userModel");

exports.getUsers = async (req, res) => {
  const userId = req.user._id;
  const users = await User.find({ _id: { $ne: userId } }).select(
    "-userPassword",
  );
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

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      message: "Plese provide id",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "No user found with that id",
    });
  }
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "User deleted successfully",
  });
};
