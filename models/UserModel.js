const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: [6, "Too few eggs"],
    max: 12,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
