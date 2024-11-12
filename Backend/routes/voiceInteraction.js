const { handleVoicCmd } = require('../controllers/handleVoiceCmd')
const { protect } = require('../middlewares/protect')

const router=require('express').Router()

router.post('/command',protect,handleVoicCmd)

module.exports=router