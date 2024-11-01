const users = require("../models/users")

// Get profile
const getProfile=async (req,res)=>{
    try {
        const profile=await users.findById(req.params.id)
        
        if (!profile) {
            return res.status(404).json({message:"Profile not found"})
        }
        res.status(200).json(profile)
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

// edit


// delete

module.exports={getProfile}