const announcementsModel = require("../models/announcements")

const getAnnouncements=async (req,res) => {
    try {
        const announcements=await announcementsModel.find().sort({date:-1});
        return res.status(200).json(announcements)

    } catch (error) {
        return res.status(500).json({message:"Server error while fetching announcements"})
    }
}
const addAnnouncement=async (req,res)=>{
    const {title,content}=req.body
    try {
        const newAnnouncement=new announcementsModel({
            title,
            content,
            author:req.user.name
        })
        await newAnnouncement.save()
        return res.status(201).json({message:"Announcement added successfully", newAnnouncement})
    } catch (error) {
        return res.status(500).json({message:"Internal Server error"})
    }
}

module.exports={getAnnouncements,addAnnouncement}