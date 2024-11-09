const { getResources, uploadResource, downloadResource } = require('../controllers/resourceSharing')
const { protect } = require('../middlewares/protect')
const upload = require('../middlewares/upload')

const router=require('express').Router()
router.get('/',protect,getResources)
router.post('/upload',protect,upload.single('file') ,uploadResource)
router.get('/download/:filename',protect,downloadResource)

module.exports=router