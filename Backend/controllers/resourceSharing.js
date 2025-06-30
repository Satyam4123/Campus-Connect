const resources = require("../models/resources");
const path = require("path");
const userActivities = require("../models/userActivities");

const getResources = async (req, res) => {
  try {
    const resourcesResponse = await resources.find().sort({ date: -1 });
    return res.status(200).json(resourcesResponse);
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching resources" });
  }
};

const viewResource = async (req, res) => {
  const { resourceId } = req.params;
  try {
    const resource = await resources.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await userActivities.create({
      userId: req.user._id,
      action: "viewed",
      resourceId: resource._id,
      timestamp: Date.now(),
    });

    return res.status(200).json(resource);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching the resource", error });
  }
};

const uploadResource = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }
  try {
    const newResource = new resources({
      title,
      description,
      filename: file.filename,
      uploader: req.user._id,
    });
    await newResource.save();
    res.status(200).json({ message: "Resource uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const downloadResource = async (req, res) => {
  const { uploader,filename } = req.params;
  const filepath = path.join(
    __dirname,
    "../src/uploads",
    uploader,
    filename
  );

  try {
    const resource = await resources.findOne({ filename });
    if (!resource) {
      return res.status(404).json({ message: "Resource not found!" });
    }
    await userActivities.create({
      userId: req.user._id,
      action: "downloaded",
      resourceId: resource._id,
      timestamp: Date.now(),
    });
    res.download(filepath, (err) => {
      if (err) {
        console.error(`Download error: ${err}`);
        return res
          .status(500)
          .json({ message: "Error while downloading the file" });
      } else {
        console.log("File download successful");
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error downloading the file!" });
  }
};

const getCount=async(req, res)=>{
  try {
    const userId=req.params.userId
    const count=await resources.countDocuments({uploader:userId});
    res.status(200).json({count})
  } catch (error) {
    res.status.json({error:"Server error"})
  }
}

module.exports = {
  getResources,
  uploadResource,
  downloadResource,
  viewResource,
  getCount
};
