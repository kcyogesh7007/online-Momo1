const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

const adminSeeder = async () => {
  const adminExist = await User.findOne({ userEmail: "admin@gmail.com" });
  if (!adminExist) {
    await User.create({
      userName: "admin",
      userPassword: await bcrypt.hash(process.env.ADMIN_PASS, 10),
      userPhoneNumber: 9865231452,
      userEmail: "admin@gmail.com",
      role: "admin",
    });
    console.log("Admin seeded successfully");
  } else {
    console.log("Admin already seeded");
  }
};

module.exports = adminSeeder;
