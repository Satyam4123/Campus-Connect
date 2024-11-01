const users = require("../models/users")
const bcrypt=require('bcrypt')

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
const editProfile=async (req,res) => {
    const {name,password,department,year}=req.body;
    try {
        const user=await users.findById(req.user._id)
        if(!user) return res.status(404).json({error: "User not found"})
        if (name) user.name=name;
        if (department) user.department=department;
        if (year) user.year=year;
        if (password) {
          user.password = await bcrypt.hash(password, 10);
        }
        await user.save();
        res.status(200).json({message:"Profile updated successfully"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

// delete

module.exports={getProfile,editProfile}