const generateJWT = require("../config/jwtGenerate");
const users = require("../models/users");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { name, email, password, department, year } = req.body;
    const user = await users.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!",
      });
    }
    const newUser = new users({ name, email, password, department, year });
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Signup successful! Please login.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "No user associated with this email" });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: "Wrong email or password" });
    }
    const jwtToken = generateJWT(user.id);
    res.status(201).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      jwtToken,
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

module.exports = { login, signup };
