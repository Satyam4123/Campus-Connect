const { sendNotification } = require("../config/socket");

const postAnnouncement = async (req, res) => {
  // your logic...
  const userId = req.body.userId;
  sendNotification(userId, "New announcement posted!");
  res.status(201).json({ message: "Announcement sent + notification" });
};
