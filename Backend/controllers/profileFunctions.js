const users = require("../models/users")
const bcrypt=require('bcrypt')

// Get profile
const getProfile = async (req, res) => {
  try {
    const profile = await users.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const { password, ...safeData } = profile._doc;
    res.status(200).json(safeData)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


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
const deleteProfile=async(req,res)=>{
    const {password}=req.body;
    try {
        const user=await users.findById(req.user._id)
        if (!user) {
            return res.status(404).json({message:"User not found"})
        }
        const isPassEqual=await bcrypt.compare(password,user.password)
        if (!isPassEqual) {
            return res.status(401).json({message:"Incorrect password"})
        }
        await user.deleteOne()
        res.status(200).json({message:"Account deleted successfully"})
    } catch (error) {
        return res.status(500).json({message:"Server error while deleting your account"})
    }
}

module.exports={getProfile,editProfile,deleteProfile}