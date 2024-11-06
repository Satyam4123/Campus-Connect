const { createEvent, getEvents } = require('../controllers/events');
const { protect } = require('../middlewares/protect');

const router=require('express').Router();

router.post('/new',protect,createEvent);
router.get('/',protect,getEvents)

// RSVP left

module.exports=router