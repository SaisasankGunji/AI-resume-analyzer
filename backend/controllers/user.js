const userModel = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, photoUrl } = req.body;
    const isUserExists = await userModel.findOne({ email: email });

    if (!isUserExists) {
      let newUser = new userModel({ name, email, photoUrl });
      await newUser.save();
      return res.status(200).json({
        message: "User registered successfully",
        user: newUser,
      });
    }
    return res.status(200).json({
      message: "Welcome Back",
      user: isUserExists,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
