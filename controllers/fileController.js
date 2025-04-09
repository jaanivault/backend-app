const File = require("../models/fileModel");
const fs = require("fs");
const path = require("path");


// 📤 Upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, size, filename } = req.file;
    const { folder = "" } = req.body; // Get folder from form (optional)

    const file = new File({
      user: req.user._id,
      originalname,
      fileType: mimetype,
      size,
      filename,
      folder: folder.trim(), // Save the folder name (optional)
      filepath: filename, // If you're using this to store the filename
    });

    await file.save();

    res.status(201).json({ message: "✅ File uploaded successfully", file });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "🚨 File upload failed", error: error.message });
  }
};


// 📁 Get all files of a user
// 📂 Get all files of a user with optional search and sort
const getUserFiles = async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort = req.query.sort || "newest";

    // 🔍 Build query
    const query = {
      user: req.user._id,
      originalname: { $regex: search, $options: "i" },
    };

    // 📥 Sorting logic
    let sortBy = { uploadedAt: -1 }; // newest by default
    if (sort === "oldest") sortBy = { uploadedAt: 1 };
    else if (sort === "name") sortBy = { originalname: 1 };

    const files = await File.find(query).sort(sortBy);

    // 🌐 Add file URL
    const filesWithURL = files.map((file) => ({
      _id: file._id,
      originalname: file.originalname,
      filename: file.filename,
      folder: file.folder,
      uploadedAt: file.uploadedAt,
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    }));

    res.json(filesWithURL);

  } catch (error) {
    console.error("Fetch files error:", error);
    res.status(500).json({ message: "Failed to fetch files", error });
  }
};


//download file 




const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file || file.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", file.filename);

    res.setHeader("Content-Disposition", `attachment; filename="${file.originalname}"`);
    res.download(filePath);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
};





// 🗑️ Delete a file
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user._id });

    if (!file) {
      return res.status(404).json({ message: "❌ File not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", file.filename);

    fs.unlink(filePath, async (err) => {
      if (err) console.warn("⚠️ File already deleted or not found");

      await file.deleteOne();
      res.json({ message: "✅ File deleted successfully" });
    });
  } catch (error) {
    console.error("❌ Deletion error:", error);
    res.status(500).json({ message: "🚨 Failed to delete file", error: error.message });
  }
};

module.exports = { uploadFile, getUserFiles,downloadFile, deleteFile, };


