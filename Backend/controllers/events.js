const Events = require("../models/eventsNcalendar");
const userActivities = require("../models/userActivities");

const createEvent=async (req,res) => {
    const {eventName, description,date,time,location}=req.body;
    try {
        const newEvent=new Events({
            eventName,
            description,
            date,
            time,
            location
        })
        await newEvent.save();
        await userActivities.create({
          userId: req.user._id,
          action:"marked",
          resourceId: newEvent._id,
          timestamp: Date.now(),
        });
        return res.status(200).json({message:"Event created successfully", newEvent})
    } catch (error) {
        return res.status(500).json({message:"Internal Server error",error})
    }
}
const getEvents=async (req,res) => {
    try {
        const events=await Events.find().sort({date:-1})
        return res.status(200).json({events})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error" });
    }
}

module.exports={createEvent,getEvents}