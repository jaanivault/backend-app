const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
originalname:{type:String,required:true},
  filepath: { type: String, required: true },
  folder: { type: String }, // <-- New field for folders
  uploadedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add user reference if missing
});

const File = mongoose.model("File", FileSchema);
module.exports = File;

