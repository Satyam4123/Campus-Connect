const { upload, download } = require('../controllers/resourceSharing');
const { protect } = require('../middlewares/protect');

const router=require('express').Router()

// upload files
router.post('/',protect,upload)

// download files
router.get('/',protect, download)

module.exports=router;