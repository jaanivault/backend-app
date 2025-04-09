const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Just create the user – pre-save hook will hash it
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;
    

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.log("❌ Email not found in DB:", email.trim().toLowerCase());
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

   

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ Login successful");

    res.json({
      message: "✅ Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❗ Login Error:", error);
    res.status(500).json({ message: "🚨 Server Error", error: error.message });
  }
};




// LOGOUT
const logoutUser = (req, res) => {
  res.json({ message: "Logout successful" });
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await user.save();

    const message = `Your password reset code is: ${resetCode}\nThis code will expire in 15 minutes.`;
    await sendEmail(user.email, "Password Reset Code", message);

    

    res.status(200).json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (
      !user ||
      String(user.resetCode) !== String(code) ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    user.password = newPassword; // Will be hashed on save via model
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    res.json({ message: "✅ Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "🚨 Server error", error: error.message });
  }
};




// ✅ EXPORT ALL FUNCTIONS TOGETHER
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};




