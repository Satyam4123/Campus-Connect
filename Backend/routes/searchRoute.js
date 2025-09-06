const { protect } = require('../middlewares/protect')
const {searchFunctions, searchUsersForConnection}=require('../controllers/searchFunctions')
const router=require('express').Router()

router.get('/',protect, searchFunctions)
router.get('/users',protect, searchUsersForConnection)

module.exports=router