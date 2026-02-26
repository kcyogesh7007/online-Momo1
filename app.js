const express = require("express");
const connectDB = require("./database/database");
const app = express();
require("dotenv").config();
connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
