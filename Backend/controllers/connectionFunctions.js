const ConnectionRequest = require("../models/connectionRequest");
const Connection = require("../models/connections");
const messages = require("../models/messages");
const User = require("../models/users");
const { getIO } = require("../config/socket");

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
    
    // Get sender info and emit real-time notification
    const sender = await User.findById(senderId).select("name email department");
    const io = getIO();
    io.to(receiverId.toString()).emit("connectionRequest", {
      type: "received",
      request: {
        _id: newReq._id,
        sender: {
          _id: senderId,
          name: sender.name,
          email: sender.email,
          department: sender.department
        },
        createdAt: newReq.createdAt
      }
    });
    
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

    // Get user info and emit real-time notification
    const accepter = await User.findById(receiverId).select("name email department");
    const io = getIO();
    io.to(senderId.toString()).emit("connectionRequest", {
      type: "accepted",
      user: {
        _id: receiverId,
        name: accepter.name,
        email: accepter.email,
        department: accepter.department
      }
    });

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

    // Emit real-time notification
    const io = getIO();
    io.to(senderId.toString()).emit("connectionRequest", {
      type: "rejected",
      userId: receiverId
    });

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
    }).select("_id name email department profilePic");

    // Get last message and unread count for each connected user
    const usersWithChatInfo = await Promise.all(
      connectedUsersData.map(async (user) => {
        // Get last message between current user and this connected user
        const lastMessage = await messages
          .findOne({
            $or: [
              { senderId: userId, receiverId: user._id },
              { senderId: user._id, receiverId: userId }
            ]
          })
          .sort({ createdAt: -1 });

        // Count unread messages from this user
        const unreadCount = await messages.countDocuments({
          senderId: user._id,
          receiverId: userId,
          isRead: { $ne: true }
        });

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          profilePic: user.profilePic,
          lastMessage: lastMessage ? {
            text: lastMessage.text,
            createdAt: lastMessage.createdAt,
            senderId: lastMessage.senderId
          } : null,
          unreadCount
        };
      })
    );

    // Sort by last message timestamp (most recent first)
    usersWithChatInfo.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return bTime - aTime;
    });

    return res.status(200).json(usersWithChatInfo);
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
    
    // Emit real-time message notification
    const io = getIO();
    io.to(receiverId.toString()).emit("receiveMessage", savedMessage);
    
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
    
    // Mark messages from the other user as read
    await messages.updateMany(
      { senderId: receiverId, receiverId: userId, isRead: false },
      { isRead: true }
    );
    
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

const markMessagesAsRead = async (req, res) => {
  const userId = req.user.id;
  const senderId = req.params.senderId;

  try {
    await messages.updateMany(
      { senderId: senderId, receiverId: userId, isRead: false },
      { isRead: true }
    );
    
    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark messages as read" });
  }
};

module.exports = {
  sendConnectionReq,
  acceptConnectionReq,
  rejectConnectionReq,
  getPendingRequests,
  getConnectedUsers,
  sendMessage,
  getHistory,
  markMessagesAsRead
};
