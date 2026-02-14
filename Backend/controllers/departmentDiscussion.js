const DepartmentMessage = require("../models/DepartmentMessage");
const User = require("../models/users");

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

/**
 * GET department discussion messages for the current user's department.
 * Query: ?limit=50 (optional)
 */
const getMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("department");
    if (!user?.department) {
      return res.status(400).json({
        success: false,
        message: "Your profile has no department set. Update your profile to join the discussion.",
      });
    }

    const limit = Math.min(
      parseInt(req.query.limit, 10) || DEFAULT_LIMIT,
      MAX_LIMIT
    );

    const messages = await DepartmentMessage.find({ department: user.department })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "name profilePic")
      .lean();

    // Return chronological order (oldest first) for display
    messages.reverse();

    res.status(200).json({
      success: true,
      department: user.department,
      data: { messages },
    });
  } catch (error) {
    console.error("Department discussion getMessages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load discussion messages",
    });
  }
};

/**
 * POST a new message to the current user's department channel.
 * Body: { text: string }
 */
const createMessage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("department name profilePic");
    if (!user?.department) {
      return res.status(400).json({
        success: false,
        message: "Your profile has no department set. Update your profile to post.",
      });
    }

    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const newMessage = new DepartmentMessage({
      department: user.department,
      userId: req.user._id,
      text,
    });
    await newMessage.save();

    const populated = await DepartmentMessage.findById(newMessage._id)
      .populate("userId", "name profilePic")
      .lean();

    res.status(201).json({
      success: true,
      data: { message: populated },
    });
  } catch (error) {
    console.error("Department discussion createMessage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to post message",
    });
  }
};

module.exports = {
  getMessages,
  createMessage,
};
