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

    // Find announcements by matching authors (optional, uncomment if needed)
    /*
    // If announcements have an authorId field that references users
    const userIds = foundUsers.map(user => user._id);
    
    const announcementsByAuthor = userIds.length > 0 ? 
      await announcements.find({ authorId: { $in: userIds } }).limit(20) : [];
    
    // Combine and deduplicate announcements
    const combinedAnnouncements = [...foundAnnouncements];
    announcementsByAuthor.forEach(announcement => {
      if (!combinedAnnouncements.some(a => a._id.toString() === announcement._id.toString())) {
        combinedAnnouncements.push(announcement);
      }
    });
    */

    // Send response with clear property names
    res.json({
      announcements: foundAnnouncements,
      users: foundUsers,
      // uncomment if using the author search section above
      // announcementsByAuthor: announcementsByAuthor
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchFunctions };
