const announcements = require("../models/announcements");
const users = require("../models/users");

const searchFunctions=async (req,res) => {
    const {query}=req.query;
    try {
        const foundAnnouncement = await announcements.find({
          $or: [
            {
              title: { $regex: query, $options: "i" },
            },
            {
              content: { $regex: query, $options: "i" },
            }
          ],
        });
        const foundUser=await users.find({
            $or:[
                {
                    name:{$regex:query, $options:'i'}
                },
                {
                    department:{$regex:query, $options:'i'}
                }
            ]
        })
        res.json({foundAnnouncement,foundUser})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
        
    }
}
module.exports={searchFunctions}