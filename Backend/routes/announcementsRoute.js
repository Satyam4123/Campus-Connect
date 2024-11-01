const { getAnnouncements, addAnnouncement } = require('../controllers/announcements')
const { protect } = require('../middlewares/protect')

const router=require('express').Router()

router.get('/',protect,getAnnouncements)
router.post('/add',protect,addAnnouncement)

module.exports=router