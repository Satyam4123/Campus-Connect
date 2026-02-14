const announcements = require("../models/announcements");
const users = require("../models/users");

const searchFunctions = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const foundAnnouncements = await announcements
      .find({
        $or: [
          { title: { $regex: safeQuery, $options: "i" } },
          { content: { $regex: safeQuery, $options: "i" } },
        ],
      })
      .limit(20);
    const foundUsers = await users
      .find({
        $or: [
          { name: { $regex: safeQuery, $options: "i" } },
          { department: { $regex: safeQuery, $options: "i" } },
        ],
      })
      .limit(20);

    res.json({
      announcements: foundAnnouncements,
      users: foundUsers,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchFunctions };
