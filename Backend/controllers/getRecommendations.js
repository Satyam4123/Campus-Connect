const userActivities = require("../models/userActivities")
const cosineSimilarity=require('cosine-similarity')

const getRecommendations = async (req,res) => {
    try {
        const recommendations = await userActivities.aggregate([
          {
            $addFields: {
              actionValue: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$actions", "viewed"] }, then: 1 },
                    { case: { $eq: ["$actions", "downloaded"] }, then: 2 },
                    { case: { $eq: ["$actions", "marked"] }, then: 3 },
                  ],
                  default: 0,
                },
              },
            },
          },
          {
            $group: {
              _id: { userId: "$userId", resourceId: "$resourceId" },
              interactionScore: { $sum: "$actionvalue" },
            },
          },
          {
            $group: {
              _id: "$_id.userId",
              resource:{$push:{resourceId:"$_id.resourceId",score:"$interactionScore"}}
            }
          },
        ]);
        res.status(200).json(recommendations)
    } catch (error) {
        return res.status(500).json({message:"Error fetching recommendations!",error})
    }
}

module.exports={getRecommendations}