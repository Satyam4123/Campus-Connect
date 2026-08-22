const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      index: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationTokenHash: {
      type: String,
      default: null,
    },

    emailVerificationTokenExpiry: {
      type: Date,
      default: null,
    },

    passwordResetTokenHash: { type: String, default: null },
    passwordResetTokenExpiry: { type: Date, default: null },
    failedLoginAttempts: { type: Number, default: 0 },
    loginLockedUntil: { type: Date, default: null },

    department: {
      type: String,
    },

    year: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
