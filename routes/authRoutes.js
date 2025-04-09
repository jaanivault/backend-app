
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Register route
router.post("/register", registerUser);

// Login route 
router.post("/login",  loginUser);

// Logout route
router.post("/logout", logoutUser);

// Forgot Password
router.post("/forgot-password",  forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;






