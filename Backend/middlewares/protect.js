const jwt=require('jsonwebtoken')
const users=require('../models/users')

const protect=async (req,res,next)=>{
    const {authorization}=req.headers;
    if (!authorization) {
        return res.status(401).json({error:"Authorization token required"})
    }
    const token=authorization.split(" ")[1];
    try {
        const {id}=jwt.verify(token, process.env.JWT_SECRET)
        req.user=await users.findOne({_id:id}).select("_id")
        
        if (!req.user) {
            return res.status(401).json({error:"User not found"})
        }
        next()
    } catch (error) {
        console.log("JWT error:",error)
        res.status(401).json({error:"Request not authorized"})
    }
}
module.exports={protect}