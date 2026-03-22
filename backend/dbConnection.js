const mongoose = require("mongoose");

require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => console.log("Database connected succesfully"))
  .catch((err) => console.log(`Database connection failed due to ${err}`));
