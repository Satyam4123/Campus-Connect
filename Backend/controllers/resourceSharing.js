const resources = require("../models/resources")
const path=require('path')
const getResources=async (req,res) => {
    try {
        const resourcesResponse=await resources.find().sort({date:-1})
        return res.status(200).json(resourcesResponse)
    } catch (error) {
        return res.status(500).json({message:"Error while fetching resources"})
    }
}

const uploadResource=async (req,res) => {
    const {title,description}=req.body;
    const file=req.file;
    if (!file) {
        return res.status(400).json({message:"File is required"})
    }
    try {
        const newResource= new resources({
            title,
            description,
            filename:file.filename,
            uploader:req.user.name
        })
        await newResource.save();
        res.status(200).json({message:"Resource uploaded successfully"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error})
    }
}

const downloadResource=(req,res)=>{
    const {filename}=req.params;
    const filepath=path.join(__dirname,'../src/uploads',req.user._id.toString(),filename)
    res.download(filepath,(err)=>{
       if (err) {
         console.log(`Download error: ${err}`);
         return res.status(500).json({ message: "Error downloading the file", err });
       }
       else{
        console.log("Downloading the file...")
       }
    })

}
module.exports={getResources,uploadResource,downloadResource}