const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const { protect } = require("../Middlewares/protect");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = `../src/uploads/${req.user._id}`;
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true }); 
    }
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload route
router.post("/uploadFile", protect, upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      message: "Image uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});

module.exports = router;