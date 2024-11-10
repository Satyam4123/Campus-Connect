const jwt=require('jsonwebtoken')
const users=require('../models/users')

const protect=async (req,res,next)=>{
    const {authorization}=req.headers;
    if (authorization) {
        const token=authorization.split(" ")[1];
        try {
            const {id}=jwt.verify(token, process.env.JWT_SECRET)
            req.user=await users.findOne({_id:id}).select("_id name")
            
            if (!req.user) {
                return res.status(401).json({error:"User not found"})
            }
            next()
        } catch (error) {
            console.log("JWT error:",error)
            res.status(401).json({error:"Request not authorized"})
        }
    }
    else if (req.isAuthenticated()) {
        return next();
    }
    else{
        return res.status(401).json({message:"Authorization required"})
    }
}
module.exports={protect}