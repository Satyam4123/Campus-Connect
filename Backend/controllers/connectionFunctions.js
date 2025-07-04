const ConnectionRequest = require("../models/connectionRequest");
const Connection = require("../models/connections");

const sendConnectionReq = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;

  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ message: "You can't send yourself a request!" });
  }

  try {
    const alreadyConnected = await Connection.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId },
      ],
    });

    if (alreadyConnected) {
      return res
        .status(400)
        .json({ message: "You are already connected with this user." });
    }

    const exists = await ConnectionRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (exists) {
      return res.status(400).json({ message: "Request already sent." });
    }

    const newReq = new ConnectionRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await newReq.save();
    return res.status(201).json({ message: "Connection request sent!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error, failed to send request." });
  }
};

const acceptConnectionReq = async (req, res) => {
  const receiverId = req.user.id;
  const senderId = req.params.senderId;

  try {
    const request = await ConnectionRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "No pending requests." });
    }

    request.status = "accepted";
    await request.save();

    const newConnection = new Connection({
      user1: senderId,
      user2: receiverId,
    });

    await newConnection.save();

    return res.status(200).json({ message: "Connection request accepted!" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to accept request." });
  }
};

const rejectConnectionReq = async (req, res) => {
  const receiverId = req.user.id;
  const senderId = req.params.senderId;

  try {
    const request = await ConnectionRequest.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "No pending requests." });
    }

    return res
      .status(200)
      .json({ message: "Connection request rejected and deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject request." });
  }
};

const getPendingRequests = async (req, res) => {
  const receiverId = req.user.id;

  try {
    const requests = await ConnectionRequest.find({
      receiver: receiverId,
      status: "pending",
    }).populate("sender", "name username"); // Return basic sender info

    return res.status(200).json({ requests });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch pending requests." });
  }
};

module.exports = {
  sendConnectionReq,
  acceptConnectionReq,
  rejectConnectionReq,
  getPendingRequests,
};
