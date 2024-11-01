const { protect } = require('../middlewares/protect')
const {searchFunctions}=require('../controllers/searchFunctions')
const router=require('express').Router()

router.get('/',protect, searchFunctions)

module.exports=router