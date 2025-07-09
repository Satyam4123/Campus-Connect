const ConnectionRequest = require("../models/connectionRequest");
const Connection = require("../models/connections");
const messages = require("../models/messages");
const User = require("../models/users");

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

    const newConnection = new Connection({
      user1: senderId,
      user2: receiverId,
    });

    await newConnection.save();
    await request.deleteOne();

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

const getConnectedUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const connectedUsers = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
    });

    const connectedUserIds = connectedUsers.map((conn) =>
      conn.user1.equals(userId) ? conn.user2 : conn.user1
    );

    const connectedUsersData = await User.find({
      _id: { $in: connectedUserIds },
    }).select("_id name email");

    return res.status(200).json(connectedUsersData);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch connected users." });
  }
};

const sendMessage=async (req, res) => {
  const senderId=req.user.id;
  const receiverId=req.params.receiverId;

  const {text}=req.body

  if(!receiverId || !text?.trim()){
    return res.status(400).json({message:"Text message is required."})
  }
  try {
    const message=new messages({
      senderId,
      receiverId,
      text:text.trim()
    })
    const savedMessage=await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    return res.status(500).json({message:"Failed to send message."})
  }
}

const getHistory=async(req, res)=>{
  const userId=req.user.id;
  const receiverId=req.params.receiverId;

  try {
    const chat=await messages.find({
      $or:[
        {senderId: userId, receiverId: receiverId},
        {senderId: receiverId, receiverId:userId}
      ]
    }).sort({createdAt:1});
    res.status(200).json({
      success:true,
      chat
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Server Error. Failed to get previous chat."
    })
  }

}

module.exports = {
  sendConnectionReq,
  acceptConnectionReq,
  rejectConnectionReq,
  getPendingRequests,
  getConnectedUsers,
  sendMessage,
  getHistory
};
