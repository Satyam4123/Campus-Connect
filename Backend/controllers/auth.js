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
    const user = await users.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        errors: ["No account found with this email"],
      });
    }
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        errors: ["This account uses Google sign-in. Please use Sign in with Google."],
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        errors: ["Incorrect password"],
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please try again later.",
      });
    }
    const jwtToken = generateJWT(user.id);

    // Set JWT in HTTP-only cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    });

    // Send user info (without JWT) in response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        name: user.name,
        email: user.email,
        userId: user._id,
        department: user.department,
        year: user.year,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = { login, signup };