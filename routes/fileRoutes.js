const express = require("express");
const router = express.Router();

const {
  uploadFile,
  getUserFiles,
  deleteFile,
  downloadFile, // ✅ download controller imported here
} = require("../controllers/fileController");

const protect = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

// Upload file
router.post("/upload", protect, uploadMiddleware.single("file"), uploadFile);

// List files
router.get("/", protect, getUserFiles);

// Delete file
router.delete("/:id", protect, deleteFile);

// Download file
router.get("/download/:id", protect, downloadFile); // ✅ fixed download route

module.exports = router;



