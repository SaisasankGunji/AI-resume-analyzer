const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const resumeRoutes = require("./routes/resume");
const cors = require("cors");
require("dotenv").config();

require("./dbConnection");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);

app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to backend" });
});
const PORT = process.env.PORT;

module.exports = app;
