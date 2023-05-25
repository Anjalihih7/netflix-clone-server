const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: [5, "minimum 5 characters"],
    maxlength: [20, "Name cannot exceed 20 characters"],
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your name"],
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//FOR HASH PASSOWRD
//Say, for example, you want to run a function everytime before you save a document in the DB, we would you a pre-hook for that
userSchema.pre("save", async function (next) {
  // console.log("this", this);
  // console.log("isModified", this.isModified("password"));

  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//FOR COMPARE PASSWORD  (Adds an instance method to documents constructed from Models compiled from this schema.)
userSchema.method("comparePassword", async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
});

//FOR GENERATE JWT TOKEN
userSchema.method("getJwtToken", function () {
  // console.log("this jwt", this);
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
});

//GENERATE REST PASSWORD TOKEN
userSchema.method("getResetPasswordToken", function () {
  //generarting token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //resetPAssword expire time 15 min
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
});

module.exports = mongoose.model("User", userSchema);
