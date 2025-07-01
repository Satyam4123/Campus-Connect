const { createEvent, getEvents,fetchEventCnt } = require('../controllers/events');
const { protect } = require('../middlewares/protect');

const router=require('express').Router();

router.post('/new',protect,createEvent);
router.get('/',protect,getEvents)
router.get('/getCnt/', protect, fetchEventCnt)

module.exports=router