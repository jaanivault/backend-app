const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    resetCode: String,
    resetCodeExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("🔐 Pre-save hook - password before hash:", this.password);

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  console.log("✅ Password hashed:", this.password);

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const result = await bcrypt.compare(enteredPassword, this.password);
  console.log("🧪 Comparing entered:", enteredPassword, "with stored hash:", this.password, "→ Match:", result);
  return result;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;


;



