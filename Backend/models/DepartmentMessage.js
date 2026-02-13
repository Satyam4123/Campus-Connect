const mongoose = require("mongoose");

const departmentMessageSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

departmentMessageSchema.index({ department: 1, createdAt: -1 });

module.exports = mongoose.model("DepartmentMessage", departmentMessageSchema);