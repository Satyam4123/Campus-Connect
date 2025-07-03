const connectionRequest = require('../models/connectionRequest')
const ConnectionRequest=require('../models/connectionRequest')

const sendConnectionReq=async(req,res)=>{
    const senderId=req.user.id
    const receiverId=req.params.receiverId

    if(senderId===receiverId) return res.status(400).json({message:{"You can't send yourself a request!"}})

    try {
        const exists = await ConnectionRequest.findOne({
            sender: senderId,
            receiver: receiverId,
            status: { $in: ["pending", "accepted"] }
          });

        if(exists)
          
    } catch (error) {
        return res.status(500).json({message:"Internal server error, failed to send request."})
    }
}