const { getResources, uploadResource, downloadResource, viewResource,getCount } = require('../controllers/resourceSharing')
const { protect } = require('../middlewares/protect')
const upload = require('../middlewares/upload')

const router=require('express').Router()
router.get('/',protect,getResources)
router.get('/:resourceId',protect,viewResource)
router.post('/upload',protect,upload.single('file') ,uploadResource)
router.get('/download/:uploader/:filename',protect,downloadResource)
router.get('/count/:userId', protect, getCount);

module.exports=router