const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    refreshToken: {
      type: String,
      default: "",
    },
    favorites: { type: Array },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    collection: "Users",
  }
);

const User = mongoose.model("Users", UserDetailsScehma);

module.exports = User;