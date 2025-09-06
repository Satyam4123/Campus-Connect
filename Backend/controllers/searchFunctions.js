const announcements = require("../models/announcements");
const users = require("../models/users");
const Connection = require("../models/connections");
const ConnectionRequest = require("../models/connectionRequest");

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

const searchUsersForConnection = async (req, res) => {
  const { query } = req.query;
  const currentUserId = req.user.id;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Get connected user IDs
    const connections = await Connection.find({
      $or: [{ user1: currentUserId }, { user2: currentUserId }]
    });
    const connectedUserIds = connections.map(conn => 
      conn.user1.toString() === currentUserId ? conn.user2 : conn.user1
    );

    // Get pending request user IDs
    const pendingRequests = await ConnectionRequest.find({
      $or: [
        { sender: currentUserId },
        { receiver: currentUserId }
      ],
      status: "pending"
    });
    const pendingUserIds = pendingRequests.map(req => 
      req.sender.toString() === currentUserId ? req.receiver : req.sender
    );

    const excludeIds = [currentUserId, ...connectedUserIds, ...pendingUserIds];

    const foundUsers = await users
      .find({
        _id: { $nin: excludeIds },
        $or: [
          { name: { $regex: safeQuery, $options: "i" } },
          { email: { $regex: safeQuery, $options: "i" } },
          { department: { $regex: safeQuery, $options: "i" } }
        ]
      })
      .select("name email department year")
      .limit(20);

    res.json({ users: foundUsers });
  } catch (error) {
    console.error("User search error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchFunctions, searchUsersForConnection };
